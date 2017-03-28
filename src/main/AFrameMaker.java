package main;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.opencsv.CSVReader;

import edu.stanford.nlp.coref.CorefCoreAnnotations;
import edu.stanford.nlp.coref.data.CorefChain;
import edu.stanford.nlp.coref.data.CorefChain.CorefMention;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.ling.CoreAnnotations.LemmaAnnotation;
import edu.stanford.nlp.ling.CoreAnnotations.SentencesAnnotation;
import edu.stanford.nlp.ling.CoreAnnotations.TokensAnnotation;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.ling.IndexedWord;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.semgraph.SemanticGraph;
import edu.stanford.nlp.semgraph.SemanticGraphCoreAnnotations.BasicDependenciesAnnotation;
import edu.stanford.nlp.semgraph.SemanticGraphEdge;
import edu.stanford.nlp.util.CoreMap;
import edu.stanford.nlp.util.IntTuple;
import frameComponents.ASetting;
import frameComponents.Action;
import frameComponents.Agent;
import frameComponents.AnAction;
import frameComponents.AnAgent;
import frameComponents.AnAgent.AgentType;
import frameComponents.AnAgent.Gender;
import frameComponents.AnEmotion;
import frameComponents.AnObject;
import frameComponents.Emotion;
import frameComponents.Entity;
import frameComponents.FrameComponent;
import frameComponents.Setting;
import story.AFrame;
import story.Frame;

public class AFrameMaker implements FrameMaker {

	private StanfordCoreNLP pipeline;

	public AFrameMaker(StanfordCoreNLP newPipeline) {
		pipeline = newPipeline;
	}

