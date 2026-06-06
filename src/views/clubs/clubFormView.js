const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function clubFormView({ title, action, club = {}, currentUser = null, error = "" }) {
    return mainLayout(title, `
        <div class="toolbar">
            <div>
                <h2>${title}</h2>
                <p class="muted">Create a new club record for the system.</p>
            </div>
        </div>

        ${error ? `
            <div style="background:#fee2e2;color:#991b1b;padding:12px 14px;border-radius:10px;margin-bottom:18px;">
                ${escapeHtml(error)}
            </div>
        ` : ""}

        <form method="POST" action="${action}">
            <label>Name</label>
            <input name="name" value="${escapeHtml(club.name || "")}" required minlength="2">

            <label>Description</label>
            <textarea name="description" rows="4" required>${escapeHtml(club.description || "")}</textarea>

            <label>Category</label>
            <input name="category" value="${escapeHtml(club.category || "")}" required minlength="2">

            <label>Leader</label>
            <input name="leader" value="${escapeHtml(getLeaderName(club.leader))}" required placeholder="Enter leader name">

            <label>Activities</label>
            <textarea name="activities" rows="3" placeholder="Optional comma-separated activities">${escapeHtml(formatActivities(club.activities))}</textarea>

            <div class="actions" style="margin-top:16px;">
                <button type="submit">Save Club</button>
                <a class="button secondary" href="/clubs">Cancel</a>
            </div>
        </form>
    `, { currentUser });
}

function formatActivities(activities) {
    if (Array.isArray(activities)) {
        return activities.join(", ");
    }

    return typeof activities === "string" ? activities : "";
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

module.exports = clubFormView;
