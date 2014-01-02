var express = require('express');
var path = require('path');
var settings = require('./settings').config;
var db = require('./db-config');
var RedisStore = require('connect-redis')(express);
var dot = require('../express-dot');

exports.configure = function(app) {
    app.configure("development", function() {
        app.use(express.logger('dev'));
        app.use(express.errorHandler());
    });
    app.configure("production", function() {
        app.use(express.compress());
        app.use(function(req, res, next) {
            res.removeHeader('X-Powered-By');
            next();
        });
    });
    // all environments
    app.configure(function() {
        app.use(express.cookieParser());

        app.use(express.session({
            secret : settings.SESSION_SECRET,
            store : new RedisStore(),
            key : 'XiaoLS',
            cookie : {
                maxAge : 60000 * 60 * 24
            }
        }));
        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(__dirname, '..', 'views'));
        app.set("view engine", "dot");
        app.engine("dot", dot.__express);
        app.use(express.favicon(path.join(__dirname, '..', 'public/img/favicon.ico')));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(db.configure());
        app.use(app.router);
        app.use(express.static(path.join(__dirname, '..', 'public')));
    });

};