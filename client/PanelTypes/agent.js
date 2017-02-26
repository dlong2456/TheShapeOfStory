var agentFrame = function(agentLists,i){
	this.agentLists = agentLists;
	this.agents;
	for(var i = 0 ; i< this.agentLists;i++)
	{
           if(agentLists[i].agentType === "HUMAN")
           	agents.push(new  human(agentLists[i].gender));
           if(agentLists[i].agentType === "ANIMAL")
           	agents.push(new nonHuman(agentLists[i].gender));


	}
	var img =loadAnimation("assets/closeUp_Frame.png") ;
	this.frame = createSprite(i*250,100,20,20);
    this.frame.addAnimation("frame",img);


}