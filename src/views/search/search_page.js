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

const buildPageUrl = ({ query, filters, pagination }, page) => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (filters.clubCategory) params.set("clubCategory", filters.clubCategory);
    if (filters.eventDate) params.set("eventDate", filters.eventDate);
    if (filters.memberStatus) params.set("memberStatus", filters.memberStatus);
    params.set("page", page);
    params.set("perPage", pagination.perPage);

    return `/search?${params.toString()}`;
};

const renderPagination = (data) => {
    const { page, totalPages } = data.pagination;

    if (totalPages <= 1) {
        return "";
    }

    return `<nav class="pagination" aria-label="Pagination">
        ${page > 1 ? `<a href="${escapeHtml(buildPageUrl(data, page - 1))}">Previous</a>` : '<span class="disabled">Previous</span>'}
        <span>Page ${page} of ${totalPages}</span>
        ${page < totalPages ? `<a href="${escapeHtml(buildPageUrl(data, page + 1))}">Next</a>` : '<span class="disabled">Next</span>'}
    </nav>`;
};

const renderSearchPage = (data) => {
    const { query, filters, counts, clubs, members, events, total } = data;
    const hasResultsView = Boolean(query || filters.clubCategory || filters.eventDate || filters.memberStatus);

    return `<!doctype html>
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
        form { display: grid; grid-template-columns: 2fr repeat(4, 1fr) auto; gap: 10px; margin-bottom: 22px; }
        input, select { min-width: 0; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 16px; background: white; }
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
        .pagination { display: flex; justify-content: center; align-items: center; gap: 14px; margin-top: 22px; color: #475569; }
        .pagination a { color: #2563eb; font-weight: 700; text-decoration: none; }
        .pagination .disabled { color: #94a3b8; }
        @media (max-width: 960px) { form { grid-template-columns: 1fr; } .grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <main>
        <h1>Search</h1>
        <form action="/search" method="get">
            <input type="search" name="q" value="${escapeHtml(query)}" placeholder="Search by club, member, or event name" aria-label="Search by club, member, or event name">
            <input type="text" name="clubCategory" value="${escapeHtml(filters.clubCategory)}" placeholder="Club category" aria-label="Club category">
            <input type="date" name="eventDate" value="${escapeHtml(filters.eventDate)}" aria-label="Event date">
            <input type="text" name="memberStatus" value="${escapeHtml(filters.memberStatus)}" placeholder="Member status" aria-label="Member status">
            <select name="perPage" aria-label="Results per page">
                ${[5, 10, 25, 50].map((size) => `<option value="${size}"${data.pagination.perPage === size ? " selected" : ""}>${size}/page</option>`).join("")}
            </select>
            <button type="submit">Search</button>
        </form>
        ${hasResultsView ? `<p class="summary">${total} matching result${total === 1 ? "" : "s"}</p>` : `<p class="summary">Search by name or filter by club category, event date, or member status.</p>`}
        <div class="grid">
            <section>
                <h2>Clubs</h2>
                ${hasResultsView ? renderItems(clubs, (club) => `<li><p class="title">${escapeHtml(club.name)}</p><p class="meta">${escapeHtml(club.category || "Uncategorized")}</p><p class="meta">${escapeHtml(club.description || "")}</p></li>`) : renderCount(counts.clubs, "club")}
            </section>
            <section>
                <h2>Members</h2>
                ${hasResultsView ? renderItems(members, (member) => `<li><p class="title">${escapeHtml(member.name)}</p><p class="meta">${escapeHtml(member.email || "No email")}</p><p class="meta">${escapeHtml(member.status || "No status")}</p></li>`) : renderCount(counts.members, "member")}
            </section>
            <section>
                <h2>Events</h2>
                ${hasResultsView ? renderItems(events, (event) => `<li><p class="title">${escapeHtml(event.title)}</p><p class="meta">${escapeHtml(event.event_date || "No date")}</p><p class="meta">${escapeHtml(event.location || "No location")}</p></li>`) : renderCount(counts.events, "event")}
            </section>
        </div>
        ${hasResultsView ? renderPagination(data) : ""}
    </main>
</body>
</html>`;
};

module.exports = { renderSearchPage };
