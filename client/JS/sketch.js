

function setSentimentParameters()
{
  if(storySentiment == "neutral")
  {
    r = 147;
    g = 222;
    b = 105;
    strWt = 1;
  }
  if(storySentiment == "positive")
  {
    r = random(200,250);
    g = random(200,255);
    b = 0;
    strWt = 3;
  }
  if(storySentiment == "negative")
  {
    r = random(50,75);
    g = 0;
    b = random(128,255);
    strWt = 3;
  }
  if(storySentiment == "very_positive")
  {
    r = 255;
    g = random(150,180);
    b = random(170,190);
    strWt = 7;
  }
  if(storySentiment == "very_negative")
  {
     r = random(50,150);
    g = random(50,150);
    b = random(50,150);
    strWt = 7;  
  }
  if(storySentiment == "init")
  {
     r = 150;
    g = 150;
    b = 150;
    strWt = 1;  
  }


}
var recordedText = "";
var offset = 0;

var storySentiment = "";

var strWt = 2;
var r = 255;
var g = 255;
var b = 255;


//end symbol variables
var endStartTime; 
var endEndTime = 40;
var endX = 50;
var endY = 600; //half of the height.
var endSpeedX = 1;
var drawEndSymbol = false;
var tempX ;

//Pattern time
var patternStartTime;

//var tex = "He woke to the fragrance of roses. The house was burning and he did not know what to do. He ran downstairs and went outside. Suddenly, he remembered that he left his cat inside. He called 911 and the firefighters saved the cat.";
// var tex = "Once upon a time ,in a village there lived a beautiful girl named Cinderella with her wicked stepmother and two step-sisters. She worked hard all day. One day, they all went to a ball in the palace, leaving Cinderella behind. Cinderella was feeling sad. Suddenly there was a burst of light and the fairy godmother appeared. With a flick of the magic she turned Cinderella into a beautiful princess with glass slippers and a horse carriage appeared at the door. The fairy godmother warned Cinderella to return before midnight. Cinderella arrived at the ball, the prince saw her and fell in love with her. They danced together all night. As the clock struck twelve, Cinderella rushed out to her carriage leaving one of her slippers behind. The prince went to every house in the town with the slipper until he found Cinderella. The prince and Cinderella lived happily ever after.";
//var tex = "I was visiting my now late grandmother (or Khun Yai, as I called her in Thai) in Bangkok, where she and my mother's family lived. I picked at it, unsure of whether or not I wanted to eat this decidedly raw fish in its spongy sleeve of rice. I was, after all, American, and was used to food served through a car window. All of a sudden, I spotted something familiar on my plate: a small but appetizing lump of green guacamole. I scraped all of it up and plopped it in my mouth, noticing an amused glint in my grandmother's eyes far too late. Fire swept my mouth in a painful, sinus-clearing swell. As I wailed, experiencing the zing of wasabi for the first time, my grandmother laughed the heartiest, most earnest laugh I've ever heard to this day."
//var tex = "Well, Prince, so Genoa and Lucca are now just family estates of the Buonapartes. But I warn you, if you don’t tell me that this means war, if you still try to defend the infamies and horrors perpetrated by that Antichrist—I really believe he is Antichrist—I will have nothing more to do with you and you are no longer my friend, no longer my ‘faithful slave,’ as you call yourself! But how do you do? I see I have frightened you—sit down and tell me all the news. It was in July, 1805, and the speaker was the well-known Anna Pávlovna Schérer, maid of honor and favorite of the Empress Márya Fëdorovna. With these words she greeted Prince Vasíli Kurágin, a man of high rank and importance, who was the first to arrive at her reception. Anna Pávlovna had had a cough for some days. She was, as she said, suffering from la grippe; grippe being then a new word in St. Petersburg, used only by the elite. All her invitations without exception, written in French, and delivered by a scarlet-liveried footman that morning, ran as follows: If you have nothing better to do, Count (or Prince), and if the prospect of spending an evening with a poor invalid is not too terrible, I shall be very charmed to see you tonight between 7 and 10—Annette Schérer. Heavens! what a virulent attack!” replied the prince, not in the least disconcerted by this reception. He had just entered, wearing an embroidered court uniform, knee breeches, and shoes, and had stars on his breast and a serene expression on his flat face. He spoke in that refined French in which our grandfathers not only spoke but thought, and with the gentle, patronizing intonation natural to a man of importance who had grown old in society and at court. He went up to Anna Pávlovna, kissed her hand, presenting to her his bald, scented, and shining head, and complacently seated himself on the sofa."
var tex = "The pool of glowing water didn’t seem safe, but she felt drawn to it. She walked towards it and climbed into the water. Suddenly, she heard a noise. It was coming from below. She called her friend John to join her. Together, she and John dove deep into the water, where they found a treasure chest. They decided to open it and inside of the chest, they found lots of gold."


