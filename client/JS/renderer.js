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
var AgentLayer = function(subjects,predicates,action,relation,setting)
{
  
	this.type = "agent";
	this.subjects = subjects || [] ;
  this.predicates = predicates || [] ;
	this.action = action || "";
  this.relation = relation || {};
//  this.setting = setting || random(["in","to","on","from"]);
this.setting = setting || "in";
 // console.log(this.relation);
  
}

AgentLayer.prototype=
{
	constructor :AgentLayer,
	draw : function(pt)
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
      var sizeRatio=1;
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
  
  drawSetting(this.setting,posSettingx,posSettingy, pt["length"]);
   if(this.relation.type == "dominant")
   {
     sizeRatio = 0.7;
     if(this.relation.positivity == 2)
     {
      posSx = posSx+0.1*pt["length"];
      posSy = posSy;
      posPx = posPx-0.1*pt["length"];
      posPy = posPy;
     }
     if(this.positivity == 1)
     {
      posSx = posSx+0.05*pt["length"];
      posSy = posSy;
      posPx = posPx-0.05*pt["length"];
      posPy = posPy;
     }
     if(this.relation.positivity == 0)
     {
      posSx = posSx;
      posSy = posSy;
      posPx = posPx;
      posPy = posPy//+agentspacey/2-20;
     }
     if(this.relation.positivity == -1)
     {
         posSx = posSx-0.05*pt["length"];
      posSy = posSy;
      posPx = posPx+0.05*pt["length"];
      posPy = posPy//+agentspacey/2;
     }
     if(this.relation.positivity == -2)
     {
         posSx = posSx-0.1*pt["length"];
      posSy = posSy;
      posPx = posPx+0.1*pt["length"];
      posPy = posPy;
   }
 }
  else if(this.relation.type == "equal")
   {
   
    sizeRatio = 1;
    if(this.relation.intimacy == 1 )
    {
      posSx = posSx+10;
      posSy = posSy;
      posPx = posPx-10;
      posPy = posPy;
    }
    if(this.relation.intimacy == 0)
    {
     
      posSx = posSx;
      posSy = posSy;
      posPx = posPx;
      posPy = posPy;
    }
 if(this.relation.intimacy == -1)
    {
      posSx = posSx-10;
      posSy = posSy;
      posPx = posPx+10;
      posPy = posPy;
    }
   }

      this.subjects.forEach(function(agent)
      {
             
             
      drawShape(agent.shape,agent.color, posSx , posSy,alpha/obj,boundingBoxX,boundingBoxY,1);
      obj+=1;

      },this);

      this.predicates.forEach(function(agent)
      {

               drawShape(agent.shape,agent.color, posPx , posPy,alpha/obj,boundingBoxX,boundingBoxY,sizeRatio);
      obj+=1;

      });
      var scribble = new Scribble();
      actionUtility[this.action](posx,posy,agentspacex,agentspacey,sizeRatio,scribble);
	},
	
}




//private stuff

 function drawShape(shape, color ,  i , j,alpha,w,h,scaleSize)
{
  
  var scribble = new Scribble();
  //var c = colorUtility[color];//.concat([alpha]);
 
 var c1 = colorUtility[random(feelingUtility[color])];
 var c1 = random(feelingUtility[color]);

 //console.log(feelingUtility[color]+": "+c1);
 //var c = "red";
 
 shapeUtility[shape](i,j,w,h,scaleSize,c1,scribble);
 
  
 

}

function drawSetting(setting,i,j,length)
{
  var scribble = new Scribble();
  settingUtility[setting](i,j,length,scribble);
}

