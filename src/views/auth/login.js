const form = document.getElementById("loginForm");
const button = document.getElementById("loginButton");
const message = document.getElementById("message");

const showMessage = (text, type) => {
    message.textContent = text;
    message.className = `message ${type}`;
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    button.disabled = true;
    showMessage("Checking login...", "");

    const formData = new FormData(form);
    const payload = {
        email: formData.get("email"),
        password: formData.get("password")
    };

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            showMessage(result.message || "Login failed", "error");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(result.user));
        showMessage(result.message || "login successfully", "success");

        if (result.user.role === "ADMIN") {
            window.location.href = "/admin";
            return;
        }

        if (result.user.role === "CLUB_LEADER") {
            window.location.href = "/leader";
            return;
        }

        window.location.href = "/users";
    } catch (error) {
        showMessage("Cannot connect to server", "error");
    } finally {
        button.disabled = false;
    }
});