//Web socket functionality 
start("ws://127.0.0.1:8000/");
var num = 0;
function start(websocketServerLocation) {

  ws = new WebSocket(websocketServerLocation);
 
  ws.onopen = function() {
    console.log("open and sending");
    ws.send(tex);
  };

  ws.onmessage = function (evt) {
    console.log("message received");
    if(evt.data.startsWith('{"sentiment"'))
    {
      showPattern = true;
      var jData = JSON.parse(evt.data)
      storySentiment = jData["sentiment"];
      
    }

   if(!showPattern)
    createComic(evt.data);
    offset = t - offset;
    
   
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
recorder.onResult = parseResult;
recorder.onEnd = function(){console.log("listening again"); recorder.start();}
function parseResult() {
  console.log("parsing");
  recordedText += recorder.resultString + ". ";
  console.log("sending: " + recordedText);
  //ws.send(recordedText);
  recordedText = "";
}

var comicStrip = [];
function createComic(data)
{
  var jsonData = JSON.parse(data);
  var framesArray = jsonData["frames"];
  
  framesArray.forEach(function(panelData){
    var act = panelData["action"];
    var subs = panelData["subjects"];
    var predis = panelData["predicates"];
    console.log("predis: " + panelData["predicates"]);
    var emotion = panelData["emotion"];
    var senti = panelData["sentiment"];
    var set = panelData["setting_preposition"];
    var subjectArray = [];
    var predArray = [];
    var relationsArray = [];
    var actionPanel = {};

    subs.forEach(function(currentSubject) {
      if(currentSubject["subjectType"] == "agent") {
        if(currentSubject["agentType"] == "HUMAN") {
            subjectArray.push(new Agent.Human(currentSubject["gender"], senti));
        }
        else {
           subjectArray.push(new Agent.NonHuman(currentSubject["gender"], senti));
        }
      } else if(currentSubject["subjectType"] == "object") {
        subjectArray.push(new Agent.Object(senti));
      }
    });

    predis.forEach(function(currentPredicate) {
      if(currentPredicate["predicateType"] === "agent")
      {
        if(currentPredicate["agentType"] == "HUMAN")
        {
            predArray.push(new Agent.Human(currentPredicate["gender"], senti));
        }
        else
        {
           predArray.push(new Agent.NonHuman(currentPredicate["gender"], senti));
        }
      }
      else if(currentPredicate["predicateType"] === "object") {
         subjectArray.push(new Agent.Object(senti));
      }
    });
    
    actionPanel = new Comic.Action(num, subjectArray, predArray, act, emotion, set, senti);
    num++;
    comicStrip.push(actionPanel);
  });
}



var comic = new Comic.Holder(comicStrip);


var inc = 0.1;
var scl = 100;
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
  //recorder.onResult = parseResult;
  recorder.start();
 createCanvas(1200,1200);
 background(255);
 G = new pv.pt(width/2,height/2);
 P = pv.drawSpiral1(G);
 Q = pv.drawSpiral2(G);
 R = pv.circleSpaceBetweenTwoArcs(G,P,Q); 
 R[0]["length"] = R[1]["length"];
 R[0]["pt"].y-= (R[0]["length"]+25);
 R[1]["pt"].x+=R[1]["length"]+50;
 R[1]["pt"].y-=R[1]["length"];
R[3]["pt"].x -=70;

 B = pv.circleSpaceBetweenTwoArcs2(G,P,Q); 
 
 

for(var i = 0 ; i < 10 ; i++)
{
  B[i]["length"] = B[12]["length"];

}
B[0]["pt"].y+= (B[0]["length"]+25);

for(var i = 1 ; i < 10 ; i++)
{
  B[i]["pt"].x-=(B[i]["length"]);
 B[i]["pt"].y+=B[i]["length"];

}
B[10]["pt"].x -=2*B[i]["length"];
 



}
var initSpiral = false;
var deltaTime = 0.05;
function setup()
{
  scribble = new Scribble();
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');
  flowfield = new Array(cols * rows);

  for (var i = 0; i < B.length; i++) {
    particles[i] = new Particle(B[i]["pt"].x,B[i]["pt"].y);
  }

  background(255);
  console.log(Renderer.reset);
}

function draw()
{
  
  //recorder.onEnd() console.log("I stopped listening");
 if(frameCount < 100)
 {
  initSpiral = true;
  storySentiment = "init";
  strWt = 2;
 }
else initSpiral = false;
  if(!showPattern && !initSpiral && !drawEndSymbol)
  {
   comic.display(P,R,t);
   t+=deltaTime;

 }
    
if(showPattern || initSpiral)
{
  
  if(showPattern && !drawEndSymbol) {patternStartTime+=1;}// console.log(patternStartTime);}
   if(patternStartTime > 150 && !drawEndSymbol) {console.log("Pattern end"); showPattern = false};
   //if(showPattern) storySentiment = 
   setSentimentParameters();
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
    particles[i].show(strWt,r,g,b);
  }

}
if(drawEndSymbol == true)
{
  t+=deltaTime;
  EndSymbol();
}
}
function mouseClicked(e)
{
   
  if(showPattern == false)
  {
    patternStartTime = 0;

  ws.send("new person");

}
if(showPattern == true)
  showPattern = false;

//if (Renderer.reset = true) background(255);
}
function mouseWheel(event)
{


  t = 0;
  showPattern = !showPattern;
  fill(150,150,150,20);
  rect(0,0,1200,1200);
  //showPatterns = false;
  endStartTime = t;
  drawEndSymbol = true;
}



