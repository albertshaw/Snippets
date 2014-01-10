var home = require('../routes').index;
var blog = require('../routes/blog');

exports.configure = function(app){
    app.get('/', home);
    app.get('/blogs', blog.list);
    app.get('/blog/get/:year/:month/:title', blog.getBlog);
    app.get('/blog/new', blog.getEditor);
    app.get('/blog/help', blog.getHelper);

    app.get('/blog/edit', blog.getEditor);
    app.post('/blog/save', blog.save);
};