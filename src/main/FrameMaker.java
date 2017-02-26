package main;

import java.util.ArrayList;

import edu.stanford.nlp.pipeline.Annotation;
import frameTypes.Frame;

public interface FrameMaker {
	public ArrayList<Frame> makeFrame(Annotation document);

}
