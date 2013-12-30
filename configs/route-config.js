var home = require('../routes').index;
var user = require('../routes/user');
var article = require('../routes/article');

exports.configure = function(app){
    app.get('/', home);
    app.get('/users', user.list);
    app.get('/newarticle', article.getEditor);
    app.get('/articles', article.list);
    app.get('/article/help', article.getHelper);

    app.post('/createarticle', article.create);
};