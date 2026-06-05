const renderDashboardPage = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard | Club Management</title>
  <style>
    :root {
      color-scheme: light;
      --page: #f4f7f6;
      --sidebar: #0e2f29;
      --sidebar-strong: #0a221e;
      --surface: #ffffff;
      --surface-soft: #f8fbfa;
      --ink: #101828;
      --muted: #667085;
      --line: #d7e0dc;
      --accent: #0f766e;
      --accent-dark: #0b5f59;
      --blue: #175cd3;
      --blue-soft: #eff4ff;
      --amber: #b54708;
      --amber-soft: #fff6e8;
      --danger: #b42318;
      --danger-soft: #fff1f3;
      --shadow: 0 12px 28px rgba(16, 24, 40, 0.08);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: var(--ink);
      background: var(--page);
    }

    button,
    input,
    select {
      font: inherit;
    }

    button {
      border: 0;
      cursor: pointer;
    }

    a {
      color: inherit;
    }

    .shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
    }

    .sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 24px 18px;
      background: var(--sidebar);
      color: #f4fbf8;
    }

    .brand {
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.14);
    }

    .brand h1 {
      margin: 0;
      font-size: 25px;
      line-height: 1.15;
    }

    .brand p {
      margin: 9px 0 0;
      color: rgba(244, 251, 248, 0.72);
      line-height: 1.45;
    }

    .nav {
      display: grid;
      gap: 8px;
      margin-top: 22px;
    }

    .nav a,
    .logout-link {
      display: flex;
      align-items: center;
      min-height: 42px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #f8fffc;
      text-decoration: none;
      background: rgba(255, 255, 255, 0.08);
      font-weight: 700;
    }

    .nav a:hover,
    .logout-link:hover {
      background: rgba(255, 255, 255, 0.14);
    }

    .nav .active {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 18px;
    }

    .main {
      min-width: 0;
      padding: 24px;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: var(--accent);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .topbar h2 {
      margin: 0;
      font-size: 34px;
      line-height: 1.15;
    }

    .topbar p {
      margin: 8px 0 0;
      max-width: 760px;
      color: var(--muted);
      line-height: 1.55;
    }

    .toolbar,
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: flex-end;
      align-items: center;
    }

    .btn,
    .pill {
      min-height: 40px;
      padding: 9px 13px;
      border-radius: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--accent);
      color: #fff;
      text-decoration: none;
      font-weight: 800;
    }

    .btn:hover {
      background: var(--accent-dark);
    }

    .btn.secondary {
      background: #e7efec;
      color: #17352e;
    }

    .btn.warning {
      background: #f7b267;
      color: #4f2600;
    }

    .pill {
      min-width: 180px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
    }

    .notice {
      display: none;
      margin-bottom: 16px;
      padding: 12px 14px;
      border: 1px solid #bfe5de;
      border-radius: 8px;
      background: #eefaf7;
      color: #13655d;
    }

    .notice.error {
      border-color: #f6c2c2;
      background: var(--danger-soft);
      color: var(--danger);
    }

    .quick-grid,
    .metric-grid,
    .section-grid {
      display: grid;
      gap: 14px;
    }

    .quick-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin-bottom: 14px;
    }

    .quick-card,
    .metric-card,
    .panel,
    .report-card,
    .user-card,
    .empty {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    .quick-card {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 16px;
      text-decoration: none;
    }

    .quick-card:hover {
      border-color: #b6cbc4;
    }

    .quick-card strong {
      display: block;
      font-size: 16px;
    }

    .quick-card span {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      line-height: 1.35;
    }

    .quick-mark {
      flex: 0 0 auto;
      min-width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      background: var(--blue-soft);
      color: var(--blue);
      font-weight: 900;
    }

    .metric-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-bottom: 14px;
    }

    .metric-card {
      padding: 16px;
    }

    .metric-card span,
    .report-stat span,
    .metric-caption {
      display: block;
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .metric-card strong {
      display: block;
      margin-top: 10px;
      font-size: 34px;
      line-height: 1;
    }

    .metric-card p {
      margin: 10px 0 0;
      color: var(--muted);
      line-height: 1.4;
    }

    .progress {
      margin-top: 14px;
      height: 8px;
      border-radius: 999px;
      overflow: hidden;
      background: #e9efec;
    }

    .progress-bar {
      width: 0%;
      height: 100%;
      border-radius: inherit;
      background: var(--accent);
      transition: width 220ms ease;
    }

    .panel {
      overflow: hidden;
      box-shadow: var(--shadow);
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--line);
      background: var(--surface-soft);
    }

    .panel-header h3 {
      margin: 0;
      font-size: 19px;
    }

    .panel-header p {
      margin: 5px 0 0;
      color: var(--muted);
      line-height: 1.45;
    }

    .panel-body {
      padding: 16px;
    }

    .report-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 12px;
    }

    .report-card {
      padding: 14px;
      box-shadow: none;
    }

    .report-card h4 {
      margin: 0;
      font-size: 17px;
      line-height: 1.25;
    }

    .report-meta,
    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      padding: 4px 8px;
      border-radius: 999px;
      background: #e7f6f2;
      color: #0c615a;
      font-size: 12px;
      font-weight: 800;
    }

    .tag.warning {
      background: var(--amber-soft);
      color: var(--amber);
    }

    .tag.soft {
      background: #eef2f8;
      color: #355070;
    }

    .report-card p,
    .muted {
      color: var(--muted);
      line-height: 1.5;
    }

    .report-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: 12px;
    }

    .report-stat {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
      background: var(--surface-soft);
    }

    .report-stat strong {
      display: block;
      margin-top: 5px;
      font-size: 20px;
      line-height: 1.15;
    }

    .section-grid {
      grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
      align-items: start;
      margin-top: 14px;
    }

    .user-list {
      display: grid;
      gap: 10px;
    }

    .user-card {
      display: grid;
      gap: 12px;
      padding: 14px;
      box-shadow: none;
    }

    .user-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: flex-start;
    }

    .user-head strong {
      display: block;
      font-size: 16px;
    }

    .user-head span {
      color: var(--muted);
      font-size: 13px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .form-field.full {
      grid-column: 1 / -1;
    }

    label {
      display: block;
      margin-bottom: 6px;
      color: #344054;
      font-size: 13px;
      font-weight: 800;
    }

    input,
    select {
      width: 100%;
      min-height: 40px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 9px 10px;
      color: var(--ink);
      background: #fff;
    }

    .empty {
      padding: 18px;
      box-shadow: none;
      color: var(--muted);
      background: var(--surface-soft);
      text-align: left;
    }

    .empty strong {
      display: block;
      margin-bottom: 4px;
      color: var(--ink);
    }

    .panel-note {
      margin: 0 0 14px;
      color: var(--muted);
      line-height: 1.5;
    }

    @media (max-width: 1180px) {
      .metric-grid,
      .quick-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .section-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 860px) {
      .shell {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: static;
        height: auto;
      }

      .topbar,
      .panel-header,
      .user-head {
        flex-direction: column;
        align-items: stretch;
      }

      .toolbar {
        justify-content: flex-start;
      }
    }

    @media (max-width: 640px) {
      .main {
        padding: 16px;
      }

      .topbar h2 {
        font-size: 28px;
      }

      .metric-grid,
      .quick-grid,
      .form-grid,
      .report-stats {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <h1>Club Management</h1>
        <p>Operations center for clubs, people, events, and attendance.</p>
      </div>

      <nav class="nav" aria-label="Primary">
        <a class="active" href="/dashboard">Dashboard</a>
        <a href="/club-management">Club Management</a>
        <a href="/attendance">Attendance</a>
      </nav>

      <div class="sidebar-footer">
        <a class="logout-link" href="/logout">Log Out</a>
      </div>
    </aside>

    <main class="main">
      <section class="topbar">
        <div>
          <p class="eyebrow">Admin Dashboard</p>
          <h2>Reports and Dashboard</h2>
          <p>
            Track club growth, member participation, activity reports, and account access from one focused workspace.
          </p>
        </div>

        <div class="toolbar">
          <select class="pill" id="roleSelect" aria-label="Current role">
            <option value="ADMIN" selected>ADMIN</option>
            <option value="LEADER">LEADER</option>
            <option value="MEMBER">MEMBER</option>
          </select>
          <button class="btn secondary" id="refreshBtn" type="button">Refresh</button>
        </div>
      </section>

      <div class="notice" id="notice"></div>

      <section class="quick-grid" aria-label="Quick actions">
        <a class="quick-card" href="/club-management">
          <div>
            <strong>Create or Review Clubs</strong>
            <span>Open club details, requests, members, and activities.</span>
          </div>
          <span class="quick-mark">C</span>
        </a>
        <a class="quick-card" href="/attendance">
          <div>
            <strong>Record Attendance</strong>
            <span>Mark students present, late, or absent for club sessions.</span>
          </div>
          <span class="quick-mark">A</span>
        </a>
        <a class="quick-card" href="#staffPanel">
          <div>
            <strong>Manage Users</strong>
            <span>Create users, set roles, and reset passwords.</span>
          </div>
          <span class="quick-mark">S</span>
        </a>
      </section>

      <section class="metric-grid" aria-label="Overview metrics">
        <article class="metric-card">
          <span>Total Clubs</span>
          <strong id="totalClubs">--</strong>
          <p>Active clubs in the system.</p>
        </article>
        <article class="metric-card">
          <span>Total Members</span>
          <strong id="totalMembers">--</strong>
          <p>Approved student memberships.</p>
        </article>
        <article class="metric-card">
          <span>Upcoming Events</span>
          <strong id="upcomingEvents">--</strong>
          <p>Scheduled activities still ahead.</p>
        </article>
        <article class="metric-card">
          <span>Participation</span>
          <strong id="studentParticipation">--%</strong>
          <p>Present and late attendance rate.</p>
          <div class="progress" aria-hidden="true">
            <div class="progress-bar" id="participationBar"></div>
          </div>
        </article>
      </section>

      <section class="grid">
        <article class="panel">
          <div class="panel-header">
            <div>
              <h3>Club Activity Reports</h3>
              <p>Attendance, membership, and request summaries by club.</p>
            </div>
            <div class="actions">
              <span class="tag soft" id="reportCountTag">0 reports</span>
            </div>
          </div>
          <div class="panel-body">
            <div id="reportsContainer" class="report-grid"></div>
          </div>
        </article>

        <section class="section-grid">
          <article class="panel" id="staffPanel">
            <div class="panel-header">
              <div>
                <h3>User Provisioning</h3>
                <p>Restricted to ADMIN profiles.</p>
              </div>
            </div>
            <div class="panel-body">
              <p class="panel-note" id="staffAccessNote">
                Create user accounts, assign roles, and issue temporary passwords.
              </p>

              <form id="provisionForm" class="form-grid" autocomplete="off">
                <div class="form-field">
                  <label for="name">Name</label>
                  <input id="name" placeholder="User name" required>
                </div>
                <div class="form-field">
                  <label for="email">Email</label>
                  <input id="email" type="email" placeholder="user@example.edu" required>
                </div>
                <div class="form-field">
                  <label for="password">Password</label>
                  <input id="password" type="password" placeholder="Temporary password" required>
                </div>
                <div class="form-field">
                  <label for="role">Role</label>
                  <select id="role">
                    <option value="ADMIN">ADMIN</option>
                    <option value="LEADER">LEADER</option>
                    <option value="MEMBER">MEMBER</option>
                  </select>
                </div>
                <div class="form-field full actions">
                  <button class="btn" type="submit">Provision User</button>
                </div>
              </form>
            </div>
          </article>

          <article class="panel">
            <div class="panel-header">
              <div>
                <h3>Provisioned Users</h3>
                <p>Current active accounts and role controls.</p>
              </div>
              <span class="tag soft" id="userCountTag">0 users</span>
            </div>
            <div class="panel-body">
              <div id="usersContainer" class="user-list"></div>
            </div>
          </article>
        </section>
      </section>
    </main>
  </div>

  <script>
    const state = {
      statistics: null,
      reports: [],
      users: [],
      noticeTimer: null,
    };

    const roleSelect = document.getElementById("roleSelect");
    const notice = document.getElementById("notice");
    const reportsContainer = document.getElementById("reportsContainer");
    const usersContainer = document.getElementById("usersContainer");
    const staffAccessNote = document.getElementById("staffAccessNote");

    const escapeHtml = (value = "") => {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    };

    const isPrivilegedRole = () => {
      return roleSelect.value === "ADMIN";
    };

    const api = async (url, options = {}) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "x-user-role": roleSelect.value,
          ...(options.headers || {}),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Request failed");
      }

      return result.data;
    };

    const showNotice = (message, isError = false) => {
      notice.textContent = message;
      notice.className = isError ? "notice error" : "notice";
      notice.style.display = "block";

      window.clearTimeout(state.noticeTimer);
      state.noticeTimer = window.setTimeout(() => {
        notice.style.display = "none";
      }, 3200);
    };

    const renderStatistics = () => {
      if (!state.statistics) {
        document.getElementById("totalClubs").textContent = "--";
        document.getElementById("totalMembers").textContent = "--";
        document.getElementById("upcomingEvents").textContent = "--";
        document.getElementById("studentParticipation").textContent = "--%";
        document.getElementById("participationBar").style.width = "0%";
        return;
      }

      const stats = state.statistics;
      const participation = typeof stats.studentParticipation === "number"
        ? stats.studentParticipation
        : 0;

      document.getElementById("totalClubs").textContent = stats.totalClubs ?? "--";
      document.getElementById("totalMembers").textContent = stats.totalMembers ?? "--";
      document.getElementById("upcomingEvents").textContent = stats.upcomingEvents ?? "--";
      document.getElementById("studentParticipation").textContent = participation.toFixed(2) + "%";
      document.getElementById("participationBar").style.width = Math.min(participation, 100) + "%";
    };

    const renderReports = () => {
      document.getElementById("reportCountTag").textContent = state.reports.length + " reports";

      if (!state.reports.length) {
        reportsContainer.innerHTML = [
          '<div class="empty">',
          '<strong>No reports yet</strong>',
          '<span>Create a club, approve members, then record attendance to populate this section.</span>',
          '<div class="actions" style="margin-top: 12px;">',
          '<a class="btn secondary" href="/club-management">Open Clubs</a>',
          '<a class="btn secondary" href="/attendance">Open Attendance</a>',
          '</div>',
          '</div>',
        ].join("");
        return;
      }

      reportsContainer.innerHTML = state.reports.map((report) => {
        const attendancePercent = report.attendance?.attendancePercentage ?? 0;
        const participationPercent = report.attendance?.participationPercentage ?? 0;
        const pending = report.pendingJoinRequests ?? 0;

        return [
          '<article class="report-card">',
          '<h4>' + escapeHtml(report.clubName) + '</h4>',
          '<div class="report-meta">',
          '<span class="tag">' + escapeHtml(report.category || "Club") + '</span>',
          '<span class="tag soft">' + escapeHtml(String(report.members || 0)) + ' members</span>',
          '<span class="tag warning">' + escapeHtml(String(pending)) + ' pending</span>',
          '</div>',
          '<p>' + escapeHtml(report.leader?.name || "No leader assigned") + '</p>',
          '<div class="report-stats">',
          '<div class="report-stat"><span>Attendance</span><strong>' + attendancePercent + '%</strong></div>',
          '<div class="report-stat"><span>Participation</span><strong>' + participationPercent + '%</strong></div>',
          '<div class="report-stat"><span>Activities</span><strong>' + escapeHtml(String(report.activities || 0)) + '</strong></div>',
          '</div>',
          '</article>',
        ].join("");
      }).join("");
    };

    const renderUsers = () => {
      const privileged = isPrivilegedRole();
      staffAccessNote.textContent = privileged
        ? "Create user accounts, assign roles, and issue temporary passwords."
        : "User administration is unavailable for this role.";

      if (!privileged) {
        usersContainer.innerHTML = [
          '<div class="empty">',
          '<strong>Access restricted</strong>',
          '<span>Switch to ADMIN to manage users.</span>',
          '</div>',
        ].join("");
        document.getElementById("provisionForm").style.display = "none";
        document.getElementById("userCountTag").textContent = "0 users";
        return;
      }

      document.getElementById("provisionForm").style.display = "grid";

      if (!state.users.length) {
        usersContainer.innerHTML = [
          '<div class="empty">',
          '<strong>No provisioned users</strong>',
          '<span>New admin, leader, and member accounts will appear here.</span>',
          '</div>',
        ].join("");
        document.getElementById("userCountTag").textContent = "0 users";
        return;
      }

      document.getElementById("userCountTag").textContent = state.users.length + " users";

      usersContainer.innerHTML = state.users.map((user) => {
        return [
          '<article class="user-card">',
          '<div class="user-head">',
          '<div>',
          '<strong>' + escapeHtml(user.name) + '</strong>',
          '<span>' + escapeHtml(user.email) + '</span>',
          '</div>',
          '<span class="tag soft">' + escapeHtml(user.role) + '</span>',
          '</div>',
          '<div class="form-grid">',
          '<div class="form-field">',
          '<label>Explicit role</label>',
          '<select data-role-user="' + escapeHtml(user.id) + '">',
          '<option value="ADMIN" ' + (user.role === "ADMIN" ? "selected" : "") + '>ADMIN</option>',
          '<option value="LEADER" ' + (user.role === "LEADER" ? "selected" : "") + '>LEADER</option>',
          '<option value="MEMBER" ' + (user.role === "MEMBER" ? "selected" : "") + '>MEMBER</option>',
          '</select>',
          '</div>',
          '<div class="form-field">',
          '<label>Password reset</label>',
          '<input data-password-user="' + escapeHtml(user.id) + '" type="password" placeholder="New temporary password">',
          '</div>',
          '</div>',
          '<div class="actions">',
          '<button class="btn secondary" type="button" data-assign-user="' + escapeHtml(user.id) + '">Save Role</button>',
          '<button class="btn warning" type="button" data-reset-user="' + escapeHtml(user.id) + '">Reset Password</button>',
          '</div>',
          '</article>',
        ].join("");
      }).join("");

      usersContainer.querySelectorAll("[data-assign-user]").forEach((button) => {
        button.addEventListener("click", async () => {
          const userId = button.getAttribute("data-assign-user");
          const select = usersContainer.querySelector("[data-role-user='" + userId + "']");
          try {
            await api("/users/" + userId + "/role", {
              method: "PATCH",
              body: JSON.stringify({ role: select.value }),
            });
            showNotice("Role updated successfully");
            await loadUsers();
          } catch (error) {
            showNotice(error.message, true);
          }
        });
      });

      usersContainer.querySelectorAll("[data-reset-user]").forEach((button) => {
        button.addEventListener("click", async () => {
          const userId = button.getAttribute("data-reset-user");
          const passwordInput = usersContainer.querySelector("[data-password-user='" + userId + "']");

          if (!passwordInput.value.trim()) {
            showNotice("Enter a new password before resetting", true);
            return;
          }

          try {
            await api("/users/" + userId + "/password-reset", {
              method: "POST",
              body: JSON.stringify({ password: passwordInput.value }),
            });
            passwordInput.value = "";
            showNotice("Password reset successfully");
            await loadUsers();
          } catch (error) {
            showNotice(error.message, true);
          }
        });
      });
    };

    const loadStatistics = async () => {
      state.statistics = await api("/dashboard/statistics");
    };

    const loadReports = async () => {
      state.reports = await api("/dashboard/reports/club-activity");
    };

    const loadUsers = async () => {
      if (!isPrivilegedRole()) {
        state.users = [];
        renderUsers();
        return;
      }

      state.users = await api("/users");
      renderUsers();
    };

    const loadDashboard = async () => {
      try {
        await Promise.all([loadStatistics(), loadReports()]);
        renderStatistics();
        renderReports();
      } catch (error) {
        state.statistics = null;
        state.reports = [];
        renderStatistics();
        renderReports();
        showNotice(error.message, true);
      }

      try {
        await loadUsers();
      } catch (error) {
        showNotice(error.message, true);
      }
    };

    document.getElementById("refreshBtn").addEventListener("click", loadDashboard);

    roleSelect.addEventListener("change", async () => {
      renderUsers();
      await loadDashboard();
    });

    document.getElementById("provisionForm").addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!isPrivilegedRole()) {
        showNotice("Only ADMIN can provision users", true);
        return;
      }

      const payload = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        role: document.getElementById("role").value,
      };

      try {
        await api("/users", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        event.target.reset();
        document.getElementById("role").value = "MEMBER";
        showNotice("User provisioned successfully");
        await loadUsers();
      } catch (error) {
        showNotice(error.message, true);
      }
    });

    loadDashboard();
  </script>
</body>
</html>`;

module.exports = renderDashboardPage;
