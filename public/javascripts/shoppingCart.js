$(document).on('click','#cart_id',function(e){

    e.preventDefault();
    var id = $(this).data('id');
      $.ajax({
          type: "GET",
          data: id,
          url: '/add-to-cart-forward/' + id, 
          success: function() {
            console.log(id)
         }
      });
  });
