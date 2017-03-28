package story;

import java.util.ArrayList;

import frameComponents.Action;
import frameComponents.Emotion;
import frameComponents.Entity;
import frameComponents.Setting;

public class AFrame implements Frame {
	
	private Action action;
	private Emotion emotion;
	private Setting setting;
	private ArrayList<Entity> predicates;
	private ArrayList<Entity> subjects;

	public Action getAction() {
		return action;
	}
	
	public void setAction(Action newAction) {
		action = newAction;
	}
	
	public Emotion getEmotion() {
		return emotion;
	}
	
	public void setEmotion(Emotion newEmotion) {
		emotion = newEmotion;
	}
	
	public Setting getSetting() {
		return setting;
	}
	
	public void setSetting(Setting newSetting) {
		setting = newSetting;
	}
	
	public ArrayList<Entity> getPredicates() {
		return predicates;
	}
	
	public void setPredicates(ArrayList<Entity> newPredicates) {
		predicates = newPredicates;
	}
	
	public ArrayList<Entity> getSubjects() {
		return subjects;
	}
	
	public void setSubjects(ArrayList<Entity> newSubjects) {
		subjects = newSubjects;
	}

}
