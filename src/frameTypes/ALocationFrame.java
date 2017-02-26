package frameTypes;

import frameComponents.FrameComponent;

public class ALocationFrame extends AFrame {
	
	private FrameComponent location; 
	
	public FrameComponent getLocation() {
		return location;
	}
	
	public void setLocation(FrameComponent newLocation) {
		location = newLocation;
	}

}
