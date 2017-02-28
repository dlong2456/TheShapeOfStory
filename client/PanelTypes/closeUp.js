function CloseUp(EmoState , agent ,i,name)  
{
	this.type = "closeUp";
	this.name = name || "";
	this.width = 40;
	this.height =  40;
	this.agent = agent || {};
	this.emoState = EmoState || "";
	var img =loadAnimation("assets/conversation_frame.png") ;
	this.frame = createSprite(i*250,100,10,10);
    this.frame.addAnimation("frame",img);
    //this.spriteSheet = loadSpriteSheet('assets/explode_sprite_sheet.png', 171, 158, 11);
    //this.animation = loadAnimation(this.spriteSheet);
    
	if(this.agent.type == "human")
	{
		this.animation = loadAnimation("assets/emoState/"+this.emoState+"/"+this.agent.sex+"/"+this.emoState+"_0001.png", "assets/emoState/"+this.emoState+"/"+this.agent.sex+"/"+this.emoState+"_0010.png");
	}
	else
	{
		this.animation = loadAnimation("assets/emoState/"+this.emoState+"/nonHuman/"+this.emoState+"_0001.png","assets/emoState/"+this.emoState+"/nonHuman/"+this.emoState+"_0010.png");
	}
	this.panel = createSprite(i*250,100, 10, 10);
    this.panel.addAnimation(this.emoState, this.animation);

}
CloseUp.prototype.dispay = function(){
	
}
