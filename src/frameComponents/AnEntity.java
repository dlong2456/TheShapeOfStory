package frameComponents;

import edu.stanford.nlp.coref.data.CorefChain;

public abstract class AnEntity extends AFrameComponent {
	
	private CorefChain referenceChain;

	public CorefChain getReferences() {
		return referenceChain;
	}

	public void setReferences(CorefChain newReferenceChain) {
		referenceChain = newReferenceChain;
	}
}
//possible future additions: 
	//possessions
	//appearance
	//behavior/personality?
	//human vs non human