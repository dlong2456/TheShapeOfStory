package frameTypes;

import java.util.ArrayList;

import frameComponents.FrameComponent;

public class AConversationFrame extends AFrame {
	
	private ArrayList<FrameComponent> entities;
	//Animation is always "speak" for now unless we add more types of convo frames
	private String animation = "speak";
	
	public ArrayList<FrameComponent> getEntities() {
		return entities;
	}
	
	public void setEntities(ArrayList<FrameComponent> newEntities) {
		entities = newEntities;
	}
	
	public String getAnimation() {
		return animation;
	}
	
	public void setAnimation(String newAnimation) {
		animation = newAnimation;
	}

}
