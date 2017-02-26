
function Agent( type1 , type2 ,sex,name , emoState , behaviour , personality )
{
	this.name = name || "";
	if(type1 === "primary")
		primary.call(this);
	if(type1==="co")
		coAgent.call(this);
	if(type2==="human")
		human.call(this,sex);
	if(type2==="nonHuman")
		nonHuman.call(this);
	this.emoState = emoState || "";
	this.behaviour = behaviour || "";
	this.personality = personality || "";
}
