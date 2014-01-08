(function() {
    var post_list_template = doT
            .template('{{~it.articles:value:index}}'
                    + '<div class="col-6 col-sm-6 col-lg-4">'
                    + '<h2 title="Heading">{{=value.title}}</h2>'
                    + '<p>{{=value.summary}}</p>'
                    + '<p><a class="btn btn-default" href="javascript:void(0)" role="button" data-id="{{=value._id}}">View details &raquo;</a></p>'
                    + '</div>' + '{{? (index+1)%3===0 }}' + '<div class="clearfix"></div>' + '{{?}}{{~}}');
    var startPos = 0;
    $('#offcanvastoggle').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
    /*
     * $('#article-list h2').tooltip({ animation : false, });
     */
    $.ajax({
        type : "GET",
        url : "articles",
        data : {
            startPos : startPos
        },
        success : function(data) {
            startPos = data.currentPos;
            if (data.articles.length) {
                $('#article-list').append(post_list_template(data));
            }
        }
    });
})(jQuery);