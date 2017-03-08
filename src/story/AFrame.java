package story;

import java.util.ArrayList;

import frameComponents.FrameComponent;

public class AFrame implements Frame {
	
	private FrameComponent action;
	private FrameComponent emotion;
	private FrameComponent setting;
	private ArrayList<FrameComponent> predicates;
	private ArrayList<FrameComponent> subjects;

	public FrameComponent getAction() {
		return action;
	}
	
	public void setAction(FrameComponent newAction) {
		action = newAction;
	}
	
	public FrameComponent getEmotion() {
		return emotion;
	}
	
	public void setEmotion(FrameComponent newEmotion) {
		emotion = newEmotion;
	}
	
	public FrameComponent getSetting() {
		return setting;
	}
	
	public void setSetting(FrameComponent newSetting) {
		setting = newSetting;
	}
	
	public ArrayList<FrameComponent> getPredicates() {
		return predicates;
	}
	
	public void setPredicates(ArrayList<FrameComponent> newPredicates) {
		predicates = newPredicates;
	}
	
	public ArrayList<FrameComponent> getSubjects() {
		return subjects;
	}
	
	public void setSubjects(ArrayList<FrameComponent> newSubjects) {
		subjects = newSubjects;
	}

}