	public ArrayList<Frame> makeFrame(Annotation document) {
		ArrayList<Action> actions = new ArrayList<Action>();
		ArrayList<Entity> entities = new ArrayList<Entity>();
		ArrayList<Frame> frames = new ArrayList<Frame>();
		// COREFERENCE RESOLUTION
		// Create an entity for each reference chain in the story
		document.get(CorefCoreAnnotations.CorefChainAnnotation.class).values();
		for (CorefChain cc : document.get(CorefCoreAnnotations.CorefChainAnnotation.class).values()) {
			ArrayList<Entity> mentionEntities = new ArrayList<Entity>();
			CorefMention mention = cc.getRepresentativeMention();
			CoreMap sentence = document.get(CoreAnnotations.SentencesAnnotation.class).get(mention.sentNum - 1);
			for (int i = mention.startIndex - 1; i < mention.endIndex - 1; i++) {
				Entity entity = null;
				CoreLabel token = sentence.get(TokensAnnotation.class).get(i);
				String pos = token.tag();
				if (pos.equals("PRP") || pos.equals("PRP$")) {
					// assume narrator is a human
					entity = new AnAgent();
					((Agent) entity).setAgentType(AgentType.HUMAN);
				} else if (pos.equals("NN") || pos.equals("NNS") || pos.equals("NNP") || pos.equals("NNPS")) {
					String ner = token.ner();
					if (ner.equals("PERSON")) {
						entity = new AnAgent();
						((Agent) entity).setAgentType(AgentType.HUMAN);
					} else if (ner.equals("LOCATION")) {
						entity = new ASetting();
					} else if (ner.equals("ORGANIZATION")) {
						entity = new AnObject();
					}
				}
				if (entity == null) {
					String nounType = getNounType(token.lemma());
					if (mention.animacy.toString().equals("ANIMATE")) {
						if (nounType.equals("person")) {
							entity = new AnAgent();
							((Agent) entity).setAgentType(AgentType.HUMAN);
						} else if (nounType.equals("animal")) {
							entity = new AnAgent();
							((Agent) entity).setAgentType(AgentType.ANIMAL);
						}
						if (entity != null) {
							if (mention.gender.toString().equals("MALE")) {
								((Agent) entity).setGender(Gender.MALE);
							} else if (mention.gender.toString().equals("FEMALE")) {
								((Agent) entity).setGender(Gender.FEMALE);
							}
						}
					} else {
						if (nounType.equals("location")) {
							entity = new ASetting();
						} else if (nounType.equals("object")) {
							entity = new AnObject();
						}
					}
				}
				if (entity != null) {
					entity.setReferences(cc);
					int[] positionArr = { token.sentIndex(), token.index() };
					entity.setPosition(new IntTuple(positionArr));
					entity.setOriginalWord(token.originalText());
					entity.setLemma(token.lemma());
					if (!token.tag().equals("DT")) {
						mentionEntities.add(entity);
					}
				}
			}
			// If mention contains more than one noun, ignore it. This prevents
			// duplicates.
			if (mentionEntities.size() == 1) {
				entities.add(mentionEntities.get(0));
			}
		}
		// DEPENDENCY MAPPING
		for (CoreMap sentence : document.get(CoreAnnotations.SentencesAnnotation.class)) {
			SemanticGraph dependencies = sentence.get(BasicDependenciesAnnotation.class);
			ArrayList<Frame> sentenceFrames = new ArrayList<Frame>();
			Collection<IndexedWord> rootVerbs = dependencies.getRoots();
			for (IndexedWord root : rootVerbs) {
				// create a new frame for each root verb
				// all verbs are actions
				Frame frame = new AFrame();
				Action action = new AnAction();
				action.setOriginalWord(root.originalText());
				int[] positionArr = { root.sentIndex(), root.index() };
				action.setPosition(new IntTuple(positionArr));
				action.setLemma(root.lemma());
				action.setAnimation(findAnimation(action));
				action.setVerb(root);
				actions.add(action);
				frame.setAction(action);
				sentenceFrames.add(frame);
				Collection<IndexedWord> verbChildren = dependencies.getChildren(root);
				for (IndexedWord child : verbChildren) {
					SemanticGraphEdge edge = dependencies.getEdge(root, child);
					if (edge.getRelation().toString().equals("conj")) {
						if (child.tag().equals("VB") || child.tag().equals("VBD") || child.tag().equals("VBG")
								|| child.tag().equals("VBN") || child.tag().equals("VBP")
								|| child.tag().equals("VBZ")) {
							// all verbs are actions
							Action secondAction = new AnAction();
							Frame secondFrame = new AFrame();
							secondAction.setOriginalWord(child.originalText());
							int[] secondPositionArr = { child.sentIndex(), child.index() };
							secondAction.setPosition(new IntTuple(secondPositionArr));
							secondAction.setLemma(child.lemma());
							secondAction.setAnimation(findAnimation(secondAction));
							secondAction.setVerb(child);
							actions.add(secondAction);
							secondFrame.setAction(secondAction);
							sentenceFrames.add(secondFrame);
						}
					}
				}
			}
			// follow the nodes connected to each verb to fill in the
			// rest of the frames
			ArrayList<Entity> predicates = new ArrayList<Entity>();
			ArrayList<Entity> subjects = new ArrayList<Entity>();
			for (Frame frame : sentenceFrames) {
				IndexedWord verb = frame.getAction().getVerb();
				Collection<IndexedWord> children = dependencies.getChildren(verb);
				for (IndexedWord child : children) {
					SemanticGraphEdge edge = dependencies.getEdge(verb, child);
					if (edge.getRelation().toString().equals("cop")) {
						// verb is a copula
						// https://en.wikipedia.org/wiki/Copula_(linguistics)
						// Stanford NLP defines the object of a copula as
						// the
						// root verb (e.g. happy in "I am happy")
						// See if the root is an emotion - if so, store the
						// frame contents differently
						List<String> emotion = findEmotion(verb.lemma());
						if (emotion != null) {
							Emotion emotionObj = new AnEmotion();
							emotionObj.setEmotion(emotion.get(0));
							emotionObj.setColor(emotion.get(1));
							frame.setEmotion(emotionObj);
							// set animation to an actual verb ("feel")
							// rather
							// than "happy"
							Action action = new AnAction();
							action.setOriginalWord(child.originalText());
							action.setLemma(child.lemma());
							int[] positionArr = { verb.sentIndex(), verb.index() };
							action.setPosition(new IntTuple(positionArr));
							action.setAnimation("feel");
							frame.setAction(action);
						} else {
							Action action = new AnAction();
							action.setOriginalWord(child.originalText());
							action.setLemma(child.lemma());
							int[] positionArr = { verb.sentIndex(), verb.index() };
							action.setPosition(new IntTuple(positionArr));
							action.setAnimation("be");
							frame.setAction(action);
						}
					} else if (edge.getRelation().toString().equals("dobj")) {
						// predicate
						matchEntity(entities, child, predicates);
						Collection<IndexedWord> grandchildren = dependencies.getChildren(child);
						for (IndexedWord grandchild : grandchildren) {
							if (grandchild.tag().equals("PRP") || grandchild.tag().equals("PRP$")
									|| grandchild.tag().equals("NN") || grandchild.tag().equals("NNS")
									|| grandchild.tag().equals("NNP") || grandchild.tag().equals("NNPS")) {
								matchEntity(entities, grandchild, predicates);
							}
						}
					} else if (edge.getRelation().toString().equals("nsubj")) {
						// subject
						matchEntity(entities, child, subjects);
						Collection<IndexedWord> grandchildren = dependencies.getChildren(child);
						for (IndexedWord grandchild : grandchildren) {
							if (grandchild.tag().equals("PRP") || grandchild.tag().equals("PRP$")
									|| grandchild.tag().equals("NN") || grandchild.tag().equals("NNS")
									|| grandchild.tag().equals("NNP") || grandchild.tag().equals("NNPS")) {
								matchEntity(entities, grandchild, subjects);
							}
						}
					} else if (edge.getRelation().toString().equals("nmod")) {
						// TODO: just look for prepositions?
						// nmod = indirect object. Something following a
						// preposition
						// match entity
						ArrayList<Entity> tempList = new ArrayList<Entity>();
						matchEntity(entities, child, tempList);
						if (tempList.size() > 0) {
							Entity ambiguousEntity = tempList.get(0);
							if (ambiguousEntity != null) {
								if (ambiguousEntity.getClass() == frameComponents.ASetting.class) {
									Collection<IndexedWord> grandchildren = dependencies.getChildren(child);
									// case
									for (IndexedWord grandchild : grandchildren) {
										SemanticGraphEdge nextEdge = dependencies.getEdge(child, grandchild);
										if (nextEdge.getRelation().toString().equals("case")) {
											((Setting) ambiguousEntity).setPreposition(grandchild.toString());
										}
									}
									frame.setSetting((Setting) ambiguousEntity);
								} else if (ambiguousEntity.getClass() == frameComponents.AnObject.class) {
									predicates.add(ambiguousEntity);
								} else if (ambiguousEntity.getClass() == frameComponents.AnAgent.class) {
									subjects.add(ambiguousEntity);
								}
							}
						}
					}
				}
				frame.setPredicates(predicates);
				frame.setSubjects(subjects);
			}
			for (Frame sentenceFrame : sentenceFrames) {
				frames.add(sentenceFrame);
			}
		}
		// sort by action index
		frames.sort(new PositionComparator());
//		for (Frame frame : frames) {
//			System.out.println(frame.getAction().getAnimation());
//		}
		return frames;
	}

