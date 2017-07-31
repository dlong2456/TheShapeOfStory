var Relation = function(type, intimacy, positivity, primary, secondary) {
	this.type = type || "equal";
	this.intimacy = intimacy || 0;
	this.positivity = positivity || 0;
	this.primary = primary;
	this.secondary = secondary;

}