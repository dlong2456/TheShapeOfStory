var Comic = (function()
{
	//Panels
	var Action = function(subjects,predicates , action,emotionColor,relation,setting ,bgColor,name)
	{
		this.type = "action",
		this.name = name || "";
		this.subjects = subjects || [] ;
		this.predicates = predicates || [] ;
		this.action = action || "";
		this.color = emotionColor || "";
		this.relation = relation || {};
		this.bgColor = bgColor || "baige";
        this.setting = setting || "";
		this.background = new Renderer.BackgroundLayer(this.bgColor);
		this.agentLayer = new Renderer.AgentLayer(this.subjects,this.predicates,this.action,this.relation,this.setting);
		this.textLayer = new Renderer.TextLayer();

		//subject and predicates mapped to size of the agents
		//
	}

    var Expository = function(setting,emotionColor,bgColor,name)
    {
          this.type = "expository",
          this.color = emotionColor || "green";
          this.bgColor = bgColor || "baige";
		this.background = new Renderer.BackgroundLayer(this.bgColor);
		this.name = name || "";
    }

    var ComicStrip = function(PanelList , capacity)
    {
    	this.panels = PanelList || [];
    	this.capacity = capacity || 5; // Number of panels per strip.
    }

     ComicStrip.prototype =
   {
   	 constructor : ComicStrip,
///
   	 display : function(pt)
   	 {
   	 
   	 	
   	 	this.panels.forEach(function(panel)
   	 	{     
              
              panel.background.draw(i,j);
              panel.agentLayer.draw(i,j);  
              i+=120; 
             
   	 	});
   	 },
   }


 var Holder = function(panels , capacity)
   {
         this.panels = panels || [];
         this.capacity = capacity || 5; // Number of strips to display on the screen.

   }

   Holder.prototype =
   {
   	constructor : Holder,
   	display : function(P,Q,G)
   	{

     var i = 1;
     var positions = pv.circleSpaceBetweenTwoArcs(G);
     // console.log(positions[0]);
     this.panels.forEach(function(panel)
     {
     	
     //	panel.background.draw(positions[i]);
     	panel.agentLayer.draw(positions[i]);
     	i+=1;
     });
   	  // var i = 10;
      // this.strips.forEach(function(strip){
       	// rect(10,i,(width-10),120);
        // strip.display(i+10);
        
        // i+=130;

       //});
   	},
   }

/*
   ComicStrip.prototype =
   {
   	 constructor : ComicStrip,
///
   	 display : function(j)
   	 {
   	 	var i = 20.0;
   	 	
   	 	this.panels.forEach(function(panel)
   	 	{     
              
              panel.background.draw(i,j);
              panel.agentLayer.draw(i,j);  
              i+=120; 
             
   	 	});
   	 },
   }
*/
  /* var Holder = function(ComicStrips , capacity)
   {
         this.strips = ComicStrips || [];
         this.capacity = capacity || 5; // Number of strips to display on the screen.

   }

   Holder.prototype =
   {
   	constructor : Holder,
   	display : function(P,Q,G)
   	{

      P = pv.drawSpiral1(G);
      Q = pv.drawSpiral2(G);
      var positions = pv.circleSpaceBetweenTwoArcs(G);
     // console.log(positions[0]);
      positions.forEach(function(pt){
      	fill(255,0,0);
         ellipse(pt.x,pt.y,10,10);
         noFill();
      //  strip.display(pt);
      });
   	  // var i = 10;
      // this.strips.forEach(function(strip){
       	// rect(10,i,(width-10),120);
        // strip.display(i+10);
        
        // i+=130;

       //});
   	},
   }
*/
return {
	Action : Action,
	
	
	
	ComicStrip : ComicStrip,
	Holder : Holder,

}

})();