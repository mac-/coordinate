var assert = require('assert'),
	Router = require('../../lib'),
	mockWindow;

describe('coordinate tests', function() {

	beforeEach(function() {
		mockWindow = {
			location: {
				pathname: '/',
				hash: '#/'
			},
			history: {
				pushState: function(obj, title, path) {
					mockWindow.location.pathname = path;
				}
			}
		};
	});

	afterEach(function() {
		var router = Router.getInstance();
		router.reset();
	});

	describe('initialize()', function() {

		it('should initialize successfully', function(done) {
			var router = Router.getInstance(),
				changeHandler = function(data) {
					assert.strictEqual(data.route, '/');
					assert(data.params);
					assert(data.context);
					assert(data.history);
					router.removeAllListeners('change');
					done();
				};

			router.on('change', changeHandler);
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });
		});

		it('should fail initialization when no parameters are provided', function(done) {
			var router = Router.getInstance();
			assert.throws(function() {
				router.initialize({});
			})
			done();
		});

		it('should fail initialization when no routes are provided', function(done) {
			var router = Router.getInstance();
			assert.throws(router.initialize)
			done();
		});
	});

	describe('watch for path changes', function() {

		it('should go to route when path changes when using the history path strategy', function(done) {
			var router = Router.getInstance(),
				changeHandler = function(data) {
					assert(data.route);
					assert(data.params);
					assert(data.context);
					assert(data.history);
					if (router.getCurrentRoute() === '/fnord') {
						router.removeAllListeners('change');
						done();
					}
				};

			router.on('change', changeHandler);
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });
			// simulate browser calling onpopstate when router changes the pathname
			mockWindow.onpopstate();

			mockWindow.location.pathname = '/fnord';
			mockWindow.onpopstate();
		});

		it('should go to route when path changes when using the hash path strategy', function(done) {
			var router = Router.getInstance(),
				changeHandler = function(data) {
					assert(data.route);
					assert(data.params);
					assert(data.context);
					assert(data.history);
					if (router.getCurrentRoute() === '/fnord') {
						router.removeAllListeners('change');
						done();
					}
				};

			router.on('change', changeHandler);
			router.initialize({ routes: ['/', '/fnord'], useHash: true, root: '/', _window: mockWindow });
			// simulate browser calling onhashchange when router changes the pathname
			mockWindow.onhashchange();

			mockWindow.location.hash = '#/fnord';
			mockWindow.onhashchange();
		});
	});

	describe('go()', function() {

		it('should throw an error if router hasn\'t been initialized', function(done) {
			var router = Router.getInstance();
			assert.throws(function() {
				router.go('/fnord');
			});
			done();
		});

		it('should emit an error when no path is provided', function(done) {
			var router = Router.getInstance();
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });

			router.on('error', function(error) {
				assert(error instanceof Error);
				router.removeAllListeners('error');
				done();
			});
			assert(!router.go());
		});

		it('should emit an error when no routes were found for a given path', function(done) {
			var router = Router.getInstance();
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });

			router.on('error', function(error) {
				assert(error instanceof Error);
				router.removeAllListeners('error');
				done();
			});
			assert(!router.go('/nada'));
		});

		it('should return false when the route that was found for a given path is the current path', function(done) {
			var router = Router.getInstance();
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });
			assert(!router.go('/'));
			done();
		});

		it('should emit change event when a route was found for a given path', function(done) {
			var path = '/fnord',
				router = Router.getInstance(),
				changeHandler = function(data) {
					assert(data.route);
					assert(data.params);
					assert(data.queryObj);
					assert(data.context);
					assert(data.history);
					if (data.path === path) {
						router.removeAllListeners('change');
						done();
					}
				};

			router.on('change', changeHandler);
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });
			
			// wait til change propagates before changing path
			setTimeout(router.go.bind(router, path), 25);
		});

		it('should emit change event when a route was found for a given path that contains query params', function(done) {
			var path = '/fnord',
				query = '?data=somedata',
				router = Router.getInstance(),
				changeHandler = function(data) {
					assert(data.route);
					assert(data.params);
					assert(data.path);
					assert(data.queryObj);
					assert(data.context);
					assert(data.history);

					// simulate browser behavior when path changes
					mockWindow.onpopstate();

					if (data.route === path) {
						router.removeAllListeners('change');
						assert(data.path + '?' + data.queryString === path + query);
						assert(data.queryObj.data === 'somedata');
						done();
					}
				};

			router.on('change', changeHandler);
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });
			
			// wait til change propagates before changing path
			setTimeout(router.go.bind(router, path + query), 25);
			
		});
	});

	describe('back()', function() {

		it('should throw an error if router hasn\'t been initialized', function(done) {
			var router = Router.getInstance();
			assert.throws(function() {
				router.back();
			});
			done();
		});

		it('should return false if there is no route to go back to', function(done) {
			var router = Router.getInstance();
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });
			router.on('change', function() {
				router.removeAllListeners('change');
				assert(!router.back());
				done();
			});
			
		});

		it('should emit change event when the last route is found', function(done) {
			var router = Router.getInstance(),
				lastRoute,
				changeHandler = function(data) {
					assert(data.route);
					assert(data.params);
					assert(data.context);
					assert(data.history);

					// simulate browser behavior when path changes
					mockWindow.onpopstate();

					if (lastRoute === '/fnord' && router.getCurrentRoute() === '/') {
						router.removeAllListeners('change');
						done();
					}
					lastRoute = router.getCurrentRoute();
				};

			router.on('change', changeHandler);
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });

			setTimeout(router.go.bind(router, '/fnord'), 25);
			setTimeout(router.back.bind(router), 50);
		});
	});

	describe('getCurrentRoute()', function() {

		it('should throw an error if router hasn\'t been initialized', function(done) {
			var router = Router.getInstance();
			assert.throws(function() {
				router.getCurrentRoute();
			});
			done();
		});

		it('should return the current route', function(done) {
			var router = Router.getInstance();
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });
			assert(router.getCurrentRoute() === '/');
			done();
		});
	});

	describe('getHistory()', function() {

		it('should throw an error if router hasn\'t been initialized', function(done) {
			var router = Router.getInstance();
			assert.throws(function() {
				router.getHistory();
			});
			done();
		});

		it('should return the history', function(done) {
			var router = Router.getInstance();
			router.initialize({ routes: ['/', '/fnord'], useHash: false, root: '/', _window: mockWindow });
			var history = router.getHistory();
			assert(history[0] === '/');
			assert(history.length === 1);
			done();
		});
	});

});