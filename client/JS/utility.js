function copyOwnPropertiesFrom(target, source) {
	Object.getOwnPropertyNames(source).forEach(function(propKey) {
		var desc = Object.getOwnPropertyDescriptor(source, propKey);
		Object.defineProperty(target, propKey, desc);
	});

}

function subClasses(SubC, SuperC) {
	var subProto = Object.create(SuperC.prototype);
	copyOwnPropertiesFrom(subProto, SubC.prototype);
	SubC.prototype = subProto;
	subC.__super = SuperC.prototype;
};

/*
Sub._super = Super.prototype;
function Sub(prop1, prop2, prop3, prop4) {
    Sub._super.constructor.call(this, prop1, prop2);
    this.prop3 = prop3;
    this.prop4 = prop4;
}
Sub.prototype.methodB = function (x, y) {
    var superResult = Sub._super.methodB.call(this, x, y);
    return this.prop3 + ' ' + superResult;
}

*/