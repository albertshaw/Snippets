var home = require('../routes').index;
var article = require('../routes/article');

exports.configure = function(app){
    app.get('/', home);
    app.get('/articles', article.list);
//    app.param('aid', /^\w+$/);
    app.get('/article/get/:aid', article.getArticle);
    app.get('/article/new', article.getEditor);
    app.get('/article/help', article.getHelper);

    app.get('/article/edit', article.getEditor);
    app.post('/article/save', article.save);
};