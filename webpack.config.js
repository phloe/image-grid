//var UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	target: "web",
	debug: false,
	entry: {
		index: "./index.js",
	},
	output: {
		path: "./dist/",
		filename: "[name].bundle.js",
		publicPath: "/dist/"
	},
	module: {
		loaders: [
			{ test: /\.css/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") }
		]
	},
	plugins: [
		//new UglifyJsPlugin(),
		new ExtractTextPlugin("[name].css")
	]
};