function EndSymbol()
{
   stroke(0);
  strokeWeight(20);
   if(endX < 450)
   {
    
  scribble.scribbleLine(endX ,endY ,endX+endSpeedX*(t-endStartTime)*5,endY );
  scribble.scribbleLine(1200-endX ,endY ,1200-(endX+endSpeedX*(t-endStartTime)*5),endY );
  endX = endX+ endSpeedX*(t-endStartTime);
    tempX = endX+ 15*endSpeedX*(t-endStartTime);

}
else if(t-endStartTime < 2*TWO_PI)
{ 
  var b1 = -10
  var b2 = 10;
   var r1 = b1*sqrt(t);
   var r2 = b2*sqrt(t);
   scribble.scribbleLine(tempX+r1*cos(t-endStartTime),endY+r1*sin(t-endStartTime),(tempX+2*r1*cos(t-endStartTime+deltaTime)),endY+r1*sin(t-endStartTime+deltaTime));
   scribble.scribbleLine(1200- tempX+r2*cos(t-endStartTime),endY+r2*sin(t-endStartTime),1200-tempX+2*r2*cos(t-endStartTime+deltaTime),endY+r2*sin(t-endStartTime+deltaTime));
    
   
}
}

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
 var storySentiment = "";

var strWt = 2;
var r = 255;
var g = 255;
var b = 255;

var inc = 0.1;
var scl = 100;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];
var flowfield;
var showPattern = false;

