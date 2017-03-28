package frameComponents;

import edu.stanford.nlp.coref.data.CorefChain;

public interface Entity extends FrameComponent {
	public CorefChain getReferences();

	public void setReferences(CorefChain newReferenceChain);

	// use this in the future to track the same entity appearing throughout a
	// story
	public int getId();
}
