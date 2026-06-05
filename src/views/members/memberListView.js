const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function statusBadge(status) {
    return `<span class="badge badge-${escapeHtml(status)}">${escapeHtml(status)}</span>`;
}

function memberListView({ members, clubs, filters = {} }) {
    const rows = members.map((member) => `
        <tr>
            <td>${member.id}</td>
            <td>${escapeHtml(member.name)}</td>
            <td>${escapeHtml(member.email)}</td>
            <td>${escapeHtml(getClubName(clubs, member.clubId))}</td>
            <td>${statusBadge(member.status)}</td>
            <td>${escapeHtml(member.participationCount)}</td>
            <td>${escapeHtml(member.lastParticipatedAt || "-")}</td>
            <td class="actions">
                <a class="button secondary" href="/members/${member.id}/edit">Edit</a>
                <form method="POST" action="/members/${member.id}/participation" style="padding:0;margin:0;background:transparent;">
                    <button type="submit">Mark Participation</button>
                </form>
                <form method="POST" action="/members/${member.id}/delete" style="padding:0;margin:0;background:transparent;">
                    <button class="danger" type="submit">Delete</button>
                </form>
            </td>
        </tr>
    `).join("");

    const clubOptions = clubs.map((club) => `
        <option value="${club.id}" ${String(filters.clubId || "") === String(club.id) ? "selected" : ""}>
            ${escapeHtml(club.name)}
        </option>
    `).join("");

    return mainLayout("Members", `
        <div class="toolbar">
            <div>
                <h2>Member Management</h2>
                <p class="muted">Club leaders can add, update, remove members, and track participation plus status.</p>
            </div>
            <div class="actions">
                <form method="GET" action="/members" class="inline-filter">
                    <select name="clubId">
                        <option value="">All clubs</option>
                        ${clubOptions}
                    </select>
                    <button type="submit">Filter</button>
                </form>
                <a class="button" href="/members/new${filters.clubId ? `?clubId=${encodeURIComponent(filters.clubId)}` : ""}">Add Member</a>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Club</th>
                    <th>Status</th>
                    <th>Participation</th>
                    <th>Last Participation</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${rows || "<tr><td colspan='8'>No members found.</td></tr>"}</tbody>
        </table>
    `);
}

function getClubName(clubs, clubId) {
    const club = clubs.find((item) => String(item.id) === String(clubId));
    return club ? club.name : `Club #${clubId}`;
}

module.exports = memberListView;
