package story;

import java.util.ArrayList;

import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;
import edu.stanford.nlp.util.CoreMap;

public class AStory implements Story {

	private ArrayList<Frame> frames;
	private String fullText = "";
	private Sentiment sentiment;

	public enum Sentiment {
		POSITIVE, NEGATIVE, NEUTRAL, VERY_POSITIVE, VERY_NEGATIVE
	}

	public ArrayList<Frame> getFrames() {
		return frames;
	}

	public void setFrames(ArrayList<Frame> newFrames) {
		frames = newFrames;
	}

	public void addFrames(ArrayList<Frame> additionalFrames) {
		for (Frame frame : additionalFrames) {
			frames.add(frame);
		}
	}

	public String getFullText() {
		return fullText;
	}

	public void setFullText(String newFullText) {
		fullText = newFullText;
	}

	public void augmentFullText(String addition) {
		fullText += addition;
	}

	public Sentiment getSentiment() {
		return sentiment;
	}

	public void setSentiment(StanfordCoreNLP pipeline) {
		Annotation document = new Annotation(fullText);
		pipeline.annotate(document);
		Integer mean = 0;
		int sentimentCount = 0;
		for (CoreMap sentence : document.get(CoreAnnotations.SentencesAnnotation.class)) {
			String sentiment = sentence.get(SentimentCoreAnnotations.SentimentClass.class);
			System.out.println(sentiment);
			int sentimentVal = 0;
			if (sentiment.equalsIgnoreCase("Neutral")) {
				sentimentVal = 0;
			} else if (sentiment.equalsIgnoreCase("Positive")) {
				sentimentVal = 1;
			} else if (sentiment.equalsIgnoreCase("Very Positive")) {
				sentimentVal = 2;
			} else if (sentiment.equalsIgnoreCase("Negative")) {
				sentimentVal = -1;
			} else if (sentiment.equalsIgnoreCase("Very Negative")) {
				sentimentVal = -2;
			}
			mean = mean + sentimentVal;
			sentimentCount++;
		}
		mean = (int) Math.ceil(mean / sentimentCount);
		if (mean == 0) {
			sentiment = Sentiment.NEUTRAL;
		} else if (mean == 1) {
			sentiment = Sentiment.POSITIVE;
		} else if (mean == 2) {
			sentiment = Sentiment.VERY_POSITIVE;
		} else if (mean == -1) {
			sentiment = Sentiment.NEGATIVE;
		} else if (mean == -2) {
			sentiment = Sentiment.VERY_NEGATIVE;
		} else {
			// default to neutral
			sentiment = Sentiment.NEUTRAL;
		}
	}

}
