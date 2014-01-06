var path = require('path');
var articledbc = require('../dbc/article');

exports.list = function(req, res) {
    articledbc.list(req.query.startPos, req.db,function(error, result) {
        if (error) {
            req.next(error);
        } else {
            res.json(result);
        }
    });
};

exports.getArticle = function(req, res) {
    res.redirect('/');
};

exports.getEditor = function(req, res) {
    res.render("editor", {
        article : {}
    });
};

exports.getHelper = function(req, res) {
    res.sendfile(path.join(__dirname, '..', 'public/assets/markdown.txt'));
};

exports.save = function(req, res) {
    articledbc.save(req.body, req.db, function(err, result) {
        if (err) {
            req.next(err);
        } else {
            res.redirect('/');
        }
    });
};
