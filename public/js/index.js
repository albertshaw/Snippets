(function() {
    var post_list_template = doT
            .template('{{~it.blogs:value:index}}'
                    + '<div class="col-6 col-sm-6 col-lg-4">'
                    + '<h2 title="Heading">{{=value.title}}</h2>'
                    + '<p>{{=value.summary}}</p>'
                    + '<p><a class="btn btn-default" href="{{=it.urls[index]}}" role="button">View details &raquo;</a></p>'
                    + '</div>' + '{{? (index+1)%3===0 }}' + '<div class="clearfix"></div>' + '{{?}}{{~}}');
    var startPos = 0;
    $('#offcanvastoggle').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
    /*
     * $('#blog-list h2').tooltip({ animation : false, });
     */
    $.ajax({
        type : "GET",
        url : "blogs",
        data : {
            startPos : startPos
        },
        success : function(data) {
            startPos = data.currentPos;
            if (data.blogs.length) {
                $('#blog-list').append(post_list_template(data));
            }
        }
    });
})(jQuery);