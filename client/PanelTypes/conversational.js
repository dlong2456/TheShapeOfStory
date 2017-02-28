function Conversation( agentList , conversation , i, name)  
{
	this.agentList = agentList;
	this.agents;
	for(var i = 0 ; i< this.agentLists;i++)
	{
           if(agentLists[i].agentType === "HUMAN")
           	agents.push(new  human(agentLists[i].gender));
           if(agentLists[i].agentType === "ANIMAL")
           	agents.push(new nonHuman(agentLists[i].gender));


	}
	this.type = "conversational";
	this.name = name || ""; //emotional state name extracted from the text.
	this.width = 40;
	this.height =  40;
	//this.agents = agents || [];
	this.conversation = conversation || [];
	var img =loadAnimation("assets/conversation_frame.png") ;
	this.frame = createSprite(i*270,200,20,20);
    this.frame.addAnimation("frame",img);
	//this.animation = loadAnimation();
	//this.panel = createSprite();
	//this.panel.addAnimation("speaking",animation);

}
Conversation.prototype.dispay = function(){
	
}
/*
CloseUp.prototype = {
	constructor : CloseUp,
	get height(){
		return this.height;
	},
	
	get width(){
		return this.width;
	},
	get type(){
		return thid.type;

	},
	get agents(){
		return this.agents;
	},
	get conversation(){
		return this.conversation;
	},
	set height(value){
         this.height = value;
	},
    set width(value){
		this.width = value;

	},
	set name(value){
		this.name = value;
	},
	set agents(agentList){
		this.agents = agentList;
	},
	set conversation(conversation){
		this.conversation = conversation;
	},
	
}
*/