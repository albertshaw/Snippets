var path = require('path');
var articledbc = require('../dbc/article');

exports.list = function(req, res) {
};

exports.getArticle = function(req,res) {
    console.log(req.body.article);
    res.redirect('/');
};

exports.getEditor = function(req, res) {
    res.render("editor", {});
};

exports.getHelper = function(req, res) {
    res.sendfile(path.join(__dirname, '..', 'public/assets/markdown.txt'));
};

exports.save = function(req,res) {
    
	res.redirect('/');
};
