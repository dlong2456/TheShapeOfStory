var Comic = (function()
{
	//Panels
	var Action = function(num,subjects,predicates , action,emotionColor,setting ,emotion,name)
	{

		this.type = "action",
		this.name = name || "";
		this.subjects = subjects || [] ;
		this.predicates = predicates || [] ;
		this.action = action || "";
		this.color = emotionColor || "";
		
		this.emotion = emotion || "";
    this.setting = setting || "";
		this.agentLayer = new Renderer.AgentLayer(num,this.subjects,this.predicates,this.action,this.setting,this.emotion);
		this.num = num;//frame number variable
  }

   

   


 var Holder = function(panels , capacity)
   {
         this.panels = panels || [];
         this.capacity = capacity || 5; // Number of strips to display on the screen.

   }

   Holder.prototype =
   {
   	constructor : Holder,
   	display : function(P,R,t)
   	{
  
     var i = 0;
     var positions = R;
  
     this.panels.forEach(function(panel)
     {
     	panel.agentLayer.draw(positions[i],t);
     	i+=1;
     });
   	 
   	},
   }


return {
	Action : Action,
	Holder : Holder,

}

})();