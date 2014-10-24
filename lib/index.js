var CallRouter = require('call').Router,
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	PathStrategyFactory = require('./pathStrategyFactory'),
	instance;


function Router() {
	var history = [],
		isCaseSensitive,
		router,
		pathStrategy,
		self = this;


	this.initialize = function(config) {
		if (!config || !config.routes || config.routes.length < 1) {
			throw new Error('Missing or invalid paramters');
		}

		isCaseSensitive = config.isCaseSensitive || false;
		router = new CallRouter({
			isCaseSensitive: isCaseSensitive
		});

		config.routes.forEach(function(route) {
			router.add({ method: 'get', path: route });
		});

		var pathStrategyName = (config.useHash) ? 'hash' : 'history';
		pathStrategy = PathStrategyFactory.getPathStrategy(pathStrategyName, { root: config.root, _window: config._window });
		pathStrategy.on('change', function(newPath) {
			self.go(newPath);
		});

		return self.go(pathStrategy.getCurrentPath());
	};

	this.go = function(path, context) {
		if (!router) {
			throw new Error('CallRouter has not been initialized yet.');
		}
		if (!path) {
			this.emit('error', new Error('No path was provided'));
			return false;
		}
		var callRoute = router.route('get', path);
		if (!callRoute || callRoute instanceof Error) {
			this.emit('error', new Error('No route is associated to path: ' + path));
			return false;
		}
		// don't route if the path is the same as the current one
		if (history.length > 0) {
			if (path === history[history.length-1]) {
				return false;
			}
		}
		history.push(path);
		pathStrategy.changePath(path);

		var eventData = {
			route: callRoute.route,
			params: (callRoute.params) ? callRoute.params : {},
			context: (context) ? context : {},
			history: history.slice(0) // clone
		};

		this.emit('change', eventData);
		return true;
	};

	this.back = function(context) {
		if (!router) {
			throw new Error('CallRouter has not been initialized yet.');
		}
		var lastPath;
		if (history.length <= 1) {
			return false;
		}
		history.pop();
		lastPath = history.pop();
		return this.go(lastPath, context);
	};

	this.getCurrentRoute = function() {
		if (!router) {
			throw new Error('CallRouter has not been initialized yet.');
		}
		return router.route('get', pathStrategy.getCurrentPath()).route;
	};

	this.getHistory = function() {
		if (!router) {
			throw new Error('CallRouter has not been initialized yet.');
		}
		return history.slice(0);
	};

	this.reset = function() {
		router = undefined;
		history = [];
		this.removeAllListeners();
		if (pathStrategy) {
			pathStrategy.removeAllListeners();
			pathStrategy = undefined;
		}
	};
}

util.inherits(Router, EventEmitter);


module.exports = {
	getInstance: function() {
		if (!instance) {
			instance = new Router();
		}
		return instance;
	}
};

