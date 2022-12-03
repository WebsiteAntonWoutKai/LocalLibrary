let popUp = document.getElementById("cookiePopup");
document.getElementById("acceptCookie").
    addEventListener("click", () => {
        popUp.classList.add("hideCookie");
        popUp.classList.remove("showCookie")
    });