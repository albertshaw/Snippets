var home = require('../routes').index;
var blog = require('../routes/blog');

var auth = require('express').basicAuth(function(user, pass, callback) {
    var result = (user === '' && pass === '');
    callback(null, result);
});

exports.configure = function(app) {
    app.get('/', home);
    app.get('/home', home);
    app.get('/blogs', blog.list);
    app.get('/blog/get/:year/:month/:title', blog.getBlog);
    app.get('/blog/new', auth,blog.getEditor);
    app.get('/blog/help', blog.getHelper);
    app.get('/blog/edit/:year/:month/:title', auth,blog.getEditor);
    
    app.post('/blog/save', auth,blog.save);
};