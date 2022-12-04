//doel: via ajax een item toevoegen aan wishlist zonder te redirecten naar nieuwe page

/*
var output = document.getElementById("quantity")

$(document).ready(function(itemId, size, quantity){

    //om data van een item in te laden
    function loadItem(){
        $.ajax({
            url : '/catalog/item/'+itemId,
            type : 'GET',
            success : function(data) {
                //$('#imagePath').html(data.imagePath);
                //$('#quantity').html(data.quantity);
                output.innerHTML = data.quantity;
            }
        });
    }
  
    loadItem();
  
    //var output = document.getElementById("quantity")

    var buttonAddOne = document.getElementById("addOne").onclick = function (itemId, size) {
        console.log("addOneButtonClicked");
        var quantity = this.quantity - 1;
        $ajax({
            url : '/catalog/item/'+itemId+'/addOne',
            type : 'POST',
            data : {item_id:itemId, size:size},
            success : function(data) {
                output.innerHTML = quantity;
                $("#error").text(data);
            }
        });
    }
    
    */

    document.getElementById("addOne").addEventListener("click", (event) => {
        var itemId = event.target.getAttribute("itemId");
        var size = event.target.getAttribute("size");
        console.log(itemId);
        console.log(size);
        //console.log(event.target.value);
        const httpRequest = new XMLHttpRequest();
        httpRequest.onload = function() {
            if (httpRequest.status === 200) {
                console.log(httpRequest.responseText);
              } else {
                console.log('There was a problem with the request.');
              }
        }
        httpRequest.open("POST", '/catalog/item/'+`itemId`+'/addOne', true);
        httpRequest.setRequestHeader('Content-Type', "application/x-www-form-urlencoded")
        httpRequest.send('itemId='+itemId+'&size='+size);
    });

















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
