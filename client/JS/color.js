var Emotion = (function(){
    var ColorUtility=
    {
    	"red" : color(255,0,0),
    	"green" : color(0,255,0),
    	"blue" : color(0,0,255),
    	"white" : color(255),
    	"black" :color(0),

    }
    var strToColor = function(color)
    { 
      if(color in ColorUtility.keys())
      return ColorUtility[color];
      else
      return color(100,100,0); 
    }
	return{

       strToColor : strToColor,
	}

})();