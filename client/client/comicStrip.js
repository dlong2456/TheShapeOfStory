function comicStrip(Panels){
	this.panels = Panels || [];

}
comicStrip.prototype.dispay = function(){
	for(var i = 0 ; i <this.panels.length ; i++)
	{
		image(this.panels[i].frame,i*50,0);
	}
}

/*
function comicStrip()
{

}

*/