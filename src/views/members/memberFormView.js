const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function memberFormView({ member = {}, clubs = [], action, title, currentUser = null }) {
    const clubOptions = clubs.map((club) => `
        <option value="${club.id}" ${String(member.clubId || "") === String(club.id) ? "selected" : ""}>
            ${escapeHtml(club.name)}
        </option>
    `).join("");

    return mainLayout(title, `
        <h2>${title}</h2>
        <form method="POST" action="${action}">
            <label>Club</label>
            <select name="clubId" required>
                <option value="">Select a club</option>
                ${clubOptions}
            </select>

            <label>Name</label>
            <input name="name" value="${escapeHtml(member.name || "")}" required minlength="2">

            <label>Email</label>
            <input type="email" name="email" value="${escapeHtml(member.email || "")}" required>

            <label>Phone</label>
            <input name="phone" value="${escapeHtml(member.phone || "")}">

            <label>Status</label>
            <select name="status">
                <option value="active" ${member.status === "active" ? "selected" : ""}>Active</option>
                <option value="inactive" ${member.status === "inactive" ? "selected" : ""}>Inactive</option>
                <option value="pending" ${member.status === "pending" ? "selected" : ""}>Pending</option>
                <option value="suspended" ${member.status === "suspended" ? "selected" : ""}>Suspended</option>
            </select>

            <label>Participation Count</label>
            <input type="number" min="0" name="participationCount" value="${escapeHtml(member.participationCount ?? 0)}">

            <label>Last Participation</label>
            <input type="datetime-local" name="lastParticipatedAt" value="${formatDateTimeLocal(member.lastParticipatedAt)}">

            <label>Notes</label>
            <textarea name="notes" rows="4">${escapeHtml(member.notes || "")}</textarea>

            <div class="actions" style="margin-top:16px;">
                <button type="submit">Save</button>
                <a class="button secondary" href="/members${member.clubId ? `?clubId=${encodeURIComponent(member.clubId)}` : ""}">Cancel</a>
            </div>
        </form>
    `, { currentUser });
}

function formatDateTimeLocal(value) {
    if (!value) {
        return "";
    }

    const normalized = typeof value === "string" ? value.replace(" ", "T") : value;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

module.exports = memberFormView;
