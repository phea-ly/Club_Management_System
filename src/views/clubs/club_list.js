function clubListPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Club Management</title>
  <style>
    :root {
      --bg: #f6f7fb;
      --panel: #ffffff;
      --text: #172033;
      --muted: #687386;
      --line: #dfe4ee;
      --primary: #1f6feb;
      --primary-dark: #185abc;
      --danger: #c93535;
      --success-bg: #e8f6ef;
      --success: #1f7a4d;
      --warning-bg: #fff5d6;
      --warning: #856000;
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
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 0;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }

    main {
      padding: 24px 0 40px;
    }

    .toolbar,
    .form-panel,
    .club-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
    }

    .toolbar {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 12px;
      align-items: end;
      padding: 16px;
      margin-bottom: 18px;
    }

    .form-panel {
      padding: 18px;
      margin-bottom: 18px;
    }

    .form-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    h2 {
      margin: 0;
      font-size: 18px;
    }

    label {
      display: block;
      margin-bottom: 6px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
    }

    input,
    select,
    textarea {
      width: 100%;
      min-height: 40px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 9px 10px;
      color: var(--text);
      background: #fff;
      font: inherit;
    }

    textarea {
      min-height: 96px;
      resize: vertical;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .full {
      grid-column: 1 / -1;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
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

    .btn-link {
      background: transparent;
      color: var(--primary);
      padding-inline: 4px;
    }

    .clubs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
    }

    .club-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .club-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    .club-name {
      margin: 0;
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

    .meta {
      margin: 0;
      color: var(--muted);
      font-size: 14px;
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
      background: var(--warning-bg);
      color: var(--warning);
    }

    .empty {
      padding: 24px;
      text-align: center;
      color: var(--muted);
      background: var(--panel);
      border: 1px dashed var(--line);
      border-radius: 8px;
    }

    @media (max-width: 720px) {
      .topbar,
      .toolbar,
      .grid {
        grid-template-columns: 1fr;
      }

      .topbar {
        align-items: stretch;
      }

      .actions {
        justify-content: stretch;
        flex-direction: column;
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
      <h1>Club Management</h1>
      <button class="btn-primary" id="newClubButton" type="button">Create Club</button>
    </div>
  </header>

  <main class="wrap">
    <section class="toolbar" aria-label="Club tools">
      <div>
        <label for="searchInput">Search clubs</label>
        <input id="searchInput" type="search" placeholder="Search by name, category, or leader" />
      </div>
      <div>
        <label for="actorRole">Current role</label>
        <select id="actorRole">
          <option value="STUDENT">Student</option>
          <option value="CLUB_LEADER">Club Leader</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </div>
      <div>
        <label for="actorId">User ID</label>
        <input id="actorId" value="student-1" />
      </div>
    </section>

    <div id="notice" class="notice"></div>

    <section class="form-panel" id="clubFormPanel" hidden>
      <div class="form-title">
        <h2 id="formTitle">Create Club</h2>
        <button class="btn-link" id="closeFormButton" type="button">Close</button>
      </div>

      <form id="clubForm">
        <input id="clubId" type="hidden" />
        <div class="grid">
          <div>
            <label for="clubName">Club name</label>
            <input id="clubName" required />
          </div>
          <div>
            <label for="clubCategory">Category</label>
            <input id="clubCategory" required />
          </div>
          <div class="full">
            <label for="clubDescription">Description</label>
            <textarea id="clubDescription" required></textarea>
          </div>
          <div>
            <label for="leaderName">Leader name</label>
            <input id="leaderName" required />
          </div>
          <div>
            <label for="leaderEmail">Leader email</label>
            <input id="leaderEmail" type="email" />
          </div>
          <div>
            <label for="leaderPhone">Leader phone</label>
            <input id="leaderPhone" />
          </div>
        </div>
        <div class="actions">
          <button class="btn-secondary" id="resetFormButton" type="button">Reset</button>
          <button class="btn-primary" type="submit">Save Club</button>
        </div>
      </form>
    </section>

    <section>
      <div id="clubsContainer" class="clubs-grid"></div>
    </section>
  </main>

  <script>
    const state = {
      clubs: [],
      search: "",
    };

    const elements = {
      actorId: document.getElementById("actorId"),
      actorRole: document.getElementById("actorRole"),
      clubForm: document.getElementById("clubForm"),
      clubFormPanel: document.getElementById("clubFormPanel"),
      clubId: document.getElementById("clubId"),
      clubName: document.getElementById("clubName"),
      clubCategory: document.getElementById("clubCategory"),
      clubDescription: document.getElementById("clubDescription"),
      leaderName: document.getElementById("leaderName"),
      leaderEmail: document.getElementById("leaderEmail"),
      leaderPhone: document.getElementById("leaderPhone"),
      clubsContainer: document.getElementById("clubsContainer"),
      closeFormButton: document.getElementById("closeFormButton"),
      formTitle: document.getElementById("formTitle"),
      newClubButton: document.getElementById("newClubButton"),
      notice: document.getElementById("notice"),
      resetFormButton: document.getElementById("resetFormButton"),
      searchInput: document.getElementById("searchInput"),
    };

    function authHeaders() {
      return {
        "content-type": "application/json",
        "x-user-id": elements.actorId.value.trim() || "student-1",
        "x-user-role": elements.actorRole.value,
      };
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

    async function loadClubs() {
      const data = await requestJson("/api/clubs", {
        headers: { "content-type": "application/json" },
      });
      state.clubs = data.clubs || [];
      renderClubs();
    }

    function filteredClubs() {
      const term = state.search.toLowerCase();

      if (!term) {
        return state.clubs;
      }

      return state.clubs.filter((club) => {
        return [
          club.name,
          club.description,
          club.category,
          club.leader && club.leader.name,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      });
    }

    function renderClubs() {
      const clubs = filteredClubs();
      elements.clubsContainer.innerHTML = "";

      if (clubs.length === 0) {
        elements.clubsContainer.innerHTML = '<div class="empty">No clubs available.</div>';
        return;
      }

      clubs.forEach((club) => {
        const card = document.createElement("article");
        card.className = "club-card";
        card.innerHTML = \`
          <div class="club-head">
            <h3 class="club-name">\${escapeHtml(club.name)}</h3>
            <span class="badge">\${escapeHtml(club.category)}</span>
          </div>
          <p>\${escapeHtml(club.description)}</p>
          <p class="meta"><strong>Leader:</strong> \${escapeHtml(club.leader.name)}</p>
          <p class="meta"><strong>Email:</strong> \${escapeHtml(club.leader.email || "Not provided")}</p>
          <p class="meta"><strong>Phone:</strong> \${escapeHtml(club.leader.phone || "Not provided")}</p>
          <div class="card-actions">
            <button class="btn-primary" data-action="join" data-id="\${club.id}" type="button">Request Join</button>
            <button class="btn-secondary" data-action="edit" data-id="\${club.id}" type="button">Edit</button>
            <button class="btn-danger" data-action="delete" data-id="\${club.id}" type="button">Delete</button>
          </div>
        \`;
        elements.clubsContainer.appendChild(card);
      });
    }

    function escapeHtml(value) {
      return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function openForm(club = null) {
      elements.clubFormPanel.hidden = false;
      elements.formTitle.textContent = club ? "Edit Club" : "Create Club";
      elements.clubId.value = club ? club.id : "";
      elements.clubName.value = club ? club.name : "";
      elements.clubCategory.value = club ? club.category : "";
      elements.clubDescription.value = club ? club.description : "";
      elements.leaderName.value = club && club.leader ? club.leader.name : "";
      elements.leaderEmail.value = club && club.leader ? club.leader.email || "" : "";
      elements.leaderPhone.value = club && club.leader ? club.leader.phone || "" : "";
      elements.clubName.focus();
    }

    function closeForm() {
      elements.clubForm.reset();
      elements.clubId.value = "";
      elements.clubFormPanel.hidden = true;
    }

    function getFormPayload() {
      return {
        name: elements.clubName.value,
        description: elements.clubDescription.value,
        category: elements.clubCategory.value,
        leader: {
          id: elements.actorId.value,
          name: elements.leaderName.value,
          email: elements.leaderEmail.value,
          phone: elements.leaderPhone.value,
        },
      };
    }

    async function saveClub(event) {
      event.preventDefault();
      const id = elements.clubId.value;
      const method = id ? "PUT" : "POST";
      const url = id ? "/api/clubs/" + id : "/api/clubs";

      try {
        await requestJson(url, {
          method,
          body: JSON.stringify(getFormPayload()),
        });
        closeForm();
        await loadClubs();
        showNotice(id ? "Club updated." : "Club created.");
      } catch (error) {
        showNotice(error.message, "error");
      }
    }

    async function handleClubAction(event) {
      const button = event.target.closest("button[data-action]");

      if (!button) {
        return;
      }

      const id = button.dataset.id;
      const action = button.dataset.action;
      const club = state.clubs.find((item) => String(item.id) === String(id));

      if (action === "edit") {
        openForm(club);
        return;
      }

      if (action === "delete") {
        if (!confirm("Delete this club?")) {
          return;
        }

        try {
          await requestJson("/api/clubs/" + id, { method: "DELETE" });
          await loadClubs();
          showNotice("Club deleted.");
        } catch (error) {
          showNotice(error.message, "error");
        }
        return;
      }

      if (action === "join") {
        try {
          await requestJson("/api/clubs/" + id + "/join-requests", { method: "POST" });
          showNotice("Join request sent.");
        } catch (error) {
          showNotice(error.message, "error");
        }
      }
    }

    elements.newClubButton.addEventListener("click", () => openForm());
    elements.closeFormButton.addEventListener("click", closeForm);
    elements.resetFormButton.addEventListener("click", () => openForm());
    elements.clubForm.addEventListener("submit", saveClub);
    elements.clubsContainer.addEventListener("click", handleClubAction);
    elements.searchInput.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderClubs();
    });
    elements.actorRole.addEventListener("change", () => {
      elements.actorId.value = elements.actorRole.value === "STUDENT" ? "student-1" : "leader-1";
    });

    loadClubs().catch((error) => showNotice(error.message, "error"));
  </script>
</body>
</html>`;
}

module.exports = clubListPage;
