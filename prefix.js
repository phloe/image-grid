var style = document.createElement("p").style;
var prefixes = " -o -ms -moz -webkit".split(" ");

module.exports = function (property) {
	var i = 0;
	var l = prefixes.length
	while (i < l) {
		var name = prefixes[i++] + property;
		if (style[name] !== undefined) {
			return name;
		}
	}
	
	return false;
};