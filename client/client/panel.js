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

