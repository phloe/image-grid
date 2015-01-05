// Simplify crossbrowser event handling.

var win = window;

// Assume `addEventListener` support. 
var add = function (element, event, func) {
	element.addEventListener(event, func);
};

// Only use `attachEvent` if is not supported `addEventListener`.
if (!win.addEventListener && win.attachEvent) {
	add = function (element, event, func) {
		element.attachEvent("on" + event, func);
	};
}

// Assume `removeEventListener` support. 
var remove = function (element, event, func) {
	element.removeEventListener(event, func);
};

// Only use `detachEvent` if is not supported `removeEventListener`.
if (!win.removeEventListener && win.detachEvent) {
	remove = function (element, event, func) {
		element.detachEvent("on" + event, func);
	};
}

module.exports = {
	add: add,
	remove: remove
};