	class PositionComparator implements Comparator<Frame> {
		@Override
		public int compare(Frame a, Frame b) {
			if (a.getAction().getPosition().get(0) < b.getAction().getPosition().get(0)) {
				return -1;
			} else if (b.getAction().getPosition().get(0) < a.getAction().getPosition().get(0)) {
				return 1;
			} else {
				// same sentence, look at indices
				if (a.getAction().getPosition().get(1) < b.getAction().getPosition().get(1)) {
					return -1;
				} else {
					return 1;
				}
			}
		}
	}

	private ArrayList<String> lemmatize(String documentText) {
		ArrayList<String> lemmas = new ArrayList<String>();
		Annotation document = new Annotation(documentText);
		pipeline.annotate(document);
		List<CoreMap> sentences = document.get(SentencesAnnotation.class);
		for (CoreMap sentence : sentences) {
			for (CoreLabel token : sentence.get(TokensAnnotation.class)) {
				lemmas.add(token.get(LemmaAnnotation.class));
			}
		}
		return lemmas;
	}

	private ArrayList<String> getGenericTypes(String word, FrameComponent frameComponent) {
		ArrayList<String> partOf = getPartOf(word);
		ArrayList<String> isA = getIsA(word);
		ArrayList<String> genericTypes = new ArrayList<String>();
		genericTypes.addAll(partOf);
		genericTypes.addAll(isA);
		return genericTypes;
	}

