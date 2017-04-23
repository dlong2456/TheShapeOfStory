package main;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

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
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;
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
import story.AStory.Sentiment;
import story.Frame;
import story.Story;

//TODO: Thread the startup so the stanford annotator loads while the model is loading
//TODO: Make sure you are properly terminating python process so you don't create zombies
//TODO: Get this so it will work on Sanjana's comp as well/list instructions to get it to work
public class AFrameMaker implements FrameMaker {

	private PythonThread outThread;
	private final Object lock;
	private final HashMap<String, String> actionMapping = new HashMap<String, String>();
	private Story story;

	public AFrameMaker(PythonThread outThread, Object lock, Story story) {
		this.story = story;
		this.outThread = outThread;
		this.lock = lock;
		buildActionMapping();
	}

	private void buildActionMapping() {
		actionMapping.put("smell", "smell");
		actionMapping.put("think", "think-about");
		actionMapping.put("move", "move-body-part");
		actionMapping.put("ingest", "ingest");
		actionMapping.put("speak", "speak");
		actionMapping.put("hear", "hear");
		actionMapping.put("feel", "feel");
		actionMapping.put("have", "have");
		actionMapping.put("conclude", "conclude");
		actionMapping.put("be", "be");
		actionMapping.put("see", "see");
		actionMapping.put("transport", "move-object");
		actionMapping.put("expel", "expel");
		actionMapping.put("propel", "propel");
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
						String nounType = setInput("categorize " + token.lemma());
						if (mention.animacy.toString().equals("ANIMATE")) {
							if (nounType.equals("person")) {
								entity = new AnAgent();
								((Agent) entity).setAgentType(AgentType.HUMAN);
								if (mention.gender.toString() != null) {
									if (mention.gender.toString().equals("MALE")) {
										((Agent) entity).setGender(Gender.MALE);
									} else if (mention.gender.toString().equals("FEMALE")) {
										((Agent) entity).setGender(Gender.FEMALE);
									}
								} else {
									String gender = setInput("gender " + token.lemma());
									if (gender.equals("male")) {
										((Agent) entity).setGender(Gender.MALE);
									} else if (gender.equals("female")) {
										((Agent) entity).setGender(Gender.FEMALE);
									}
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
				action.setAnimation(actionMapping.get(setInput("verb " + action.getLemma())));
				action.setVerb(root);
				actions.add(action);
				frame.setAction(action);
				calculateSentiment(sentence, frame, story);
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
							secondAction.setAnimation(actionMapping.get(setInput("verb " + secondAction.getLemma())));
							secondAction.setVerb(child);
							actions.add(secondAction);
							secondFrame.setAction(secondAction);
							calculateSentiment(sentence, secondFrame, story);
							sentenceFrames.add(secondFrame);
						}
					}
				}
			}
			// follow the nodes connected to each verb in the sentence to fill
			// in the rest of the frames
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
						String emotion = setInput("emotion " + verb.lemma());
						if (emotion != null) {
							Emotion emotionObj = new AnEmotion();
							emotionObj.setEmotion(verb.lemma());
							emotionObj.setPrimitiveEmotion(emotion);
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

	private void calculateSentiment(CoreMap sentence, Frame frame, Story story) {
		String sentiment = sentence.get(SentimentCoreAnnotations.SentimentClass.class);
		int sentimentVal = 0;
		if (sentiment.equalsIgnoreCase("Neutral")) {
			sentimentVal = 0;
			frame.setSentiment(Sentiment.NEUTRAL);
		} else if (sentiment.equalsIgnoreCase("Positive")) {
			sentimentVal = 1;
			frame.setSentiment(Sentiment.POSITIVE);
		} else if (sentiment.equalsIgnoreCase("Very Positive")) {
			sentimentVal = 2;
			frame.setSentiment(Sentiment.VERY_POSITIVE);
		} else if (sentiment.equalsIgnoreCase("Negative")) {
			sentimentVal = -1;
			frame.setSentiment(Sentiment.NEGATIVE);
		} else if (sentiment.equalsIgnoreCase("Very Negative")) {
			sentimentVal = -2;
			frame.setSentiment(Sentiment.VERY_NEGATIVE);
		}
		story.addSentiment(sentimentVal);
	}

	private String setInput(String input) {
		outThread.setReady(false);
		outThread.setInput(input + "\n");
		synchronized (lock) {
			while (!outThread.isReady()) {
				try {
					lock.wait();
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			return outThread.getReturnVal();
		}
	}

}