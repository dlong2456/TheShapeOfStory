//This creates an agent - the agent can be one of three types: human, non-human, or object
var Agent = (function() {
	//This creates a human agent - represented by a circle or triangle depending on gender
	var Human = function(gender, name) {
		this.type = "human";
		this.name = name || "";
		this.gender = gender || "MALE";
		if (this.gender === "MALE")
			this.shape = "triangle";
		else if (this.gender === "FEMALE")
			this.shape = "circle";
		else
			this.shape = "triangle";
	};

	//This creates a non-human agent - represented by a rectangle
	var NonHuman = function(gender, name) {
		this.type = "nonHuman";
		this.name = name || "";
		this.gender = gender || "MALE";
		this.shape = "rectangle";
	};

	//This creates an object - represented by a square
	var Object = function(name) {
		this.type = "object";
		this.name = name || "";
		this.shape = "square";
		this.position = new pv.P(50, 50);
	};

	return {
		Human: Human,
		NonHuman: NonHuman,
		Object: Object,
	}
})();