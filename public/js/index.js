$(document).ready(function() {
    $('#offcanvastoggle').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
    $('#article-catalog h2').tooltip({
        animation : false,
    });
});