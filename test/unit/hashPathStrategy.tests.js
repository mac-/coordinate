var assert = require('assert'),
	HashPathStrategy = require('../../lib/hashPathStrategy'),
	mockWindow;

describe('hashPathStrategy tests', function() {
	var hashPathStrategy;

	beforeEach(function() {
		mockWindow = {
			location: {
				pathname: '/',
				hash: '#/'
			}
		};
	});

	describe('new HashPathStrategy()', function() {

		it('should emit change events when constructed using the default root', function(done) {
			var toPath = '/fnord';
			hashPathStrategy = new HashPathStrategy({ _window: mockWindow });
			hashPathStrategy.on('change', function(newPath, oldPath) {
				assert.strictEqual(newPath, toPath);
				assert.strictEqual(oldPath, '/');
				done();
			});

			mockWindow.location.hash = '#' + toPath;
			mockWindow.onhashchange();
		});

		it('should emit change events when constructed using a specified root', function(done) {
			var root = '/fnord/1234/';
			mockWindow.location.pathname = root;

			var toPath = '/fnord';
			hashPathStrategy = new HashPathStrategy({ root: root, _window: mockWindow });
			hashPathStrategy.on('change', function(newPath, oldPath) {
				assert.strictEqual(newPath, toPath);
				assert.strictEqual(oldPath, '/');
				assert.strictEqual(mockWindow.location.pathname, root)
				done();
			});

			mockWindow.location.hash = '#' + toPath;
			mockWindow.onhashchange();
		});

		it('should throw an error if the configured root cannot be found on the current path', function(done) {
			var root = '/fnord/1234/';
			mockWindow.location.pathname = '/nothing';

			assert.throws(function() {
				hashPathStrategy = new HashPathStrategy({ root: root, _window: mockWindow });
			});
			done();
		});
		
	});

	describe('getCurrentPath()', function() {

		it('should get the current path', function(done) {
			mockWindow.location.hash = '#/fnord';

			hashPathStrategy = new HashPathStrategy({ _window: mockWindow });
			var path = hashPathStrategy.getCurrentPath();
			assert.strictEqual(path, '/fnord');
			done();
		});

	});

	describe('changePath()', function() {

		it('should change the current path', function(done) {
			hashPathStrategy = new HashPathStrategy({ _window: mockWindow });
			hashPathStrategy.changePath('/fnord');

			// simulate browser beahvior when hash changes
			mockWindow.onhashchange();

			assert.strictEqual(mockWindow.location.hash, '#/fnord');
			done();
		});
	});
});