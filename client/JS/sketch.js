var recordedText = "";
var offset = 0;
var storySentiment = "";
//var tex = "He woke to the smell of smoke. The house was burning and he did not know what to do. He ran downstairs and went outside. Suddenly, he remembered that he left his cat inside. He called 911 and the firefighters saved the cat.";
//var tex = "Once upon a time ,in a village there lived a beautiful girl named Cinderella with her wicked stepmother and two step-sisters. She worked hard all day. One day, they all went to a ball in the palace, leaving Cinderella behind. Cinderella was feeling sad. Suddenly there was a burst of light and the fairy godmother appeared. With a flick of the magic she turned Cinderella into a beautiful princess with glass slippers and a horse carriage appeared at the door. The fairy godmother warned Cinderella to return before midnight. Cinderella arrived at the ball, the prince saw her and fell in love with her. They danced together all night. As the clock struck twelve, Cinderella rushed out to her carriage leaving one of her slippers behind. The prince went to every house in the town with the slipper until he found Cinderella. The prince and Cinderella lived happily ever after.";
//I was visiting my now late grandmother (or Khun Yai, as I called her in Thai) in Bangkok, where she and my mother's family lived. I picked at it, unsure of whether or not I wanted to eat this decidedly raw fish in its spongy sleeve of rice. I was, after all, American, and was used to food served through a car window. All of a sudden, I spotted something familiar on my plate: a small but appetizing lump of green guacamole. I scraped all of it up and plopped it in my mouth, noticing an amused glint in my grandmother's eyes far too late. Fire swept my mouth in a painful, sinus-clearing swell. As I wailed, experiencing the zing of wasabi for the first time, my grandmother laughed the heartiest, most earnest laugh I've ever heard to this day."
//Web socket functionality 
start("ws://127.0.0.1:8000/");
var num = 0;
function start(websocketServerLocation) {

  ws = new WebSocket(websocketServerLocation);
 
  ws.onopen = function() {
    console.log("open");
    //ws.send(tex);
  };

  ws.onmessage = function (evt) {
    console.log("message received");
    if(evt.data.startsWith('{"sentiment"'))
    {
      showPattern = true;
      var jData = JSON.parse(evt.data)
      storySentiment = jData["sentiment"];
      //console.log(storySentiment);
    }
//{"sentiment": "NEUTRAL"}
   if(!showPattern)
    createComic(evt.data);
    offset = t - offset;
    //console.log("offset time "+t);
   
  };

  ws.onclose = function() {
    console.log("closed");
  };

  ws.onerror = function(err) {
    console.log(err);
  };


}

var recorder = new p5.SpeechRec();
recorder.continuous = true; // do continuous recognition 

function parseResult() {
  console.log("parsing");
  recordedText += recorder.resultString + ". ";
    // if (recordedText.length > 100) {
      console.log("sending");
      ws.send(recordedText);
      // ws.send(recorder.resultString);
      recordedText = "";
    // }
}

