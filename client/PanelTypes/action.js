function Action( action ,  i, agents, name)  
{
	this.type = "action";
	this.name = name || ""; //action name extracted from the text.
	this.width = 40;
	this.height =  40;
	this.agents = agents || [];
	this.action = action || {};
	var img =loadAnimation("assets/closeUp_Frame.png") ;
	this.frame = createSprite(i*250,100,20,20);
    this.frame.addAnimation("frame",img);
     if(this.action.name === "propel" || this.action.name === "move-object" || this.action.name === "move-possesion")
     {
     	this.animation = loadAnimation("assets/action/"+"propel"+"/"+"propel"+"_0001.png","assets/action/"+"propel"+"/"+"propel"+"_0007.png");
     }
     if(this.action.name === "move-body-part" )
     {
     	this.animation = loadAnimation("assets/action/"+"move-body-part"+"/"+"move-body-part"+"_0001.png","assets/action/"+"move-body-part"+"/"+"move-body-part"+"_0006.png");
     }
     if(this.action.name === "think-about" )
     {
     	this.animation = loadAnimation("assets/action/"+"think-about"+"/"+"think-about"+"_0001.png","assets/action/"+"think-about"+"/"+"think-about"+"_0003.png");
     }
     if(this.action.name === "hear" )
     {
     	this.animation = loadAnimation("assets/action/"+"hear"+"/"+"hear"+"_0001.png","assets/action/"+"hear"+"/"+"hear"+"_0002.png");
     }
     if(this.action.name === "feel" )
     {
     	this.animation = loadAnimation("assets/action/"+"feel"+"/"+"feel"+"_0001.png","assets/action/"+"feel"+"/"+"feel"+"_0003.png");
     }
	this.animation = loadAnimation("assets/action/"+this.action.name+"/"+this.action.name+"_0001.png","assets/action/"+this.action.name+"/"+this.action.name+"_0005.png");
	this.panel = createSprite(i*250,100,20,20);
	this.panel.addAnimation(this.action.name,this.animation);



}

Action.prototype.dispay = function(){
	

}
/*
Action.prototype = {
	constructor : Action,
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
	get action(){
		return this.action;
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
	set action(action){
		this.action = action;
	},
	
}
*/