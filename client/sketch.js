

var p1,p2,p3;
var comicS = [];
var agent1;
var agent2;
var agent3;
var agents = [];
var a1;
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
    if (recordedText.length > 200) {
    	console.log("sending");
		ws.send(recordedText);
	}
}

function setup() {
 recorder.onResult = parseResult;
 recorder.start();
 bg = loadImage("assets/scrollBackground.jpg");
  createCanvas(720, 400);
  a1 = new action("Walk",[agent2]);
  agent1 = new Agent("primary","human","female","me","happy");
   agent2 = new Agent("co","human","male","boyfriend","angry");
   agent3 = new Agent("co","nonHuman","","box","sad");
   agents.push(agent2);
  p1 = new CloseUp("angry",agent2,1);
 p2 = new CloseUp("happy",agent1,0);
 p3 = new Action(a1,agents,2);


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