var comicStrip = [];
function createComic(data)
{
  //console.log("comic being created");
  //console.log(JSON.parse(data));
  var jsonData = JSON.parse(data);
  //console.log(jsonData);
  var framesArray = jsonData["frames"];
  
  framesArray.forEach(function(panelData){
         var act = panelData["action"];
         var subs = panelData["subjects"];
         var predis = panelData["predicates"];
         //var relates = panelData["relationships"];
        // var emoColor = panelData["color"];
        var emotion = panelData["emotion"];
        var senti = panelData["sentiment"];
         var set = panelData["setting_preposition"];
         var subjectArray = [];
         var predArray = [];
         var relationsArray = [];
         var actionPanel = {};
        subs.forEach(function(currentSubject)
        {
               if(currentSubject["subjectType"] == "agent")
               {
                if(currentSubject["agentType"] == "HUMAN")
                {
                    subjectArray.push(new Agent.Human(senti,currentSubject["gender"]));
                }
                else
                {
                   subjectArray.push(new Agent.NonHuman(senti,currentSubject["gender"]));
                }
               }
               else if(currentSubject["subjectType"] == "object")
                   subjectArray.push(new Agent.Object(senti));
        });
         predis.forEach(function(currentSubject)
        {
               if(currentSubject["predicateType"] == "agent")
               {
                if(currentSubject["agentType"] == "HUMAN")
                {
                    predArray.push(new Agent.Human(senti,currentSubject["gender"]));
                }
                else
                {
                   predArray.push(new Agent.NonHuman(senti,currentSubject["gender"]));
                }
               }
                else if(currentSubject["subjectType"] == "object")
                   subjectArray.push(new Agent.object(senti));


        });



       //console.log(emotion);
       actionPanel = new Comic.Action(num,subjectArray,predArray,act,emotion,set,senti);
       num++;
      //console.log(actionPanel);
       comicStrip.push(actionPanel);
  });
}



var comic = new Comic.Holder(comicStrip);


var inc = 0.1;
var scl = 10;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];
var flowfield;
var showPattern = false;


var G;

var t = 0;
var P = [];
var Q = [];
var R = [];
var B = [];




function preload()
{
  recorder.onResult = parseResult;
  recorder.start();
 createCanvas(800,800);
 background(255);
 G = new pv.pt(width/2,height/2);
 P = pv.drawSpiral1(G);
 Q = pv.drawSpiral2(G);
 R = pv.circleSpaceBetweenTwoArcs(G,P,Q); 
 R[0]["length"] = R[1]["length"];
 R[0]["pt"].y-= (R[0]["length"]+25);
 R[1]["pt"].x+=R[1]["length"]+30;
 R[1]["pt"].y-=R[1]["length"];
 B = pv.circleSpaceBetweenTwoArcs2(G,P,Q); 
 B[0]["length"] = B[1]["length"];
 B[0]["pt"].y+= (B[0]["length"]+25);
 B[1]["pt"].x-=2*B[1]["length"];
 B[1]["pt"].y+=B[1]["length"];



}
var deltaTime = 0.05;
function setup()
{
  scribble = new Scribble();
  //sentiment pattern 
 // colorMode(HSB, 255);

  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');
  flowfield = new Array(cols * rows);

  for (var i = 0; i < B.length; i++) {
    particles[i] = new Particle(B[i]["pt"].x,B[i]["pt"].y);
  }

  
}

function draw()
{
  
 //console.log(showPattern);
  if(!showPattern)
{
  //ellipse(R[0]["pt"].x,R[0]["pt"].y,10,10);
  colorMode(RGB);
   comic.display(P,R,t);
    t+=deltaTime;
  }
if(showPattern)
{
colorMode(HSB, 255);
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += inc;
      stroke(0, 50);
     
    }
    yoff += inc;

    zoff += 0.03;
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges(B[i]["length"]);
    particles[i].show();
  }

}
}
function mouseClicked()
{
  if(showPattern == false)
  {
  ws.send("new person");

}
if(showPattern == true)
  showPattern = false;
}
function mouseWheel(event)
{
  showPattern = !showPattern;
}


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
var sentimentUtility = 
{
  
  "very-negative" : ["dark_red","black","red_orange","dark_green","grey_black","maroon"], //red orange for aggression
  "negative" : ["dull_yellow"], //dull yellow for sickness
  "neutral" : ["dull_green","blue"," dark_purple","grey","red","dark_orange","yellow_green","dull_yellow"],
  "positive" : ["orange","yellow","olive_green","gold","aqua","light_blue"],
  "very-positive" : ["orange","bright_yellow","bright_blue","bright_green","magenta"],

}
/*


function setup() {
 //recorder.onResult = parseResult;
// recorder.start();
 createCanvas(2000, 800);
  


}




var testAgent = new Agent.Human("green","FEMALE");
var testAgent2 = new Agent.Human("blue","MALE");
var r = new Relation("dominant",1,2,[testAgent],[testAgent2]);

var p1 = new Comic.Action([testAgent2],[testAgent2],"think-about","blue",r,"on");
//subjects,predicates , action,emotionColor,relation,setting ,bgColor,name
var p2 = new Comic.Action([testAgent2],[testAgent2],"move-body-part","blue",r,"from");
var strip = new Comic.ComicStrip([p1,p2]);
var strip2 = new Comic.ComicStrip([p1,p2]);
var comic = new Comic.Holder([strip,strip2]);
var testColor = "red";

function setup()
{
  createCanvas(400,400);
}

function draw()
{
  
  background(255);

  comic.display();
  
}
*/


