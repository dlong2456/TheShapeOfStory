//This defines aspects of a relationship between two entities
var Relation = function(type, intimacy, positivity, primary, secondary) {
	this.type = type || "equal";
	this.intimacy = intimacy || 0;
	this.positivity = positivity || 0;
	this.primary = primary;
	this.secondary = secondary;
}