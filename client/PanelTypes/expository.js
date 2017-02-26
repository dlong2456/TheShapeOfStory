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
/*
Expository.prototype = {
	constructor : Expository,
	get height(){
		return this.height;
	},
	
	get width(){
		return this.width;
	},
	get type(){
		return thid.type;

	},
	set height(value){
         this.height = value;
	},
    set width(value){
		this.width = value;

	},
	set setting(value){
		this.setting = value;
	},
	set name(value){
		this.name = value;
	}
	
}
*/