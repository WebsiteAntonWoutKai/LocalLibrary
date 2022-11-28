var output = document.getElementById("value")

var slider = document.getElementById("range").oninput = function () {

    var value = (this.value - this.min) / (this.max - this.min) * 100
    output.innerHTML = this.value;

}

