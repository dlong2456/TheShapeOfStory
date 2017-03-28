package frameComponents;

import edu.stanford.nlp.ling.IndexedWord;

public interface Action extends FrameComponent {
	
	public String getAnimation();
	
	public void setAnimation(String newAnimation);
	
	public IndexedWord getVerb();
	
	public void setVerb(IndexedWord newVerb);
}
