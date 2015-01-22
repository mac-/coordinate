var util = require('util'),
	EventEmitter = require('events').EventEmitter;

function HashPathStrategy(config) {
	config = config || {};
	var self = this,
		root = (config.root) ? config.root.replace(/^([^\/])/, '/$1').replace(/([^\/])$/, '$1/') : '/', //ensure leading slash and trailing slash
		win = config._window || window, // inject window for unit testing
		currentPath,
		isManualChange = false,
		changeHandler = function() {
			if (isManualChange) {
				isManualChange = false;
				return;
			}
			var newPath = self.getCurrentPath();
			self.emit('change', newPath, currentPath);
			currentPath = newPath;
		};

	root = root.replace(/^\/+|\/+$/g, '/'); //ensure leading slash and no trailing slash
	win.onhashchange = changeHandler;

	this.getCurrentPath = function() {
		if (win.location.pathname !== root) {
			throw new Error('Unexpected root path: ' + win.location.pathname);
		}
		return win.location.hash.substr(1) || '/';
	};

	this.changePath = function(path) {
		// if we are already on this path, don't try to change it
		if (win.location.hash !== '#' + path) {
			isManualChange = true;
			win.location.hash = '#' + path;
		}
	};

	currentPath = this.getCurrentPath();
}

util.inherits(HashPathStrategy, EventEmitter);

module.exports = HashPathStrategy;