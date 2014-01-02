var settings = require('./settings').config.db;
var mongoose = require('mongoose');

exports.configure = function() {
	var db = mongoose.createConnection(settings.DB_HOST, settings.OPTIONS);
    var articleSchema = mongoose.Schema({
        createdate : {
            type : Date,
            'default' : Date.now
        },
        lastModDate : {
            type : Date,
            'default' : Date.now
        },
        author : String,
        title : {
            type : String,
            unique : true
        },
        content : String,
        summary : String
    });
    articleSchema.index({
        name : 1
    });
    db.model('Article', articleSchema);
    return function(req, res, next) {
        req.db = db;
        next();
    };
};