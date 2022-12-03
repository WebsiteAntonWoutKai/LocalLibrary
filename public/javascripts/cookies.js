let popUp = document.getElementById("cookiePopup");
document.getElementById("acceptCookie").
    addEventListener("click", () => {
        popUp.classList.add("hide");
        popUp.classList.remove("show")
    });