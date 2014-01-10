var path = require('path');
var blogdb = require('../dbc/blogdb');
var marked = require('marked');
var moment = require('moment');

exports.list = function(req, res) {
    blogdb.list(req.query.startPos, req.db, function(error, result) {
        if (error) {
            req.next(error);
        } else {
            var urls = [];
            for (var idx = 0; idx < result.blogs.length; idx++) {
                var mo = moment(result.blogs[idx].createdate);
                urls.push("blog/get/" + mo.format("YYYY/MM/") + result.blogs[idx].title + ".html");
            }
            result.urls = urls;
            res.json(result);
        }
    });
};

exports.getBlog = function(req, res) {
    if (!~req.url.search(/\.html?$/)) {
        req.next();
    } else if (req.blogcache[req.url]) {
        res.send(req.blogcache[req.url]);
    } else {
        blogdb.get(req.params, req.db, function(error, result) {
            if (error) {
                req.next(error);
            } else {
                result.content = marked(result.content);
                res.render("blog", result, function(error, result) {
                    if (error) {
                        req.next(error);
                    } else {
                        req.blogcache[req.url] = result;
                        res.send(result);
                    }
                });
            }
        });
    }
};

exports.getEditor = function(req, res) {
    res.render("editor", {
        blog : {}
    });
};

exports.getHelper = function(req, res) {
    res.sendfile(path.join(__dirname, '..', 'public/assets/markdown.txt'));
};

exports.save = function(req, res) {
    blogdb.save(req.body, req.db, function(err, result) {
        if (err) {
            req.next(err);
        } else {
            res.redirect('/');
        }
    });
};
