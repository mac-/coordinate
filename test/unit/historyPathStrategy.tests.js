var assert = require('assert'),
	HistoryPathStrategy = require('../../lib/historyPathStrategy'),
	mockWindow;

describe('historyPathStrategy tests', function() {
	var historyPathStrategy;

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


	describe('new HistoryPathStrategy()', function() {

		it('should emit change events when constructed using the default root', function(done) {
			var toPath = '/fnord';
			historyPathStrategy = new HistoryPathStrategy({ _window: mockWindow });
			historyPathStrategy.on('change', function(newPath, oldPath) {
				assert.strictEqual(newPath, toPath);
				assert.strictEqual(oldPath, '/');
				done();
			});

			mockWindow.location.pathname = toPath;
			mockWindow.onpopstate();
		});

		it('should emit change events when constructed using a specified root', function(done) {
			var root = '/fnord/1234';
			mockWindow.location.pathname = root;

			var toPath = '/fnord';
			historyPathStrategy = new HistoryPathStrategy({ root: root, _window: mockWindow });
			historyPathStrategy.on('change', function(newPath, oldPath) {
				assert.strictEqual(newPath, toPath);
				assert.strictEqual(oldPath, '/');
				assert.strictEqual(mockWindow.location.pathname, root + toPath);
				done();
			});

			mockWindow.location.pathname = root + toPath;
			mockWindow.onpopstate();
		});

		it('should throw an error if the configured root cannot be found on the current path', function(done) {
			var root = '/fnord/1234';
			mockWindow.location.pathname = '/nothing';

			assert.throws(function() {
				historyPathStrategy = new HistoryPathStrategy({ root: root, _window: mockWindow });
			});
			done();
		});
		
	});

	describe('getCurrentPath()', function() {

		it('should get the current path', function(done) {
			mockWindow.location.pathname = '/fnord';

			historyPathStrategy = new HistoryPathStrategy({ _window: mockWindow });
			var path = historyPathStrategy.getCurrentPath();
			assert.strictEqual(path, '/fnord');
			done();
		});

	});

	describe('changePath()', function() {

		it('should change the current path', function(done) {
			historyPathStrategy = new HistoryPathStrategy({ _window: mockWindow });
			historyPathStrategy.changePath('/fnord');

			// simulate browser beahvior when hash changes
			mockWindow.onpopstate();

			assert.strictEqual(mockWindow.location.pathname, '/fnord');
			done();
		});
	});
});