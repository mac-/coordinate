var util = require('util'),
	EventEmitter = require('events').EventEmitter;

function HistoryPathStrategy(config) {
	config = config || {};
	var self = this,
		root = (config.root) ? config.root.replace(/^([^\/])/, '/$1') : '/', //ensure leading slash and no trailing slash
		win = config._window || window, // inject window for unit testing
		currentPath,
		changeHandler = function() {
			var newPath = self.getCurrentPath();
			self.emit('change', newPath, currentPath);
			currentPath = newPath;
		};

	win.onpopstate = changeHandler;

	this.getCurrentPath = function() {
		if (win.location.pathname.indexOf(root) !== 0) {
			throw new Error('Unexpected root path: ' + win.location.pathname);
		}

		var path = win.location.pathname.replace(root, '');
		path = (path.indexOf('/') === 0) ? path : '/' + path;
		return path;
	};

	this.changePath = function(path) {
		var newPath = (root === '/') ? path : root + path;
		// if we are already on this path, don't try to change it
		if (newPath !== win.location.pathname) {
			win.history.pushState(null, null, newPath);
		}
	};

	currentPath = this.getCurrentPath();
}

util.inherits(HistoryPathStrategy, EventEmitter);

module.exports = HistoryPathStrategy;