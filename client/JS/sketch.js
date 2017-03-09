var recordedText = "";

//Web socket functionality 
start("ws://127.0.0.1:8000/");
function start(websocketServerLocation) {

  ws = new WebSocket(websocketServerLocation);

  ws.onopen = function() {
    console.log("open");
  };

  ws.onmessage = function (evt) {
    console.log("message received");
    //These are the JSON messages with the frame data
    //console.log(evt.data);
    createComic(evt.data);
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
    //if (recordedText.length > 100) {
      console.log("sending");
    //ws.send(recordedText);
    ws.send(recorder.resultString);
    //recordedText = "";
  //}
}
var comicStrip = [];
function createComic(data)
{
  console.log(JSON.parse(data));
  var jsonData = JSON.parse(data);
  var framesArray = jsonData["frames"];
  
  framesArray.forEach(function(panelData){
         var act = panelData["action"];
         var subs = panelData["subjects"];
         var predis = panelData["predicates"];
         //var relates = panelData["relationships"];
         var emoColor = panelData["color"];
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
                    subjectArray.push(new Agent.Human(emoColor,currentSubject["gender"]));
                }
                else
                {
                   subjectArray.push(new Agent.NonHuman(emoColor,currentSubject["gender"]));
                }
               }
        });
         predis.forEach(function(currentSubject)
        {
               if(currentSubject["predicateType"] == "agent")
               {
                if(currentSubject["agentType"] == "HUMAN")
                {
                    predArray.push(new Agent.Human(emoColor,currentSubject["gender"]));
                }
                else
                {
                   predArray.push(new Agent.NonHuman(emoColor,currentSubject["gender"]));
                }
               }
        });
/*
       relates.forEach(function(rel){
            var pr = rel["primary_agent"];
            var sec = rel["secondary_agent"];
            var primaryA = {};
            var secondaryA = {};
            
                if(pr["agentType"] == "HUMAN")
                {
                    primaryA = new Agent.Human(emoColor,pr["gender"]);
                }
                else
                {
                   primaryA = new Agent.NonHuman(emoColor,pr["gender"]);
                }
                if(sec["agentType"] == "HUMAN")
                {
                    secondaryA = new Agent.Human(emoColor,sec["gender"]);
                }
                else
                {
                   secondaryA = new Agent.NonHuman(emoColor,sec["gender"]);
                }
               relationsArray.push(new Relation(rel["type"],rel["intimacy"],rel["positivity"],primaryA,secondaryA));

       });
*/
       actionPanel = new Comic.Action(subjectArray,predArray,act,emoColor,{},set);
       comicStrip.push(actionPanel);
  });
}

/*
var testAgent = new Agent.Human("green","FEMALE");
var testAgent2 = new Agent.Human("blue","MALE");
var r = new Relation("dominant",1,-2,[testAgent],[testAgent2]);

var p1 = new Comic.Action([testAgent],[testAgent2],"speak","blue",r,"on");
//subjects,predicates , action,emotionColor,relation,setting ,bgColor,name
var p2 = new Comic.Action([testAgent],[testAgent2],"move-body-part","blue",r,"from");
var strip = new Comic.ComicStrip([p1,p2]);
var strip2 = new Comic.ComicStrip([p1,p2]);
var comic = new Comic.Holder([strip,strip2]);
var testColor = "red";
//obj.position = new pv.P(50,50);
///var justAtest = Renderer.testFunction;
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

function setup() {
 recorder.onResult = parseResult;
 recorder.start();
 createCanvas(2000, 800);
  


}

function draw() {
  clear();
  background(255);  

  
}




    