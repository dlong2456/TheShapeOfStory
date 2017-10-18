//This object contains a single comic strip frame
var Comic = (function() {
  
  //This method creates a frame given a set of parameters
  var Action = function(num, subjects, predicates, action, emotion, setting, sentiment, name) {
    //Set frame type - right now we only have action implemented 
    this.type = "action";
    //Set panel properties according to parameters or, if parameters are null, fill in default values
    this.name = name || "";
    this.subjects = subjects || [];
    this.predicates = predicates || [];
    this.action = action || "";
    this.emotion = emotion || "";
    this.sentiment = sentiment || "neutral";
    this.setting = setting || "";
    //TODO: What does this do? I think maybe it specifies the layer the panels are drawn on - i.e. agent layer instead of spiral layer
    this.agentLayer = new Renderer.AgentLayer(num, this.subjects, this.predicates, this.action, this.setting, this.sentiment, this.emotion);
    //This keeps track of the frame number
    this.num = num;
    print(this.num);
  };

  //This constructor creates a frame container that holds a certain number of panels
  var Holder = function(panels, capacity) {
    this.panels = panels || []; //I think this has a reference to the original panel array
    // Number of panels (but not being used right now)
    this.capacity = capacity || 5;
  };

  //This object is a container for a certain number of panels, and contains a method for displaying these panels
  Holder.prototype = {
    constructor: Holder,
    //Method that displays a series of panels
    display: function(P, R, t, counter, cb) {
     // var i = 0;
      var positions = R;
      //this.panels.forEach(function(panel) {
        //if(i > 5) {i = 0; background(255);}
      //panel.agentLayer.draw(positions[i], t);
       // i += 1;
      //console.log("counter: " + counter);
      if (this.panels[counter] != null && this.panels[counter] != undefined) {
        this.panels[counter].agentLayer.draw(positions[counter], t, cb);
      }
    },
  };

  //The properties that can be accessed from this Comic object include an action frame and a frame container/holder
  return {
    Action: Action,
    Holder: Holder,
  };

})();