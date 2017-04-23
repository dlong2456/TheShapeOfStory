package story;

import java.util.ArrayList;

public class AStory implements Story {

	private ArrayList<Frame> frames;
	private String fullText = "";
	private Sentiment sentiment;
	private int sentimentCount = 0;
	private int sentimentRunningTotal = 0;
	private int sentimentVal = 0;

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
	
	public void addSentiment(int newSentimentVal) {
		sentimentCount++;
		sentimentRunningTotal = sentimentRunningTotal + newSentimentVal;
		sentimentVal = (int) Math.ceil(sentimentRunningTotal / sentimentCount);
		if (sentimentVal == 0) {
			sentiment = Sentiment.NEUTRAL;
		} else if (sentimentVal == 1) {
			sentiment = Sentiment.POSITIVE;
		} else if (sentimentVal == 2) {
			sentiment = Sentiment.VERY_POSITIVE;
		} else if (sentimentVal == -1) {
			sentiment = Sentiment.NEGATIVE;
		} else if (sentimentVal == -2) {
			sentiment = Sentiment.VERY_NEGATIVE;
		} else {
			// default to neutral
			sentiment = Sentiment.NEUTRAL;
		}
	}

}
