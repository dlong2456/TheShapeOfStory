package frameTypes;

import frameComponents.FrameComponent;

public class AnEmotionFrame extends AFrame {
	private String animation;
	private FrameComponent emotion;
	private FrameComponent entity;
	
	public AnEmotionFrame() {
		this.setFrameType(FrameType.CLOSEUP);
	}
	
	public FrameComponent getEntity() {
		return entity;
	}
	
	public void setEntity(FrameComponent newEntity) {
		entity = newEntity;
	}

	public FrameComponent getEmotion() {
		return emotion;
	}

	public void setEmotion(FrameComponent newEmotion) {
		emotion = newEmotion;
	}

	public String getAnimation() {
		return animation;
	}

	public void setAnimation(String newAnimation) {
		animation = newAnimation;
	}
}
