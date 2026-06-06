const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function eventListView({ events, clubs, filters = {}, currentUser = null }) {
    const role = String(currentUser?.role || "").toLowerCase();
    const canManageEvents = role === "admin" || role === "club_leader";
    const canRegister = role === "member";
    const rows = events.map((event) => `
        <tr>
            <td>${event.id}</td>
            <td>${escapeHtml(event.title)}</td>
            <td>${escapeHtml(getClubName(clubs, event.clubId))}</td>
            <td>${escapeHtml(event.location)}</td>
            <td>${escapeHtml(event.eventDate || "-")}</td>
            <td><span class="badge badge-${escapeHtml(event.status)}">${escapeHtml(event.status)}</span></td>
            <td>${escapeHtml(event.attendeeCount)}</td>
            <td class="actions">
                ${canRegister ? `
                    <form method="POST" action="/events/${event.id}/register" style="padding:0;margin:0;background:transparent;">
                        <input type="hidden" name="name" value="${escapeHtml(currentUser?.name || "")}">
                        <input type="hidden" name="email" value="${escapeHtml(currentUser?.email || "")}">
                        <input type="hidden" name="role" value="${escapeHtml(currentUser?.role || "member")}">
                        <button type="submit">Register</button>
                    </form>
                ` : ""}
                ${canManageEvents ? `
                    <a class="button secondary" href="/events/${event.id}/edit">Edit</a>
                    <form method="POST" action="/events/${event.id}/delete" style="padding:0;margin:0;background:transparent;">
                        <button class="danger" type="submit">Delete</button>
                    </form>
                ` : ""}
            </td>
        </tr>
    `).join("");

    const clubOptions = clubs.map((club) => `
        <option value="${club.id}" ${String(filters.clubId || "") === String(club.id) ? "selected" : ""}>
            ${escapeHtml(club.name)}
        </option>
    `).join("");

    return mainLayout("Events", `
        <div class="toolbar">
            <div>
                <h2>Event Management</h2>
                <p class="muted">Members can browse and register for events. Club leaders and admins manage them.</p>
            </div>
            <div class="actions">
                <form method="GET" action="/events" class="inline-filter">
                    <select name="clubId">
                        <option value="">All clubs</option>
                        ${clubOptions}
                    </select>
                <button type="submit">Filter</button>
                </form>
                ${canManageEvents ? `<a class="button" href="/events/new${filters.clubId ? `?clubId=${encodeURIComponent(filters.clubId)}` : ""}">Add Event</a>` : ""}
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Club</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Attendees</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${rows || "<tr><td colspan='8'>No events found.</td></tr>"}</tbody>
        </table>
    `, { currentUser });
}

function getClubName(clubs, clubId) {
    const club = clubs.find((item) => String(item.id) === String(clubId));
    return club ? club.name : `Club #${clubId}`;
}

module.exports = eventListView;
