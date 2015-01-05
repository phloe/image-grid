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