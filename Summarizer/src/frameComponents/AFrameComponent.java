package frameComponents;

import java.util.ArrayList;

public abstract class AFrameComponent implements FrameComponent {

	private String originalWord;
	private ArrayList<String> genericTypes;
	private ArrayList<String> relatedWords;

	public ArrayList<String> getRelatedWords() {
		return relatedWords;
	}

	public String getOriginalWord() {
		return originalWord;
	}

	public ArrayList<String> getGenericTypes() {
		return genericTypes;
	}

	public void setOriginalWord(String newOriginalWord) {
		originalWord = newOriginalWord;
	}

	public void setGenericTypes(ArrayList<String> newGenericTypes) {
		genericTypes = newGenericTypes;
	}

	public void setRelatedWords(ArrayList<String> newRelatedWords) {
		relatedWords = newRelatedWords;
	}

}
