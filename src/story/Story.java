package story;

import java.util.ArrayList;

import story.AStory.Sentiment;

public interface Story {
	public ArrayList<Frame> getFrames();

	public void setFrames(ArrayList<Frame> newFrames);

	public String getFullText();

	public void setFullText(String newFullText);

	public void augmentFullText(String addition);

	public Sentiment getSentiment();

	public void addFrames(ArrayList<Frame> additionalFrames);

	public void addSentiment(int newSentimentVal);

}
