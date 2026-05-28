const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function userFormView({ user = {}, action, title, showPassword = false }) {
    return mainLayout(title, `
        <h2>${title}</h2>
        <form method="POST" action="${action}">
            <label>Name</label>
            <input name="name" value="${escapeHtml(user.name || "")}" required>

            <label>Email</label>
            <input type="email" name="email" value="${escapeHtml(user.email || "")}" required>

            ${showPassword ? `
                <label>Password</label>
                <input type="password" name="password" minlength="6" required>
            ` : ""}

            <label>Role</label>
            <select name="role">
                <option value="member" ${user.role === "member" ? "selected" : ""}>Member</option>
                <option value="club_leader" ${user.role === "club_leader" ? "selected" : ""}>Club Leader</option>
                <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
            </select>

            <label>Phone</label>
            <input name="phone" value="${escapeHtml(user.phone || "")}">

            <label>Address</label>
            <textarea name="address">${escapeHtml(user.address || "")}</textarea>

            <div class="actions" style="margin-top:16px;">
                <button type="submit">Save</button>
                <a class="button secondary" href="/users">Cancel</a>
            </div>
        </form>
    `);
}

module.exports = userFormView;
