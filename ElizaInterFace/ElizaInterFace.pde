import java.io.*;
import codeanticode.eliza.*;
import controlP5.*;

ControlP5 cp5;
String textValue = "";


PWindow win;
Eliza eliza;
public void settings() {
  size(700, 400);
}

void setup() { 
  win = new PWindow();
  eliza = new Eliza(this);
  
   PFont font = createFont("arial",20);
  cp5 = new ControlP5(this);
  cp5.addTextfield("story_area")
     .setPosition(20,100)
     .setSize(200,200)
     .setFont(font)
     .setFocus(true)
     .setColor(color(255,0,0))
     ;
                 
  cp5.addBang("clear")
     .setPosition(240,100)
     .setSize(80,40)
     .getCaptionLabel().align(ControlP5.CENTER, ControlP5.CENTER)
     ;    
  textFont(font);
  
}

void draw() {
   background(0);
  fill(255);
  text(cp5.get(Textfield.class,"story_area").getText(), 360,130);
  text(textValue, 360,180);
 // input = false;
}
public void clear() {
  cp5.get(Textfield.class,"story_area").clear();
}

void controlEvent(ControlEvent theEvent) {
  if(theEvent.isAssignableFrom(Textfield.class)) {
    println("controlEvent: accessing a string from controller '"
            +theEvent.getName()+"': "
            +theEvent.getStringValue()
            );
     try
{
    String filename= "C:\\Users\\SANJANA\\Desktop\\Processing_multipleWindows\\data\\story.txt";
  //  FileWriter fw = new FileWriter(filename,true); //the true will append the new data
    FileWriter fw = new FileWriter(filename,true);
    BufferedWriter out = new BufferedWriter(fw);
    out.write("");
    out.append("\n"+theEvent.getStringValue());//appends the string to the file
    out.append("\r\n");
    out.close();
}
catch(IOException ioe)
{
    System.err.println("IOException: " + ioe.getMessage());
}

   
  }
  
   input = true;
  textVal = theEvent.getStringValue();
  println(eliza.processInput(textVal));
  input = false;
}


public void input(String theText) {
  // automatically receives results from controller input
  println("a textfield event for controller 'story_area' : "+theText);
}
void mousePressed() {
  println("mousePressed in primary window");
}  