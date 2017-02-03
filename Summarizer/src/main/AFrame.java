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
	private FrameType frameType;

	public AFrame(ArrayList<FrameComponent> newCharacters, ArrayList<FrameComponent> newActions,
			ArrayList<FrameComponent> newSettings) {
		characters = newCharacters;
		actions = newActions;
		settings = newSettings;
		getFrameType();
	}

	public ArrayList<FrameComponent> getCharacters() {
		return characters;
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

	// TODO: improve these rules
	// read-only
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
}