	private ArrayList<String> getPartOf(String word) {
		String partOf = httpGet("http://api.conceptnet.io/query?start=/c/en/" + word + "&rel=/r/PartOf");
		ArrayList<String> partOfArray = parseJSONObject(partOf, "end");
		return partOfArray;
	}

	private ArrayList<String> getIsA(String word) {
		String isA = httpGet("http://api.conceptnet.io/query?start=/c/en/" + word + "&rel=/r/IsA");
		ArrayList<String> isAArray = parseJSONObject(isA, "end");
		return isAArray;
	}

	private ArrayList<String> parseJSONObject(String jsonString, String node) {
		ArrayList<String> arr = new ArrayList<String>();
		JSONObject obj = new JSONObject(jsonString);
		JSONArray edges = obj.getJSONArray("edges");
		for (int i = 0; i < edges.length(); i++) {
			JSONObject edge = edges.getJSONObject(i);
			if (edge.getDouble("weight") >= 1.15) {
				String word = edge.getJSONObject(node).getString("label");
				if (word.startsWith("a ")) {
					word = word.substring(2, word.length());
				}
				ArrayList<String> words = lemmatize(word);
				if (words.size() == 1) {
					word = words.get(0);
				}
				// Use concreteness value as a filter if we need to find
				// specific images from words
				// if (findConcretenessValue(word) > 4) {
				arr.add(word);
				// }
			}
		}
		return arr;
	}

	private ArrayList<String> getRelated(String word) {
		String related = httpGet("http://api.conceptnet.io/query?start=/c/en/" + word + "&rel=/r/RelatedTo");
		ArrayList<String> relatedArray = parseJSONObject(related, "end");
		return relatedArray;
	}

	private ArrayList<String> getLocationLinks(String word) {
		String locatedAt = httpGet("http://api.conceptnet.io/query?end=/c/en/" + word + "&rel=/r/AtLocation");
		ArrayList<String> arr = new ArrayList<String>();
		JSONObject obj = new JSONObject(locatedAt);
		JSONArray edges = obj.getJSONArray("edges");
		for (int i = 0; i < edges.length(); i++) {
			JSONObject edge = edges.getJSONObject(i);
			arr.add(edge.getJSONObject("start").getString("label"));
		}
		return arr;
	}

	private ArrayList<String> getAnimalLinks(String word) {
		String animalLinks = httpGet("http://api.conceptnet.io/query?node=/c/en/" + word + "&other=/c/en/animal");
		ArrayList<String> arr = new ArrayList<String>();
		JSONObject obj = new JSONObject(animalLinks);
		JSONArray edges = obj.getJSONArray("edges");
		for (int i = 0; i < edges.length(); i++) {
			JSONObject edge = edges.getJSONObject(i);
			if (edge.getJSONObject("rel").getString("label").equals("RelatedTo")) {
				if (edge.getJSONObject("start").getString("label").equals("animal")) {
					arr.add(edge.getJSONObject("start").getString("label"));
				} else {
					arr.add(edge.getJSONObject("end").getString("label"));
				}
			} else if (edge.getJSONObject("rel").getString("label").equals("IsA")) {
				if (edge.getJSONObject("start").getString("label").equals("animal")) {
					arr.add(edge.getJSONObject("start").getString("label"));
				} else {
					arr.add(edge.getJSONObject("end").getString("label"));
				}
			}
		}
		return arr;
	}

