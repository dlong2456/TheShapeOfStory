package imageData;

import java.io.*;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Set;
import java.util.Iterator;
import java.util.HashSet;
import java.lang.Integer;
import processing.core.PApplet;
import processing.core.PImage;
import processing.core.PFont;
public class ImgDataManagement {
	public String imgSource ;
	PApplet parent;
	
	PImage img;
	HashMap<String,ArrayList>h;
	HashMap<String,String>h2;
	ArrayList<String>parents;
	
	public ImgDataManagement(PApplet p , String source)
	{
		parent = p;
		imgSource = source;
		String lines[] = p.loadStrings(imgSource);
		  
		  h = new HashMap<String,ArrayList>(); // hash map to hold the object and corresponding folder numbers
		  h2 = new HashMap<String,String>(); // hash map to hold the object and its parent.
		  parents = new ArrayList<String>(); // array list that holds all the parent classes.
		  for(int i = 1 ; i < lines.length ; i++)
		  {
		    if((lines[i].charAt(0)>=65 && lines[i].charAt(0)<=90) | (lines[i].charAt(0)>=97 && lines[i].charAt(0)<=122) )
		    {
		      String testString[] = p.split(lines[i],' ');
		      if(Integer.parseInt(testString[2])==0)
		      {
		        h.put(testString[0],new ArrayList(0));
		        h.get(testString[0]).add(0);
		      }
		     else
		     {
		        h.put(testString[0],new ArrayList(Integer.parseInt(testString[2])));
		     for(int j =i+1 ; j < i+Integer.parseInt(testString[2])+1;j++)
		     {
		         h.get(testString[0]).add(lines[j]);
		     }
		     }
		    
		    }
		   
		  }
		  
		 for(int i = 1 ; i < lines.length ; i++)
		 {
		    if((lines[i].charAt(0)>=65 && lines[i].charAt(0)<=90) | (lines[i].charAt(0)>=97 && lines[i].charAt(0)<=122) )
		    {
		      String testString[] = p.split(lines[i],' ');
		      if(testString[1].equals("0"))
		      {
		       
		       parents.add(testString[0]);
		       h2.put(testString[0],"0");
		      }
		      else
		      h2.put(testString[0],testString[1]);
		     
		     
		    }
		   
		 }
		
	}
	
	
	public PImage pullPicture(String object)
	{
	  PImage img;
	  Set<String> s = new HashSet<String>(h.keySet());
	  for (Iterator<String> it = s.iterator(); it.hasNext(); ) {
	        String f = it.next();
	        if (object.equals(f))
	           {
	             int r = 0; // r =1 if things stop working.
	             //int r = int(random(h.get(f).size()));
	             int objAddress = Integer.parseInt(h.get(f).get(r).toString());
	             int folderNum = objAddress/100;
	             String imgAdress = "m"+h.get(f).get(r).toString(); 
	             img = parent.loadImage("C:\\Users\\SANJANA\\Documents\\_GATECH\\Semester2\\ADAMLab\\Feb2_Milestone1\\sketchInterface\\data\\train\\png\\"+folderNum+"\\"+imgAdress+"\\"+objAddress+".png");
	            
	             return img;
	           }
	    }
	  
	 return null;
	}

}
