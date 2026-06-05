function memberManagementPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Member Management</title>
  <style>
    :root {
      --bg: #f5f7fb;
      --panel: #ffffff;
      --text: #172033;
      --muted: #667085;
      --line: #d9e0ec;
      --primary: #1f6feb;
      --primary-dark: #185abc;
      --danger: #c93535;
      --success-bg: #e8f6ef;
      --success: #1f7a4d;
      --warn-bg: #fff5d6;
      --warn: #856000;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.5;
    }

    header {
      background: var(--panel);
      border-bottom: 1px solid var(--line);
    }

    .wrap {
      width: min(1160px, calc(100% - 32px));
      margin: 0 auto;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 0;
    }

    h1,
    h2,
    h3 {
      margin: 0;
    }

    h1 {
      font-size: 24px;
    }

    h2 {
      font-size: 18px;
    }

    main {
      padding: 24px 0 40px;
    }

    .toolbar,
    .panel,
    .member-card,
    .participation-item {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
    }

    .toolbar {
      display: grid;
      grid-template-columns: 1fr 150px 150px 180px;
      gap: 12px;
      align-items: end;
      padding: 16px;
      margin-bottom: 18px;
    }

    .panel {
      padding: 18px;
      margin-bottom: 18px;
    }

    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 14px;
      align-items: end;
    }

    label {
      display: block;
      margin-bottom: 6px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
    }

    input,
    select {
      width: 100%;
      min-height: 40px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 9px 10px;
      color: var(--text);
      background: #fff;
      font: inherit;
    }

    button {
      min-height: 38px;
      border: 0;
      border-radius: 6px;
      padding: 8px 12px;
      cursor: pointer;
      font: inherit;
      font-weight: 700;
    }

    .btn-primary {
      background: var(--primary);
      color: #fff;
    }

    .btn-primary:hover {
      background: var(--primary-dark);
    }

    .btn-secondary {
      background: #edf1f7;
      color: var(--text);
    }

    .btn-danger {
      background: var(--danger);
      color: #fff;
    }

    .members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
      gap: 14px;
    }

    .member-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
    }

    .member-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    .member-name {
      font-size: 18px;
    }

    .badge {
      align-self: flex-start;
      border-radius: 999px;
      padding: 4px 9px;
      background: #e9f1ff;
      color: #185abc;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }

    .badge.active {
      background: #e8f6ef;
      color: #1f7a4d;
    }

    .badge.inactive,
    .badge.suspended {
      background: #fdecec;
      color: #a83232;
    }

    .badge.pending {
      background: #fff5d6;
      color: #856000;
    }

    .meta {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .stat {
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 8px;
      text-align: center;
    }

    .stat strong {
      display: block;
      font-size: 18px;
    }

    .stat span {
      color: var(--muted);
      font-size: 12px;
    }

    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: auto;
    }

    .notice {
      display: none;
      margin-bottom: 14px;
      border-radius: 6px;
      padding: 10px 12px;
      font-weight: 700;
    }

    .notice.success {
      display: block;
      background: var(--success-bg);
      color: var(--success);
    }

    .notice.error {
      display: block;
      background: var(--warn-bg);
      color: var(--warn);
    }

    .empty {
      padding: 24px;
      text-align: center;
      color: var(--muted);
      background: var(--panel);
      border: 1px dashed var(--line);
      border-radius: 8px;
    }

    .participation {
      display: grid;
      gap: 10px;
    }

    .participation-item {
      padding: 12px;
    }

    @media (max-width: 860px) {
      .topbar,
      .toolbar,
      .grid {
        grid-template-columns: 1fr;
      }

      .topbar {
        align-items: stretch;
      }

      button {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="wrap topbar">
      <h1>Member Management</h1>
      <button class="btn-primary" id="refreshButton" type="button">Refresh Members</button>
    </div>
  </header>

  <main class="wrap">
    <section class="toolbar">
      <div>
        <label for="searchInput">Search members</label>
        <input id="searchInput" type="search" placeholder="Search by name, email, or status" />
      </div>
      <div>
        <label for="clubId">Club ID</label>
        <input id="clubId" value="1" />
      </div>
      <div>
        <label for="actorId">Leader ID</label>
        <input id="actorId" value="1" />
      </div>
      <div>
        <label for="statusFilter">Status filter</label>
        <select id="statusFilter">
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>
    </section>

    <div id="notice" class="notice"></div>

    <section class="panel">
      <div class="panel-head">
        <h2>Add Club Member</h2>
      </div>
      <form id="addMemberForm">
        <div class="grid">
          <div>
            <label for="studentEmail">Student email</label>
            <input id="studentEmail" type="email" placeholder="sok.dara@example.com" required />
          </div>
          <button class="btn-primary" type="submit">Add Member</button>
        </div>
      </form>
    </section>

    <section>
      <div id="membersContainer" class="members-grid"></div>
    </section>

    <section class="panel" id="participationPanel" hidden>
      <div class="panel-head">
        <h2 id="participationTitle">Participation</h2>
        <button class="btn-secondary" id="closeParticipationButton" type="button">Close</button>
      </div>
      <div id="participationContainer" class="participation"></div>
    </section>
  </main>

  <script>
    const state = {
      members: [],
      search: "",
    };

    const elements = {
      actorId: document.getElementById("actorId"),
      addMemberForm: document.getElementById("addMemberForm"),
      clubId: document.getElementById("clubId"),
      closeParticipationButton: document.getElementById("closeParticipationButton"),
      membersContainer: document.getElementById("membersContainer"),
      notice: document.getElementById("notice"),
      participationContainer: document.getElementById("participationContainer"),
      participationPanel: document.getElementById("participationPanel"),
      participationTitle: document.getElementById("participationTitle"),
      refreshButton: document.getElementById("refreshButton"),
      searchInput: document.getElementById("searchInput"),
      statusFilter: document.getElementById("statusFilter"),
      studentEmail: document.getElementById("studentEmail"),
    };

    function authHeaders() {
      return {
        "content-type": "application/json",
        "x-user-id": elements.actorId.value.trim() || "1",
        "x-user-role": "CLUB_LEADER",
      };
    }

    function clubBaseUrl() {
      return "/api/members/club/" + encodeURIComponent(elements.clubId.value.trim() || "1");
    }

    function showNotice(message, type = "success") {
      elements.notice.textContent = message;
      elements.notice.className = "notice " + type;
      window.setTimeout(() => {
        elements.notice.className = "notice";
      }, 3500);
    }

    async function requestJson(url, options = {}) {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...authHeaders(),
          ...(options.headers || {}),
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      return data;
    }

    async function loadMembers() {
      const query = elements.statusFilter.value ? "?status=" + elements.statusFilter.value : "";
      const data = await requestJson(clubBaseUrl() + query);
      state.members = data.members || [];
      renderMembers();
    }

    function filteredMembers() {
      const term = state.search.toLowerCase();

      if (!term) {
        return state.members;
      }

      return state.members.filter((member) => {
        const fullName = (member.first_name || "") + " " + (member.last_name || "");
        return [fullName, member.email, member.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      });
    }

    function renderMembers() {
      const members = filteredMembers();
      elements.membersContainer.innerHTML = "";

      if (members.length === 0) {
        elements.membersContainer.innerHTML = '<div class="empty">No members found.</div>';
        return;
      }

      members.forEach((member) => {
        const fullName = ((member.first_name || "") + " " + (member.last_name || "")).trim();
        const card = document.createElement("article");
        card.className = "member-card";
        card.innerHTML = \`
          <div class="member-head">
            <h3 class="member-name">\${escapeHtml(fullName || "Unnamed Member")}</h3>
            <span class="badge \${escapeHtml(String(member.status).toLowerCase())}">\${escapeHtml(member.status)}</span>
          </div>
          <p class="meta"><strong>Email:</strong> \${escapeHtml(member.email)}</p>
          <p class="meta"><strong>Joined:</strong> \${escapeHtml(member.joined_at)}</p>
          <div class="stats">
            <div class="stat"><strong>\${member.registered_event_count || 0}</strong><span>Registered</span></div>
            <div class="stat"><strong>\${member.attended_event_count || 0}</strong><span>Present</span></div>
            <div class="stat"><strong>\${member.absent_event_count || 0}</strong><span>Absent</span></div>
          </div>
          <div>
            <label for="status-\${member.id}">Member status</label>
            <select id="status-\${member.id}" data-action="status" data-id="\${member.id}">
              \${statusOption("ACTIVE", member.status)}
              \${statusOption("PENDING", member.status)}
              \${statusOption("INACTIVE", member.status)}
              \${statusOption("SUSPENDED", member.status)}
            </select>
          </div>
          <div class="card-actions">
            <button class="btn-secondary" data-action="participation" data-id="\${member.id}" data-name="\${escapeHtml(fullName)}" type="button">View Participation</button>
            <button class="btn-danger" data-action="remove" data-id="\${member.id}" type="button">Remove</button>
          </div>
        \`;
        elements.membersContainer.appendChild(card);
      });
    }

    function statusOption(value, selected) {
      return '<option value="' + value + '"' + (value === selected ? " selected" : "") + ">" + value + "</option>";
    }

    function escapeHtml(value) {
      return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    async function addMember(event) {
      event.preventDefault();

      try {
        await requestJson(clubBaseUrl(), {
          method: "POST",
          body: JSON.stringify({ email: elements.studentEmail.value }),
        });
        elements.addMemberForm.reset();
        await loadMembers();
        showNotice("Member added.");
      } catch (error) {
        showNotice(error.message, "error");
      }
    }

    async function updateStatus(memberId, status) {
      try {
        await requestJson(clubBaseUrl() + "/" + memberId + "/status", {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
        await loadMembers();
        showNotice("Member status updated.");
      } catch (error) {
        showNotice(error.message, "error");
      }
    }

    async function removeMember(memberId) {
      if (!confirm("Remove this member from the club?")) {
        return;
      }

      try {
        await requestJson(clubBaseUrl() + "/" + memberId, { method: "DELETE" });
        await loadMembers();
        showNotice("Member removed.");
      } catch (error) {
        showNotice(error.message, "error");
      }
    }

    async function showParticipation(memberId, memberName) {
      try {
        const data = await requestJson(clubBaseUrl() + "/" + memberId + "/participation");
        const items = data.participation || [];
        elements.participationTitle.textContent = "Participation - " + memberName;
        elements.participationContainer.innerHTML = "";

        if (items.length === 0) {
          elements.participationContainer.innerHTML = '<div class="empty">No participation records.</div>';
        } else {
          items.forEach((item) => {
            const row = document.createElement("div");
            row.className = "participation-item";
            row.innerHTML = \`
              <h3>\${escapeHtml(item.title)}</h3>
              <p class="meta"><strong>Date:</strong> \${escapeHtml(item.event_date)} | <strong>Location:</strong> \${escapeHtml(item.location)}</p>
              <p class="meta"><strong>Status:</strong> \${escapeHtml(item.participation_status)} | <strong>Registered:</strong> \${escapeHtml(item.registered_at || "Not registered")}</p>
            \`;
            elements.participationContainer.appendChild(row);
          });
        }

        elements.participationPanel.hidden = false;
        elements.participationPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        showNotice(error.message, "error");
      }
    }

    elements.addMemberForm.addEventListener("submit", addMember);
    elements.closeParticipationButton.addEventListener("click", () => {
      elements.participationPanel.hidden = true;
    });
    elements.membersContainer.addEventListener("change", (event) => {
      const select = event.target.closest("select[data-action='status']");

      if (select) {
        updateStatus(select.dataset.id, select.value);
      }
    });
    elements.membersContainer.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");

      if (!button) {
        return;
      }

      if (button.dataset.action === "remove") {
        removeMember(button.dataset.id);
      }

      if (button.dataset.action === "participation") {
        showParticipation(button.dataset.id, button.dataset.name);
      }
    });
    elements.refreshButton.addEventListener("click", () => {
      loadMembers().catch((error) => showNotice(error.message, "error"));
    });
    elements.searchInput.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderMembers();
    });
    elements.statusFilter.addEventListener("change", () => {
      loadMembers().catch((error) => showNotice(error.message, "error"));
    });

    loadMembers().catch((error) => showNotice(error.message, "error"));
  </script>
</body>
</html>`;
}

module.exports = memberManagementPage;
