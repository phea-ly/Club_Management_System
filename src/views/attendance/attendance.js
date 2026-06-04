const renderAttendancePage = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Attendance | Club Management</title>
  <style>
    :root {
      --bg: #eef4f0;
      --surface: #ffffff;
      --ink: #10221c;
      --muted: #5f6f69;
      --line: #d8e4de;
      --accent: #0f766e;
      --accent-dark: #0b5f59;
      --accent-soft: #d7f4ef;
      --danger: #b42318;
      --warning: #b54708;
      --shadow: 0 20px 45px rgba(13, 39, 33, 0.08);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at top left, rgba(15, 118, 110, 0.15), transparent 35%),
        linear-gradient(180deg, #f8fbfa 0%, var(--bg) 100%);
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

    .shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
    }

    .sidebar {
      padding: 28px 20px;
      background: linear-gradient(180deg, #0e2f29 0%, #0b241f 100%);
      color: #f1f7f5;
    }

    .brand {
      padding-bottom: 22px;
      margin-bottom: 22px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }

    .brand h1 {
      margin: 0;
      font-size: 28px;
      line-height: 1.1;
    }

    .brand p {
      margin: 10px 0 0;
      color: rgba(241, 247, 245, 0.7);
      line-height: 1.5;
    }

    .nav {
      display: grid;
      gap: 10px;
    }

    .nav a {
      display: flex;
      align-items: center;
      min-height: 46px;
      padding: 10px 14px;
      border-radius: 12px;
      color: #f8fffc;
      text-decoration: none;
      background: rgba(255, 255, 255, 0.08);
    }

    .nav .active,
    .nav a:hover {
      background: rgba(215, 244, 239, 0.18);
    }

    .main {
      min-width: 0;
      padding: 28px;
    }

    .hero {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .hero h2 {
      margin: 0;
      font-size: 34px;
      line-height: 1.1;
    }

    .hero p,
    .muted {
      color: var(--muted);
      line-height: 1.55;
    }

    .actions,
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }

    .btn {
      min-height: 42px;
      padding: 10px 14px;
      border-radius: 12px;
      background: var(--accent);
      color: #fff;
      font-weight: 700;
    }

    .btn:hover {
      background: var(--accent-dark);
    }

    .btn.secondary {
      background: #eaf3ef;
      color: #17352e;
    }

    .notice {
      display: none;
      margin-bottom: 18px;
      padding: 12px 14px;
      border: 1px solid #bfe5de;
      border-radius: 14px;
      background: #eefaf7;
      color: #13655d;
    }

    .notice.error {
      border-color: #f6c2c2;
      background: #fff1f1;
      color: var(--danger);
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 18px;
      align-items: start;
    }

    .panel {
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.92);
      box-shadow: var(--shadow);
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 18px;
      border-bottom: 1px solid var(--line);
    }

    .panel-header h3 {
      margin: 0;
      font-size: 20px;
    }

    .panel-body {
      padding: 18px;
    }

    .form-grid,
    .metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .field.full {
      grid-column: 1 / -1;
    }

    label {
      display: block;
      margin-bottom: 6px;
      color: #30403a;
      font-size: 13px;
      font-weight: 700;
    }

    input,
    select {
      width: 100%;
      min-height: 42px;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 10px 12px;
      color: var(--ink);
      background: #fff;
    }

    .member-list,
    .history-list {
      display: grid;
      gap: 12px;
    }

    .member-row,
    .history-card,
    .metric {
      border: 1px solid var(--line);
      border-radius: 14px;
      background: #fff;
      padding: 14px;
    }

    .member-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 140px;
      gap: 12px;
      align-items: center;
    }

    .member-row strong,
    .history-card strong,
    .metric strong {
      display: block;
    }

    .tag {
      display: inline-flex;
      min-height: 28px;
      align-items: center;
      padding: 4px 9px;
      border-radius: 999px;
      background: var(--accent-soft);
      color: #0c615a;
      font-size: 12px;
      font-weight: 700;
    }

    .tag.warning {
      background: #fff1dc;
      color: var(--warning);
    }

    .history-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .history-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .empty {
      padding: 24px;
      color: var(--muted);
      text-align: center;
      border: 1px dashed var(--line);
      border-radius: 14px;
      background: #fff;
    }

    @media (max-width: 1040px) {
      .shell,
      .grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 680px) {
      .main {
        padding: 18px;
      }

      .hero,
      .panel-header,
      .member-row {
        grid-template-columns: 1fr;
        flex-direction: column;
      }

      .form-grid,
      .metrics {
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
        <p>Record attendance and review participation across club activities.</p>
      </div>
      <nav class="nav" aria-label="Primary">
        <a href="/dashboard">Dashboard</a>
        <a href="/club-management">Club Management</a>
        <a class="active" href="/attendance">Attendance</a>
      </nav>
    </aside>

    <main class="main">
      <section class="hero">
        <div>
          <h2>Attendance</h2>
          <p>Choose a club, mark each member, and review activity history.</p>
        </div>
        <div class="actions">
          <button class="btn secondary" id="refreshBtn" type="button">Refresh</button>
          <a class="btn secondary" href="/logout">Log Out</a>
        </div>
      </section>

      <div class="notice" id="notice"></div>

      <section class="grid">
        <article class="panel">
          <div class="panel-header">
            <div>
              <h3>Record Attendance</h3>
              <p class="muted">Available for ADMIN and LEADER accounts.</p>
            </div>
          </div>
          <div class="panel-body">
            <form id="attendanceForm" class="form-grid">
              <div class="field full">
                <label for="clubSelect">Club</label>
                <select id="clubSelect" required></select>
              </div>
              <div class="field">
                <label for="activityName">Activity</label>
                <input id="activityName" placeholder="Weekly meeting" required>
              </div>
              <div class="field">
                <label for="activityType">Type</label>
                <select id="activityType">
                  <option value="meeting">Meeting</option>
                  <option value="event">Event</option>
                  <option value="training">Training</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>
              <div class="field full">
                <label for="activityDate">Date</label>
                <input id="activityDate" type="date" required>
              </div>
              <div class="field full">
                <label>Members</label>
                <div id="memberList" class="member-list"></div>
              </div>
              <div class="field full actions">
                <button class="btn" type="submit">Save Attendance</button>
              </div>
            </form>
          </div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <div>
              <h3>History</h3>
              <p class="muted">Filter by club and month.</p>
            </div>
          </div>
          <div class="panel-body">
            <div class="filters">
              <select id="filterClub"></select>
              <input id="filterMonth" type="month">
              <button class="btn secondary" id="applyFiltersBtn" type="button">Apply</button>
            </div>

            <div class="metrics" id="reportMetrics" style="margin: 16px 0;"></div>
            <div id="historyList" class="history-list"></div>
          </div>
        </article>
      </section>
    </main>
  </div>

  <script>
    const state = {
      clubs: [],
      history: [],
      report: null,
      noticeTimer: null,
    };

    const clubSelect = document.getElementById("clubSelect");
    const filterClub = document.getElementById("filterClub");
    const memberList = document.getElementById("memberList");
    const historyList = document.getElementById("historyList");
    const reportMetrics = document.getElementById("reportMetrics");
    const notice = document.getElementById("notice");

    document.getElementById("activityDate").valueAsDate = new Date();

    const escapeHtml = (value = "") => {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    };

    const api = async (url, options = {}) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
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

    const selectedClub = () => state.clubs.find((club) => club.id === clubSelect.value);

    const renderClubOptions = () => {
      const options = state.clubs.map((club) => {
        return '<option value="' + escapeHtml(club.id) + '">' + escapeHtml(club.name) + '</option>';
      }).join("");

      clubSelect.innerHTML = options || '<option value="">No clubs available</option>';
      filterClub.innerHTML = '<option value="">All clubs</option>' + options;
      renderMembers();
    };

    const renderMembers = () => {
      const club = selectedClub();
      const members = club?.members || [];

      if (!members.length) {
        memberList.innerHTML = '<div class="empty">This club has no approved members yet.</div>';
        return;
      }

      memberList.innerHTML = members.map((member, index) => {
        return [
          '<div class="member-row">',
          '<div>',
          '<strong>' + escapeHtml(member.name) + '</strong>',
          '<span class="muted">' + escapeHtml(member.email || "No email") + '</span>',
          '</div>',
          '<select data-member-index="' + index + '">',
          '<option value="present">Present</option>',
          '<option value="late">Late</option>',
          '<option value="absent">Absent</option>',
          '</select>',
          '</div>',
        ].join("");
      }).join("");
    };

    const renderReport = () => {
      const totals = state.report?.totals;

      if (!totals) {
        reportMetrics.innerHTML = "";
        return;
      }

      reportMetrics.innerHTML = [
        '<div class="metric"><span class="muted">Activities</span><strong>' + totals.activities + '</strong></div>',
        '<div class="metric"><span class="muted">Records</span><strong>' + totals.records + '</strong></div>',
        '<div class="metric"><span class="muted">Present</span><strong>' + totals.present + '</strong></div>',
        '<div class="metric"><span class="muted">Participation</span><strong>' + totals.participationPercentage + '%</strong></div>',
      ].join("");
    };

    const renderHistory = () => {
      if (!state.history.length) {
        historyList.innerHTML = '<div class="empty">No attendance records yet.</div>';
        return;
      }

      historyList.innerHTML = state.history.map((item) => {
        const club = state.clubs.find((entry) => entry.id === item.clubId);
        const summary = item.summary || {};
        const date = item.activityDate ? new Date(item.activityDate).toLocaleDateString() : "No date";

        return [
          '<article class="history-card">',
          '<div class="history-head">',
          '<div>',
          '<strong>' + escapeHtml(item.activityName) + '</strong>',
          '<span class="muted">' + escapeHtml(club?.name || item.clubId) + ' · ' + escapeHtml(date) + '</span>',
          '</div>',
          '<span class="tag">' + escapeHtml(item.activityType || "activity") + '</span>',
          '</div>',
          '<div class="history-stats">',
          '<span class="tag">Present ' + (summary.present || 0) + '</span>',
          '<span class="tag warning">Late ' + (summary.late || 0) + '</span>',
          '<span class="tag warning">Absent ' + (summary.absent || 0) + '</span>',
          '<span class="tag">Participation ' + (summary.participationPercentage || 0) + '%</span>',
          '</div>',
          '</article>',
        ].join("");
      }).join("");
    };

    const loadClubs = async () => {
      state.clubs = await api("/clubs");
      renderClubOptions();
    };

    const loadAttendance = async () => {
      const params = new URLSearchParams();

      if (filterClub.value) {
        params.set("clubId", filterClub.value);
      }

      if (document.getElementById("filterMonth").value) {
        params.set("month", document.getElementById("filterMonth").value);
      }

      const query = params.toString() ? "?" + params.toString() : "";
      state.history = await api("/attendance/history" + query);
      state.report = await api("/attendance/reports" + query);
      renderReport();
      renderHistory();
    };

    document.getElementById("attendanceForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const club = selectedClub();

      if (!club || !club.members?.length) {
        showNotice("Choose a club with approved members first", true);
        return;
      }

      const records = club.members.map((member, index) => {
        const status = memberList.querySelector("[data-member-index='" + index + "']").value;
        return {
          studentName: member.name,
          studentEmail: member.email || "",
          status,
        };
      });

      try {
        await api("/attendance", {
          method: "POST",
          body: JSON.stringify({
            clubId: club.id,
            activityName: document.getElementById("activityName").value,
            activityType: document.getElementById("activityType").value,
            activityDate: document.getElementById("activityDate").value,
            recordedBy: "Admin",
            records,
          }),
        });

        document.getElementById("activityName").value = "";
        showNotice("Attendance saved successfully");
        await loadAttendance();
      } catch (error) {
        showNotice(error.message, true);
      }
    });

    clubSelect.addEventListener("change", renderMembers);
    document.getElementById("applyFiltersBtn").addEventListener("click", loadAttendance);
    document.getElementById("refreshBtn").addEventListener("click", async () => {
      await loadClubs();
      await loadAttendance();
    });

    (async () => {
      try {
        await loadClubs();
        await loadAttendance();
      } catch (error) {
        showNotice(error.message, true);
      }
    })();
  </script>
</body>
</html>`;

module.exports = renderAttendancePage;
