exports.save = function(blog, db, cb) {
    var Blog = db.models.Blog;
    new Blog({
        author : 'albertshaw',
        authorsite : 'https://github.com/albertshaw/',
        title : blog.title,
        content : blog.content,
        summary : blog.summary
    }).save(function(error, result) {
        if (error) {
            cb(error);
        } else {
            cb(null, result);
        }
    });
};

exports.list = function(startPos, db, cb) {
    var Blog = db.models.Blog;
    startPos = Number(startPos) || 0;
    Blog.find().select('title createdate summary').skip(startPos).limit(9).sort({
        createdate : -1
    }).exec(function(error, blogs) {
        cb(error, {
            currentPos : blogs.length + startPos,
            blogs : blogs
        });
    });
};

exports.get = function(params, db, cb) {
    var query = db.models.Blog.findOne({
        title : params.title.split(".")[0]
    }), year = Number(params.year) || 0, month = Number(params.month) || 0;
    if (year && month) {
        query.where("createdate").gte(new Date(year, month-1)).lt(new Date(year, month));
    }
    query.exec(cb);
};