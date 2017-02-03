package main;

import java.util.ArrayList;

public class Driver {

	public static void main(String[] args) {
		// Segment paragraph into sentences
		TextSegmenter textSegmenter = new ATextSegmenter();
		// TODO: problems with two-word nouns
		ArrayList<String> textSegments = textSegmenter.paragraphToSentences(
				"Yesterday, I went to the supermarket with my mom. We bought some carrots and peppers. My dog also came along. We were all very happy. I love my mom and dog.");
		// Make each sentence into a frame
		FrameMaker frameMaker = new AFrameMaker();
		ArrayList<Frame> frames = new ArrayList<Frame>();
		for (int i = 0; i < textSegments.size(); i++) {
			Frame frame = frameMaker.makeFrame(textSegments.get(i));
			frames.add(frame);
		}
	}

}
