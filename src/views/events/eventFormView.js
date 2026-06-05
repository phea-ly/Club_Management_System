const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function eventFormView({ event = {}, clubs = [], action, title }) {
    const clubOptions = clubs.map((club) => `
        <option value="${club.id}" ${String(event.clubId || "") === String(club.id) ? "selected" : ""}>
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

            <label>Title</label>
            <input name="title" value="${escapeHtml(event.title || "")}" required minlength="2">

            <label>Description</label>
            <textarea name="description" rows="4">${escapeHtml(event.description || "")}</textarea>

            <label>Location</label>
            <input name="location" value="${escapeHtml(event.location || "")}" required minlength="2">

            <label>Event Date</label>
            <input type="datetime-local" name="eventDate" value="${formatDateTimeLocal(event.eventDate)}" required>

            <label>Status</label>
            <select name="status">
                <option value="scheduled" ${event.status === "scheduled" ? "selected" : ""}>Scheduled</option>
                <option value="completed" ${event.status === "completed" ? "selected" : ""}>Completed</option>
                <option value="cancelled" ${event.status === "cancelled" ? "selected" : ""}>Cancelled</option>
            </select>

            <label>Max Participants</label>
            <input type="number" min="0" name="maxParticipants" value="${escapeHtml(event.maxParticipants ?? "")}">

            <label>Current Attendees</label>
            <input type="number" min="0" name="attendeeCount" value="${escapeHtml(event.attendeeCount ?? 0)}">

            <div class="actions" style="margin-top:16px;">
                <button type="submit">Save</button>
                <a class="button secondary" href="/events${event.clubId ? `?clubId=${encodeURIComponent(event.clubId)}` : ""}">Cancel</a>
            </div>
        </form>
    `);
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

module.exports = eventFormView;
