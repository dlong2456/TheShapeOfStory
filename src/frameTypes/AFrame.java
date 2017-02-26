package frameTypes;

public abstract class AFrame implements Frame {
	
	public enum FrameType {
		LOCATION, ACTION, AGENT, OBJECT, CLOSEUP, CONVERSATION
	}

	private FrameType frameType;

	public FrameType getFrameType() {
		return frameType;
	}

	public void setFrameType(FrameType newFrameType) {
		frameType = newFrameType;
	}

}
