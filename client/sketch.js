


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
	for(var p = 0 ; p < framesArray.length ; p++)
	{
		if(framesArray[p]["frameType"] === "agent")
			comicStrip.push(new agentFrame(framesArray[p]["agents"]),p+1);
		if(framesArray[p]["frameType"] === "action")
		{
			var act = new action(framesArray[p]["animation"]);
			comicStrip.push(new Action(act,p+1));
		}
		if(framesArray[p]["frameType"] === "closeup")
		{
			var a;
			if(framesArray[p]["agent"]["agentType"]==="HUMAN")
				a = new human(framesArray[p]["agent"]["gender"]);
			if(framesArray[p]["agent"]["agentType"]==="ANIMAL")
				a = new nonHuman(framesArray[p]["agent"]["gender"]);
			comicStrip.push(new CloseUp(framesArray[p]["animation"],a,p+1));

		}
		if(framesArray[p]["frameType"] === "setting")
			comicStrip.push(new Expository(framesArray[p]["setting"],p+1));
		if(framesArray[p]["frameType"] === "object")
			comicStrip.push(new ObjectFrame(framesArray[p]["object"],p+1));
		if(framesArray[p]["frameType"] === "conversation")
			comicStrip.push(new agentFrame(framesArray[p]["agents"]),p+1);	
		
	}
	clear();
   redraw();
}

function setup() {
 recorder.onResult = parseResult;
 recorder.start();
 bg = loadImage("assets/scrollBackground.jpg");
  createCanvas(2000, 800);
  


}

function draw() {
  clear();
  background(255);  
  camera.zoom = .5;

  drawSprites();
}










/*
//close up panel class

function CloseUp(name , EmoState , agent)  
{
	this.type = "closeUp";
	this.name = name || ""; //emotional state name extracted from the text.
	this.width = 40;
	this.height =  40;
	this.agent = agent || {};
	this.emoState = EmoState || "";
	this.frame = loadImage("assets/CloseUp.png");

}
CloseUp.prototype.dispay = function(){
	
}


//conversation panel calss
function Conversation(name , agents , conversation)  
{
	this.type = "conversational";
	this.name = name || ""; //emotional state name extracted from the text.
	this.width = 40;
	this.height =  40;
	this.agents = agents || [];
	this.conversation = conversation || [];
	this.frame = loadImage("assets/conversation.png");

}
Conversation.prototype.dispay = function(){
	
}
//action panel class
function Action(name , action , agents)  
{
	this.type = "action";
	this.name = name || ""; //action name extracted from the text.
	this.width = 40;
	this.height =  40;
	this.agents = agents || [];
	this.action = action || {};
	this.frame = loadImage("assets/Action.png");

}
//expository panel class
function Expository(setting , name)  
{
	this.type = "expository";
	this.name = name || ""; //name extracted from the text.
	this.setting = setting || "";//url for image.
	this.width = 50;
	this.height =  40;
	this.frame = loadImage("assets/expository.png");

}
Expository.prototype.dispay = function(){
	
}


Action.prototype.dispay = function(){
	

}

//panel class
function Panel(type, object){
	this.object = object || "";
	if(type == "action")
		Action.call(this);
	if(type == "conversational")
		Conversation.call(this);
	if(type == "expository")
		Expository.call(this);
	if(type == "closeUp")
		CloseUp.call(this);
}

Panel.prototype.display = function(){
	
}

//comic strip class
function comicStrip(Panels){
	this.panels = Panels || [];

}
comicStrip.prototype.dispay = function(){
	for(var i = 0 ; i <this.panels.length ; i++)
	{
		image(this.panels[i].frame,i*50,0);
	}
}



var p1 = new Panel("action");
var p2 = new Panel("action");
var p3 = new Panel("conversation");

var comicS

function preload()
{
  
}

function setup()
{
    createCanvas(400,400);
    comicS = new comicStrip([p1,p2,p3]);

  

 
}

function draw()
{
     background(255);
     comicS.display();
}
*/