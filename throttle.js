// A function that adds that wraps `func` and adds dynamic throttling.
// Useful for events that fire rapidly like onscroll and onresize. 

module.exports = function (func) {

	var timer, last, fire;
	var base = 16;
	var delay = base;

	function timeout () {
		timer = clearTimeout(timer);
		delay = (base + (+new Date) - last) / 2;

		if (fire) {
			fire = false;
			func();
		}
	}

	return function () {
		if (!timer) {
			var now = +new Date;
			if (last && last + delay < now) {
				delay = base;
			}
			last = now;
			timer = setTimeout(timeout, delay);
			func();
		}
		else if (!fire) {
			fire = true;
		}
	};

};