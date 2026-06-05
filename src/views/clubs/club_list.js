const renderClubListPage = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Club Management</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #17202a;
      --muted: #667085;
      --line: #d8dee8;
      --surface: #ffffff;
      --page: #f6f8fb;
      --primary: #0f766e;
      --primary-dark: #115e59;
      --danger: #b42318;
      --warning: #b54708;
      --ok: #067647;
      --blue: #175cd3;
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
    textarea,
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
      background: #102a43;
      color: #e6edf5;
      padding: 24px 18px;
    }

    .brand {
      margin-bottom: 28px;
    }

    .brand h1 {
      margin: 0;
      font-size: 24px;
      line-height: 1.2;
    }

    .brand p {
      margin: 8px 0 0;
      color: #b8c7d9;
      font-size: 14px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      min-height: 42px;
      padding: 10px 12px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .nav-item::before {
      content: none;
      display: none;
    }

    .main {
      padding: 28px;
      min-width: 0;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .topbar h2 {
      margin: 0;
      font-size: 28px;
      line-height: 1.2;
    }

    .topbar p {
      margin: 6px 0 0;
      color: var(--muted);
      line-height: 1.45;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: flex-end;
    }

    .btn {
      min-height: 38px;
      padding: 9px 14px;
      border-radius: 6px;
      background: var(--primary);
      color: white;
      font-weight: 700;
    }

    .btn:hover {
      background: var(--primary-dark);
    }

    .btn.secondary {
      background: #e8eef5;
      color: #1d2939;
    }

    .btn.danger {
      background: var(--danger);
    }

    .btn.small {
      min-height: 32px;
      padding: 7px 10px;
      font-size: 13px;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 18px;
      align-items: start;
    }

    .panel,
    .club-card,
    .modal {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 8px;
    }

    .panel {
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--line);
    }

    .panel-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .search {
      width: min(320px, 100%);
      min-height: 36px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 8px 10px;
    }

    .club-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
      padding: 16px;
    }

    .club-card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .club-card h4 {
      margin: 0;
      font-size: 18px;
      line-height: 1.25;
    }

    .club-card p {
      margin: 0;
      color: var(--muted);
      line-height: 1.45;
    }

    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      min-height: 26px;
      padding: 4px 8px;
      border-radius: 999px;
      background: #e6f4f1;
      color: #0f5f59;
      font-size: 12px;
      font-weight: 700;
    }

    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: auto;
    }

    .details {
      padding: 16px;
      position: sticky;
      top: 18px;
    }

    .details h3 {
      margin: 0 0 10px;
      font-size: 20px;
    }

    .detail-block {
      border-top: 1px solid var(--line);
      padding-top: 14px;
      margin-top: 14px;
    }

    .detail-label {
      margin: 0 0 5px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .detail-value {
      margin: 0;
      line-height: 1.45;
    }

    .request-item,
    .attendance-item,
    .member-item {
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 10px;
      margin-top: 8px;
    }

    .request-item strong,
    .attendance-item strong,
    .member-item strong {
      display: block;
      margin-bottom: 4px;
    }

    .attendance-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 150px;
      gap: 10px;
      align-items: center;
      border-top: 1px solid var(--line);
      padding-top: 10px;
      margin-top: 10px;
    }

    .attendance-row:first-child {
      border-top: 0;
      padding-top: 0;
      margin-top: 0;
    }

    .metric-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: 8px;
    }

    .metric {
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 8px;
    }

    .metric strong {
      display: block;
      font-size: 18px;
      line-height: 1.2;
    }

    .metric span {
      color: var(--muted);
      font-size: 12px;
    }

    .status {
      font-size: 12px;
      font-weight: 700;
      color: var(--warning);
    }

    .status.approved {
      color: var(--ok);
    }

    .status.rejected {
      color: var(--danger);
    }

    .empty {
      padding: 22px 16px;
      color: var(--muted);
      text-align: center;
    }

    .notice {
      min-height: 38px;
      margin-bottom: 14px;
      padding: 10px 12px;
      border-radius: 6px;
      background: #eff8ff;
      color: var(--blue);
      border: 1px solid #b2ddff;
      display: none;
    }

    .notice.error {
      background: #fff1f3;
      border-color: #fecdd6;
      color: var(--danger);
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(16, 24, 40, 0.48);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 10;
    }

    .modal {
      width: min(640px, 100%);
      max-height: 90vh;
      overflow: auto;
      padding: 18px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 20px;
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
      font-size: 13px;
      color: #344054;
      font-weight: 700;
    }

    input,
    textarea,
    select {
      width: 100%;
      min-height: 38px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 9px 10px;
      background: #fff;
      color: var(--ink);
    }

    textarea {
      resize: vertical;
      min-height: 88px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }

    @media (max-width: 920px) {
      .shell {
        grid-template-columns: 1fr;
      }

      .sidebar {
        padding: 18px;
      }

      .layout {
        grid-template-columns: 1fr;
      }

      .details {
        position: static;
      }
    }

    @media (max-width: 640px) {
      .main {
        padding: 18px;
      }

      .topbar,
      .panel-header {
        flex-direction: column;
        align-items: stretch;
      }

      .toolbar {
        justify-content: flex-start;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .attendance-row,
      .metric-row {
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
        <p>Manage student clubs, leaders, members, and join requests.</p>
      </div>
      <div class="nav-item">Clubs</div>
    </aside>

    <main class="main">
      <section class="topbar">
        <div>
          <h2>Student Clubs</h2>
          <p>Create clubs, keep details updated, and review student requests.</p>
        </div>
        <div class="toolbar">
          <select id="roleSelect" aria-label="Current role">
            <option value="ADMIN">Admin</option>
            <option value="LEADER">Leader</option>
            <option value="MEMBER">Member</option>
          </select>
          <button class="btn" id="newClubBtn" type="button">+ New Club</button>
        </div>
      </section>

      <div class="notice" id="notice"></div>

      <section class="layout">
        <div class="panel">
          <div class="panel-header">
            <h3>Available Clubs</h3>
            <input class="search" id="searchInput" type="search" placeholder="Search clubs">
          </div>
          <div class="club-grid" id="clubGrid"></div>
        </div>

        <aside class="panel details" id="detailsPanel">
          <h3>Club Details</h3>
          <p class="detail-value">Select a club to view leader details, activities, members, and join requests.</p>
        </aside>
      </section>
    </main>
  </div>

  <div class="modal-backdrop" id="clubModal">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="clubModalTitle">
      <div class="modal-header">
        <h3 id="clubModalTitle">Create Club</h3>
        <button class="btn secondary small" id="closeClubModal" type="button">Close</button>
      </div>
      <form id="clubForm">
        <input type="hidden" id="clubId">
        <div class="form-grid">
          <div class="form-field">
            <label for="clubName">Club name</label>
            <input id="clubName" required>
          </div>
          <div class="form-field">
            <label for="clubCategory">Category</label>
            <input id="clubCategory" required>
          </div>
          <div class="form-field">
            <label for="leaderName">Leader name</label>
            <input id="leaderName" required>
          </div>
          <div class="form-field">
            <label for="leaderEmail">Leader email</label>
            <input id="leaderEmail" type="email">
          </div>
          <div class="form-field full">
            <label for="clubDescription">Description</label>
            <textarea id="clubDescription" required></textarea>
          </div>
          <div class="form-field full">
            <label for="clubActivities">Activities</label>
            <textarea id="clubActivities" placeholder="One activity per line"></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn secondary" type="button" id="cancelClubForm">Cancel</button>
          <button class="btn" type="submit">Save Club</button>
        </div>
      </form>
    </div>
  </div>

  <div class="modal-backdrop" id="joinModal">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="joinModalTitle">
      <div class="modal-header">
        <h3 id="joinModalTitle">Request to Join</h3>
        <button class="btn secondary small" id="closeJoinModal" type="button">Close</button>
      </div>
      <form id="joinForm">
        <input type="hidden" id="joinClubId">
        <div class="form-grid">
          <div class="form-field">
            <label for="studentName">Student name</label>
            <input id="studentName" required>
          </div>
          <div class="form-field">
            <label for="studentEmail">Student email</label>
            <input id="studentEmail" type="email">
          </div>
          <div class="form-field full">
            <label for="joinReason">Reason</label>
            <textarea id="joinReason"></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn secondary" type="button" id="cancelJoinForm">Cancel</button>
          <button class="btn" type="submit">Submit Request</button>
        </div>
      </form>
    </div>
  </div>

  <div class="modal-backdrop" id="attendanceModal">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="attendanceModalTitle">
      <div class="modal-header">
        <h3 id="attendanceModalTitle">Take Attendance</h3>
        <button class="btn secondary small" id="closeAttendanceModal" type="button">Close</button>
      </div>
      <form id="attendanceForm">
        <input type="hidden" id="attendanceClubId">
        <div class="form-grid">
          <div class="form-field">
            <label for="activityName">Meeting or event</label>
            <input id="activityName" required>
          </div>
          <div class="form-field">
            <label for="activityDate">Date</label>
            <input id="activityDate" type="date" required>
          </div>
          <div class="form-field">
            <label for="activityType">Type</label>
            <select id="activityType">
              <option value="meeting">Meeting</option>
              <option value="event">Event</option>
              <option value="practice">Practice</option>
            </select>
          </div>
          <div class="form-field">
            <label for="recordedBy">Recorded by</label>
            <input id="recordedBy">
          </div>
          <div class="form-field full">
            <label>Members</label>
            <div id="attendanceMembers"></div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn secondary" type="button" id="cancelAttendanceForm">Cancel</button>
          <button class="btn" type="submit">Save Attendance</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    const state = {
      clubs: [],
      attendance: [],
      attendanceReport: null,
      selectedClubId: null,
      search: "",
    };

    const clubGrid = document.getElementById("clubGrid");
    const detailsPanel = document.getElementById("detailsPanel");
    const notice = document.getElementById("notice");
    const roleSelect = document.getElementById("roleSelect");

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.textContent = item.textContent.trim().replace(/^[A-Z]\\s+/, "");
    });

    const api = async (url, options = {}) => {
      const headers = {
        "Content-Type": "application/json",
        "x-user-role": roleSelect.value,
        ...(options.headers || {}),
      };

      const response = await fetch(url, { ...options, headers });
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
      window.setTimeout(() => {
        notice.style.display = "none";
      }, 3200);
    };

    const escapeHtml = (value = "") => {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    };

    const loadClubs = async () => {
      try {
        state.clubs = await api("/clubs", { headers: { "x-user-role": roleSelect.value } });
        if (!state.selectedClubId && state.clubs[0]) {
          state.selectedClubId = state.clubs[0].id;
        }
        await loadAttendance();
        render();
      } catch (error) {
        showNotice(error.message, true);
      }
    };

    const loadAttendance = async () => {
      if (!state.selectedClubId || roleSelect.value === "MEMBER") {
        state.attendance = [];
        state.attendanceReport = null;
        return;
      }

      state.attendance = await api("/attendance?clubId=" + encodeURIComponent(state.selectedClubId));
      state.attendanceReport = await api("/attendance/reports?clubId=" + encodeURIComponent(state.selectedClubId));
    };

    const filteredClubs = () => {
      const search = state.search.toLowerCase();
      return state.clubs.filter((club) => {
        return [club.name, club.description, club.category, club.leader?.name]
          .join(" ")
          .toLowerCase()
          .includes(search);
      });
    };

    const render = () => {
      renderClubGrid();
      renderDetails();
      document.getElementById("newClubBtn").style.display =
        roleSelect.value === "MEMBER" ? "none" : "inline-flex";
    };

    const renderClubGrid = () => {
      const clubs = filteredClubs();

      if (!clubs.length) {
        clubGrid.innerHTML = '<div class="empty">No clubs found.</div>';
        return;
      }

      clubGrid.innerHTML = clubs
        .map((club) => {
          const managerActions = roleSelect.value === "MEMBER"
            ? ""
            : '<button class="btn small secondary" type="button" onclick="openEditModal(\\'' + club.id + '\\')">Edit</button>' +
              '<button class="btn small danger" type="button" onclick="deleteClub(\\'' + club.id + '\\')">Delete</button>';

          return [
            '<article class="club-card">',
            '<div class="tag-row">',
            '<span class="tag">' + escapeHtml(club.category) + '</span>',
            '<span class="tag">' + club.members.length + ' members</span>',
            '</div>',
            '<h4>' + escapeHtml(club.name) + '</h4>',
            '<p>' + escapeHtml(club.description) + '</p>',
            '<p><strong>Leader:</strong> ' + escapeHtml(club.leader?.name || "No leader") + '</p>',
            '<div class="card-actions">',
            '<button class="btn small secondary" type="button" onclick="selectClub(\\'' + club.id + '\\')">View</button>',
            '<button class="btn small" type="button" onclick="openJoinModal(\\'' + club.id + '\\')">Join</button>',
            managerActions,
            '</div>',
            '</article>',
          ].join("");
        })
        .join("");
    };

    const renderDetails = () => {
      const club = state.clubs.find((item) => item.id === state.selectedClubId);

      if (!club) {
        detailsPanel.innerHTML = [
          '<h3>Club Details</h3>',
          '<p class="detail-value">Select a club to view leader details, activities, members, and join requests.</p>',
        ].join("");
        return;
      }

      const activities = club.activities.length
        ? club.activities.map((activity) => '<li>' + escapeHtml(activity) + '</li>').join("")
        : "<li>No activities yet</li>";

      const members = club.members.length
        ? club.members.map((member) => [
            '<div class="member-item">',
            '<strong>' + escapeHtml(member.name) + '</strong>',
            '<span>' + escapeHtml(member.email || "No email") + '</span>',
            '</div>',
          ].join("")).join("")
        : '<p class="detail-value">No members yet.</p>';

      const requests = club.joinRequests.length
        ? club.joinRequests.map((request) => {
            const reviewActions = roleSelect.value === "MEMBER" || request.status !== "pending"
              ? ""
              : [
                  '<div class="card-actions">',
                  '<button class="btn small" type="button" onclick="reviewRequest(\\'' + club.id + '\\', \\'' + request.id + '\\', \\'approve\\')">Approve</button>',
                  '<button class="btn small danger" type="button" onclick="reviewRequest(\\'' + club.id + '\\', \\'' + request.id + '\\', \\'reject\\')">Reject</button>',
                  '</div>',
                ].join("");

            return [
              '<div class="request-item">',
              '<strong>' + escapeHtml(request.studentName) + '</strong>',
              '<span class="status ' + request.status + '">' + escapeHtml(request.status) + '</span>',
              '<p class="detail-value">' + escapeHtml(request.reason || "No reason provided") + '</p>',
              reviewActions,
              '</div>',
            ].join("");
          }).join("")
        : '<p class="detail-value">No join requests.</p>';

      const managerAttendanceAction = roleSelect.value === "MEMBER"
        ? ""
        : '<button class="btn small" type="button" onclick="openAttendanceModal(\\'' + club.id + '\\')">Take Attendance</button>';

      const report = state.attendanceReport?.totals || {
        activities: 0,
        attendancePercentage: 0,
        participationPercentage: 0,
      };

      const attendanceHistory = state.attendance.length
        ? state.attendance.slice(0, 5).map((attendance) => [
            '<div class="attendance-item">',
            '<strong>' + escapeHtml(attendance.activityName) + '</strong>',
            '<span>' + new Date(attendance.activityDate).toLocaleDateString() + ' - ' + escapeHtml(attendance.activityType) + '</span>',
            '<div class="metric-row">',
            '<div class="metric"><strong>' + attendance.summary.present + '</strong><span>Present</span></div>',
            '<div class="metric"><strong>' + attendance.summary.late + '</strong><span>Late</span></div>',
            '<div class="metric"><strong>' + attendance.summary.absent + '</strong><span>Absent</span></div>',
            '</div>',
            '</div>',
          ].join("")).join("")
        : '<p class="detail-value">No attendance recorded yet.</p>';

      detailsPanel.innerHTML = [
        '<h3>' + escapeHtml(club.name) + '</h3>',
        '<div class="tag-row">',
        '<span class="tag">' + escapeHtml(club.category) + '</span>',
        '<span class="tag">' + club.joinRequests.filter((request) => request.status === "pending").length + ' pending</span>',
        '</div>',
        '<div class="card-actions">',
        managerAttendanceAction,
        '</div>',
        '<div class="detail-block">',
        '<p class="detail-label">Description</p>',
        '<p class="detail-value">' + escapeHtml(club.description) + '</p>',
        '</div>',
        '<div class="detail-block">',
        '<p class="detail-label">Leader</p>',
        '<p class="detail-value">' + escapeHtml(club.leader?.name || "") + '<br>' + escapeHtml(club.leader?.email || "") + '</p>',
        '</div>',
        '<div class="detail-block">',
        '<p class="detail-label">Activities</p>',
        '<ul class="detail-value">' + activities + '</ul>',
        '</div>',
        '<div class="detail-block">',
        '<p class="detail-label">Members</p>',
        members,
        '</div>',
        '<div class="detail-block">',
        '<p class="detail-label">Attendance Report</p>',
        '<div class="metric-row">',
        '<div class="metric"><strong>' + report.activities + '</strong><span>Activities</span></div>',
        '<div class="metric"><strong>' + report.attendancePercentage + '%</strong><span>Attendance</span></div>',
        '<div class="metric"><strong>' + report.participationPercentage + '%</strong><span>Participation</span></div>',
        '</div>',
        attendanceHistory,
        '</div>',
        '<div class="detail-block">',
        '<p class="detail-label">Join Requests</p>',
        requests,
        '</div>',
      ].join("");
    };

    const selectClub = async (id) => {
      state.selectedClubId = id;
      try {
        await loadAttendance();
      } catch (error) {
        showNotice(error.message, true);
      }
      render();
    };

    const openClubModal = () => {
      document.getElementById("clubModalTitle").textContent = "Create Club";
      document.getElementById("clubForm").reset();
      document.getElementById("clubId").value = "";
      document.getElementById("clubModal").style.display = "flex";
    };

    const openEditModal = (id) => {
      const club = state.clubs.find((item) => item.id === id);
      if (!club) return;

      document.getElementById("clubModalTitle").textContent = "Edit Club";
      document.getElementById("clubId").value = club.id;
      document.getElementById("clubName").value = club.name;
      document.getElementById("clubCategory").value = club.category;
      document.getElementById("leaderName").value = club.leader?.name || "";
      document.getElementById("leaderEmail").value = club.leader?.email || "";
      document.getElementById("clubDescription").value = club.description;
      document.getElementById("clubActivities").value = club.activities.join("\\n");
      document.getElementById("clubModal").style.display = "flex";
    };

    const closeClubModal = () => {
      document.getElementById("clubModal").style.display = "none";
    };

    const openJoinModal = (clubId) => {
      document.getElementById("joinForm").reset();
      document.getElementById("joinClubId").value = clubId;
      document.getElementById("joinModal").style.display = "flex";
    };

    const closeJoinModal = () => {
      document.getElementById("joinModal").style.display = "none";
    };

    const openAttendanceModal = (clubId) => {
      const club = state.clubs.find((item) => item.id === clubId);
      if (!club) return;

      if (!club.members.length) {
        showNotice("Add members before recording attendance", true);
        return;
      }

      document.getElementById("attendanceForm").reset();
      document.getElementById("attendanceClubId").value = clubId;
      document.getElementById("activityDate").value = new Date().toISOString().slice(0, 10);
      document.getElementById("recordedBy").value = club.leader?.name || "";
      document.getElementById("attendanceMembers").innerHTML = club.members.map((member, index) => [
        '<div class="attendance-row">',
        '<div>',
        '<strong>' + escapeHtml(member.name) + '</strong>',
        '<div class="detail-value">' + escapeHtml(member.email || "No email") + '</div>',
        '</div>',
        '<select data-member-index="' + index + '">',
        '<option value="present">Present</option>',
        '<option value="absent">Absent</option>',
        '<option value="late">Late</option>',
        '</select>',
        '</div>',
      ].join("")).join("");
      document.getElementById("attendanceModal").style.display = "flex";
    };

    const closeAttendanceModal = () => {
      document.getElementById("attendanceModal").style.display = "none";
    };

    const deleteClub = async (id) => {
      if (!confirm("Delete this club?")) return;

      try {
        await api("/clubs/" + id, { method: "DELETE" });
        if (state.selectedClubId === id) state.selectedClubId = null;
        showNotice("Club deleted successfully");
        await loadClubs();
      } catch (error) {
        showNotice(error.message, true);
      }
    };

    const reviewRequest = async (clubId, requestId, action) => {
      try {
        await api("/clubs/" + clubId + "/requests/" + requestId + "/" + action, { method: "POST" });
        showNotice("Request " + (action === "approve" ? "approved" : "rejected"));
        await loadClubs();
      } catch (error) {
        showNotice(error.message, true);
      }
    };

    document.getElementById("newClubBtn").addEventListener("click", openClubModal);
    document.getElementById("closeClubModal").addEventListener("click", closeClubModal);
    document.getElementById("cancelClubForm").addEventListener("click", closeClubModal);
    document.getElementById("closeJoinModal").addEventListener("click", closeJoinModal);
    document.getElementById("cancelJoinForm").addEventListener("click", closeJoinModal);
    document.getElementById("closeAttendanceModal").addEventListener("click", closeAttendanceModal);
    document.getElementById("cancelAttendanceForm").addEventListener("click", closeAttendanceModal);

    document.getElementById("searchInput").addEventListener("input", (event) => {
      state.search = event.target.value;
      renderClubGrid();
    });

    roleSelect.addEventListener("change", async () => {
      try {
        await loadAttendance();
      } catch (error) {
        showNotice(error.message, true);
      }
      render();
    });

    document.getElementById("clubForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = document.getElementById("clubId").value;
      const payload = {
        name: document.getElementById("clubName").value.trim(),
        description: document.getElementById("clubDescription").value.trim(),
        category: document.getElementById("clubCategory").value.trim(),
        leader: {
          name: document.getElementById("leaderName").value.trim(),
          email: document.getElementById("leaderEmail").value.trim(),
        },
        activities: document.getElementById("clubActivities").value
          .split("\\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      try {
        await api(id ? "/clubs/" + id : "/clubs", {
          method: id ? "PUT" : "POST",
          body: JSON.stringify(payload),
        });
        closeClubModal();
        showNotice(id ? "Club updated successfully" : "Club created successfully");
        await loadClubs();
      } catch (error) {
        showNotice(error.message, true);
      }
    });

    document.getElementById("joinForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const clubId = document.getElementById("joinClubId").value;
      const payload = {
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("studentEmail").value.trim(),
        reason: document.getElementById("joinReason").value.trim(),
      };

      try {
        await api("/clubs/" + clubId + "/join", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        closeJoinModal();
        showNotice("Join request submitted");
        await loadClubs();
      } catch (error) {
        showNotice(error.message, true);
      }
    });

    document.getElementById("attendanceForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const clubId = document.getElementById("attendanceClubId").value;
      const club = state.clubs.find((item) => item.id === clubId);
      const records = Array.from(document.querySelectorAll("#attendanceMembers select")).map((select) => {
        const member = club.members[Number(select.dataset.memberIndex)];
        return {
          studentName: member.name,
          studentEmail: member.email,
          status: select.value,
        };
      });

      const payload = {
        clubId,
        activityName: document.getElementById("activityName").value.trim(),
        activityType: document.getElementById("activityType").value,
        activityDate: document.getElementById("activityDate").value,
        recordedBy: document.getElementById("recordedBy").value.trim(),
        records,
      };

      try {
        await api("/attendance", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        closeAttendanceModal();
        showNotice("Attendance saved");
        await loadAttendance();
        render();
      } catch (error) {
        showNotice(error.message, true);
      }
    });

    loadClubs();
  </script>
</body>
</html>`;

module.exports = renderClubListPage;
