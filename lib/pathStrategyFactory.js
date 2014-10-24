var HashPathStrategy = require('./hashPathStrategy'),
	HistoryPathStrategy = require('./historyPathStrategy');

module.exports = {
	getPathStrategy: function(type, config) {
		if (type.toLowerCase() === 'hash') {
			return new HashPathStrategy(config);
		}
		if (type.toLowerCase() === 'history') {
			return new HistoryPathStrategy(config);
		}
		throw new Error('Invalid Path Strategy: ' + type);
	}
};