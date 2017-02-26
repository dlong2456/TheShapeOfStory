package frameComponents;

import java.util.ArrayList;

public interface FrameComponent {

	public ArrayList<String> getRelatedWords();

	public String getOriginalWord();

	public ArrayList<String> getGenericTypes();

	public void setOriginalWord(String newOriginalWord);

	public void setGenericTypes(ArrayList<String> newGenericType);

	public void setRelatedWords(ArrayList<String> newRelatedWords);

	public String getLemma();

	public void setLemma(String newLemma);

}