//TESTING and animating the FERMAT'S SPIRAL FOR HOLDING THE COMIC STRIPS
/*
Anger
Disgust
Fear
Happiness
Sadness
Surprise
*/
/*
var inc = 0.1;
var scl = 10;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];
var flowfield;
var showPattern = false;

var t; //time for creating the animation.
var G;

var t = 0;
var P = [];
var Q = [];
var R = [];
var B = [];
var testAgent = new Agent.Human("happiness","FEMALE");
var testAgent2 = new Agent.Human("surprise","MALE");
var object = new Agent.Object("happiness");
var testAgent3 = new Agent.NonHuman("surprise","MALE");
var r = new Relation("dominant",1,2,[testAgent],[testAgent2]);
var emptyRelation = {};
var p1 = new Comic.Action(0,[testAgent],[testAgent3],"ingest","happiness","from");

var p2 = new Comic.Action(1,[testAgent2],[testAgent3],"feel","surprise","to");
var p3 = new Comic.Action(2,[testAgent2],[testAgent3],"see","surprise","to");
var p4 = new Comic.Action(3,[testAgent2],[testAgent3],"expel","surprise","to");
var comic = new Comic.Holder([p1,p2,p3,p4]);

var scribble;
//V1 = pv.U(V1);

var s = 0;
function preload()
{
  createCanvas(800,800);
 background(255);
 G = new pv.pt(width/2,height/2);
 P = pv.drawSpiral1(G);
 Q = pv.drawSpiral2(G);
 R = pv.circleSpaceBetweenTwoArcs(G,P,Q); 
 R[0]["length"] = R[1]["length"];
 R[0]["pt"].y-= (R[0]["length"]+25);
 R[1]["pt"].x+=R[1]["length"]+30;
 R[1]["pt"].y-=R[1]["length"];
 B = pv.circleSpaceBetweenTwoArcs2(G,P,Q); 
 B[0]["length"] = B[1]["length"];
 B[0]["pt"].y+= (B[0]["length"]+25);
 B[1]["pt"].x-=2*B[1]["length"];
 B[1]["pt"].y+=B[1]["length"];
}
var deltaTime = 0.05;
function setup()
{
scribble = new Scribble();
  //sentiment pattern 
 // colorMode(HSB, 255);
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');
  flowfield = new Array(cols * rows);

  for (var i = 0; i < B.length; i++) {
    particles[i] = new Particle(B[i]["pt"].x,B[i]["pt"].y);
  }
 
}

function draw()
{
  
 
  if(!showPattern)
   comic.display(P,R,t);
    t+=deltaTime;
if(showPattern)
{
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += inc;
      stroke(0, 50);
     
    }
    yoff += inc;

    zoff += 0.0003;
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges(B[i]["length"]);
    particles[i].show();
  }

}
}
function mouseWheel(event)
{
  showPattern = !showPattern;
}
*/
/*var t = 0;
var scribble;
var x = 100;
var y = 100;
var _x = 100
var __x = 100
var totalDistance = 50;
var totalTime = 5;
var speed = totalDistance/totalTime;
function setup()
{
  createCanvas(1200,1200);
  background(255);
  scribble = new Scribble();
  // delay(5000);
}

function draw()
{
 
    t+=0.1;
  strokeWeight(1);
  if(t<totalTime)
  {
    scribble.scribbleLine(x,y,x+speed,y);
    x+=speed;
  }
  
 else if(t-5<totalTime)
 {
  scribble.scribbleLine(_x,y+10,_x+10*(t-5),y+10);
  _x+=speed;
  console.log(+10*(t-5));
 }
 else if(t-10<totalTime)
 {
  scribble.scribbleLine(__x,y+20,__x+10*(t-10),y+20);
  __x+=(t-10);
 }
 strokeWeight(1);
}
  */
  


