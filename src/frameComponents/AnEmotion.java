package frameComponents;

public class AnEmotion extends AFrameComponent implements Emotion {
	private String color;
	private String emotion;

	public String getEmotion() {
		return emotion;
	}

	public void setEmotion(String newEmotion) {
		emotion = newEmotion;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String newColor) {
		color = newColor;
	}

}
