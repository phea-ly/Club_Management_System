const form = document.getElementById("registerForm");
const button = document.getElementById("registerButton");
const message = document.getElementById("message");

const showMessage = (text, type) => {
    message.textContent = text;
    message.className = type;
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    button.disabled = true;
    showMessage("Creating account...", "");

    const formData = new FormData(form);
    const payload = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password")
    };

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            showMessage(result.message || "Register failed", "error");
            return;
        }

        showMessage(result.message || "register successfully", "success");
        setTimeout(() => {
            window.location.href = "/login";
        }, 800);
    } catch (error) {
        showMessage("Cannot connect to server", "error");
    } finally {
        button.disabled = false;
    }
});
