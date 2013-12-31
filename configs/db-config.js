var settings = require('./settings').config.db;
var mongoose = require('mongoose').createConnection(settings.DB_HOST, settings.OPTIONS);

exports.configure = function() {
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
        content : String
    });
    articleSchema.index({
        name : 1
    });
    mongoose.model('Article', articleSchema);
    return function(req, res, next) {
        req.mongoose = mongoose;
        next();
    };
};