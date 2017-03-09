package story;

import java.util.ArrayList;

import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import story.AStory.Sentiment;

public interface Story {
	public ArrayList<Frame> getFrames();

	public void setFrames(ArrayList<Frame> newFrames);

	public String getFullText();

	public void setFullText(String newFullText);

	public void augmentFullText(String addition);

	public Sentiment getSentiment();

	public void setSentiment(StanfordCoreNLP pipeline);

	public void addFrames(ArrayList<Frame> additionalFrames);

}
