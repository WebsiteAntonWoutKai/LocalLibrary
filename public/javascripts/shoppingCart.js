//doel: via ajax een item toevoegen aan wishlist zonder te redirecten naar nieuwe page



















//slecht code voor shopping cart
/*const { addOneItem } = require("../../controllers/itemController");

$(document).ready(function(itemInCart){
  var itemId = itemInCart.itemId;
  var size = itemInCart.size;
  var amount = itemInCart.amount;
  //om data van een item in te laden
  function loadItem(){
      $.ajax({
          url : '/catalog/item/'+itemId+'/cartDetail',
          type : 'GET',
          success : function(data) {
            $('#imagePath').html(data.imagePath);
            $('#category').html(data.category);
            $('#name').html(data.name);
          }
      });
  }

  loadItem();

  $("#addOneItem").click(function(event){
      event.preventDefault();
      var id = $(this).data('id');
      $.ajax({
          url : '/catalog/item/'+itemId+'/addOne',
          type : 'POST',
          data : {item_id:itemId, size:size},
          success : function(data) {
              loadItem();
              $("#error").text(data);
          }
      });
  });

  $(document).on("click","#removeOne",function(event){
    event.preventDefault();
    $.ajax({
        url : '/catalog/item/'+itemId+'/removeOne',
        type : 'POST',
        data : {item_id:itemId, size:size},
        success : function(data) {
            loadItem();
            $("#error").text(data);
        }
    });
});

  $(document).on("click","#remove",function(event){
      event.preventDefault();
      $.ajax({
          url : '/catalog/item'+itemId+'/remove',
          type : 'POST',
          data : {item_id:itemId, size:size, amount:amount},
          success : function(data) {
              loadItem();
              alert("Data Deleted Successfully");
          }
      });
  });
});*/
