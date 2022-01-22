/*
$(document).ready(function() {
    //grab button with `delete-article` class
    $('.delete-article').click(function(e) {
        $target = $(e.target);
        console.log('$target.attr("data-id")' + $target.attr('data-id'));

        //grab article id from button data attribute
        // wich is declared as: a.btn.btn-danger.btn-sm.delete-article(href='#', data-id=article._id) Delete
        const articleId = $(this).attr('data-id');

        //make ajax call to delete article
        $.ajax({
            method: 'DELETE',
            url: '/article/' + articleId
        }).then(function(data) {
            //reload page
            //location.reload();
            alert('Article Deleted');
            window.location.href = '/';
        });
    });
});
*/


$(document).ready(function(){
  $('.delete-article').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/article/'+id,
      success: function(response){
        alert('Deleting Article');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});

