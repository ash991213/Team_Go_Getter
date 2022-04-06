('.like-container > .feeling_a, .dislike-container  > .feeling_a').on('click', function() {
    event.preventDefault();
    ('.active').removeClass('active');
    (this).addClass('active');
});