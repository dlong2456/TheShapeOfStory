package main;

import java.util.ArrayList;

import frameComponents.FrameComponent;

public class AFrame implements Frame {
	public enum FrameType {
		EXPOSITORY, CONVERSATION, CLOSEUP, ACTION
	}

	private ArrayList<FrameComponent> characters;
	private ArrayList<FrameComponent> actions;
	private ArrayList<FrameComponent> settings;
	private ArrayList<FrameComponent> animals;
	private ArrayList<FrameComponent> objects;
	private FrameType frameType;
	private String animation;

	public AFrame(ArrayList<FrameComponent> newCharacters, ArrayList<FrameComponent> newActions,
			ArrayList<FrameComponent> newSettings) {
		characters = newCharacters;
		actions = newActions;
		settings = newSettings;
		getFrameType();
	}

	public AFrame() {
		// TODO Auto-generated constructor stub
	}

	public String getOriginalText() {
		return "";
	}

	public ArrayList<FrameComponent> getCharacters() {
		return characters;
	}
	
	public ArrayList<FrameComponent> getObjects() {
		return objects;
	}
	
	public ArrayList<FrameComponent> getAnimals() {
		return animals;
	}

	public ArrayList<FrameComponent> getActions() {
		return actions;
	}

	public ArrayList<FrameComponent> getSettings() {
		return settings;
	}

	public void setCharacters(ArrayList<FrameComponent> newCharacters) {
		characters = newCharacters;
	}

	public void setActions(ArrayList<FrameComponent> newActions) {
		actions = newActions;
	}

	public void setSettings(ArrayList<FrameComponent> newSettings) {
		settings = newSettings;
	}
	
	public void setAnimals(ArrayList<FrameComponent> newAnimals) {
		animals = newAnimals;
	}
	
	public void setObjects(ArrayList<FrameComponent> newObjects) {
		objects = newObjects;
	}

	public void getSentiment() {
		// sentiment analysis? http://nlp.stanford.edu/sentiment/index.html
	}

	// TODO: improve these rules
	// read-only
	// "main idea" of frame?
	public FrameType getFrameType() {
		if (!settings.isEmpty()) {
			frameType = FrameType.EXPOSITORY;
		}
		if (actions.size() > 1) {
			frameType = FrameType.ACTION;
		}
		if (characters.size() > 1) {
			frameType = FrameType.CONVERSATION;
		} else {
			frameType = FrameType.CLOSEUP;
		}
		return frameType;
	}
	
	public void setAnimation(String newAnimation) {
		animation = newAnimation;
	}

	// TODO: Match on number of characters
	// TODO: Match on sentiment analysis
	public String getAnimation() {
//				double lineStrength = 0;
				//for verb in actions column
				//if verb has a conceptNet link to any of this.getActions()
				//strength = strength + linkStrength
				//for adjective in descriptors column
				//if adj has a conceptNet link to any of this.getDescriptors()
				//strength = strength + linkStrength
				//for setting in settings column
				//etc
				//for character in characters column
				//etc
//				strengths.add(lineStrength);
				//animations.add(first column of line);
//			}
//			Double max = 0.0;
//			Integer lineIndex = null;
//			for (int i = 0; i < strengths.size(); i++) {
//				if (strengths.get(i) > max) {
//					max = strengths.get(i);
//					lineIndex = i;
//				}
//			}
//			if (lineIndex != null) {
//				System.out.println(animations.get(lineIndex));
//				return animations.get(lineIndex);
//			}
		return animation;
	}
}