/*
var x = 0;
var speed = 10;
var scribble;
function setup()
{
  createCanvas(400,400);
  scribble = new Scribble();
  background(255);
}

function draw()
{
  if(x+speed<width/2)
  {
     x+=speed;
  scribble.scribbleLine(x,100,x+speed,100);
  }
   

}
*/

/*var scribble;
function setup()
{
scribble = new Scribble();
createCanvas(400,400);
background(255);
}
function draw()
{
  //scribble.scribbleRect(100,100,100,100);
   stroke(0);
  scribble.scribbleFilling([150,50,50,150],[150,150,50,50],2,90);
}
*/

/*function setup() {
        var canvas = createCanvas( windowWidth*0.98, windowHeight*0.97 );
        background( 255 );
        stroke( 0 );
        strokeWeight( 5 );
        // an array with some values
        var values = [ 16, 35, 78, 95, 70, 64, 32, 10, -10, -32, -64, -32 ];
        // calculate a few sizes
        var width      = ( windowWidth * 0.7 * 0.98 ) / values.length;
        var spacer     = ( windowWidth * 0.3 * 0.98 ) / ( values.length + 1 );
        var halfHeight = windowHeight / 2;
        // create an instance of scribble and set a few parameters
        var scribble       = new Scribble();
        scribble.bowing    = 0.1;
        scribble.roughness = 1.5;
        // draw a horizontal line across the center of the screen
        scribble.scribbleLine( 0, halfHeight, windowWidth, halfHeight );
        // draw every value as a filled rect in a bar graph
        for ( var i = 0; i < values.length; i++ ) {
          // calculate the x and y coordinates of the center of the rect and the height
          var h = halfHeight * 0.01 * values[i];
          var x = ( spacer + width ) * ( i + 1 ) - ( width / 2 );
          var y = halfHeight - h / 2;
          // set the thikness of the rect lines
          strokeWeight( 5 );
          // set the color of the rect lines to black
          stroke( 0 );
          // draw a rect for the value
          scribble.scribbleRect( x, y, width, h );
          // calculate the x and y coordinates for the border points of the hachure
          var xleft   = x - width / 2 + 5;
          var xright  = x + width / 2 - 5;
          var ytop    = y - ( halfHeight *  0.01 * values[i] / 2 );
          var ybottom = y + ( halfHeight *  0.01 * values[i] / 2 );
          // reduce the sizes to fit in the rect
          if ( ytop > ybottom ) {
            ytop    -= 5;
            ybottom += 5;
          } else {
            ytop    += 5;
            ybottom -= 5;
          }
          // the x coordinates of the border points of the hachure
          var xCoords = [ xleft, xright, xright, xleft ];
          // the y coordinates of the border points of the hachure
          var yCoords = [ ytop, ytop, ybottom, ybottom ];
          // the gap between two hachure lines
          var gap = 3.5;
          // the angle of the hachure in degrees
          var angle = 30;
          // set the thikness of our hachure lines
          strokeWeight( 3 );
          //set the color of the hachure to a nice blue
          stroke( 0, 50, 180 );
          // fill the rect with a hachure
          scribble.scribbleFilling( xCoords, yCoords , gap, angle );
        }
      }
      function draw() {}
      */

