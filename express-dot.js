var path = require('path');
var settings = require('./configs/settings').config;
var doT = require('dot').process({
	path : "./views"
});

function getFileName(filename) {
	var slashIndex = filename.lastIndexOf("\\"), dotIndex = filename
			.lastIndexOf(".");
	return filename.substring(slashIndex + 1, dotIndex);
}

function _renderFile(filename, options, cb) {
	'use strict';
	var name = getFileName(filename);
	var template = doT[name];
	if (template) {
		options.site = settings.site;
		options.env = process.env.NODE_ENV || 'development';
		return cb(null, template(options));
	} else {
		return cb(new Error(name + " is not found!"));
	}
}

exports.__express = function(filename, options, cb) {
	'use strict';
	cb = (typeof cb === 'function') ? cb : function() {
	};
	return _renderFile(filename, options, cb);
};