const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function profileView(user) {
    return mainLayout("Update Profile", `
        <h2>Update Profile</h2>
        <form method="POST" action="/profile/${user.id}">
            <label>Name</label>
            <input name="name" value="${escapeHtml(user.name || "")}" required>

            <label>Phone</label>
            <input name="phone" value="${escapeHtml(user.phone || "")}">

            <label>Address</label>
            <textarea name="address">${escapeHtml(user.address || "")}</textarea>

            <div class="actions" style="margin-top:16px;">
                <button type="submit">Update Profile</button>
                <a class="button secondary" href="/users">Back</a>
            </div>
        </form>
    `);
}

module.exports = profileView;
