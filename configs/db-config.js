var settings = require('./settings').config.db;
var mongoose = require('mongoose');

exports.configure = function() {
	var db = mongoose.createConnection(settings.DB_HOST, settings.OPTIONS);
    var BlogSchema = mongoose.Schema({
        createdate : {
            type : Date,
            'default' : Date.now
        },
        lastmoddate : Date,
        author : {
            type:String,
            'default' : "John Doe"
        },
        authorsite : String,
        title : {
            type : String,
            unique : true
        },
        content : String,
        summary : String
    });
    db.model('Blog', BlogSchema);
    return function(req, res, next) {
        req.db = db;
        next();
    };
};