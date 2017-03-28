package frameComponents;

import edu.stanford.nlp.ling.IndexedWord;

public class AnAction extends AFrameComponent implements Action {
	
	private String animation;
	private IndexedWord verb;

	
	public String getAnimation() {
		return animation;
	}
	
	public void setAnimation(String newAnimation) {
		animation = newAnimation;
	}
	
	public IndexedWord getVerb() {
		return verb;
	}
	
	public void setVerb(IndexedWord newVerb) {
		verb = newVerb;
	}
	
}