var t; //time for creating the animation.
var G;
var offset = 0;
var t = 0;
var P = [];
var Q = [];
var R = [];
var B = [];
//actionPanel = new Comic.Action(num,subjectArray,predArray,act,emotion,set,senti);
var testAgent = new Agent.Human("FEMALE");
var testAgent2 = new Agent.Human("MALE");
var object = new Agent.Object();
var testAgent3 = new Agent.NonHuman("MALE");

var p1 = new Comic.Action(0,[testAgent],[testAgent],"be","fear","from","positive");

var p2 = new Comic.Action(1,[testAgent],[testAgent],"ingest","happy","to","positive");
var p3 = new Comic.Action(2,[testAgent2],[testAgent3],"have","angry","to","very_negative");
var p4 = new Comic.Action(3,[testAgent2],[testAgent3],"have","surprise","to","very_positive");
var comic = new Comic.Holder([p1,p2,p3,p4]);

var scribble;


var s = 0;
function preload()
{
 createCanvas(1200,1200);
 background(255);
 G = new pv.pt(width/2,height/2);
 P = pv.drawSpiral1(G);
 Q = pv.drawSpiral2(G);
 R = pv.circleSpaceBetweenTwoArcs(G,P,Q); 
 R[0]["length"] = R[1]["length"];
 R[0]["pt"].y-= (R[0]["length"]+25);
 R[1]["pt"].x+=R[1]["length"]+50;
 R[1]["pt"].y-=R[1]["length"];
R[3]["pt"].x -=70;
 //pattern cricle.
 B = pv.circleSpaceBetweenTwoArcs2(G,P,Q); 
 
 

for(var i = 0 ; i < 10 ; i++)
{
  B[i]["length"] = B[12]["length"];

}
B[0]["pt"].y+= (B[0]["length"]+25);

for(var i = 1 ; i < 10 ; i++)
{
  B[i]["pt"].x-=(B[i]["length"]);
 B[i]["pt"].y+=B[i]["length"];

}
B[10]["pt"].x -=2*B[i]["length"];
 
 

}
var initSpiral = false;
var deltaTime = 0.05;
function setup()
{
scribble = new Scribble();
  //sentiment pattern 
 //
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');
  flowfield = new Array(cols * rows);

  for (var i = 0; i < B.length; i++) {
    particles[i] = new Particle(B[i]["pt"].x,B[i]["pt"].y);
  }
 
  storySentiment = "init";
}

function draw()
{
  
 if(frameCount < 100)
 {
  initSpiral = true;
 // storySentiment = "init";
  strWt = 2;

 }
else initSpiral = false;
  if(!showPattern && !initSpiral)
  {
   // colorMode(RGB, 255);
   comic.display(P,R,t);
   t+=deltaTime;
 }
    
if(showPattern || initSpiral)
{
  if(showPattern) storySentiment = "positive";
  console.log(storySentiment);
   //colorMode(HSB, 255);
   setSentimentParameters();
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
    particles[i].show(strWt,r,g,b);
  }

}
}
function mouseWheel(event)
{
  storySentiment == "very_positive";
  showPattern = !showPattern;
}
function setSentimentParameters()
{
  if(storySentiment == "neutral")
  {
    r = 147;
    g = 222;
    b = 105;
    strWt = 1;
  }
  if(storySentiment == "positive")
  {
    r = random(200,250);
    g = random(200,255);
    b = 0;
    strWt = 3;
  }
  if(storySentiment == "negative")
  {
    r = random(50,75);
    g = 0;
    b = random(128,255);
    strWt = 3;
  }
  if(storySentiment == "very_positive")
  {
    r = 255;
    g = random(150,180);
    b = random(170,190);
    strWt = 7;
  }
  if(storySentiment == "very_negative")
  {
     r = random(50,150);
    g = random(50,150);
    b = random(50,150);
    strWt = 7;  
  }
  if(storySentiment == "init")
  {
     r = 5;
    g = 5;
    b = 5;
    strWt = 1;  
  }


}

*/
