document.getElementById("profile").innerText =
    window.sessionStorage.getItem("user-data").split(",")[1];
document.getElementById("play").onclick = function () {
    window.location.href = "game"
};
