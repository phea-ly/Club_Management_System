const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function passwordView(user, currentUser = null) {
    return mainLayout("Change Password", `
        <h2>Change Password for ${escapeHtml(user.name)}</h2>
        <form method="POST" action="/profile/${user.id}/password">
            <label>New Password</label>
            <input type="password" name="newPassword" minlength="6" required>

            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" minlength="6" required>

            <div class="actions" style="margin-top:16px;">
                <button type="submit">Change Password</button>
                <a class="button secondary" href="/users">Back</a>
            </div>
        </form>
    `, { currentUser });
}

module.exports = passwordView;
