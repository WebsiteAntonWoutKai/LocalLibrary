//reload shopping cart item
//var outputQuantity = document.getElementById("quantity");

// function getQuantity (userId, itemId, size) {
//     const httpRequest = new XMLHttpRequest();
//     httpRequest.open("GET", '/catalog/user/'+`userId`+'/getQuantity', true);
//     httpRequest.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
//     httpRequest.onreadystatechange = function(data) {
//         if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
//             console.log("response server: " + httpRequest.responseText);
//             outputQuantity = data.innerHtml("quantity");
//         } else {
//             console.log('There was a problem with the request.');
//         }
//     }
//     httpRequest.send('itemId='+itemId+'&size='+size);
// };

//clear cart
document.getElementById("clearCart").onclick = function () {
    
}

//add one 
document.querySelectorAll("#addOne").forEach(item => {
    item.addEventListener("click", (event) => {
        var itemId = event.target.getAttribute("itemId");
        var size = event.target.getAttribute("size");
        //console.log(event.target.value);
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", '/catalog/item/' + `itemId` + '/addOne', true);
        httpRequest.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
                console.log(httpRequest.responseText);
            } else {
                console.log('There was a problem with the request.');
            }
        }
        httpRequest.send('itemId=' + itemId + '&size=' + size);
        setTimeout(function () {
            window.location.reload();
        }, 500);
    });
})


//remove one
document.querySelectorAll("#removeOne").forEach(item => {
    item.addEventListener("click", (event) => {
        var itemId = event.target.getAttribute("itemId");
        var size = event.target.getAttribute("size");
        console.log(itemId);
        console.log(size);
        //console.log(event.target.value);
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", '/catalog/item/' + `itemId` + '/removeOne', true);
        httpRequest.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        httpRequest.readyStateChange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
                console.log(httpRequest.responseText);
                //outputQuantity.innerHtml = httpRequest.responseText
            } else {
                console.log('There was a problem with the request.');
            }
        }
        httpRequest.send('itemId=' + itemId + '&size=' + size);
        setTimeout(function () {
            window.location.reload();
        }, 500);
    });
})


/*
document.getElementById("quantity").addEventListener("change",function(event) {
        var itemId = event.target.getAttribute("itemId");
        var size = event.target.getAttribute("size");
        var value = event.target.getAttribute("value");
        console.log(value);
        console.log(itemId);
        console.log(size);

        const httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", '/catalog/item/'+`itemId`+'/changeQuantity', true);
        httpRequest.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        httpRequest.readyStateChange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
                console.log(httpRequest.responseText);
            } else {
            console.log('There was a problem with the request.');
            }
    }
        httpRequest.send('itemId='+itemId+'&size='+size+'&newQuantity'+value);
    });
*/















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
