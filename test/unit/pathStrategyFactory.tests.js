var assert = require('assert'),
	HashPathStrategy = require('../../lib/hashPathStrategy'),
	HistoryPathStrategy = require('../../lib/historyPathStrategy'),
	PathStrategyFactory = require('../../lib/pathStrategyFactory'),
	mockWindow;

describe('pathStrategyFactory tests', function() {

	beforeEach(function() {
		mockWindow = {
			location: {
				pathname: '/',
				hash: '#/'
			}
		};
	});

	describe('getPathStrategy()', function() {

		it('should throw an error for an invalid path strategy', function(done) {
			assert.throws(function() {
				pathStrategy = PathStrategyFactory.getPathStrategy('fnord', { _window: mockWindow });
			});
			done();
		});

		it('should return an instance of HashPathStrategy', function(done) {
			pathStrategy = PathStrategyFactory.getPathStrategy('hash', { _window: mockWindow });
			assert(pathStrategy instanceof HashPathStrategy);
			done();
		});

		it('should return an instance of HistoryPathStrategy', function(done) {
			pathStrategy = PathStrategyFactory.getPathStrategy('history', { _window: mockWindow });
			assert(pathStrategy instanceof HistoryPathStrategy);
			done();
		});
		
	});
});