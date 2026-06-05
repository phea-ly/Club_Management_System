const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const renderItems = (items, renderItem) => {
    if (!items.length) {
        return '<p class="empty-state">No matches found.</p>';
    }

    return `<ul class="result-list">${items.map(renderItem).join("")}</ul>`;
};

const renderCount = (count, label) => `<p class="count">${count} ${label}${count === 1 ? "" : "s"}</p>`;

const renderSearchPage = ({ query, counts, clubs, members, events, total }) => `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Search - Club Management System</title>
    <style>
        body { margin: 0; font-family: Arial, sans-serif; color: #1f2937; background: #f7f8fb; }
        main { width: min(1080px, calc(100% - 32px)); margin: 40px auto; }
        h1 { margin: 0 0 18px; font-size: 32px; }
        h2 { margin: 0 0 12px; font-size: 20px; }
        form { display: flex; gap: 10px; margin-bottom: 22px; }
        input { flex: 1; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 16px; }
        button { padding: 12px 18px; border: 0; border-radius: 6px; background: #2563eb; color: white; font-weight: 700; cursor: pointer; }
        .summary { margin-bottom: 20px; color: #475569; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        section { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
        .result-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
        .result-list li { padding-bottom: 12px; border-bottom: 1px solid #edf2f7; }
        .result-list li:last-child { border-bottom: 0; padding-bottom: 0; }
        .title { margin: 0 0 4px; font-weight: 700; }
        .meta { margin: 0; color: #64748b; font-size: 14px; line-height: 1.4; }
        .empty-state { margin: 0; color: #64748b; }
        .count { margin: 0; color: #2563eb; font-size: 28px; font-weight: 700; }
        @media (max-width: 760px) { form { flex-direction: column; } .grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <main>
        <h1>Search</h1>
        <form action="/search" method="get">
            <input type="search" name="q" value="${escapeHtml(query)}" placeholder="Search by club, member, or event name" aria-label="Search by club, member, or event name">
            <button type="submit">Search</button>
        </form>
        ${query ? `<p class="summary">${total} result${total === 1 ? "" : "s"} for "${escapeHtml(query)}"</p>` : `<p class="summary">Search by name to view matching database records.</p>`}
        <div class="grid">
            <section>
                <h2>Clubs</h2>
                ${query ? renderItems(clubs, (club) => `<li><p class="title">${escapeHtml(club.name)}</p><p class="meta">${escapeHtml(club.category || "Uncategorized")}</p><p class="meta">${escapeHtml(club.description || "")}</p></li>`) : renderCount(counts.clubs, "club")}
            </section>
            <section>
                <h2>Members</h2>
                ${query ? renderItems(members, (member) => `<li><p class="title">${escapeHtml(member.name)}</p><p class="meta">${escapeHtml(member.email || "No email")}</p><p class="meta">${escapeHtml(member.status || "No status")}</p></li>`) : renderCount(counts.members, "member")}
            </section>
            <section>
                <h2>Events</h2>
                ${query ? renderItems(events, (event) => `<li><p class="title">${escapeHtml(event.title)}</p><p class="meta">${escapeHtml(event.event_date || "No date")}</p><p class="meta">${escapeHtml(event.location || "No location")}</p></li>`) : renderCount(counts.events, "event")}
            </section>
        </div>
    </main>
</body>
</html>`;

module.exports = { renderSearchPage };
