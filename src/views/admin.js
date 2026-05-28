const logoutButton = document.getElementById("logoutButton");
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

if (!loggedInUser) {
    window.location.href = "/login";
}

if (loggedInUser && loggedInUser.role !== "ADMIN") {
    window.location.href = "/users";
}

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
});
