var seconds = 5;
var counter = document.getElementById("clock");

counter.innerHTML = seconds + ' seconds.';

setInterval(function () {
    seconds--;
    counter.innerHTML = seconds + ' seconds.';
    if (seconds == 1) {
        counter.innerHTML = seconds + ' second.';
    }
    if (seconds == 0) {
        window.location.href = '/'
    }
},1000)