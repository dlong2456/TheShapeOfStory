package frameTypes;

import frameComponents.FrameComponent;

public class AnActionFrame extends AFrame {
	
	private String animation;
	private FrameComponent action;
	
	public AnActionFrame() {
		this.setFrameType(FrameType.ACTION);
	}
	
	public FrameComponent getAction() {
		return action;
	}
	
	public void setAction(FrameComponent newAction) {
		action = newAction;
	}
	
	public String getAnimation() {
		return animation;
	}
	
	public void setAnimation(String newAnimation) {
		animation = newAnimation;
	}

}
