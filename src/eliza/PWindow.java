package eliza;

import codeanticode.eliza.Eliza;
import processing.core.PApplet;
import processing.event.KeyEvent;
import processing.core.PImage;
public class PWindow extends PApplet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	Boolean input = false;
	String textVal = "";
	Eliza eliza;

	public PWindow() {
		super();
		PApplet.runSketch(new String[] { this.getClass().getSimpleName() }, this);
	}

	void settings() {
		size(1000, 1000);
	}

	public void setup() {
		eliza = new Eliza(this);
	}

	public void draw() {
		for(int i = 0 ; i < ElizaInterface.displays.size(); i++)
			this.image(ElizaInterface.displays.get(i),0,0,200,200);
	}

	public void mousePressed() {
//		println("mousePressed in secondary window");
	}

	public void displayResponse(String inputText) {
		String response = eliza.processInput(inputText);
		text(response, width / 2, height / 2);
	}

	public void keyPressed(KeyEvent ke) {
		if (key == CODED && keyCode == ENTER)
			fill(255);
		println(eliza.processInput(textVal));
	}
}