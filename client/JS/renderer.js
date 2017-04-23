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
  
  "very-negative" : ["dark_red","black","red_orange","dark_green","grey_black","maroon"], //red orange for aggression
  "negative" : ["dull_yellow",], //dull yellow for sickness
  "neutral" : ["dull_green","blue"," dark_purple","grey","red","dark_orange","yellow_green","dull_yellow"],
  "positive" : ["orange","yellow","olive_green","gold","aqua","light_blue"],
  "very-positive" : ["orange","bright_yellow","bright_blue","bright_green","magenta"],

}



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
var AgentLayer = function(num,subjects,predicates,action,setting,emotion)
{
  this.num = num;
	this.type = "agent";
	this.subjects = subjects || [] ;
  this.predicates = predicates || [] ;
	this.action = action || "";
  this.emotion = emotion || "";
  this.setting = setting || "";
  this.setDone = false;
  this.subjectDone = false;
   this.predicateDone = false;
  this.actDone = false;
  this.dt = 20;//frame drawing time
  this.et = 5; //element drawing time - time to draw setting, 2 agents , action
 // console.log(this.relation);
  
}

AgentLayer.prototype=
{
	constructor :AgentLayer,
	draw : function(pt,t)
	{
    
    var time = t-this.dt*this.num;

    
   if(time > 0 && time <=this.dt)
   {
   
    
   if(time >= this.dt/this.et) this.setDone = true;
   if(time >= this.et * 2) this.subjectDone = true;
   if(time>=this.et*3) this.predicateDone = true;
      var i = pt["pt"].x;
      var j = pt["pt"].y;
     
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
     //top left corner 
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
     //middle of the "in" box
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
      //middle of the "to" circle.
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
         //middle of the "from" circle.
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
  if(!this.setDone)
  drawSetting(this.setting,posSettingx,posSettingy, pt["length"],time);
  if(this.setDone && !this.subjectDone)

    {  

      console.log("drawing agents");
      this.subjects.forEach(function(agent)
      {
             
             
      drawShape(agent.shape,agent.color, posSx , posSy,alpha/obj,boundingBoxX,boundingBoxY,time);
      obj+=1;

      },this);
}
if(this.subjectDone && !this.predicateDone){
      this.predicates.forEach(function(agent)
      {

               drawShape(agent.shape,agent.color, posPx , posPy,alpha/obj,boundingBoxX,boundingBoxY,time);
      obj+=1;

      });
    }
      if(this.predicateDone)
      {
        var scribble = new Scribble();
        strokeWeight(1);
         actionUtility[this.action](posPx+boundingBoxX/2,posPy,boundingBoxX,boundingBoxY,scribble,time);
      }
      
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
  
  if(time >= 5 && time < 10)
 {
  var a = 5;

  var b = 10;
  var t = time-a;
 }
 else if(time >= 10 && time < 15)
 {
  var a = 10;

  var b = 15;
  var t = time-a;

 }

  var T = 5; //amount of time available for drawing this animation
  var delTperLine = T/3; //amount of time available to draw each part of the animation. This element has 4 parts therefore, 5/4.
  var dist = sqrt(sq(w/2)+sq(h/2))/2; // length of each line to be drawn.
 
  var speed = dist/delTperLine; //speed of drawing each line.
  
  strokeWeight(1);
  push();
  translate(i,j);

  var colorDistance = h;
  var colorSpeed = h/T;
  stroke(255,0,0);
  //scribble.scribbleFilling([w/2,3*w/2,-w/2,],[0,h,h],2,0,2*time);
 // scribble.scribbleLine(w/2-(h/4)*t,h/2*t,w/2+(h/4)*t,h/2*t);
 scribble.scribbleLine(w/2-colorSpeed/2*t,colorSpeed*t,w/2+colorSpeed/2*t,colorSpeed*t);
 stroke(0);
  if(t<delTperLine)
  {
   
    var x = w/2-speed*t;
    var y = 0+speed*2*t;
    scribble.scribbleLine(x,y,x-speed*t,y+2*speed*t);

  }
  else if(t<2*delTperLine)
  {
    var x = w/2+speed*(t-delTperLine);
    var y = 0+speed*2*(t-delTperLine);
    scribble.scribbleLine(x,y,x+speed*(t-delTperLine),y+speed*2*(t-delTperLine));

  }

  else if (t<=T)
  {
    var x = -w/2+2*speed*(t-2*delTperLine);
    var y = h;
    scribble.scribbleLine(x,y,x+2*speed*(t-2*delTperLine),y);
  }

 

  pop();
  strokeWeight(1);


 
}

function drawSquare(i,j,w,h,color,scribble,time)
{
 if(time >= 5 && time < 10)
 {
  var a = 5;

  var b = 10;
  var t = time-a;
 }
 else if(time >= 10 && time < 15)
 {
  var a = 10;

  var b = 15;
  var t = time-a;

 }

  var T = 5; //amount of time available for drawing this animation
  var delTperLine = T/4; //amount of time available to draw each part of the animation. This element has 4 parts therefore, 5/4.
  var dist = w/2; // length of each line to be drawn.
  
  var speed = dist/delTperLine; //speed of drawing each line.

  strokeWeight(1);
  push();
  translate(i,j);

   var colorDistance = w;
  var colorSpeed = w/T;
  stroke(255,0,0);
  //scribble.scribbleFilling([w/2,3*w/2,-w/2,],[0,h,h],2,0,2*time);
 // scribble.scribbleLine(w/2-(h/4)*t,h/2*t,w/2+(h/4)*t,h/2*t);
 scribble.scribbleLine(0,colorSpeed*t,w,colorSpeed*t);

  if(t<delTperLine)
  {
    var x = 0;
    var y = 0+speed*t;
    scribble.scribbleLine(x,y,x,y+speed*t);

  }
  else if(t<2*delTperLine)
  {
    var x = 0+speed*(t-delTperLine);
    var y = 0;
    scribble.scribbleLine(x,y,x+speed*(t-delTperLine),y);

  }
else if(t<3*delTperLine)
  {
    var x = w;
    var y = w-speed*(t-2*delTperLine);
 console.log(t-2*delTperLine);
    scribble.scribbleLine(x,y,x,y-speed*(t-2*delTperLine));

  }
  else if (t<T)
  {
    var x = w-speed*(t-3*delTperLine);
    var y = w;
    scribble.scribbleLine(x,y,x-speed*(t-3*delTperLine),y);
  }
  pop();
  strokeWeight(1);

}

function drawRectangle(i,j,w,h,color,scribble,time)
{
 if(time >= 5 && time < 10)
 {
  var a = 5;

  var b = 10;
  var t = time-a;
 }
 else if(time >= 10 && time < 15)
 {
  var a = 10;

  var b = 15;
  var t = time-a;

 }

  var T = 5; //amount of time available for drawing this animation
  var delTperLine = T/4; //amount of time available to draw each part of the animation. This element has 4 parts therefore, 5/4.
  var distX = w; // length of each line to be drawn.
  var distY = h/2;
  var speedX = distX/delTperLine; //speed of drawing each line.
  var speedY = distY/delTperLine;
  strokeWeight(1);
  push();
  translate(i,j);
 var colorDistance = h/2;
  var colorSpeed = h/(2*T);
  stroke(255,0,0);
  //scribble.scribbleFilling([w/2,3*w/2,-w/2,],[0,h,h],2,0,2*time);
 // scribble.scribbleLine(w/2-(h/4)*t,h/2*t,w/2+(h/4)*t,h/2*t);
 scribble.scribbleLine(0,colorSpeed*t,w,colorSpeed*t);
stroke(0);
  if(t<delTperLine)
  {
    var x = 0;
    var y = 0+speedY*t;
    scribble.scribbleLine(x,y,x,y+speedY*t);

  }
  else if(t<2*delTperLine)
  {
    var x = 0+speedX*(t-delTperLine);
    var y = 0;
    scribble.scribbleLine(x,y,x+speedX*(t-delTperLine),y);

  }
else if(t<3*delTperLine)
  {
    var x = distX;
    var y = distY-speedY*(t-2*delTperLine);
   
    scribble.scribbleLine(x,y,x,y-speedY*(t-2*delTperLine));

  }
  else if (t<T)
  {
    var x = distX-speedX*(t-3*delTperLine);
    var y = distY;
    scribble.scribbleLine(x,y,x-speedX*(t-3*delTperLine),y);
  }
  pop();
  strokeWeight(1);
  
}

function drawCircle(i,j,w,h,color,scribble,time,emotion)
{
  if(time >= 5 && time < 10)
 {
  var a = 5;

  var b = 10;
  var t = time-a;
 }
 else if(time >= 10 && time < 15)
 {
  var a = 10;

  var b = 15;
  var t = time-a;

 }

 //variable to make the circle scribbly
 var r = random(0,0.5);
  var majorAxis = w;
  var minorAxis = w;
  var T = 5; //amount of time available for drawing this animation
  var dist = TWO_PI; // length of each line to be drawn.
  var speed = dist/T; //speed of drawing each line.
 
  push();
  translate(i,j);
var colorDistanceX = PI/2;
  var colorSpeedX = colorDistanceX/T;
  var colorDistanceY = w;
  var colorSpeedY = colorDistanceY/(T/2);
  stroke(255,0,0);
  //scribble.scribbleFilling([w/2,3*w/2,-w/2,],[0,h,h],2,0,2*time);
 // scribble.scribbleLine(w/2-(h/4)*t,h/2*t,w/2+(h/4)*t,h/2*t);
 scribble.scribbleLine(minorAxis*Math.sin(colorSpeedX*t),-w+colorSpeedY*t,-minorAxis*Math.sin(colorSpeedX*t),-w+colorSpeedY*t);
 //scribble.scribbleLine(minorAxis*Math.sin(colorSpeedX*t),w-colorSpeedY*t,-minorAxis*Math.sin(colorSpeedX*t),w-colorSpeedY*t);
stroke(0);
/*noStroke()
if(t<T/3 || t > 2*T/3 ){
fill(0,255,0,255*0.1*t*t);
ellipse(0,0,w-2,w-2);
noFill();*/

//******
stroke(0);
 strokeWeight(2);
 
  var x1 = minorAxis*Math.cos(speed*t);
  var y1 = majorAxis*Math.sin(speed*t);
  var x2 = minorAxis*Math.cos(speed*(t+r)); //0.05 = deltaTime of overall painting set in the sketch.js
  var y2 = majorAxis*Math.sin(speed*(t+r));

  scribble.scribbleLine(x1,y1,x2,y2);

  
  pop();
  strokeWeight(1);
  
 
  
}
function emptyFunction()
{
  return -1;
}

function drawOn(i,j,length,scribble,time)
{


   var T = 5; //amount of time available for drawing this animation
  var delTperLine = T/3; //amount of time available to draw each part of the animation. This element has 4 parts therefore, 5/4.
  var dist = 0.9*length; // length of each line to be drawn.
  var speed = dist/delTperLine; //speed of drawing each line.
  strokeWeight(1);
  push();
  translate(i,j);
  if(time<delTperLine)
  {
    if(time>0.9*delTperLine) strokeWeight(0);
    var x = 0+speed*time;
    var y = 0;
    scribble.scribbleLine(x,y,x+speed*time,y);

  }
  else if(time<2*delTperLine)
  {
     if(time>0.99*delTperLine*2) strokeWeight(0);
    var x = 0+speed*(time-delTperLine);
    var y = dist/3;
    scribble.scribbleLine(x,y,x+speed*(time-delTperLine),y);

  }

  else if (time<T)
  {
    if(time>0.99*delTperLine*3) strokeWeight(0);
    var x = 0+speed*(time-2*delTperLine);
    var y = 2*dist/3;
    scribble.scribbleLine(x,y,x+speed*(time-2*delTperLine),y);
  }
  pop();
  strokeWeight(1);
   
  
}
function drawIn(i,j,length,scribble,time)
{
  var T = 5; //amount of time available for drawing this animation
  var delTperLine = T/4; //amount of time available to draw each part of the animation. This element has 4 parts therefore, 5/4.
  var dist = 0.8*length; // length of each line to be drawn.
  var speed = dist/delTperLine; //speed of drawing each line.
  strokeWeight(1);
  push();
  translate(i,j);
  if(time<delTperLine)
  {
    var x = -dist;
    var y = -dist+speed*time;
    scribble.scribbleLine(x,y,x,y+speed*time);

  }
  else if(time<2*delTperLine)
  {
    var x = -dist+speed*(time-delTperLine);
    var y = -dist;
    scribble.scribbleLine(x,y,x+speed*(time-delTperLine),y);

  }
else if(time<3*delTperLine)
  {
    var x = dist;
    var y = -dist+speed*(time-2*delTperLine);
    scribble.scribbleLine(x,y,x,y+speed*(time-2*delTperLine));

  }
  else if (time<T)
  {
    var x = -dist+speed*(time-3*delTperLine);
    var y = dist;
    scribble.scribbleLine(x,y,x+speed*(time-3*delTperLine),y);
  }
  pop();
  strokeWeight(1);
}

function drawFrom(i,j,length,scribble,time)
{
  var majorAxis = 0.8*length*2;
  var minorAxis = 0.6*length*2;
  var T = 5; //amount of time available for drawing this animation
  var dist = TWO_PI; // length of each line to be drawn.
  var speed = dist/T; //speed of drawing each line.
   var r = random(0,0.5);
  strokeWeight(2);
  push();
  translate(i,j);
  var x1 = minorAxis*Math.cos(speed*time);
  var y1 = majorAxis*Math.sin(speed*time);
  var x2 = minorAxis*Math.cos(speed*(time+r)); //0.05 = deltaTime of overall painting set in the sketch.js
  var y2 = majorAxis*Math.sin(speed*(time+r));

  scribble.scribbleLine(x1,y1,x2,y2);
  pop();
  strokeWeight(1);
  
}
function drawTo(i,j,length,scribble,time)
{
 
   var majorAxis = 0.8*length*2;
  var minorAxis = 0.6*length*2;
  var T = 5; //amount of time available for drawing this animation
  var dist = TWO_PI; // length of each line to be drawn.
  var speed = dist/T; //speed of drawing each line.
  strokeWeight(2);
   var r = random(0,0.5);
  push();
  translate(i,j);
  var x1 = -minorAxis*Math.cos(speed*time);
  var y1 = majorAxis*Math.sin(speed*time);
  var x2 = -minorAxis*Math.cos(speed*(time+r)); //0.05 = deltaTime of overall painting set in the sketch.js
  var y2 = majorAxis*Math.sin(speed*(time+r));

  scribble.scribbleLine(x1,y1,x2,y2);
  pop();
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
  
  scribble.scribbleFilling([-20,-10,-10,-20],[-5,-5,5,5],2,90)
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


//emotion drawings as line quality
/*
Anger
Disgust
Fear
Happiness
Sadness
Surprise
*/
//P is the coordinate of points in clockwise sense , in which angry is to be drawn.
//P is an array of points in case of triangle and square and rectangle
//P is an array of center and radius in case of circle
function drawAngry(P,color,time)
{
  var speed = 2;
  var sWeight = 2;
  var roughness = 2;
  //triangle
   if(P.length === 6)
   {
     fillTriangle(P,speed,color,roughness,sweight,time)
   }
   //rectangle / square
    if(P.length == 8)
   {
       fillSquare(P,speed,color,roughness,sweight,time)

   }
   //circle.
   if(P.length == 3)
   {
     fillCircle(P,speed,color,roughness,sweight,time)
   }

}
function fillCircle(P,speed,color,roughness,sweight,time)
{

}

function fillSquare(P,speed,color,roughness,sweight,time)
{

}

function fillTriangle(P,speed,color,roughness,sweight,time)
{

}
	return {
   
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