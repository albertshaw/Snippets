var path = require('path');

exports.list = function(req, res) {
};

exports.getEditor = function(req, res) {
    res.render("editor", {});
};

exports.getHelper = function(req, res) {
    res.sendfile(path.join(__dirname, '..', 'public/assets/markdown.txt'));
};

exports.create = function(req,res) {
	console.log(req.body.article);
	res.redirect('/');
};