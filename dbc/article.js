exports.save = function(article, db, cb) {
	var Article = db.models.Article;
	new Article({
		author : 'albertshaw',
		title : article.title,
		content : article.content,
		summary : article.summary
	}).save(function(error, result) {
		if (error) {
			cb(error);
		}else{
			cb(null, result);
		}
	});
};

exports.list = function(startPos, db, cb) {
    var Article = db.models.Article;
    startPos = Number(startPos)||0;
    Article.find().select('title summary _id').skip(startPos).limit(9).sort({
        createdate : -1
    }).exec(function(error,articles){
        cb(error, {
            currentPos:articles.length+startPos,
            articles:articles
        });
    });
};