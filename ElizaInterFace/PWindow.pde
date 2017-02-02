import codeanticode.eliza.*;
//
Boolean input = false;
String textVal= "";
class PWindow extends PApplet {
  Eliza eliza;
  PWindow() {
    super();

    PApplet.runSketch(new String[] {this.getClass().getSimpleName()}, this);
  }

  void settings() {
    size(500, 200);
  }

  void setup() {
    
    eliza = new Eliza(this);
  }

  void draw() {
   
    if(input)
    {
    background(150);
    displayResponse(textVal);
    }
   
 
  }

  void mousePressed() {
    println("mousePressed in secondary window");
  }
  
  void displayResponse(String inputText)
  {
    String response = eliza.processInput(inputText);
    text(response,width/2,height/2);
  
  }
  
  void keyPressed(KeyEvent ke)
  {
    if(key == CODED && keyCode == ENTER)
    fill(255);
    println(eliza.processInput(textVal));
   
  }
}