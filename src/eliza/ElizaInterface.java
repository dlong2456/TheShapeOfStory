package eliza;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Properties;

import codeanticode.eliza.Eliza;
import controlP5.ControlEvent;
import controlP5.ControlP5;
import controlP5.Textfield;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import frameComponents.FrameComponent;
import imageData.ImgDataManagement;
import main.AFrameMaker;
import main.ATextSegmenter;
import main.Frame;
import main.FrameMaker;
import main.TextSegmenter;
import processing.core.PApplet;
import processing.core.PFont;
import processing.core.PImage;
import main.Driver;

public class ElizaInterface extends PApplet {

	private static final long serialVersionUID = 1L;
	private ImgDataManagement IMD;
	private ControlP5 cp5;
	private String textValue = "";
	boolean characterFound = false;
	boolean settingFound = false;
	boolean actionFound = false;
	// PWindow win;
	boolean fl = false;
	private Eliza eliza;
	StanfordCoreNLP pipeline;
	public PImage img;
	public static ArrayList<PImage> displays = new ArrayList<PImage>();
	public static ArrayList<String> displayText = new ArrayList<String>();

	public void settings() {
		size(1000, 1000);
	}

	public void setup() {
		// Make NLP pipeline here because it takes awhile
		Properties props = new Properties();
		props.put("annotators", "tokenize, ssplit, pos, lemma");
		pipeline = new StanfordCoreNLP(props);
		// win = new PWindow();
		eliza = new Eliza(this);
		IMD = new ImgDataManagement(this,
				"C:\\Users\\SANJANA\\Documents\\_GATECH\\Semester2\\ADAMLab\\Feb2_Milestone1\\sketchInterface\\data\\train.txt");
		PFont font = createFont("arial", 20);
		cp5 = new ControlP5(this);
		cp5.addTextfield("story_area").setPosition(20, 100).setSize(200, 200).setFont(font).setFocus(true)
				.setColor(color(255, 0, 0));

		cp5.addBang("clear").setPosition(240, 100).setSize(80, 40).getCaptionLabel().align(ControlP5.CENTER,
				ControlP5.CENTER);
		textFont(font);
		background(0);
	}

	public void draw() {

		fill(255);
		text(cp5.get(Textfield.class, "story_area").getText(), 360, 130);
		text(textValue, 360, 180);
		if (fl) {
			// Collections.reverse(displays);
			// Collections.reverse(displayText);
			for (int i = 0; i < displays.size(); i++) {
				this.image(displays.get(i), i * 200, 400, 200, 200);
				fill(255);
				this.text(displayText.get(i), i * 200, 750);
			}
			// this.image(img, 0, 0,200,200);
			fl = false;
		}

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
			FrameMaker frameMaker = new AFrameMaker(this.pipeline);
			ArrayList<Frame> frames = new ArrayList<Frame>();
			for (int i = 0; i < textSegments.size(); i++) {
				Frame frame = frameMaker.makeFrame(textSegments.get(i));
				frames.add(frame);
			}
			for (int i = 0; i < frames.size(); i++) {
				ArrayList<FrameComponent> st = frames.get(i).getSettings();
				ArrayList<FrameComponent> ct = frames.get(i).getCharacters();
				ArrayList<FrameComponent> at = frames.get(i).getActions();

				if (!st.isEmpty()) {

					for (int j = 0; j < st.size(); j++) {
						PImage settingImage = IMD.pullPicture(st.get(j).getOriginalWord());
						if (settingImage != null) {
							displays.add(IMD.pullPicture(st.get(j).getOriginalWord()));
							displayText.add("setting");
							settingFound = true;
						}
						if (settingFound == false) {

							ArrayList<String> sGenericTypes = st.get(j).getGenericTypes();
							for (int k = 0; k < sGenericTypes.size(); k++) {
								settingImage = IMD.pullPicture(sGenericTypes.get(k));
								if (settingImage != null) {
									displays.add(settingImage);
									displayText.add("setting");
									settingFound = true;
									break;
								}

							}
						}
						if (settingFound == false) {
							ArrayList<String> sRelatedTypes = st.get(j).getRelatedWords();
							for (int k = 0; k < sRelatedTypes.size(); k++) {
								System.out.println(sRelatedTypes.get(k));

								settingImage = IMD.pullPicture(sRelatedTypes.get(k));
								if (settingImage != null) {
									displays.add(settingImage);
									displayText.add("setting");
									settingFound = true;
									break;
								}

							}
						}
					}
				}

				if (!ct.isEmpty()) {
					for (int j = 0; j < ct.size(); j++) {
						PImage characterImage = IMD.pullPicture(ct.get(j).getOriginalWord());
						if (characterImage != null) {
							displays.add(characterImage);
							displayText.add("character");
							characterFound = true;
						}
						if (characterFound == false) {

							ArrayList<String> cGenericTypes = ct.get(j).getGenericTypes();
							for (int k = 0; k < cGenericTypes.size(); k++) {
								characterImage = IMD.pullPicture(cGenericTypes.get(k));
								if (characterImage != null) {
									displays.add(characterImage);
									displayText.add("character");
									characterFound = true;
									break;
								}

							}
						}
						if (characterFound == false) {
							ArrayList<String> cRelatedTypes = ct.get(j).getRelatedWords();
							for (int k = 0; k < cRelatedTypes.size(); k++) {
								System.out.println(cRelatedTypes.get(k));

								characterImage = IMD.pullPicture(cRelatedTypes.get(k));
								if (characterImage != null) {
									displays.add(characterImage);
									displayText.add("character");
									characterFound = true;

									break;
								}

							}
						}

					}

				}

				if (!at.isEmpty()) {

					for (int j = 0; j < at.size(); j++) {
						PImage actionImage = IMD.pullPicture(at.get(j).getOriginalWord());
						if (actionImage != null) {
							displays.add(IMD.pullPicture(at.get(j).getOriginalWord()));
							displayText.add("action");
							actionFound = true;
						}
						if (actionFound == false) {

							ArrayList<String> aGenericTypes = at.get(j).getGenericTypes();
							for (int k = 0; k < aGenericTypes.size(); k++) {
								actionImage = IMD.pullPicture(aGenericTypes.get(k));
								if (actionImage != null) {
									displays.add(actionImage);
									displayText.add("action");
									actionFound = true;
									break;
								}

							}
						}
						if (actionFound == false) {
							ArrayList<String> aRelatedTypes = at.get(j).getRelatedWords();
							for (int k = 0; k < aRelatedTypes.size(); k++) {
								System.out.println(aRelatedTypes.get(k));
								actionImage = IMD.pullPicture(aRelatedTypes.get(k));
								if (actionImage != null) {
									displays.add(actionImage);
									displayText.add("action");
									actionFound = true;
									break;
								}

							}
						}
					}
				}

				fl = true;
			}
		}
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
