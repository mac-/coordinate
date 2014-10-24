# coordinate

A router for client-side (browser) JS applications.

Features:
* implements the routing strategy from [HapiJS]() (uses [call]() under the covers)
* emits events instead of calling callbacks of function handlers when a route is hit
* supports using the url hash or the HTML5 history API


[![Build Status](https://secure.travis-ci.org/mac-/coordinate.png)](http://travis-ci.org/mac-/coordinate)
[![Coverage Status](https://coveralls.io/repos/mac-/coordinate/badge.png)](https://coveralls.io/r/mac-/coordinate)
[![NPM version](https://badge.fury.io/js/coordinate.png)](http://badge.fury.io/js/coordinate)
[![Dependency Status](https://david-dm.org/mac-/coordinate.png)](https://david-dm.org/mac-/coordinate)

[![NPM](https://nodei.co/npm/coordinate.png?downloads=true&stars=true)](https://nodei.co/npm/coordinate/)

## Contributing

This module makes use of a `Makefile` for building/testing purposes. After obtaining a copy of the repo, run the following commands to make sure everything is in working condition before you start your work:

	make install
	make test

Before committing a change to your fork/branch, run the following commands to make sure nothing is broken:

	make test
	make test-cov

Don't forget to bump the version in the `package.json` using the [semver](http://semver.org/spec/v2.0.0.html) spec as a guide for which part to bump. Submit a pull request when your work is complete.

***Notes:***
* Please do your best to ensure the code coverage does not drop. If new unit tests are required to maintain the same level of coverage, please include those in your pull request.
* Please follow the same coding/formatting practices that have been established in the module.

## Installation

	npm install coordinate

## Usage

This module assumes that you are using [browserify]() to bundle your client-side code.

To use the router, require it in and initialize it like so:

```js
var router = require('coordinate').getInstance(),
	routes = [ '/', '/users', '/users/{userId}' ];

router.on('change', function(data) {
	console.log(data.route);   // the string route that was hit
	console.log(data.params);  // an object that contains any path parameters
	console.log(data.context); // context data that was passed to the router.go method
	console.log(data.history); // an Array of strings that contain the past paths that were navigated to
});

router.initialize({ routes: routes });

```

## `initialize` Options

### `routes`

A collection of valid routes

Required.

### `root`

The root path that all routes are appended to. For example, if the root is set to '/api', and there is a route '/users', then the expected full path would either be '/api/users' or '/api/#/users' depending on whether it is using the URL hash or HTML5 history API.

Defaults to `'/'`

### `isCaseSensitive`

A flag that denotes whether the provided route paths should be considered case sensitive or not.

Defaults to `false`

### `useHash`

A flag that denotes whether or not to use the hash for route paths, or to use the HTML5 history API.

Defaults to `false`

# License

The MIT License (MIT)

