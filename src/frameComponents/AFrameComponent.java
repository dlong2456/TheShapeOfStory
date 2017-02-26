package frameComponents;

import java.util.ArrayList;

import edu.stanford.nlp.util.IntTuple;

public abstract class AFrameComponent implements FrameComponent {

	private String originalWord;
	private ArrayList<String> genericTypes;
	private ArrayList<String> relatedWords;
	private String lemma;
	private IntTuple position;

	public ArrayList<String> getRelatedWords() {
		return relatedWords;
	}

	public String getOriginalWord() {
		return originalWord;
	}

	public String getLemma() {
		return lemma;
	}

	public void setLemma(String newLemma) {
		lemma = newLemma;
	}
	
	public IntTuple getPosition() {
		return position;
	}
	
	public void setPosition(IntTuple newPosition) {
		position = newPosition;
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
