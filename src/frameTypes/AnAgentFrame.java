package frameTypes;

import java.util.ArrayList;

import frameComponents.FrameComponent;

public class AnAgentFrame extends AFrame {
	
	private ArrayList<FrameComponent> entities;
	
	public AnAgentFrame() {
		this.setFrameType(FrameType.AGENT);
	}
	
	public ArrayList<FrameComponent> getEntities() {
		return entities;
	}
	
	public void setEntities(ArrayList<FrameComponent> newEntities) {
		entities = newEntities;
	}

}
