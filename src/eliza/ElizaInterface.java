package eliza;

import java.util.ArrayList;

import codeanticode.eliza.Eliza;
import controlP5.ControlEvent;
import controlP5.ControlP5;
import controlP5.Textfield;
import main.AFrameMaker;
import main.ATextSegmenter;
import main.Frame;
import main.FrameMaker;
import main.TextSegmenter;
import processing.core.PApplet;
import processing.core.PFont;

public class ElizaInterface extends PApplet {

	private static final long serialVersionUID = 1L;
	private ControlP5 cp5;
	private String textValue = "";
	PWindow win;
	private Eliza eliza;

	public void settings() {
		size(1000, 1000);
	}

	public void setup() {
		win = new PWindow();
		eliza = new Eliza(this);

		PFont font = createFont("arial", 20);
		cp5 = new ControlP5(this);
		cp5.addTextfield("story_area").setPosition(20, 100).setSize(200, 200).setFont(font).setFocus(true)
				.setColor(color(255, 0, 0));

		cp5.addBang("clear").setPosition(240, 100).setSize(80, 40).getCaptionLabel().align(ControlP5.CENTER,
				ControlP5.CENTER);
		textFont(font);

	}

	public void draw() {
		background(0);
		fill(255);
		text(cp5.get(Textfield.class, "story_area").getText(), 360, 130);
		text(textValue, 360, 180);
		// input = false;
	}

	public void clear() {
		cp5.get(Textfield.class, "story_area").clear();
	}

	public void controlEvent(ControlEvent theEvent) {
		if (theEvent.isAssignableFrom(Textfield.class)) {
			TextSegmenter textSegmenter = new ATextSegmenter();
			ArrayList<String> textSegments = textSegmenter.paragraphToSentences(theEvent.getStringValue());
			// Make each sentence into a frame
			FrameMaker frameMaker = new AFrameMaker();
			ArrayList<Frame> frames = new ArrayList<Frame>();
			for (int i = 0; i < textSegments.size(); i++) {
				Frame frame = frameMaker.makeFrame(textSegments.get(i));
				frames.add(frame);
			}
			//FILE OUTPUT CODE BELOW
//			try {
//				String filename = "C:\\Users\\SANJANA\\Desktop\\Processing_multipleWindows\\data\\story.txt";
//				// FileWriter fw = new FileWriter(filename,true); //the true
//				// will append the new data
//				FileWriter fw = new FileWriter(filename, true);
//				BufferedWriter out = new BufferedWriter(fw);
//				out.write("");
//				// appends the string to the file
//				out.append("\n" + theEvent.getStringValue());
//				out.append("\r\n");
//				out.close();
//			} catch (IOException ioe) {
//				System.err.println("IOException: " + ioe.getMessage());
//			}
		}
		win.input = true;
		String textVal = theEvent.getStringValue();
		println(eliza.processInput(textVal));
		win.input = false;
	}

	public void input(String theText) {
		// automatically receives results from controller input
		// println("a textfield event for controller 'story_area' : " +
		// theText);
	}

	public void mousePressed() {
		// println("mousePressed in primary window");
	}

}
