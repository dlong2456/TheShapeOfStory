var Renderer = (function()
{

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
  this.setting = setting || "in";
  console.log(this.relation);
  
}

AgentLayer.prototype=
{
	constructor :AgentLayer,
	draw : function(pt)
	{
      var i = pt["pt"].x-(pt["length"]);
      var j =pt["pt"].y-(pt["length"]);
     
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
    /*
      posSettingx = i;
      posSettingy = j+60;
      settingBoundx = 100;
      settingBoundy = 40;
      agentspacex = 100;
      agentspacey = 60;
      posx = i;
      posy = j;
      posSx = i;
      posSy = j;
      posPx = posSx+agentspacex/2;
      posPy = posSy;
      */
      posSettingx = i;
      posSettingy = j + 0.6*pt["length"]*2;
      settingBoundx = pt["length"];
      settingBoundy = pt["length"]*0.4*2;
      agentspacex = pt["length"]*2;
      agentspacey = pt["length"]*0.6*2;
      posx = i;
      posy = j;
      posSx = i;
      posSy = j;
      posPx = posSx+agentspacex/2;
      posPy = posSy;
      
   
     }
     if(this.setting == "in")
     {
      posSettingx = i+0.1*pt["length"]*2;
      posSettingy = j+0.1*pt["length"]*2;
      settingBoundx = 0.8*pt["length"]*2;
      settingBoundy = 0.8*pt["length"]*2;
      agentspacex = 0.7*pt["length"]*2;
      agentspacey = 0.7*pt["length"]*2;
      posx = i+0.15*pt["length"]*2;
      posy = j+0.15*pt["length"]*2;
      posSx = i+0.15*pt["length"]*2;
      posSy = j+0.15*pt["length"]*2;
      posPx = posSx+agentspacex/2;
      posPy = posSy;
       
     }
     if(this.setting == "to")
     {
      posSettingx = i+0.3*pt["length"];
      posSettingy = j+0.1*pt["length"];
      settingBoundx = 0.6*pt["length"]*2;
      settingBoundy = 0.8*pt["length"]*2;
      agentspacex = 0.6*pt["length"]*2;
      agentspacey = 0.4*pt["length"]*2;
      posx = i;
      posy = j+0.3*pt["length"]*2;
      posSx = i;
      posSy = j+0.3*pt["length"]*2;
      posPx = posSx+agentspacex/2;
      posPy = posSy;
          
     }
     if(this.setting == "from")
     {
      posSettingx = i+0.1*pt["length"];
      posSettingy = j+0.3*pt["length"];
      settingBoundx = 0.6*pt["length"]*2;
      settingBoundy = 0.8*pt["length"]*2;
      agentspacex = 0.6*pt["length"]*2;
      agentspacey = 0.4*pt["length"]*2;
      posx = i+0.5*pt["length"]*2;
      posy = j+0.3*pt["length"]*2;
      posSx = i+0.5*pt["length"]*2;
      posSy = j+0.3*pt["length"]*2;
      posPx = posSx+agentspacex/2;
      posPy = posSy;
  
      
     }
     boundingBoxX = agentspacex/2;
     boundingBoxY = agentspacey;
  
  drawSetting(this.setting,posSettingx,posSettingy, pt["length"]);
   if(this.relation.type == "dominant")
   {
     sizeRatio = 0.5;
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
//   ellipse(i,j,20,20);
  //  ellipse(posSettingx,posSettingy,10,10);
    //rect(i,j,pt["length"]*2,pt["length"]*2);
 
      this.subjects.forEach(function(agent)
      {
             
             
      drawShape(agent.shape,agent.color,this.action, posSx , posSy,alpha/obj,boundingBoxX,boundingBoxY,1);
      obj+=1;

      },this);

      this.predicates.forEach(function(agent)
      {

               drawShape(agent.shape,agent.color,this.action, posPx , posPy,alpha/obj,boundingBoxX,boundingBoxY,sizeRatio);
      obj+=1;

      });
    
	},
	
}




//private stuff

 function drawShape(shape, color , action, i , j,alpha,w,h,scaleSize)
{
  /*
  var w = 100;
  var h = 100;
  if(setting == "on" || setting == "at")
  {
    
    strokeWeight(5);
    line(i+10,j+90,i+90,j+90);
    line(i+10,j+80,i+90,j+80);
    line(i+10,j+70,i+90,j+70);
    w = 100;
    h = 60;
  }
  else
  {
    console.log("bye");
  }
  strokeWeight(1);
  */
  
 var c = colorUtility[color];//.concat([alpha]);
 //var c = colorUtility[color];
  fill(c);
 shapeUtility[shape](i,j,w,h,scaleSize);
 //actionUtility["move-body-part"](i,j,w,h,scaleSize);
   if(action == "move-body-part")
    actionUtility[action](i,j,w,h,scaleSize);
   if(action == "think-about")
    actionUtility[action](i,j,w,h,scaleSize);
  if(action == "see")
    actionUtility[action](i,j,w,h,scaleSize);
   if(action == "speak")
    actionUtility[action](i,j,w,h,scaleSize);
   if(action == "hear")
    actionUtility[action](i,j,w,h,scaleSize);
   if(action == "think-about")
    actionUtility[action](i,j,w,h,scaleSize);
   if(action == "conclude")
    actionUtility[action](i,j,w,h,scaleSize);
  if(action == "ingest")
    actionUtility[action](i,j,w,h,scaleSize);
   if(action == "feel")
    actionUtility[action](i,j,w,h,scaleSize);
   if(action == "expel")
    actionUtility[action](i,j,w,h,scaleSize);
  
  
 noFill();

}

function drawSetting(setting,i,j,length)
{
 
  settingUtility[setting](i,j,length);
}

function drawTriangle(i,j,w,h,s)
{
  //console.log(i+(w/2)+" "+j+(h/3),i+(3*w/4),j+h,i+(w/4),j+h)
  //console.log(i);

 push(); 
  translate(i,j);
  scale(s);
 
  triangle(0+(w/2),0+(h/3),0+(3*w/4),0+h,0+(w/4),0+h);
  pop();
 
}

function drawSquare(i,j,w,h,s)
{
  push();
    translate(i,j);
  scale(s);
  rect((w/2),(h/2),(w/2),(h/2));
  pop();

}

function drawRectangle(i,j,w,h,s)
{
  push();
    translate(i,j);
  scale(s);
   rect((w/2),(h/2)+10,(w/2),(h/2)+10);
  pop();
}

function drawCircle(i,j,w,h,s)
{
 
  push()
    translate(i,j);
  scale(s);
  ellipse((w/2),(h/2),(w),(w));
  pop();
 
}


function drawOn(i,j,length)
{
   
   strokeWeight(5);
    line(i+0.1*length*2,j+0.3*length*2,i+0.9*length*2,j+0.3*length*2);
    line(i+0.1*length*2,j+0.2*length*2,i+0.9*length*2,j+0.2*length*2);
    line(i+0.1*length*2,j+0.1*length*2,i+0.9*length*2,j+0.1*length*2);
    //w = 100;
    //h = 60;
    strokeWeight(1);
}
function drawIn(i,j)
{
  strokeWeight(5);
  rect(i,j,80,80);
  strokeWeight(1);
}

function drawFrom(i,j,length)
{
    strokeWeight(5);
    rect(i,j,0.6*length*2,0.8*length*2);
    strokeWeight(1);
}
function drawTo(i,j,length)
{
    strokeWeight(5);
    rect(i,j,0.6*length*2,0.8*length*2);
    strokeWeight(1);
}
var shapeUtility={
  "circle" : drawCircle,
  "triangle" : drawTriangle,
  "square" : drawSquare,
  "rectangle" : drawRectangle,


};
var colorUtility = 
{

//  "red" : Array(255,0,0),
  "red" : '#ff0000',
  "green" :'#00ff00',
  "blue" :'#0000ff',
  "black" : '#000000',
  "white" : '#ffffff',
  "baige" : Array(255,228),
  "bgColor" : '#DAA45E'
  

};

var settingUtility = 
{
  "in" : drawIn,
  "from" : drawFrom,
  "to" : drawTo,
  "at" : drawOn,
  "on" : drawOn,
}
var actionUtility = 
{
  "expel" : drawExpel,
  //"propel" : drawPropel,
  "see" : drawSee,
  //"smell" : drawSmell,
  //"move-object" : drawMoveObject,
  "think-about" : drawThinkAbout,
  "ingest" : drawIngest,
  "speak" : drawSpeak,
  "hear" :drawHear,
 "feel" : drawFeel,
  //"have" :drawHave,
  "conclude" : drawConclude,
  "move-body-part": drawMoveBodyPart,
};
function drawExpel(i,j,w,h,s)
{
  push();
  translate(i,j);
  scale(s);
  noFill();
  arc(w+10,h-20,50,50,PI,PI+PI/3);
  fill(255,0,0);
  var v = pv.V(pv.R(pv.V(-1,0),PI/3));

 //var p = pv.P(G,1,v);
 // show(p);
  noFill();
  
  pop();
}
function drawFeel(i,j,w,h,s)
{
  push();
  translate(i,j);
  pv.emotionCircle(pv.P(w/2,h/2),h);
  pop();
}
function drawIngest(i,j,w,h,s)
{
  push();
  scale(s);
  translate(i,j);
 pv.circleHeadGear(pv.P(w/2+4,h/2-14),pv.V(1/sqrt(3),-sqrt(3)/2));
 pv.circleHeadGear(pv.P(w/2,h/2-14),pv.V(0,-1));
  pv.circleHeadGear(pv.P(w/2-4,h/2-14),pv.V(-1/sqrt(3),-sqrt(3)/2));
  //pv.circleHeadGear(pv.P(w/2,h/2+5),pv.V(-1/sqrt(2),-1/sqrt(2)));
  pop();

}
function drawSee(i,j,w,h,s)
{
  push();
  translate(i,j);
  scale(s);
  ellipse(w/2,h/2,10,20);
  ellipse(w/2,h/2,5,10);
  pop();
}
function drawSpeak(i,j,w,h,s)
{
  push();
  translate(i,j);
  scale(s);
  noFill();
  arc(0.5*w,0.7*h,0.5*w,0.5*h,-PI/6,PI/6);
  arc(0.6*w,0.7*h,0.5*w,0.5*h,-PI/3,PI/3);
  arc(0.7*w,0.7*h,0.5*w,0.5*h,-PI/3,PI/3);
  pop();
}
function drawHear(i,j,w,h,s)
{
   push();
  translate(i,j);
  scale(s);
  noFill();
  arc(0.75*w,0.7*h,0.5*w,0.5*h,PI/2+PI/6,PI+PI/3);
  arc(0.85*w,0.7*h,0.5*w,0.5*h,PI/2+PI/3,PI+PI/6);
  arc(0.95*w,0.7*h,0.5*w,0.5*h,PI/2+PI/3,PI+PI/6);
  pop();
}
//i , j vertices of the bounding box and w, h - size of the bounding box
function drawThinkAbout( i , j , w , h,s)
{
   strokeWeight(3);
   push();
   translate(i,j);
   scale(s);
   ellipse(w/2,h/2,5,5);
   pop();
   strokeWeight(1);
}

function drawMoveBodyPart(i,j,w,h,s)
{
  strokeWeight(3);
  push();

  translate(i,j);
  scale(s);
  line(0,0+h-10,0+w/2-5,0+h-10);
  line(0,0+h-15,0+w/2,0+h-15);
  line(0,0+h-20,0+w/2+5,0+h-20);
  pop();
  strokeWeight(1);

}
function drawThinkAbout(i,j,w,h,s)
{
  push();
  translate(i+w/2,j+h/2);
  scale(s);
  pv.questionMark(pv.P(0,0));
  pop();
}
function drawConclude(i,j,w,h,s)
{
  push();
  translate(i+w/2,j+h/2);
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