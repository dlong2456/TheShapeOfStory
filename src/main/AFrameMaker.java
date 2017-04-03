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
import org.python.core.PyObject;
import org.python.core.PyString;
import org.python.util.PythonInterpreter;

import com.opencsv.CSVReader;

import edu.stanford.nlp.coref.CorefCoreAnnotations;
import edu.stanford.nlp.coref.data.CorefChain;
import edu.stanford.nlp.coref.data.CorefChain.CorefMention;
import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.ling.CoreAnnotations.TokensAnnotation;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.ling.IndexedWord;
import edu.stanford.nlp.pipeline.Annotation;
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
import frameComponents.Setting;
import story.AFrame;
import story.Frame;

public class AFrameMaker implements FrameMaker {
	
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
					// assume personal prounouns indicate humanity
					entity = new AnAgent();
					((Agent) entity).setAgentType(AgentType.HUMAN);
					if (token.lemma().toString().equals("her") || token.lemma().toString().equals("she")
							|| token.lemma().toString().equals("hers")) {
						((Agent) entity).setGender(Gender.FEMALE);
					} else if (token.lemma().toString().equals("him") || token.lemma().toString().equals("his")
							|| token.lemma().toString().equals("he")) {
						((Agent) entity).setGender(Gender.MALE);
					} else if (token.lemma().toString().equals("I") || token.lemma().toString().equals("my")
							|| token.lemma().toString().equals("me")) {
						// assume a male narrator
						((Agent) entity).setGender(Gender.MALE);
					}
				} else if (pos.equals("NN") || pos.equals("NNS") || pos.equals("NNP") || pos.equals("NNPS")) {
					// First try named entity recognition
					String ner = token.ner();
					if (ner.equals("PERSON")) {
						entity = new AnAgent();
						((Agent) entity).setAgentType(AgentType.HUMAN);
						if (mention.gender.toString().equals("MALE")) {
							((Agent) entity).setGender(Gender.MALE);
						} else if (mention.gender.toString().equals("FEMALE")) {
							((Agent) entity).setGender(Gender.FEMALE);
						}
					} else if (ner.equals("LOCATION")) {
						entity = new ASetting();
					} else if (ner.equals("ORGANIZATION")) {
						entity = new AnObject();
					}
					// Then try concept net matching
					if (entity == null) {
						String nounType = getNounType(token.lemma());
						System.out.println(token.lemma() + " " + nounType);
						if (mention.animacy.toString().equals("ANIMATE")) {
							if (nounType.equals("person")) {
								entity = new AnAgent();
								((Agent) entity).setAgentType(AgentType.HUMAN);
								if (mention.gender.toString().equals("MALE")) {
									((Agent) entity).setGender(Gender.MALE);
								} else if (mention.gender.toString().equals("FEMALE")) {
									((Agent) entity).setGender(Gender.FEMALE);
								}
							} else if (nounType.equals("animal")) {
								entity = new AnAgent();
								((Agent) entity).setAgentType(AgentType.ANIMAL);
							}
						} else {
							if (nounType.equals("location")) {
								entity = new ASetting();
							} else if (nounType.equals("object")) {
								entity = new AnObject();
							}
						}
					}
				}
				if (entity != null) {
					entity.setReferences(cc);
					int[] positionArr = { token.sentIndex(), token.index() };
					entity.setPosition(new IntTuple(positionArr));
					entity.setOriginalWord(token.originalText());
					entity.setLemma(token.lemma());
					// DT = determiner
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
		// Find and connect actions, entities, setting prepositions, and
		// emotions
		for (CoreMap sentence : document.get(CoreAnnotations.SentencesAnnotation.class)) {
			SemanticGraph dependencies = sentence.get(BasicDependenciesAnnotation.class);
			ArrayList<Frame> sentenceFrames = new ArrayList<Frame>();
			Collection<IndexedWord> rootVerbs = dependencies.getRoots();
			for (IndexedWord root : rootVerbs) {
				// create a new frame for each root verb
				Frame frame = new AFrame();
				Action action = new AnAction();
				action.setOriginalWord(root.originalText());
				int[] positionArr = { root.sentIndex(), root.index() };
				action.setPosition(new IntTuple(positionArr));
				action.setLemma(root.lemma());
				action.setAnimation(findPrimitiveAction(action));
				action.setVerb(root);
				actions.add(action);
				frame.setAction(action);
				sentenceFrames.add(frame);
				// find additional verbs in sentence (this handles compound
				// sentences)
				Collection<IndexedWord> verbChildren = dependencies.getChildren(root);
				for (IndexedWord child : verbChildren) {
					SemanticGraphEdge edge = dependencies.getEdge(root, child);
					if (edge.getRelation().toString().equals("conj")) {
						if (child.tag().equals("VB") || child.tag().equals("VBD") || child.tag().equals("VBG")
								|| child.tag().equals("VBN") || child.tag().equals("VBP")
								|| child.tag().equals("VBZ")) {
							Action secondAction = new AnAction();
							Frame secondFrame = new AFrame();
							secondAction.setOriginalWord(child.originalText());
							int[] secondPositionArr = { child.sentIndex(), child.index() };
							secondAction.setPosition(new IntTuple(secondPositionArr));
							secondAction.setLemma(child.lemma());
							secondAction.setAnimation(findPrimitiveAction(secondAction));
							secondAction.setVerb(child);
							actions.add(secondAction);
							secondFrame.setAction(secondAction);
							sentenceFrames.add(secondFrame);
						}
					}
				}
			}
			// follow the nodes connected to each verb in the sentence to fill
			// in the
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
						// TODO: Maybe also just look for emotion key words in
						// the sentence? This misses some
						// TODO: How to associate an emotion with an agent?
						List<String> emotion = findEmotion(verb.lemma());
						if (emotion != null) {
							Emotion emotionObj = new AnEmotion();
							emotionObj.setEmotion(emotion.get(0));
							emotionObj.setPrimitiveEmotion(emotion.get(1));
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
						System.out.println("dobj " + child);
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
										// TODO: just look for preposition key
										// words in sentence? System is missing
										// some of these
										SemanticGraphEdge nextEdge = dependencies.getEdge(child, grandchild);
										if (nextEdge.getRelation().toString().equals("case")) {
											// TODO: Do we want to add any other
											// prepositions? Out/outside/inside?
											// Maybe a mapping
											if (grandchild.lemma().toString().equals("to")
													|| grandchild.lemma().toString().equals("on")
													|| grandchild.lemma().toString().equals("in")
													|| grandchild.lemma().toString().equals("at")
													|| grandchild.lemma().toString().equals("from")) {
												((Setting) ambiguousEntity)
														.setPreposition(grandchild.lemma().toString());
											}
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
		// Sort by action index so that the frames are in chronological order
		frames.sort(new PositionComparator());
		return frames;
	}

	// A comparator to assist in sorting frame array by action index
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

	// Finds all words "located at" the given word using ConceptNet API
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

	// Finds links between the given word and "animal" using ConceptNet API
	private ArrayList<String> getAnimalLinks(String word) {
		String animalLinks = httpGet("http://api.conceptnet.io/query?node=/c/en/" + word + "&other=/c/en/animal");
		ArrayList<String> arr = new ArrayList<String>();
		JSONObject obj = new JSONObject(animalLinks);
		JSONArray edges = obj.getJSONArray("edges");
		// Only pay attention to RelatedTo and IsA links
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

	// Finds links between the given word and "person" using ConceptNet API
	private ArrayList<String> getPersonLinks(String word) {
		String personLinks = httpGet("http://api.conceptnet.io/query?node=/c/en/" + word + "&other=/c/en/person");
		ArrayList<String> arr = new ArrayList<String>();
		JSONObject obj = new JSONObject(personLinks);
		JSONArray edges = obj.getJSONArray("edges");
		// Only pay attention to RelatedTo and IsA links
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

	// Categorizes nouns as person, location, animal, or object
	private String getNounType(String word) {
		// TODO: location links throwing off some results
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

	// Helper for HTTP GET requests
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
			// TODO: Might want to break this part into a modular function,
			// makes this not a general use HTTP GET method
			int index = res.indexOf("{\"@context\"");
			res = res.substring(index, res.length());
			return res;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// Finds an unknown entity in a list of known entities (assists in entity
	// tracking throughout a story)
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

	// Uses a CSV file and ConceptNet queries to map any emotion to a set of six
	// basic emotions
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

	// Uses a CSV file and ConceptNet queries to map any verb to a set of 14
	// canonical verbs (Schank)
	private String findPrimitiveAction(Action frameComponent) {
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