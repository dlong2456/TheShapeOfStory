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
	draw :  function(i,j)
	{

        fill.apply(null,colorUtility[this.color]);
        noStroke();
          rect(i,j,100,100);
          
        noFill();
        stroke(0);
      
        
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
	draw : function(i,j)
	{
      var alpha = 255;
      var obj = 1;
      var posx = i;
      var posy = j;
      var posPx,posPy;
      var posSx , posSy;
      var posSettingx, posSettingy;
      var sizeRatio=1;
      var agentspacex , agentspacey;
      var boundingBoxX, boundingBoxY;

     if(this.setting == "on" || this.setting == "at")
     {
    
       posSettingx = i;
       posSettingy = j+60;
       posx = i;
       posy = j;
       agentspacex = 100;
       agentspacey = 60;
     }
     if(this.setting == "in")
     {
      posSettingx = i+10;
      posSettingy = j+10;
      posx = i+20;
      posy = j+20;
       agentspacex = 70;
       agentspacey = 70;
     }
     if(this.setting == "to")
     {
      posSettingx = i+30;
      posSettingy = j+10;
      posx = i;
      posy = j+30;
       agentspacex = 60;
       agentspacey = 40;
     }
     if(this.setting == "from")
     {
      posSettingx = i+10;
      posSettingy = j+10;
       posx = i+50;
      posy = j+30;
       agentspacex = 60;
       agentspacey = 40;
     }
  
  drawSetting(this.setting,posSettingx,posSettingy);
   if(this.relation.type == "dominant")
   {
     sizeRatio = 0.5;
     if(this.relation.positivity == 2)
     {
      posSx = posx;
      posSy = posy;
      posPx = posSx+agentspacex/2-20;
      posPy = posy //+10;
     }
     if(this.positivity == 1)
     {
      posSx = posx;
      posSy = posy;
      posPx = posSx+agentspacex/2-10;
      posPy = posy;
     }
     if(this.relation.positivity == 0)
     {
         posSx = posx;
      posSy = posy;
      posPx = posSx +agentspacex/2;
      posPy = posy//+agentspacey/2-20;
     }
     if(this.relation.positivity == -1)
     {
         posSx = posx;
      posSy = posy;
      posPx = posSx+agentspacex/2+10;
      posPy = posy//+agentspacey/2;
     }
     if(this.relation.positivity == -2)
     {
         posSx = posx;
      posSy = posy;
      posPx = posSx+agentspacex/2+20;
      posPy = posy//+agentspacey/2+20;
     }
   }
   if(this.relation.type == "equal")
   {
   
    sizeRatio = 1;
    if(this.relation.intimacy == 1 )
    {
      posSx = posx;
      posSy = posy;
      posPx = posx+agentspacex/2-20;
      posPy = posy//+agentspacey/2-20;
    }
    if(this.relation.intimacy == 0)
    {
     
          posSx = posx;
      posSy = posy;
      posPx = posx+agentspacex/2;
      posPy = posy//+agentspacey/2;
    }
 if(this.relation.intimacy == -1)
    {
      posSx = posx;
      posSy = posy;
      posPx = posx+agentspacex/2+20;
      posPy = posy//+agentspacey/2+20;
    }
   }
    
  
      this.subjects.forEach(function(agent)
      {
             
             
               drawShape(agent.shape,agent.color,this.action, posSx , posSy,alpha/obj,agentspacex/2,agentspacey,1);
      obj+=1;

      },this);

      this.predicates.forEach(function(agent)
      {

               drawShape(agent.shape,agent.color,this.action, posPx , posPy,alpha/obj,agentspacex/2,agentspacey,sizeRatio);
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
  scale(scaleSize);
 var c = colorUtility[color].concat([alpha]);
 //var c = colorUtility[color];
  fill.apply(null,c);
 shapeUtility[shape](i,j,w,h);
 if(action == "move-body-part")
  drawMoveBodyPart(i,j,w,h);
 noFill();
scale(1/scaleSize);
}

function drawSetting(setting,i,j)
{
 
  settingUtility[setting](i,j);
}

function drawTriangle(i,j,w,h)
{
  //console.log(i+(w/2)+" "+j+(h/3),i+(3*w/4),j+h,i+(w/4),j+h)
  //console.log(i);
    triangle(i+(w/2),j+(h/3),i+(3*w/4),j+h,i+(w/4),j+h);
}

function drawSquare(i,j,w,h)
{
   
    rect(i+(w/3),j+(h/3),(w/2),(h/2));
}

function drawRectangle(i,j,w,h)
{
   
   rect(i+(w/3),j+(h/3)+10,(w/2),(h/3)+10);
}

function drawCircle(i,j,w,h)
{
   
  ellipse(i+(w/2),j+(h/2),(w/2),(h/2));
}


function drawOn(i,j)
{
   
   strokeWeight(5);
    line(i+10,j+30,i+90,j+30);
    line(i+10,j+20,i+90,j+20);
    line(i+10,j+10,i+90,j+10);
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

function drawFrom(i,j)
{
    strokeWeight(5);
    rect(i,j,60,80);
  strokeWeight(1);
}
function drawTo(i,j)
{
    strokeWeight(5);
    rect(i,j,60,80);
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

  "red" : Array(255,0,0),
  "green" :Array(0,255,0),
  "blue" :Array(0,0,255),
  "black" : [0,0,0],
  "white" : [255,255],
  "baige" : Array(255,228),

};

var settingUtility = 
{
  "in" : drawIn,
  "from" : drawFrom,
  "to" : drawTo,
  "at" : drawOn,
  "on" : drawOn,
}

function drawSpeak()
{

}
//i , j vertices of the bounding box and w, h - size of the bounding box
function drawThinkAbout( i , j , w , h)
{
   strokeWeight(3);
   ellipse(w/2,h/2,5,5);

   strokeWeight(1);
}

function drawMoveBodyPart(i,j,w,h)
{
  strokeWeight(3);
  line(i,j+h-10,i+w/2-5,j+h-10);
  line(i,j+h-15,i+w/2,j+h-15);
  line(i,j+h-20,i+w/2+5,j+h-20);
  strokeWeight(1);

}

var actionUtility = 
{
  //"expel" : drawExpel,
  //"propel" : drawPropel,
  //"see" : drawSee,
  //"smell" : drawSmell,
  //"move-object" : drawMoveObject,
 // "think-about" : drawThinkAbout,
 // "ingest" : drawIngest,
 // "speak" : drawSpeak,
 // "hear" :drawHear,
 // "feel" : drawFeel,
  //"have" :drawHave,
 // "conclude" : drawConclude,
  "move-body-part": drawMoveBodyPart,
};

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