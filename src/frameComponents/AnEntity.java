package frameComponents;

import edu.stanford.nlp.coref.data.CorefChain;

public abstract class AnEntity extends AFrameComponent implements Entity {

	private CorefChain referenceChain;
	private int id;

	public CorefChain getReferences() {
		return referenceChain;
	}

	public void setReferences(CorefChain newReferenceChain) {
		referenceChain = newReferenceChain;
	}

	// use this in the future to track the same entity appearing throughout a
	// story
	public int getId() {
		return id;
	}
}