	private ArrayList<String> getPersonLinks(String word) {
		String personLinks = httpGet("http://api.conceptnet.io/query?node=/c/en/" + word + "&other=/c/en/person");
		ArrayList<String> arr = new ArrayList<String>();
		JSONObject obj = new JSONObject(personLinks);
		JSONArray edges = obj.getJSONArray("edges");
		for (int i = 0; i < edges.length(); i++) {
			JSONObject edge = edges.getJSONObject(i);
			if (edge.getJSONObject("rel").getString("label").equals("RelatedTo")) {
				if (edge.getJSONObject("start").getString("label").equals("person")) {
					arr.add(edge.getJSONObject("start").getString("label"));
				} else {
					arr.add(edge.getJSONObject("end").getString("label"));
				}
			} else if (edge.getJSONObject("rel").getString("label").equals("IsA")) {
				if (edge.getJSONObject("start").getString("label").equals("person")) {
					arr.add(edge.getJSONObject("start").getString("label"));
				} else {
					arr.add(edge.getJSONObject("end").getString("label"));
				}
			}
		}
		return arr;
	}

	private ArrayList<String> getSymbolOf(String word) {
		String symbolOf = httpGet("http://api.conceptnet.io/query?end=/c/en/" + word + "&rel=/r/SymbolOf");
		ArrayList<String> symbolOfArray = parseJSONObject(symbolOf, "start");
		return symbolOfArray;
	}

	private ArrayList<String> getRelatedWords(String word, FrameComponent frameComponent) {
		ArrayList<String> related = getRelated(word);
		ArrayList<String> symbolOf = getSymbolOf(word);
		ArrayList<String> relatedWords = new ArrayList<String>();
		relatedWords.addAll(related);
		relatedWords.addAll(symbolOf);
		return relatedWords;
	}

	// Use this if we need to find specific images of words
	private void parseFrameComponent(FrameComponent frameComponent) {
		frameComponent.setRelatedWords(getGenericTypes(frameComponent.getOriginalWord(), frameComponent));
		frameComponent.setGenericTypes(getRelatedWords(frameComponent.getOriginalWord(), frameComponent));
	}

	private String getNounType(String word) {
		// TODO: how to differentiate between settings and locations?
		ArrayList<String> locationLinks = getLocationLinks(word);
		ArrayList<String> personLinks = getPersonLinks(word);
		ArrayList<String> animalLinks = getAnimalLinks(word);
		// return the noun type with the most links
		if (locationLinks.size() > 2 && locationLinks.size() > personLinks.size()
				&& locationLinks.size() > animalLinks.size()) {
			return "location";
		} else if (personLinks.size() > 0 && personLinks.size() >= locationLinks.size()
				&& personLinks.size() >= animalLinks.size()) {
			return "person";
		} else if (animalLinks.size() > 0 && animalLinks.size() > personLinks.size()
				&& animalLinks.size() >= locationLinks.size()) {
			return "animal";
		} else {
			return "object";
		}
	}

