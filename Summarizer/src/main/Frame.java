package main;

import java.util.ArrayList;

import frameComponents.FrameComponent;
import main.AFrame.FrameType;

public interface Frame {

	public ArrayList<FrameComponent> getCharacters();

	public ArrayList<FrameComponent> getActions();

	public ArrayList<FrameComponent> getSettings();

	public void setCharacters(ArrayList<FrameComponent> newCharacters);

	public void setActions(ArrayList<FrameComponent> newActions);

	public void setSettings(ArrayList<FrameComponent> newSettings);

	public FrameType getFrameType();
}
