var Agent = (function(){
	//public stuff
	var Human = function(emotionColor,gender,name)
	{
		this.type = "human";
		this.name = name || "";
		this.gender = gender || "MALE";
		if(this.gender == "MALE")
			this.shape = "triangle";
		else if(this.gender == "FEMALE" )
			this.shape = "circle";
		else
			this.shape = "triangle";
		this.color = emotionColor || "";
	};
	var NonHuman = function(emotionColor,gender,name)
	{
		this.type = "nonHuman";
		this.name = name || "";
		this.gender = gender || "MALE";
		this.shape = "rectangle";
		this.color = emotionColor || "";

	};

	var Object = function(emotionColor,name)
	{
		this.type = "object";
		this.name = name || "";
		this.shape = "square";
		this.position = new pv.P(50,50);
		this.color = emotionColor || "";
	};

//private stuff
    









	return {
    Human: Human,
    NonHuman : NonHuman,
    Object : Object,
   

  }
})();