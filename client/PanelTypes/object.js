var ObjectFrame = function(name,i){
   this.name = name;
   var img =loadAnimation("assets/closeUp_Frame.png") ;
	this.frame = createSprite(i*250,100,20,20);
    this.frame.addAnimation("frame",img);

}