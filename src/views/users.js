const logoutButton = document.getElementById("logoutButton");
const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
    window.location.href = "/login";
}

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
});
