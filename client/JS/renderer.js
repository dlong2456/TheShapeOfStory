var Renderer = (function()
{
var settingUtility = 
{
  "" : emptyFunction,
  "in" : drawIn,
  "from" : drawFrom,
  "to" : drawTo,
  "at" : drawOn,
  "on" : drawOn,
}

var shapeUtility={
   "" : drawSquare,
  "circle" : drawCircle,
  "triangle" : drawTriangle,
  "square" : drawSquare,
  "rectangle" : drawRectangle,


};
var colorUtility = 
{

//  "red" : Array(255,0,0),
   "" : '#000000',
  "red" : '#ff0000', //fear, disgust , 
  "green" :'#00ff00', //
  "blue" :'#0000ff', //sadness
  "black" : '#000000', //anger
  "white" : '#ffffff',
 
  //anger
"dark_red" : '#CC0000',
"red_orange" : '#FF4500',
"dark_green" : '#336600',

//disgust
"dull_yellow" : '#cccc00',
"grey_black" : '#606060',
"maroon" : '#660000',

//fear
"dark_orange" : '#FF8C00',
"yellow_green" : '#CCCC00',
"dull_yellow" : '#999900',

//happiness
"orange" : '#FFA500',
"yellow" : '#ffff00',
"olive_green" : '#00cc00',
"gold" : '#FFDF00',
"aqua" : '#00cccc',
"light_blue" : '#99ffff',

//sadness
"dull_green" : '#666600',
"dark_purple" : '#330066',
"grey" : '#c0c0c0',

//surprise
"orange" : '#ff8000',
"bright_yellow" : '#ffff00',
"bright_blue" : '#002366',
"bright_green" : '#80ff00',
"magenta" : '#FF007F',


};


var actionUtility = 
{
  "" : drawExpel,
  "expel" : drawExpel,
  "propel" : drawPropel,
  "see" : drawSee,
  "smell" : drawSmell,
  "move-object" : drawMoveObject,
  "think-about" : drawThinkAbout,
  "ingest" : drawIngest,
  "speak" : drawSpeak,
  "hear" :drawHear,
 "feel" : drawFeel,
  "have" :drawHave,
  "conclude" : drawConclude,
  "move-body-part": drawMoveBodyPart,
  "be" : drawBe,
};
var feelingUtility = 
{
  //red is a very emotionally intense color.
  //orange combines the energy of red and happiness of yellow
  //
  "" : ["orange","yellow","olive_green","gold","aqua","light_blue"],
  "anger" : ["dark_red","black","red_orange","dark_green"], //red orange for aggression
  "disgust" : ["red","dull_yellow","grey_black","maroon"], //dull yellow for sickness
  "fear" : ["red","dark_orange","yellow_green","dull_yellow"], //erd for danger, yellow_green for cowardice,//dark_orange for distrust
  "happiness" : ["orange","yellow","olive_green","gold","aqua","light_blue"],
  "sadness" : ["dull_green","blue"," dark_purple","grey"],
  "surprise" : ["orange","bright_yellow","bright_blue","bright_green","magenta"],

}


//Public stuff
	//the layer class 
	var Layer = function(layerType)
    {


    	if(layerType == "background" )
           BackgroundLayer.call(this);
        if(layerType == "entity" )
           EntityLayer.call(this);
        if(layerType == "text" )
           TextLayer.call(this);
        else //defualt layer set to entity
           EntityLayer.call(this);
    }

    Layer.prototype = 
    {
    	constructor : Layer,

    }
 /*
 //use for testing different techniques
  var testFunction = function()
  {
  	fill(200,200,0);
  	rect(20,20,20,20);
  }
*/


//the background layer class
var BackgroundLayer = function(color,setting)
{
  this.type = "background"
  this.color = color || "baige"; // represents the background emotion.
  this.setting = setting;

}
BackgroundLayer.prototype=
{
	constructor :BackgroundLayer,
	draw :  function(pt)
	{

       // fill.apply(null,colorUtility[this.color]);
      
       
        
      
        
	},
}

//the text Layer class
var TextLayer = function()
{
	this.type = "text";
	//to be figured out.
}

//the entity layer class
var AgentLayer = function(num,subjects,predicates,action,setting)
{
  this.num = num;
	this.type = "agent";
	this.subjects = subjects || [] ;
  this.predicates = predicates || [] ;
	this.action = action || "";
  
  this.setting = setting || "";
 // console.log(this.relation);
  
}

AgentLayer.prototype=
{
	constructor :AgentLayer,
	draw : function(pt,t)
	{
    var time = t-4*this.num;
   if(time > 0 && time <=3)
   {
   
      //var i = pt["pt"].x-(pt["length"]);
    //  var j =pt["pt"].y-(pt["length"]);
      var i = pt["pt"].x;
      var j = pt["pt"].y;
      point(i,j);
      var alpha = 255;
      var obj = 1;
      var posSettingx, posSettingy; 
      var settingBoundx , settingBoundy;
      var posPx,posPy;
      var posSx , posSy;
     
      var agentspacex , agentspacey;
      var posx, posy;
      var boundingBoxX, boundingBoxY;

     if(this.setting == "on" || this.setting == "at")
     {
   
      posSettingx = i-pt["length"];
      posSettingy = j + 0.1*pt["length"]*2;
      settingBoundx = pt["length"];
      settingBoundy = pt["length"]*0.4*2;
      agentspacex = pt["length"]*2;
      agentspacey = pt["length"]*0.6*2;
      
      posSx = i-pt["length"];
      posSy = j-pt["length"];
      posPx = posSx+agentspacex/2;
      posPy = posSy;
      posx = posSx+agentspacex/2;
      posy = posSy+agentspacey/2;
      
   
     }
     if(this.setting == "in")
     {
     // posSettingx = i+0.1*pt["length"]*2;
     // posSettingy = j+0.1*pt["length"]*2;
     posSettingx = i;
     posSettingy = j;
     settingBoundx = 0.8*pt["length"]*2;
     settingBoundy = 0.8*pt["length"]*2;
      agentspacex = 0.7*pt["length"]*2;
      agentspacey = 0.7*pt["length"]*2;
     
      posSx =  i-0.7*pt["length"];
      posSy = j-0.7*pt["length"];
      posPx = posSx+agentspacex/2;
      posPy = posSy;
      posx = posSx+agentspacex/2;
      posy = posSy+agentspacey/2;
       
     }
     if(this.setting == "")
     {
     // posSettingx = i+0.1*pt["length"]*2;
     // posSettingy = j+0.1*pt["length"]*2;
     posSettingx = i;
     posSettingy = j;
     settingBoundx = 0.8*pt["length"]*2;
     settingBoundy = 0.8*pt["length"]*2;
      agentspacex = 0.7*pt["length"]*2;
      agentspacey = 0.7*pt["length"]*2;
     
      posSx =  i-0.7*pt["length"];
      posSy = j-0.7*pt["length"];
      posPx = posSx+agentspacex/2;
      posPy = posSy;
      posx = posSx+agentspacex/2;
      posy = posSy+agentspacey/2;
       
     }
     if(this.setting == "to")
     {
      posSettingx = i+0.3*pt["length"];
      posSettingy = j;
      settingBoundx = 0.6*pt["length"]*2;
      settingBoundy = 0.8*pt["length"]*2;
      agentspacex = 0.6*pt["length"]*2;
      agentspacey = 0.4*pt["length"]*2;
    
      posSx = i-pt["length"];
      posSy = j-pt["length"]/2;
      posPx = posSx+agentspacex/2;
      posPy = posSy;
      posx = posSx+agentspacex/2;
      posy = j;
          
     }
     if(this.setting == "from")
     {
      posSettingx = i;
      posSettingy = j;
      settingBoundx = 0.6*pt["length"]*2;
      settingBoundy = 0.8*pt["length"]*2;
      agentspacex = 0.6*pt["length"]*2;
      agentspacey = 0.4*pt["length"]*2;
     
      posSx = i;
      posSy = j-pt["length"]/2;
      posPx = posSx+agentspacex/2;
      posPy = posSy;
      posx = posSx+agentspacex/2;
      posy = j;
      
     }
     boundingBoxX = agentspacex/2;
     boundingBoxY = agentspacey;
  
  drawSetting(this.setting,posSettingx,posSettingy, pt["length"],time);
  
      this.subjects.forEach(function(agent)
      {
             
             
      drawShape(agent.shape,agent.color, posSx , posSy,alpha/obj,boundingBoxX,boundingBoxY,time);
      obj+=1;

      },this);

      this.predicates.forEach(function(agent)
      {

               drawShape(agent.shape,agent.color, posPx , posPy,alpha/obj,boundingBoxX,boundingBoxY,time);
      obj+=1;

      });
      var scribble = new Scribble();
      //actionUtility[this.action](posx,posy,agentspacex,agentspacey,scribble,time);
	}
  },
	
}




//private stuff

 function drawShape(shape, color ,  i , j,alpha,w,h,time)
{
  
  var scribble = new Scribble();
  var c1 = colorUtility[random(feelingUtility[color])];
  var c1 = random(feelingUtility[color]);
  shapeUtility[shape](i,j,w,h,c1,scribble,time);
 
  
 

}

function drawSetting(setting,i,j,length,time)
{
  var scribble = new Scribble();
  settingUtility[setting](i,j,length,scribble,time);
}

function drawTriangle(i,j,w,h,color,scribble,time)
{
  
 var rFactor = random(5); //degree of randomness
 push();

  translate(i,j);
  
  
  scribble.scribbleLine(w/2,0.1*h+rFactor,0.8*w,0.8*h);
  scribble.scribbleLine(0.8*w,0.8*h,0.2*w,0.8*h);
   scribble.scribbleLine(w/2,0.1*h+rFactor,0.2*w,0.8*h);
   stroke(color);
   var xCoords = [w/2,0.8*w,0.2*w];
   var yCoords = [0.1*h+rFactor,0.8*h,0.8*h];
   var gap = 2;
   var angle = 90;
   scribble.scribbleFilling(xCoords,yCoords,gap,angle);

   noStroke();
  pop();
 
}

function drawSquare(i,j,w,h,color,scribble,time)
{
  push();

    translate(i,j);
   var dist = w;
   var speed = w/10;
   var x = +speed*time;
   var _x = dist+speed*(time-1);
   var __x = dist+speed*(time-2);
  
   if(time<1)
  {
       scribble.scribbleLine(x,0,x+time*dist,0);
       scribble.scribbleLine(0,x,0,x+time*dist);
  }
  else if(time<2)
  {
     scribble.scribbleLine(dist,_x-2*dist+dist,dist,_x+(time-1)*dist-2*dist+dist);
  }
  else if(time < 3)
  {
   scribble.scribbleLine(__x-2*dist+dist,0+dist,__x+(time-2)*dist-2*dist+dist,0+dist);
  }
 
  stroke(color);
  
   scribble.scribbleLine(0,(dist*time)%dist,w,(dist*time)%dist);

  

   stroke(0);

   
  pop();

}

function drawRectangle(i,j,w,h,color,scribble,time)
{
 
  push();
  var distX = w/2;
  var distY = h;
    translate(i,j);
 
 
   var speedX = w/10;
   var speedY = h/10;
   var x = +speedX*time;
   var _x = w+speedY*(time-1);
   var __x = h+speedX*(time-2);
 
   if(time<1)
  {
       scribble.scribbleLine(x,0,x+time*distX,0);
       scribble.scribbleLine(0,x,0,x+time*distY);
  }
  else if(time<2)
  {
     scribble.scribbleLine(distX,_x-distY,distX,_x+(time-1)*distY-distY);
  }
  else if(time < 3)
  {
   scribble.scribbleLine(__x-2*distX,distY,__x+(time-2)*distX-2*distX,distY);
  }
 
  stroke(color);
  
   scribble.scribbleLine(0,(distY*time)%distY,w/2,(distY*time)%distY);

   stroke(color);
   

   stroke(0);
  pop();
}

function drawCircle(i,j,w,h,color,scribble,time)
{
 
  push()
    translate(i,j);
 
  
 fill(color);

  //scribble.scribbleEllipse(w/2+6,h/2,(w),(w));
  var majorAxis = w/2;
   var minorAxis = w/2;
   var x =0+6+time;
   var y = 0-w/2+time*10;

   scribble.scribbleLine(x+minorAxis*Math.cos(time),y+majorAxis*Math.sin(time),x+minorAxis*Math.cos(time+2*deltaTime),y+majorAxis*Math.sin(time+2*deltaTime));

noFill();
  pop();
 
}
function emptyFunction()
{
  return -1;
}

function drawOn(i,j,length,scribble,time)
{
   
   strokeWeight(2);

  // var r = random([-1,1]);
  var dist = (i+0.9*length*2)-(i+0.1*length*2);
  var speed = dist/10;
  var x = i+0.1*length*2+speed*time;
  var _x = i+0.1*length*2+speed*(time-1);
  var __x = i+0.1*length*2+speed*(time-2);
  var r = 1;
  
 
  if(time<1)
  {
  
    scribble.scribbleLine(x,j+r*0.3*length*2,x+time*100,j+r*0.3*length*2);
 }
   else if(time<2)  
  { 
     scribble.scribbleLine(_x,j+r*0.2*length*2,_x+(time-1)*100,j+r*0.2*length*2);
  }
   else if(time<3)
   {
    scribble.scribbleLine(__x,j+r*0.1*length*2,__x+(time-2)*100,j+r*0.1*length*2);
  }
  
    strokeWeight(1);
}
function drawIn(i,j,length,scribble,time)
{
  strokeWeight(2);
  var dist = 0.8*length*2;
  var speed = dist/10;
  var x = (i-0.8*length*2)+speed*time;
  var _x = (j+0.8*length*2)+speed*(time-1);
  var __x = (i+0.8*length*2)+speed*(time-2);
  if(time<1)
  {
       scribble.scribbleLine(x,j-dist,x+time*100,j-dist);
       scribble.scribbleLine(i-dist,x,i-dist,x+time*100);
  }
  else if(time<2)
  {
     scribble.scribbleLine(i,_x-2*dist,i,_x+(time-1)*100-2*dist);
  }
  else if(time < 3)
  {
   scribble.scribbleLine(__x-2*dist,j,__x+(time-2)*100-2*dist,j);
  }
 // scribble.scribbleRect(i,j,0.8*length*2,0.8*length*2);
  strokeWeight(1);
}

function drawFrom(i,j,length,scribble,time)
{
    strokeWeight(2);
   // scribble.scribbleEllipse(i,j,0.6*length*2,0.8*length*2);
   var majorAxis = 0.8*length*2;
   var minorAxis = 0.6*length*2;
   var x = i+time;
   var y = j-0.8*length+time*10;

   scribble.scribbleLine(x+minorAxis*Math.cos(time),y+majorAxis*Math.sin(time),x+minorAxis*Math.cos(time+deltaTime),y+majorAxis*Math.sin(time+deltaTime));
   //scribble.scribbleRect(i,j,0.6*length*2,0.8*length*2)
   
    strokeWeight(1);
}
function drawTo(i,j,length,scribble,time)
{
    strokeWeight(2);
     var majorAxis = 0.8*length*2;
   var minorAxis = 0.6*length*2;
   var x = i+time;
   var y = j-0.8*length+time*10;
    scribble.scribbleLine(x+minorAxis*Math.cos(time),y+majorAxis*Math.sin(time),x+minorAxis*Math.cos(time+deltaTime),y+majorAxis*Math.sin(time+deltaTime));
    //scribble.scribbleEllipse(i,j,0.6*length*2,0.8*length*2);
    strokeWeight(1);
}
function drawBe(i,j,w,h,scribble,time)
{
   push();
  translate(i,j);
 
  //using a sin wave.
  
  pop();
}
function drawSmell(i,j,w,h,scribble,time)
{
   push();
  translate(i,j);
  
  //using a sin wave.
  fill(0);
 scribble.scribbleEllipse(-9,-8,5,5);
  scribble.scribbleEllipse(9,-8,5,5);
    noFill();
  scribble.scribbleCurve(-9,-8,-3,-7,-7,-12,-5,-12);
  scribble.scribbleCurve(9,-8,3,-7,7,-12,5,-12);
  scribble.scribbleCurve(-3,-7,0,8,-7,0,-3,5);
  scribble.scribbleCurve(3,-7,0,8,7,0,3,5);
  
  for(var t = 3*PI ; t < 8*PI ; t+=0.1)
   // scribble.scribbleLine(t,8*sin(-t),t+0.1,-8*sin(t+0.1));
 {
  scribble.scribbleLine(3*sin(-t)-4,t,-3*sin(t+0.1)-4,t+0.1);
  scribble.scribbleLine(3*sin(-t)+4,t,-3*sin(t+0.1)+4,t+0.1);
}
  fill(random(255),random(255),random(255));
  noStroke();
  scribble.scribbleEllipse(3*sin(-3*PI)-4,3*PI,4,4);

   fill(random(255),random(255),random(255));
  scribble.scribbleEllipse(3*sin(-3*PI)+4,3*PI,4,4);
  stroke(0);
  noFill();

  pop();
  
}
function drawMoveObject(i,j,w,h,scribble,time)
{
     push();
  translate(i,j);
 
  scribble.scribbleLine(-5,-5,0,0);
  scribble.scribbleLine(-5,5,0,0);
  scribble.scribbleLine(-5+4,-5,4,0);
  scribble.scribbleLine(-5+4,5,4,0);
  scribble.scribbleLine(-15,0,15,0);
  fill(random(255),random(255),random(255));
  noStroke()
  scribble.scribbleEllipse(15,0,5,5);
  noFill();
  stroke(random(255),random(255),random(255));
  
  scribble.scribbleFilling([-20,-10,-10,-20],[-5,-5,5,5],2,180)
  scribble.scribbleRect(-15,0,10,10);
  
  stroke(0);
  pop();
}
function drawHave(i,j,w,h,scribble,time)
{
    push();
  translate(i,j);

  //using a sin wave.
  
  pop();
}
function drawIngest(i,j,w,h,scribble,time)
{
    push();
  translate(i,j);
 

  //using a sin wave.
  stroke(0);
   //strokeWeight(3);
  // scribble.scribbleEllipse(0,0,10,10);
  
  stroke(random(255),random(255),random(255));
  var gap = 2;
  var angle = 90;
  var xCoords = [0,10,-10];
  var yCoords = [25,5,5];
  scribble.scribbleFilling(xCoords,yCoords, gap , angle);
  stroke(0);
  scribble.scribbleCurve(0,-20,10,-20,5,-16,5,-16);
  scribble.scribbleLine(0,-20,0,15);
  scribble.scribbleLine(-8,0,8,0);
  scribble.scribbleLine(0,15,5,5);
  scribble.scribbleLine(0,15,-5,5);
  scribble.scribbleLine(0,25,10,5);
  scribble.scribbleLine(0,25,-10,5);
  noStroke();
  fill(random(200,255),random(200,255),0);
  scribble.scribbleEllipse(0,0,5,5)
   stroke(0);


  pop();
}

function drawExpel(i,j,w,h,scribble,time)
{
  push();
  translate(i,j);
 
  //using a sin wave.
  fill(0);
  scribble.scribbleEllipse(-4*PI-5,sin(-4*PI),5,5);
  for(var t = -4*PI ; t < 8*PI ; t+=0.1)
    scribble.scribbleLine(t,8*sin(-t),t+0.1,-8*sin(t+0.1));
  fill(random(250,255),random(100,165),0);
  scribble.scribbleEllipse(t+1,8*sin(t+0.1),10,10);
  noFill();

/*
fill(255,0,0);
  scribble.scribbleEllipse(-w/2,-30,5,5);
  scribble.scribbleEllipse(-w/2,-20,5,5);
  scribble.scribbleEllipse(-w/2,-10,5,5);
  noFill();
  scribble.scribbleCurve(-w/2,-30,-w/8,-5,-w/4,-25,-w/6,-20)
  scribble.scribbleCurve(-w/2,-20,-w/8,-0,-w/4,-15,-w/6,-10)
  scribble.scribbleCurve(-w/2,-10,-w/8,5,-w/4,-5,-w/6,0)
  fill(255,0,0);
  scribble.scribbleEllipse(w/2,-30,5,5);
  scribble.scribbleEllipse(w/2,-20,5,5);
  scribble.scribbleEllipse(w/2,-10,5,5);
  noFill();
  scribble.scribbleCurve(w/2,-30,w/8,-5,w/4,-25,w/6,-20)
  scribble.scribbleCurve(w/2,-20,w/8,-0,w/4,-15,w/6,-10)
  scribble.scribbleCurve(w/2,-10,w/8,5,w/4,-5,w/6,0)
  noFill();
*/
  /*
  arc(w+10,h-20,50,50,PI,PI+PI/3);
  //fill(255,0,0);
  var v = pv.V(pv.R(pv.V(-1,0),PI/3));

 //var p = pv.P(G,1,v);
 // show(p);
  noFill();
  */
  pop();
}
function drawPropel(i,j,w,h,scribble,time)
{
   push();
  translate(i,j);
 
 
  fill(random(100,255),0,random(200,255));
  scribble.scribbleEllipse(0,0,10,10);
  noFill();
 scribble.scribbleLine(5,-5,25,-10);
 scribble.scribbleLine(5,0,28,-5);
  scribble.scribbleLine(5,2,26,0);
  
  pop();
}
function drawFeel(i,j,w,h,scribble,time)
{
  push();
  translate(i,j);
  //scribble.roughness = (0.5);
  //strokeWeight(2);
  scribble.scribbleLine(0,-h/2,0,h/2);
  scribble.scribbleLine(-w/2,0,w/2,0);
  scribble.scribbleLine(w/2-15,h/2-10,-w/2+15,-h/2+10);
   scribble.scribbleLine(-w/2+15,h/2-10,w/2-15,-h/2+10);
   noStroke();
 
    fill(random(255),random(255),0);
    scribble.scribbleEllipse(0,-h/2,5,5);
      fill(random(255),random(255),random(255));
    scribble.scribbleEllipse(-w/2,0,5,5);
      fill(0,random(255),random(255));
    scribble.scribbleEllipse(w/2,0,5,5);
      fill(random(255),random(255),random(255));
    scribble.scribbleEllipse(-w/2+10,h/2-5,5,5);
      fill(random(255),0,random(255));
    scribble.scribbleEllipse(w/2-10,-h/2+5,5,5);
      fill(random(255),random(255),0);
    scribble.scribbleEllipse(w/2-10,h/2-5,5,5);
      fill(random(255),random(255),random(255));
    scribble.scribbleEllipse(-w/2+10,-h/2+5,5,5);
     fill(random(255),random(255),random(255));
    scribble.scribbleEllipse(0,h/2,5,5);
    noFill();
    
    stroke(0);
  //pv.emotionCircle(pv.P(0,0),h);
  pop();
}

function drawSee(i,j,w,h,scribble,time)
{
  push();
  translate(i,j);
  
  strokeWeight(2)
  scribble.scribbleEllipse(0,0,w/4,h/2);
  fill(0)
  scribble.scribbleEllipse(0,0,w/8,h/4);
  noFill();
  strokeWeight(1);
  pop();
}
function drawSpeak(i,j,w,h,scribble,time)
{
  push();
  translate(i,j);
  
  fill(255,150,0);
  arc(0,0,10,10,PI-3*PI/4,PI+3*PI/4);
  fill(0)
  arc(0,0,10,10,PI+3*PI/4,PI/4);
   noFill();
  scribble.scribbleCurve(5,-5,25,-25,10,-5,20,-5);
  fill(0)
  scribble.scribbleEllipse(25,-25,5,5);
  noFill();
  scribble.scribbleCurve(5,-3,35,-22,10,-3,20,-3);
  fill(0)
  scribble.scribbleEllipse(35,-22,5,5);
   noFill();
  scribble.scribbleCurve(5,0,30,0,10,0,20,0);
  fill(0)
  scribble.scribbleEllipse(25,0,5,5);
   noFill();
  scribble.scribbleCurve(5,3,35,22,10,3,20,3);
  fill(0)
  scribble.scribbleEllipse(35,22,5,5);
   noFill();
  scribble.scribbleCurve(5,5,25,25,10,5,20,5);
  fill(0)
  scribble.scribbleEllipse(25,25,5,5);
   noFill();
 

  /*
  noFill();
  arc(0.5*w,0.7*h,0.5*w,0.5*h,-PI/6,PI/6);
  arc(0.6*w,0.7*h,0.5*w,0.5*h,-PI/3,PI/3);
  arc(0.7*w,0.7*h,0.5*w,0.5*h,-PI/3,PI/3);
  */
  pop();
}
function drawHear(i,j,w,h,scribble,time)
{
   push();
  translate(i,j);
 
  fill(random(255),random(255),random(255));
  scribble.scribbleEllipse(w/2,-h/2,5,5);
  fill(random(255),random(255),random(255));
  scribble.scribbleEllipse(w/2,-h/2+35,5,5);
  fill(random(255),random(255),random(255));

  scribble.scribbleEllipse(-w/2,-h/2,5,5);
  fill(random(255),random(255),random(255));
  scribble.scribbleEllipse(-w/2,-h/2+35,5,5);
  noFill();
  scribble.scribbleLine(w/2,-h/2,w/2+15,-h/2+5);
  scribble.scribbleLine(w/2+15,-h/2+5,w/2,-h/2+10);
  scribble.scribbleLine(w/2,-h/2+10,w/2+15,-h/2+20);
  scribble.scribbleLine(w/2+15,-h/2+20,w/2,-h/2+25);
  scribble.scribbleLine(w/2,-h/2+25,w/2+15,-h/2+30);
   scribble.scribbleLine(w/2+15,-h/2+30,w/2,-h/2+35);


   scribble.scribbleLine(-w/2,-h/2,-w/2-15,-h/2+5);
  scribble.scribbleLine(-w/2-15,-h/2+5,-w/2,-h/2+10);
  scribble.scribbleLine(-w/2,-h/2+10,-w/2-15,-h/2+20);
  scribble.scribbleLine(-w/2-15,-h/2+20,-w/2,-h/2+25);
  scribble.scribbleLine(-w/2,-h/2+25,-w/2-15,-h/2+30);
   scribble.scribbleLine(-w/2-15,-h/2+30,-w/2,-h/2+35);
  
//scribble.scribbleCurve(-w/2-5+10,-h/2+5,-w/2-5+10,-h/2+30,-w/2-15+10,-h/2+15,-w/2-15+10,-h/2+20)

 // arc(0.75*w,0.7*h,0.5*w,0.5*h,PI/2+PI/6,PI+PI/3);
 // arc(0.85*w,0.7*h,0.5*w,0.5*h,PI/2+PI/3,PI+PI/6);
 // arc(0.95*w,0.7*h,0.5*w,0.5*h,PI/2+PI/3,PI+PI/6);
  
  pop();
}
//i , j vertices of the bounding box and w, h - size of the bounding box
/*function drawThinkAbout( i , j , w , h,s)
{
   strokeWeight(3);
   push();
   translate(i,j);
   scale(s);
   ellipse(w/2,h/2,5,5);
   pop();
   strokeWeight(1);
}
*/
function drawMoveBodyPart(i,j,w,h,scribble,time)
{
  
  push();
  translate(i,j);
noStroke();
  fill(random(250,255),random(100,165),0);
  scribble.scribbleEllipse(-10*PI-5,-5+sin(-10*PI),5,5);
   fill(random(250,255),0,random(100,165));
  scribble.scribbleEllipse(-8*PI-5,sin(-8*PI),5,5);
   fill(0,random(100,165),random(250,255));
  scribble.scribbleEllipse(-6*PI-5,5+sin(-6*PI),5,5);
  stroke(0);
  strokeWeight(1);
  for(var t = -10*PI ; t < -4*PI ; t+=0.1)
    scribble.scribbleLine(t,-5+sin(-t),t+0.1,-5-sin(t+0.1));
   for(var t = -8*PI ; t <  -4*PI ; t+=0.1)
    scribble.scribbleLine(t,sin(-t),t+0.1,-sin(t+0.1));
   for(var t = -6*PI ; t < -4*PI ; t+=0.1)
    scribble.scribbleLine(t,5+sin(-t),t+0.1,5-sin(t+0.1));
  noFill();
  
/*
  
  scale(s);
  line(0,0+h-10,0+w/2-5,0+h-10);
  line(0,0+h-15,0+w/2,0+h-15);
  line(0,0+h-20,0+w/2+5,0+h-20);
  */
  pop();
 

}
function drawThinkAbout(i,j,w,h,time)
{
  push();
  translate(i,j);
 
  pv.questionMark(pv.P(0,0));
  pop();
}
function drawConclude(i,j,w,h,time)
{
  push();
  translate(i,j);

  pv.questionMarkInverted(pv.P(0,0));
  pop();
}


	return {
    Layer: Layer,
    BackgroundLayer : BackgroundLayer,
    TextLayer : TextLayer,
    AgentLayer : AgentLayer,
   
    //testFunction:testFunction,
    //failing: failing
  }
})();

//the display methods
//layers
//