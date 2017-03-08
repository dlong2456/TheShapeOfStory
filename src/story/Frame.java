package story;

import java.util.ArrayList;

import frameComponents.FrameComponent;

public interface Frame {
	public FrameComponent getAction();

	public void setAction(FrameComponent newAction);

	public FrameComponent getEmotion();

	public void setEmotion(FrameComponent newEmotion);

	public FrameComponent getSetting();

	public void setSetting(FrameComponent newSetting);

	public ArrayList<FrameComponent> getPredicates();

	public void setPredicates(ArrayList<FrameComponent> newPredicates);

	public ArrayList<FrameComponent> getSubjects();

	public void setSubjects(ArrayList<FrameComponent> newSubjects);

}