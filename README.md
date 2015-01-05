image-grid
==========

> Fast minimalist image-grid.

Layout elements with known aspect ratios in a grid as known from [flickr](https://www.flickr.com/explore) or [google image search](https://www.google.dk/search?q=image-grid&tbm=isch).
Elements can be either raw or wrapped images with `width` and `height` attributes - or wrapper elements with a `data-ratio` attribute.

* _Very_ fast due to using managed stylesheets instead of inline styles.
* No library dependencies.
* And - oh yeah, it's fast!

[DEMO](http://rasmusfl0e.github.io/image-grid/)

## Usage
image-grid will handle the layout of images in a container.

### HTML

```html
<div class="container">
    <img width="400" height="400" src="http://lorempixel.com/400/400?2" />
    <img width="520" height="400" src="http://lorempixel.com/520/400?3" />
    <img width="400" height="400" src="http://lorempixel.com/400/400?4" />
    <img width="440" height="400" src="http://lorempixel.com/440/400?5" />
    <img width="360" height="400" src="http://lorempixel.com/360/400?6" />
    <img width="400" height="400" src="http://lorempixel.com/400/400?7" />
    <img width="360" height="400" src="http://lorempixel.com/360/400" />
    <img width="600" height="400" src="http://lorempixel.com/600/400" />
    <img width="480" height="400" src="http://lorempixel.com/480/400" />
    <img width="520" height="400" src="http://lorempixel.com/520/400" />
    <img width="560" height="400" src="http://lorempixel.com/560/400" />
    <img width="480" height="400" src="http://lorempixel.com/480/400?13" />
    <img width="560" height="400" src="http://lorempixel.com/560/400?14" />
    <img width="320" height="400" src="http://lorempixel.com/320/400?15" />
    <img width="480" height="400" src="http://lorempixel.com/480/400?16" />
    <img width="440" height="400" src="http://lorempixel.com/440/400?17" />
    <div>
    	<img width="520" height="400" src="http://lorempixel.com/520/400?18" />
    </div>
    <div data-ratio="16-9">
    	<img src="http://lorempixel.com/800/450?19" />
    </div>
</div>
```

### JS

```js
var grid = require("image-grid");

// Create a new image-grid.

var myImageGrid = grid(".container", {
	maxHeight: 200,
	margin: 1,
	callback: function () {
		// do stuff because layout changed.
	}
});

// Set new options

myImageGrid.set({
	margin: 10
});

// Deactivate the grid before removing it from the DOM.

myImageGrid.deactivate();
myImageGrid.container.parentNode.removeChild(myImageGrid.container);
```

## API

### imageGrid
Create an image-grid to handle the layout of images in a container.

##### Arguments

* `selector` (string) - The selector of the image-grid container element.
* `options`
   * `maxHeight` (number) - Optional. The maximum height of each row of images in the grid. Default is `100`. 
   * `margin` (number) - Optional. The margin between images in the grid. Default is `10`. 
   * `callback` (function) - Optional. This callback will be called everytime the layout is re-rendered. Default is null.

##### Returns
An image-grid instance.


### image-grid instance methods

#### #.set
Can be used to change options after instance creation.

##### Arguments

* `options` See imageGrid `options` argument.


#### #.render
Can be called to refresh the layout manually.


##### Arguments

* `force` (boolean) - Optional. .


#### #.deactivate
Deactivates the grid and removes the stylesheet for the instance and events if necessary.

#### #.activate
Re-active deactivated instance.

