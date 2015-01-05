/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* include style via extract-text-webpack-plugin */
	var css = __webpack_require__(5);
	/* include style end */
	 
	var imageGrid = __webpack_require__(1);

	/* setup */

	(function setup (container, num) {
		var i = 0;
		while (i < num) {
			var img = document.createElement("img");
			var width = 400 + (Math.round(Math.random() * 30) * 10);
			var height = 400;
			img.setAttribute("width", width);
			img.setAttribute("height", height);
			img.setAttribute("src", "http://lorempixel.com/" + width + "/" + height +"?" + i);
			container.appendChild(img);
			//container.appendChild(document.createTextNode(" "));
			i++;
		}
	} (document.querySelector(".container"), 250));

	/* setup end */

	var instance;

	var maxHeight = document.getElementById("maxHeight");
	var maxHeightValue = document.getElementById("maxHeightValue");
	maxHeight.oninput = function () {
		maxHeightValue.innerHTML = this.value;
		instance.set({maxHeight: this.value});
	};

	var margin = document.getElementById("margin");
	var marginValue = document.getElementById("marginValue");
	margin.oninput = function () {
		marginValue.innerHTML = this.value;
		instance.set({margin: this.value});
	};

	var destroy = document.getElementById("destroy");
	destroy.onclick = function () {
		instance.deactivate();
	}

	var create = document.getElementById("create");
	create.onclick = function () {
		instance.activate();
	}

	instance = imageGrid(".container", {margin: margin.value, maxHeight: maxHeight.value});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var prefix = __webpack_require__(2);
	var events = __webpack_require__(3);
	var layout = __webpack_require__(4);
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var style = document.createElement("p").style;
	var prefixes = " -o- -ms- -moz- -webkit-".split(" ");

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (width, maxHeight, margin, ratios) {
		
		var availWidth; // avalable width for elements.
		var height = margin;
		var elements = [];
		var length = ratios.length;
		
		var _offset = 0; // current row index offset.
		var _weight = 0; // combined weight of ratios of row elements.
		var _height; // height of the current row.
		var _count; // number of elements in current row.
		var index = 0;
		
		// calculate rows and heights
		
		while (index < length) {
			_weight += ratios[index++];
			_count = index - _offset;
			
			availWidth = width - ((_count + 1) * margin);
			
			// calculate the current height for the row with rowWeight.
			_height = Math.round(availWidth / _weight);
			
			// if row height low enough calculate layout
			if (_height <= maxHeight || index === length) {
				
				var partial = (_height > maxHeight);
				if (partial) {
					_height = maxHeight;
				}
				var w, rounded;
				var decimals = [];
				var i = _offset;
				while (i < index) {
					w = ratios[i] * _height;
					rounded = Math.round(w);
					decimals.push({
						decimals: w - rounded,
						index: i
					});
					availWidth -= rounded;
					elements.push({
						x: 0,
						y: height,
						width: rounded,
						height: _height
					});
					i++;
				}
				
				// distribute available width.
				if (!partial && availWidth !== 0) {
					
					var inc = 1;
					if (availWidth < 0) {
						inc = -inc;
						availWidth = -availWidth;
					}
					
					decimals.sort(function (a, b) {
						return a.decimals - b.decimals;
					});
					
					if (inc > 0) {
						decimals.reverse();
					}
					 
					i = 0;
					while (availWidth) {
						elements[decimals[i].index].width += inc;
						availWidth--;
						i = (i < decimals.length) ? i + 1 : 0;
					}
					
				}
				
				// add x positions.
				i = _offset;
				var x = margin;
				while (i < index) {
					elements[i].x = x;
					x += elements[i].width + margin;
					i++;
				}
				
				height += _height + margin;
				
				// ready row variables for next row.
				_offset = index;
				_weight = 0;
			}
		}

		return {
			height: height,
			elements: elements
		};

	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])