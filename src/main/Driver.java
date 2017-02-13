package main;

import processing.core.PApplet;

public class Driver {

	public static void main(String[] args) {
//		//Make NLP pipeline here because it takes awhile
//		Properties props = new Properties();
//		props.put("annotators", "tokenize, ssplit, pos, lemma");
//		StanfordCoreNLP pipeline = new StanfordCoreNLP(props);
//		// Segment paragraph into sentences
//		TextSegmenter textSegmenter = new ATextSegmenter();
//		ArrayList<String> textSegments = textSegmenter.paragraphToSentences("The first time I ever had sushi was when I was about ten years old. I was visiting my now late grandmother (or Khun Yai, as I called her in Thai) in Bangkok, where she and my mother's family lived. I picked at it, unsure of whether or not I wanted to eat this decidedly raw fish in its spongy sleeve of rice. I was, after all, American, and was used to food served through a car window. All of a sudden, I spotted something familiar on my plate: a small but appetizing lump of green guacamole. I scraped all of it up and plopped it in my mouth, noticing an amused glint in my grandmother's eyes far too late. Fire swept my mouth in a painful, sinus-clearing swell. As I wailed, experiencing the zing of wasabi for the first time, my grandmother laughed the heartiest, most earnest laugh I've ever heard to this day.");
//		// Make each sentence into a frame
//		FrameMaker frameMaker = new AFrameMaker(pipeline);
//		ArrayList<Frame> frames = new ArrayList<Frame>();
//		for (int i = 0; i < textSegments.size(); i++) {
//			Frame frame = frameMaker.makeFrame(textSegments.get(i));
//			frame.getAnimation();
//			frames.add(frame);
//		}
		 PApplet.main("eliza.ElizaInterface");
	}

}
