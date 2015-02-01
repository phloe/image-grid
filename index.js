/* include style via extract-text-webpack-plugin */
var css = require("image-grid/style.css");
/* include style end */
 
var imageGrid = require("image-grid");

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
} (document.querySelector(".container"), 50));

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