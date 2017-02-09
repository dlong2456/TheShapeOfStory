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
import java.util.List;
import java.util.Properties;

import org.json.JSONArray;
import org.json.JSONObject;

import edu.stanford.nlp.ling.CoreAnnotations.LemmaAnnotation;
import edu.stanford.nlp.ling.CoreAnnotations.PartOfSpeechAnnotation;
import edu.stanford.nlp.ling.CoreAnnotations.SentencesAnnotation;
import edu.stanford.nlp.ling.CoreAnnotations.TokensAnnotation;
import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.util.CoreMap;
import frameComponents.ACharacter;
import frameComponents.AFrameComponent;
import frameComponents.ASetting;
import frameComponents.AnAction;
import frameComponents.FrameComponent;

//TODO: relationships between characters and objects?
public class AFrameMaker implements FrameMaker {

	protected StanfordCoreNLP pipeline;

	private enum WordType {
		VERB, NOUN, PERSONAL_NOUN, DESCRIPTOR, OTHER
	}

	public AFrameMaker() {
		Properties props = new Properties();
		props.put("annotators", "tokenize, ssplit, pos, lemma");
		this.pipeline = new StanfordCoreNLP(props);
	}

	public Frame makeFrame(String textSegment) {
		ArrayList<FrameComponent> characters = new ArrayList<FrameComponent>();
		ArrayList<FrameComponent> actions = new ArrayList<FrameComponent>();
		ArrayList<FrameComponent> settings = new ArrayList<FrameComponent>();
		ArrayList<String> tags = tagPOS(textSegment);
		ArrayList<String> words = lemmatize(textSegment);
		// Get rid of punctuation in words list
		for (int i = 0; i < words.size(); i++) {
			words.set(i, words.get(i).replaceAll("[^\\w]", ""));
		}
		for (int i = 0; i < words.size(); i++) {
			String word = words.get(i);
			WordType type;
			// codes:
			// https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
			if (tags.get(i).equals("NN") || tags.get(i).equals("NNS") || tags.get(i).equals("NNP")
					|| tags.get(i).equals("NNPS")) {
				type = WordType.NOUN;
			} else if (tags.get(i).equals("PRP") || tags.get(i).equals("PRP$")) {
				type = WordType.PERSONAL_NOUN;
				// TODO: Personalize this based on gender of the writer
				ACharacter character = new ACharacter(word);
				character.setGenericTypes(new ArrayList<String>(Arrays.asList("woman", "man", "person", "human")));
				characters.add(character);
			} else if (tags.get(i).equals("VB") || tags.get(i).equals("VBD") || tags.get(i).equals("VBG")
					|| tags.get(i).equals("VBN") || tags.get(i).equals("VBP") || tags.get(i).equals("VBZ")) {
				type = WordType.VERB;
			} else if (tags.get(i).equals("JJ") || tags.get(i).equals("JJR") || tags.get(i).equals("JJS")
					|| tags.get(i).equals("RBR") || tags.get(i).equals("RB") || tags.get(i).equals("RBS")) {
				// TODO: not doing anything with these right now
				type = WordType.DESCRIPTOR;
			} else {
				type = WordType.OTHER;
			}
			// filter out words that can't easily become nouns
			if (!type.equals(WordType.OTHER) && !type.equals(WordType.DESCRIPTOR)
					&& !type.equals(WordType.PERSONAL_NOUN)) {
				try {
					if (type.equals(WordType.VERB)) {
						// all verbs are actions
						AnAction action = new AnAction(word);
						parseFrameComponent(action);
						actions.add(action);
					} else if (type.equals(WordType.NOUN)) {
						if (isSetting(word)) {
							ASetting setting = new ASetting(word);
							parseFrameComponent(setting);
							settings.add(setting);
						} else {
							// assume all other nouns are characters
							// TODO: differentiate between entities and objects
							ACharacter character = new ACharacter(word);
							parseFrameComponent(character);
							characters.add(character);
						}
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		Frame frame = new AFrame(characters, actions, settings);
		return frame;
	}

	private ArrayList<String> lemmatize(String documentText) {
		ArrayList<String> lemmas = new ArrayList<String>();
		Annotation document = new Annotation(documentText);
		this.pipeline.annotate(document);
		List<CoreMap> sentences = document.get(SentencesAnnotation.class);
		for (CoreMap sentence : sentences) {
			for (CoreLabel token : sentence.get(TokensAnnotation.class)) {
				lemmas.add(token.get(LemmaAnnotation.class));
			}
		}
		return lemmas;
	}

	private ArrayList<String> tagPOS(String documentText) {
		ArrayList<String> tags = new ArrayList<String>();
		Annotation document = new Annotation(documentText);
		this.pipeline.annotate(document);
		List<CoreMap> sentences = document.get(SentencesAnnotation.class);
		for (CoreMap sentence : sentences) {
			for (CoreLabel token : sentence.get(TokensAnnotation.class)) {
				tags.add(token.get(PartOfSpeechAnnotation.class));
			}
		}
		return tags;
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
			// TODO: traverse one level higher in the IsA tree (maybe not necessary?)
			if (edge.getDouble("weight") >= 1.15
					) {
				String word = edge.getJSONObject(node).getString("label");
				if (word.startsWith("a ")) {
					word = word.substring(2, word.length());
				}
				ArrayList<String> words = lemmatize(word);
				if (words.size() == 1) {
					word = words.get(0);
				}
				if (findConcretenessValue(word) > 4) {
					arr.add(word);
				}
			}
		}
		return arr;
	}

	private ArrayList<String> getRelated(String word) {
		String related = httpGet("http://api.conceptnet.io/query?start=/c/en/" + word + "&rel=/r/RelatedTo");
		ArrayList<String> relatedArray = parseJSONObject(related, "end");
		return relatedArray;
	}

	private ArrayList<String> getLocatedAt(String word) {
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

	private void parseFrameComponent(AFrameComponent frameComponent) {
		frameComponent.setRelatedWords(getGenericTypes(frameComponent.getOriginalWord(), frameComponent));
		frameComponent.setGenericTypes(getRelatedWords(frameComponent.getOriginalWord(), frameComponent));
	}

	private boolean isSetting(String word) {
		ArrayList<String> locatedAt = getLocatedAt(word);
		if (locatedAt.size() > 2) {
			return true;
		}
		return false;
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

	private double findConcretenessValue(String word) {
		try (BufferedReader br = new BufferedReader(new FileReader("concreteness_ratings.txt"))) {
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
}
