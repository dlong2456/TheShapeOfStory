package main;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

import org.json.JSONArray;
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
import frameComponents.AFrameComponent;
import frameComponents.ASetting;
import frameComponents.AnAction;
import frameComponents.AnAgent;
import frameComponents.AnAgent.AgentType;
import frameComponents.AnAgent.Gender;
import frameComponents.AnEntity;
import frameComponents.AnObject;
import frameComponents.FrameComponent;
import frameTypes.AConversationFrame;
import frameTypes.ALocationFrame;
import frameTypes.AnActionFrame;
import frameTypes.AnAgentFrame;
import frameTypes.AnObjectFrame;
import frameTypes.Frame;

//TODO: Recognize emotional states
public class AFrameMaker implements FrameMaker {

	private StanfordCoreNLP pipeline;

	public AFrameMaker(StanfordCoreNLP newPipeline) {
		pipeline = newPipeline;
	}

	public ArrayList<Frame> makeFrame(Annotation document) {
		ArrayList<FrameComponent> actions = new ArrayList<FrameComponent>();
		ArrayList<FrameComponent> entities = new ArrayList<FrameComponent>();
		ArrayList<Frame> frames = new ArrayList<Frame>();
		FrameComponent entity = null;
		// Create an entity for each reference chain in the story
		for (CorefChain cc : document.get(CorefCoreAnnotations.CorefChainAnnotation.class).values()) {
			// TODO: if mention contains more than one noun, ignore it
			CorefMention mention = cc.getRepresentativeMention();
			CoreMap sentence = document.get(CoreAnnotations.SentencesAnnotation.class).get(mention.sentNum - 1);
			for (int i = mention.startIndex - 1; i < mention.endIndex - 1; i++) {
				CoreLabel token = sentence.get(TokensAnnotation.class).get(i);
				String pos = token.tag();
				if (pos.equals("PRP") || pos.equals("PRP$")) {
					// assume narrator is a human
					entity = new AnAgent();
					((AnAgent) entity).setAgentType(AgentType.HUMAN);
				} else if (pos.equals("NN") || pos.equals("NNS") || pos.equals("NNP") || pos.equals("NNPS")) {
					String ner = token.ner();
					if (ner.equals("PERSON")) {
						entity = new AnAgent();
						((AnAgent) entity).setAgentType(AgentType.HUMAN);
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
							System.out.println("PERSON");
							entity = new AnAgent();
							((AnAgent) entity).setAgentType(AgentType.HUMAN);
						} else if (nounType.equals("animal")) {
							entity = new AnAgent();
							((AnAgent) entity).setAgentType(AgentType.ANIMAL);
						}
						if (entity != null) {
							if (mention.gender.toString().equals("MALE")) {
								((AnAgent) entity).setGender(Gender.MALE);
							} else if (mention.gender.toString().equals("FEMALE")) {
								((AnAgent) entity).setGender(Gender.FEMALE);
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
					((AnEntity) entity).setReferences(cc);
					int[] positionArr = { token.sentIndex(), token.index() };
					entity.setPosition(new IntTuple(positionArr));
					entity.setOriginalWord(token.originalText());
					entity.setLemma(token.lemma());
					entities.add(entity);
				}
			}
		}

		for (CoreMap sentence : document.get(CoreAnnotations.SentencesAnnotation.class)) {
			SemanticGraph dependencies = sentence.get(BasicDependenciesAnnotation.class);
			Collection<IndexedWord> rootVerbs = dependencies.getRoots();
			for (IndexedWord verb : rootVerbs) {
				// new frame, new action
				AnAction action = new AnAction();
				action.setOriginalWord(verb.originalText());
				int[] positionArr = { verb.sentIndex(), verb.index() };
				action.setPosition(new IntTuple(positionArr));
				action.setLemma(verb.lemma());
				actions.add(action);
				// create a new action frame for each action
				String animation = findAnimation(action);
				Frame frame = null;
				// All speak actions are conversation frames
				if (animation != null) {
					if (animation.equals("speak")) {
						frame = new AConversationFrame();
						// TODO: Need to set entities
					} else {
						frame = new AnActionFrame();
						((AnActionFrame) frame).setAnimation(findAnimation(action));
						((AnActionFrame) frame).setAction(action);
					}
					if (frame != null) {
						frames.add(frame);
					}
				}
			}
			Iterable<SemanticGraphEdge> edge_set1 = dependencies.edgeIterable();
			for (SemanticGraphEdge edge : edge_set1) {
				Frame frame = null;
				IndexedWord token = edge.getTarget();
				if (edge.getRelation().toString().equals("dobj")) {
					// object frame
					frame = new AnObjectFrame();
					// match to an entity
					for (int i = 0; i < entities.size(); i++) {
						List<CorefMention> referenceChain = ((AnEntity) entities.get(i)).getReferences()
								.getMentionsInTextualOrder();
						for (int j = 0; j < referenceChain.size(); j++) {
							if (referenceChain.get(j).position.get(0) == token.sentIndex() + 1
									&& token.index() <= referenceChain.get(j).endIndex
									&& token.index() >= referenceChain.get(j).startIndex) {
								((AnObjectFrame) frame).setObject(entities.get(i));
								break;
							}
						}
					}
					if (((AnObjectFrame) frame).getObject() == null) {
						frame = null;
					}
				} else if (edge.getRelation().toString().equals("nsubj")) {
					// agent frame
					frame = new AnAgentFrame();
					// match to entities
					ArrayList<FrameComponent> shortEntitiesList = new ArrayList<FrameComponent>();
					for (int i = 0; i < entities.size(); i++) {
						List<CorefMention> referenceChain = ((AnEntity) entities.get(i)).getReferences()
								.getMentionsInTextualOrder();
						for (int j = 0; j < referenceChain.size(); j++) {
							if (referenceChain.get(j).position.get(0) == token.sentIndex() + 1
									&& token.index() <= referenceChain.get(j).endIndex
									&& token.index() >= referenceChain.get(j).startIndex) {
								if (entities.get(i).getClass() == frameComponents.AnAgent.class) {
									shortEntitiesList.add(entities.get(i));
									break;
								}
							}
						}
					}
					if (shortEntitiesList.size() == 0) {
						frame = null;
					} else {
						((AnAgentFrame) frame).setEntities(shortEntitiesList);
					}
				} else if (edge.getRelation().toString().equals("nmod")) {
					// nmod = indirect object. Something following a preposition
					// match entity
					FrameComponent ambiguousEntity = null;
					for (int i = 0; i < entities.size(); i++) {
						List<CorefMention> referenceChain = ((AnEntity) entities.get(i)).getReferences()
								.getMentionsInTextualOrder();
						for (int j = 0; j < referenceChain.size(); j++) {
							if (referenceChain.get(j).position.get(0) == token.sentIndex() + 1
									&& token.index() <= referenceChain.get(j).endIndex
									&& token.index() >= referenceChain.get(j).startIndex) {
								ambiguousEntity = entities.get(i);
								break;
							}
						}
					}
					// figure out if the entity is a person, setting, or object
					// TODO: I don't think this is exactly right. can object
					// frames contain agents or objects?
					// can an agent frame be a direct object?
					if (ambiguousEntity != null) {
						if (ambiguousEntity.getClass() == frameComponents.ASetting.class) {
							frame = new ALocationFrame();
							((ALocationFrame) frame).setLocation(ambiguousEntity);
						} else if (ambiguousEntity.getClass() == frameComponents.AnObject.class) {
							frame = new AnObjectFrame();
							((AnObjectFrame) frame).setObject(ambiguousEntity);
						} else if (ambiguousEntity.getClass() == frameComponents.AnAgent.class) {
							frame = new AnAgentFrame();
							ArrayList<FrameComponent> agents = new ArrayList<FrameComponent>();
							agents.add(ambiguousEntity);
							((AnAgentFrame) frame).setEntities(agents);
						}
					}
				}
				// check for null properties as well
				if (frame != null) {
					frames.add(frame);
				}
			}
			// TODO: Sort frames at end according to their sentence position.
			// frames.sort();
		}
		return frames;
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

	private ArrayList<String> getGenericTypes(String word, AFrameComponent frameComponent) {
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

	private ArrayList<String> getRelatedWords(String word, AFrameComponent frameComponent) {
		ArrayList<String> related = getRelated(word);
		ArrayList<String> symbolOf = getSymbolOf(word);
		ArrayList<String> relatedWords = new ArrayList<String>();
		relatedWords.addAll(related);
		relatedWords.addAll(symbolOf);
		return relatedWords;
	}

	// Use this if we need to find specific images of words
	private void parseFrameComponent(AFrameComponent frameComponent) {
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

	private String findAnimation(FrameComponent frameComponent) {
		CSVReader reader;
		try {
			reader = new CSVReader(new FileReader("res/canonical_verbs.csv"));
			String[] nextLine;
			ArrayList<String> actionArray = new ArrayList<String>();
			ArrayList<String> primitiveActionArr = new ArrayList<String>();
			ArrayList<Double> weights = new ArrayList<Double>();
			while ((nextLine = reader.readNext()) != null) {
				// nextLine[] is an array of values from the line
				String[] actions = nextLine[1].split(", ");
				for (int i = 0; i < actions.length; i++) {
					if (frameComponent.getOriginalWord().equals(actions[i])) {
						reader.close();
						return nextLine[0];
					}
					String relation = httpGet("http://api.conceptnet.io/query?node=/c/en/"
							+ frameComponent.getOriginalWord() + "&other=/c/en/" + actions[i]);
					JSONObject obj = new JSONObject(relation);
					JSONArray edges = obj.getJSONArray("edges");
					for (int j = 0; j < edges.length(); j++) {
						JSONObject edge = edges.getJSONObject(j);
						actionArray.add(actions[i]);
						primitiveActionArr.add(nextLine[0]);
						weights.add(edge.getDouble("weight"));
					}
				}
			}
			reader.close();
			double max = 0;
			String primitiveAction = null;
			for (int j = 0; j < actionArray.size(); j++) {
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