function drawTriangle(i,j,w,h,s,color,scribble)
{
  
 var rFactor = random(5); //degree of randomness
 push();

  translate(i,j);
  scale(s);
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

function drawSquare(i,j,w,h,s,color,scribble)
{
  push();

    translate(i,j);

  scale(s);
  scribble.scribbleRect((w/2),(w/2),(w),(w));
  stroke(color);
   var xCoords = [0,w,w,0];
   var yCoords = [0,0,w,w];
   var gap = 2;
   var angle = 180;
   scribble.scribbleFilling(xCoords,yCoords,gap,angle);

   noStroke();
  pop();

}

function drawRectangle(i,j,w,h,s,color,scribble)
{
  var rFactor = random(h/2,h)
  push();
    translate(i,j);
  scale(s);
   scribble.scribbleRect((w/2),(h/2),(w/2),rFactor);
   stroke(color);
   var xCoords = [w/4,w/4+w/2,w/4+w/2,w/4];
   var yCoords = [h/4,h/4,rFactor,rFactor];
   var gap = 1;
   var angle = 180;
   scribble.scribbleFilling(xCoords,yCoords,gap,angle);

   stroke(0);
  pop();
}

function drawCircle(i,j,w,h,s,color,scribble)
{
 
  push()
    translate(i,j);
  scale(s);
  //scribble.scribbleEllipse((w/2),(h/2),(w),(w));
 // stroke(color);
 // scribble.scribbleFilling([][])
 fill(color);
 var rFactor = random(15); //degree of randomness
  scribble.scribbleEllipse(w/2+6,h/2+rFactor,(w),(w));

/*
   stroke(color);
   var xCoords = [w/2+6-w/2,w+6+w/2-w/2,w+6+w/2-w/2,w/2-w/2];
   var yCoords = [h/2+rFactor-w/2,h/2+rFactor-w/2,h/2+rFactor+w-w/2,h/2+rFactor+w-w/2];
   var gap = 2;
   var angle = 180;
   scribble.scribbleFilling(xCoords,yCoords,gap,angle);

   noStroke();
*/
noFill();
  pop();
 
}
function emptyFunction()
{
  return -1;
}

function drawOn(i,j,length,scribble)
{
   
   strokeWeight(2);
  // var r = random([-1,1]);
  var r = 1;
    scribble.scribbleLine(i+0.1*length*2,j+r*0.3*length*2,i+0.9*length*2,j+r*0.3*length*2);
     scribble.scribbleLine(i+0.1*length*2,j+r*0.2*length*2,i+0.9*length*2,j+r*0.2*length*2);
    scribble.scribbleLine(i+0.1*length*2,j+r*0.1*length*2,i+0.9*length*2,j+r*0.1*length*2);
    //w = 100;
    //h = 60;
    strokeWeight(1);
}
function drawIn(i,j,length,scribble)
{
  strokeWeight(2);
  scribble.scribbleRect(i,j,0.8*length*2,0.8*length*2);
  strokeWeight(1);
}

function drawFrom(i,j,length,scribble)
{
    strokeWeight(2);
   // scribble.scribbleEllipse(i,j,0.6*length*2,0.8*length*2);
   push();
   rotate(radians(PI/4));
   scribble.scribbleRect(i,j,0.6*length*2,0.8*length*2)
   pop();
    strokeWeight(1);
}
function drawTo(i,j,length,scribble)
{
    strokeWeight(2);
    scribble.scribbleEllipse(i,j,0.6*length*2,0.8*length*2);
    strokeWeight(1);
}
function drawBe(i,j,w,h,s,scribble)
{
   push();
  translate(i,j);
  scale(s);
  //using a sin wave.
  
  pop();
}
function drawSmell(i,j,w,h,s,scribble)
{
   push();
  translate(i,j);
  scale(s);
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
function drawMoveObject(i,j,w,h,s,scribble)
{
     push();
  translate(i,j);
  scale(s);
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
function drawHave(i,j,w,h,s,scribble)
{
    push();
  translate(i,j);
  scale(s);
  //using a sin wave.
  
  pop();
}
function drawIngest(i,j,w,h,s,scribble)
{
    push();
  translate(i,j);
  scale(s);

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

function drawExpel(i,j,w,h,s,scribble)
{
  push();
  translate(i,j);
  scale(s);
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
function drawPropel(i,j,w,h,s,scribble)
{
   push();
  translate(i,j);
  scale(s);
 
  fill(random(100,255),0,random(200,255));
  scribble.scribbleEllipse(0,0,10,10);
  noFill();
 scribble.scribbleLine(5,-5,25,-10);
 scribble.scribbleLine(5,0,28,-5);
  scribble.scribbleLine(5,2,26,0);
  
  pop();
}
function drawFeel(i,j,w,h,s,scribble)
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

function drawSee(i,j,w,h,s,scribble)
{
  push();
  translate(i,j);
  scale(s);
  strokeWeight(2)
  scribble.scribbleEllipse(0,0,w/4,h/2);
  fill(0)
  scribble.scribbleEllipse(0,0,w/8,h/4);
  noFill();
  strokeWeight(1);
  pop();
}
function drawSpeak(i,j,w,h,s,scribble)
{
  push();
  translate(i,j);
  scale(s);
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
function drawHear(i,j,w,h,s,scribble)
{
   push();
  translate(i,j);
  scale(s);
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
function drawMoveBodyPart(i,j,w,h,s,scribble)
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
function drawThinkAbout(i,j,w,h,s)
{
  push();
  translate(i,j);
  scale(s);
  pv.questionMark(pv.P(0,0));
  pop();
}
function drawConclude(i,j,w,h,s)
{
  push();
  translate(i,j);
  scale(s);
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