package main;

import java.text.BreakIterator;
import java.util.ArrayList;
import java.util.Locale;

public class ATextSegmenter implements TextSegmenter {

	public ArrayList<String> paragraphToSentences(String paragraph) {
		ArrayList<String> sentences = new ArrayList<String>();
		BreakIterator iterator = BreakIterator.getSentenceInstance(Locale.US);
		iterator.setText(paragraph);
		int lastIndex = iterator.first();
		while (lastIndex != BreakIterator.DONE) {
			int firstIndex = lastIndex;
			lastIndex = iterator.next();
			if (lastIndex != BreakIterator.DONE) {
				String sentence = paragraph.substring(firstIndex, lastIndex);
				sentences.add(sentence);
			}
		}
		return sentences;
	}

}
