exports.save = function(article, db, cb) {
	var Article = db.models.Article;
	new Article({
		author : 'albertshaw',
		title : article.aname,
		content : article.acontent,
		asummary : article.asummary
	}).save(function(error, result) {
		if (error) {
			cb(error);
		}else{
			cb(null, result);
		}
	});
};