	private static String httpGet(String urlString) {
		try {
			StringBuilder result = new StringBuilder();
			URL url = new URL(urlString);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			int responseCode = conn.getResponseCode();
			if (responseCode == 200) {
				BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
				String line;
				while ((line = rd.readLine()) != null) {
					result.append(line);
				}
				rd.close();
			}
			String res = result.toString();
			int index = res.indexOf("{\"@context\"");
			res = res.substring(index, res.length());
			return res;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// Use this if we need to find specific images of words
	private double findConcretenessValue(String word) {
		try (BufferedReader br = new BufferedReader(new FileReader("res/concreteness_ratings.txt"))) {
			String line;
			while ((line = br.readLine()) != null) {
				if (line.startsWith(word + "\t")) {
					String[] columns = line.split("\t");
					return Double.parseDouble(columns[2]);
				}
			}
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
	}

	private void matchEntity(ArrayList<Entity> entities, IndexedWord token, ArrayList<Entity> list) {
		for (int i = 0; i < entities.size(); i++) {
			List<CorefMention> referenceChain = entities.get(i).getReferences().getMentionsInTextualOrder();
			for (int j = 0; j < referenceChain.size(); j++) {
				if (referenceChain.get(j).position.get(0) == token.sentIndex() + 1
						&& token.index() <= referenceChain.get(j).endIndex
						&& token.index() >= referenceChain.get(j).startIndex) {
					list.add(entities.get(i));
					break;
				}
			}
		}
	}

	private List<String> findEmotion(String adj) {
		CSVReader reader;
		String[] nextLine;
		try {
			reader = new CSVReader(new FileReader("res/emotions.csv"));
			ArrayList<String> basicEmotions = new ArrayList<String>();
			ArrayList<String> colorArr = new ArrayList<String>();
			ArrayList<Double> weights = new ArrayList<Double>();
			while ((nextLine = reader.readNext()) != null) {
				// nextLine[] is an array of values from the line
				String[] emotionArr = nextLine[1].split(", ");
				if (adj.equals(nextLine[0])) {
					reader.close();
					List<String> arr = Arrays.asList(nextLine[0], nextLine[2]);
					return arr;
				}
				for (String emotion : emotionArr) {
					String relation = httpGet(
							"http://api.conceptnet.io/query?node=/c/en/" + adj + "&other=/c/en/" + emotion);
					JSONObject obj = new JSONObject(relation);
					JSONArray edges = obj.getJSONArray("edges");
					for (int j = 0; j < edges.length(); j++) {
						JSONObject edge = edges.getJSONObject(j);
						weights.add(edge.getDouble("weight"));
						colorArr.add(nextLine[2]);
						basicEmotions.add(nextLine[0]);
					}
				}
			}
			reader.close();
			double max = 0;
			String basicEmotion = null;
			String color = null;
			for (int j = 0; j < basicEmotions.size(); j++) {
				if (weights.get(j) > max) {
					max = weights.get(j);
					basicEmotion = basicEmotions.get(j);
					color = colorArr.get(j);
				}
			}
			if (max >= 2) {
				List<String> arr = Arrays.asList(basicEmotion, color);
				return arr;
			}
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	private String findAnimation(Action frameComponent) {
		CSVReader reader;
		try {
			reader = new CSVReader(new FileReader("res/canonical_verbs.csv"));
			String[] nextLine;
			ArrayList<String> primitiveActionArr = new ArrayList<String>();
			ArrayList<Double> weights = new ArrayList<Double>();
			while ((nextLine = reader.readNext()) != null) {
				// nextLine[] is an array of values from the line
				String[] actions = nextLine[1].split(", ");
				for (int i = 0; i < actions.length; i++) {
					if (frameComponent.getLemma().equals(actions[i])) {
						reader.close();
						return nextLine[0];
					}
					String relation = httpGet("http://api.conceptnet.io/query?node=/c/en/" + frameComponent.getLemma()
							+ "&other=/c/en/" + actions[i]);
					JSONObject obj = new JSONObject(relation);
					JSONArray edges = obj.getJSONArray("edges");
					for (int j = 0; j < edges.length(); j++) {
						JSONObject edge = edges.getJSONObject(j);
						primitiveActionArr.add(nextLine[0]);
						weights.add(edge.getDouble("weight"));
					}
				}
			}
			reader.close();
			double max = 0;
			String primitiveAction = null;
			for (int j = 0; j < primitiveActionArr.size(); j++) {
				if (weights.get(j) > max) {
					max = weights.get(j);
					primitiveAction = primitiveActionArr.get(j);
				}
			}
			if (max >= 2) {
				return primitiveAction;
			}
		} catch (FileNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
}
