var prefix = require("./prefix");
var events = require("./events");
var layout = require("./layout");
//var throttle = require("./throttle");

var win = window;
var doc = document;
var head;

var instances = [];
var idPrefix = "image-grid-";
var transform = prefix("transform");
var uid = 0;
var active = false;

//var renderAllThrottled = throttle(renderAll);

function renderAll () {
	var i = 0;
	var l = instances.length;
	while (i < l) {
		instances[i++].render();
	}
}

function activate (instance) {
	var index = instances.indexOf(instance);
	if (index === -1) {
		instances.push(instance);
	}
	if (!instance.style.parentNode) {
		head.appendChild(instance.style);
	}
	if (!active) {
		events.add(win, "resize", renderAll);
		active = true;
	}
}

function deactivate (instance) {
	var index = instances.indexOf(instance);
	if (index > -1) {
		instance.style.parentNode.removeChild(instance.style);
		instances.splice(index, 1);
	}
	if (!instances.length && active) {
		events.remove(win, "resize", renderAll);
		active = false;
	}
}

var ImageGrid = function _init (container, options) {
	if (typeof container === "string") {
		container = doc.querySelector(container);
	}
	
	var style = doc.createElement("style");
	head.appendChild(style);
	
	var id = container.id;
	if (!id) {
		id = idPrefix + uid++; 
		container.id = id;
	}
	
	var elements = container.childNodes;
	var ratios = [];
	
	var i = elements.length;
	var count = 0;
	var element, width, height, img;
	while (i--) {
		element = elements[i];
		if (element.nodeType === 1) {
			count++;
			img = null;
			width = 16;
			height = 9;
			
			if (element.nodeName.toLowerCase() === "img") {
			   img = element;
			}
			else {
				ratio = element.getAttribute("data-ratio");
				if (ratio) {
					ratio = ratio.split("-");
					width = ratio[0];
					height = ratio[1];
				}
				else {
					img = element.querySelector("img");
				}
			}
			if (img) {
				width = img.getAttribute("width");
				height = img.getAttribute("height");
			}
			ratios.unshift(width / height);
		}
	}
	
	this.id = id;
	this.css = "";
	this.style = style;
	this.container = container;
	this.elements = elements;
	this.count = count;
	this.ratios = ratios;
	this.lastWidth;
	this.margin = 10;
	this.maxHeight = 100;
	if (options) {
		this.set(options);
	}
	else {
		this.render();
	}
	activate(this);
};

ImageGrid.prototype.set = function _set (options) {
	var changed;
	
	if ("maxHeight" in options && options.maxHeight !== this.maxHeight) {
		this.maxHeight = parseInt(options.maxHeight, 10);
		changed = true;
	}
	
	if ("margin" in options && options.margin !== this.margin) {
		this.margin = parseInt(options.margin, 10);
		changed = true;
	}
	
	if (typeof options.callback === "function" && options.callback !== this.callback) {
		this.callback = options.callback;
	}
	
	if (changed) {
		this.render(changed);
	}
	
	return this;
};

ImageGrid.prototype.render = function _render (force) {
	var width = this.container.offsetWidth;
	
	// bail fast if no change in width.
	if (!force && width === this.lastWidth) {
		return;
	}
	
	// calculate grid layout.
	
	var grid = layout(width, this.maxHeight, this.margin, this.ratios);
	
	// render CSS
	
	var id = this.id;
	
	var css = "#" + id + " { height: " + grid.height + "px; position: relative; padding: 0; }\n";
	css += "#" + id + " > * { margin: 0; position: absolute; }\n";
	
	var element;
	var elements = grid.elements;
	var l = elements.length;
	var i = 0;
	while (i < l) {
		element = elements[i++];
		css += "#" + id + " > :nth-child(" + i + ") { ";
		if (transform) {
			css += transform + ": translate3d(" + element.x + "px, " + element.y + "px, 0); ";
		}
		else {
			css +=  "left: " + element.x + "px; top: " + element.y + "px; ";
		}
		css +=  "width: " + element.width + "px; height: " + element.height + "px; }\n";
	}
	
	// apply CSS if necessary
	
	if (this.css !== css) {
		if ("textContent" in this.style) {
			this.style.textContent = css;
		}
		else {
			this.style.styleSheet.cssText = css;
		}
		this.css = css;
	}
	
	if (this.callback) {
		this.callback();
	}
	
	this.lastWidth = width;
	
	return this;
};

ImageGrid.prototype.activate = function _activate () {
	activate(this);
	
	return this;
};

ImageGrid.prototype.deactivate = function _deactivate () {
	deactivate(this);
	
	return this;
};

module.exports = function factory (container, options) {
	if (!head) {
		head = doc.head || doc.getElementsByTagName("head")[0];
	}
	return new ImageGrid(container, options);
};