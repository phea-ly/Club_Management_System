const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function userListView(users, currentUser = null) {
    const rows = users.map((user) => `
        <tr>
            <td>${user.id}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.role)}</td>
            <td>${escapeHtml(user.phone || "-")}</td>
            <td class="actions">
                <a class="button secondary" href="/users/${user.id}/edit">Edit</a>
                <form method="POST" action="/users/${user.id}/delete" style="padding:0;margin:0;background:transparent;">
                    <button class="danger" type="submit">Delete</button>
                </form>
            </td>
        </tr>
    `).join("");

    return mainLayout("Users", `
        <div class="actions" style="justify-content:space-between;margin-bottom:18px;">
            <div>
                <h2>User Management</h2>
                <p class="muted">Administrators can create accounts, update users, and assign roles.</p>
            </div>
            <a class="button" href="/users/new">Create User</a>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${rows || "<tr><td colspan='6'>No users yet.</td></tr>"}</tbody>
        </table>
    `, { currentUser });
}

module.exports = userListView;
