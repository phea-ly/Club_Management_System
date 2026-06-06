const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function clubListView(clubs = [], currentUser = null) {
    const canCreateClub = currentUser && ["admin", "club_leader"].includes(String(currentUser.role || "").toLowerCase());
    const canJoinClub = currentUser && String(currentUser.role || "").toLowerCase() === "member";
    const rows = clubs.map((club) => `
        <tr>
            <td>${escapeHtml(club.id)}</td>
            <td>${escapeHtml(club.name || "")}</td>
            <td>${escapeHtml(club.category || "-")}</td>
            <td>${escapeHtml(getLeaderName(club.leader) || "-")}</td>
            <td>${escapeHtml(club.isActive ? "active" : "inactive")}</td>
            <td class="actions">
                ${canJoinClub ? `
                    <form method="POST" action="/clubs/${club.id}/join" style="padding:0;margin:0;background:transparent;">
                        <input type="hidden" name="name" value="${escapeHtml(currentUser.name)}">
                        <input type="hidden" name="email" value="${escapeHtml(currentUser.email || "")}">
                        <input type="hidden" name="reason" value="Student joining club">
                        <button type="submit">Join</button>
                    </form>
                ` : ""}
            </td>
        </tr>
    `).join("");

    return mainLayout("Clubs", `
        <div class="toolbar">
            <div>
                <h2>Club Management</h2>
                <p class="muted">Admins and club leaders can access the club API and manage club records.</p>
            </div>
            ${canCreateClub ? `<a class="button" href="/clubs/new">Create Club</a>` : ""}
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Leader</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${rows || "<tr><td colspan='6'>No clubs found.</td></tr>"}</tbody>
        </table>
    `, { currentUser });
}

function getLeaderName(leader) {
    if (!leader) {
        return "";
    }

    if (typeof leader === "string") {
        try {
            const parsed = JSON.parse(leader);
            return parsed && typeof parsed === "object" ? String(parsed.name || "") : String(leader || "");
        } catch (_error) {
            return String(leader || "");
        }
    }

    if (typeof leader === "object") {
        return String(leader.name || "");
    }

    return String(leader || "");
}

module.exports = clubListView;
