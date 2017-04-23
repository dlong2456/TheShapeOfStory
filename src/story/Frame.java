package story;

import java.util.ArrayList;

import frameComponents.Action;
import frameComponents.Emotion;
import frameComponents.Entity;
import frameComponents.Setting;
import story.AStory.Sentiment;

public interface Frame {
	public Action getAction();

	public void setAction(Action newAction);

	public Emotion getEmotion();

	public void setEmotion(Emotion newEmotion);

	public Setting getSetting();

	public void setSetting(Setting newSetting);

	public ArrayList<Entity> getPredicates();

	public void setPredicates(ArrayList<Entity> newPredicates);

	public ArrayList<Entity> getSubjects();

	public void setSubjects(ArrayList<Entity> newSubjects);

	public Sentiment getSentiment();

	public void setSentiment(Sentiment newSentiment);

}