package frameComponents;

public class AnEmotion extends AFrameComponent implements Emotion {
	private String primitiveEmotion;
	private String emotion;

	public String getEmotion() {
		return emotion;
	}

	public void setEmotion(String newEmotion) {
		emotion = newEmotion;
	}

	public String getPrimitiveEmotion() {
		return primitiveEmotion;
	}

	public void setPrimitiveEmotion(String newPrimitiveEmotion) {
		primitiveEmotion = newPrimitiveEmotion;
	}

}
