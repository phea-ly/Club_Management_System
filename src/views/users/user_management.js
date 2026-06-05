function userManagementPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Management</title>
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
    .user-card {
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
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
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

    .btn-link {
      background: transparent;
      color: var(--primary);
      padding-inline: 4px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
    }

    .user-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
    }

    .user-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    .user-name {
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

    @media (max-width: 760px) {
      .topbar,
      .toolbar,
      .grid {
        grid-template-columns: 1fr;
      }

      .topbar {
        align-items: stretch;
      }

      .actions {
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
      <h1>User Management</h1>
      <button class="btn-primary" id="newUserButton" type="button">Create User</button>
    </div>
  </header>

  <main class="wrap">
    <section class="toolbar">
      <div>
        <label for="searchInput">Search users</label>
        <input id="searchInput" type="search" placeholder="Search by name, email, role, or department" />
      </div>
      <div>
        <label for="actorRole">Current role</label>
        <select id="actorRole">
          <option value="ADMIN">Administrator</option>
          <option value="CLUB_LEADER">Club Leader</option>
          <option value="STUDENT">Student</option>
        </select>
      </div>
      <div>
        <label for="actorId">User ID</label>
        <input id="actorId" value="1" />
      </div>
    </section>

    <div id="notice" class="notice"></div>

    <section class="panel" id="userFormPanel" hidden>
      <div class="panel-head">
        <h2 id="formTitle">Create User</h2>
        <button class="btn-link" id="closeFormButton" type="button">Close</button>
      </div>

      <form id="userForm">
        <input id="userId" type="hidden" />
        <div class="grid">
          <div>
            <label for="name">Full name</label>
            <input id="name" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input id="email" type="email" required />
          </div>
          <div>
            <label for="role">Role</label>
            <select id="role" required>
              <option value="STUDENT">Student</option>
              <option value="CLUB_LEADER">Club Leader</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          <div>
            <label for="department">Department</label>
            <input id="department" />
          </div>
          <div>
            <label for="phone">Phone</label>
            <input id="phone" />
          </div>
          <div>
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="Required for new users" />
          </div>
        </div>
        <div class="actions">
          <button class="btn-secondary" id="resetFormButton" type="button">Reset</button>
          <button class="btn-primary" type="submit">Save User</button>
        </div>
      </form>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>My Profile</h2>
        <button class="btn-secondary" id="loadProfileButton" type="button">Load Profile</button>
      </div>
      <form id="profileForm">
        <div class="grid">
          <div>
            <label for="profileName">Full name</label>
            <input id="profileName" required />
          </div>
          <div>
            <label for="profileEmail">Email</label>
            <input id="profileEmail" type="email" required />
          </div>
          <div>
            <label for="profileDepartment">Department</label>
            <input id="profileDepartment" />
          </div>
          <div>
            <label for="profilePhone">Phone</label>
            <input id="profilePhone" />
          </div>
        </div>
        <div class="actions">
          <button class="btn-primary" type="submit">Update Profile</button>
        </div>
      </form>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>Change Password</h2>
      </div>
      <form id="passwordForm">
        <div class="grid">
          <div>
            <label for="currentPassword">Current password</label>
            <input id="currentPassword" type="password" required />
          </div>
          <div>
            <label for="newPassword">New password</label>
            <input id="newPassword" type="password" minlength="6" required />
          </div>
        </div>
        <div class="actions">
          <button class="btn-primary" type="submit">Change Password</button>
        </div>
      </form>
    </section>

    <section>
      <div id="usersContainer" class="users-grid"></div>
    </section>
  </main>

  <script>
    const state = {
      users: [],
      search: "",
    };

    const elements = {
      actorId: document.getElementById("actorId"),
      actorRole: document.getElementById("actorRole"),
      closeFormButton: document.getElementById("closeFormButton"),
      currentPassword: document.getElementById("currentPassword"),
      department: document.getElementById("department"),
      email: document.getElementById("email"),
      formTitle: document.getElementById("formTitle"),
      loadProfileButton: document.getElementById("loadProfileButton"),
      name: document.getElementById("name"),
      newPassword: document.getElementById("newPassword"),
      newUserButton: document.getElementById("newUserButton"),
      notice: document.getElementById("notice"),
      password: document.getElementById("password"),
      passwordForm: document.getElementById("passwordForm"),
      phone: document.getElementById("phone"),
      profileDepartment: document.getElementById("profileDepartment"),
      profileEmail: document.getElementById("profileEmail"),
      profileForm: document.getElementById("profileForm"),
      profileName: document.getElementById("profileName"),
      profilePhone: document.getElementById("profilePhone"),
      resetFormButton: document.getElementById("resetFormButton"),
      role: document.getElementById("role"),
      searchInput: document.getElementById("searchInput"),
      userForm: document.getElementById("userForm"),
      userFormPanel: document.getElementById("userFormPanel"),
      userId: document.getElementById("userId"),
      usersContainer: document.getElementById("usersContainer"),
    };

    function authHeaders() {
      return {
        "content-type": "application/json",
        "x-user-id": elements.actorId.value.trim() || "1",
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

    async function loadUsers() {
      try {
        const data = await requestJson("/api/users");
        state.users = data.users || [];
        renderUsers();
      } catch (error) {
        state.users = [];
        renderUsers();
        showNotice(error.message, "error");
      }
    }

    async function loadProfile() {
      const data = await requestJson("/api/users/me");
      const user = data.user;
      elements.profileName.value = user.name || "";
      elements.profileEmail.value = user.email || "";
      elements.profileDepartment.value = user.department || "";
      elements.profilePhone.value = user.phone || "";
    }

    function filteredUsers() {
      const term = state.search.toLowerCase();

      if (!term) {
        return state.users;
      }

      return state.users.filter((user) => {
        return [user.name, user.email, user.role, user.department]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      });
    }

    function renderUsers() {
      const users = filteredUsers();
      elements.usersContainer.innerHTML = "";

      if (users.length === 0) {
        elements.usersContainer.innerHTML = '<div class="empty">No users to display.</div>';
        return;
      }

      users.forEach((user) => {
        const card = document.createElement("article");
        card.className = "user-card";
        card.innerHTML = \`
          <div class="user-head">
            <h3 class="user-name">\${escapeHtml(user.name)}</h3>
            <span class="badge">\${escapeHtml(user.role)}</span>
          </div>
          <p class="meta"><strong>Email:</strong> \${escapeHtml(user.email)}</p>
          <p class="meta"><strong>Department:</strong> \${escapeHtml(user.department || "Not provided")}</p>
          <p class="meta"><strong>Phone:</strong> \${escapeHtml(user.phone || "Not provided")}</p>
          <div class="card-actions">
            <button class="btn-secondary" data-action="edit" data-id="\${user.id}" type="button">Edit</button>
            <button class="btn-secondary" data-action="role" data-id="\${user.id}" type="button">Assign Role</button>
            <button class="btn-danger" data-action="delete" data-id="\${user.id}" type="button">Delete</button>
          </div>
        \`;
        elements.usersContainer.appendChild(card);
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

    function openForm(user = null) {
      elements.userFormPanel.hidden = false;
      elements.formTitle.textContent = user ? "Update User" : "Create User";
      elements.userId.value = user ? user.id : "";
      elements.name.value = user ? user.name : "";
      elements.email.value = user ? user.email : "";
      elements.role.value = user ? user.role : "STUDENT";
      elements.department.value = user ? user.department || "" : "";
      elements.phone.value = user ? user.phone || "" : "";
      elements.password.value = "";
      elements.password.required = !user;
      elements.name.focus();
    }

    function closeForm() {
      elements.userForm.reset();
      elements.userId.value = "";
      elements.password.required = false;
      elements.userFormPanel.hidden = true;
    }

    function getUserPayload() {
      const payload = {
        name: elements.name.value,
        email: elements.email.value,
        role: elements.role.value,
        department: elements.department.value,
        phone: elements.phone.value,
      };

      if (elements.password.value) {
        payload.password = elements.password.value;
      }

      return payload;
    }

    async function saveUser(event) {
      event.preventDefault();

      const id = elements.userId.value;
      const method = id ? "PUT" : "POST";
      const url = id ? "/api/users/" + id : "/api/users";

      try {
        await requestJson(url, {
          method,
          body: JSON.stringify(getUserPayload()),
        });
        closeForm();
        await loadUsers();
        showNotice(id ? "User updated." : "User created.");
      } catch (error) {
        showNotice(error.message, "error");
      }
    }

    async function updateProfile(event) {
      event.preventDefault();

      try {
        await requestJson("/api/users/me/profile", {
          method: "PUT",
          body: JSON.stringify({
            name: elements.profileName.value,
            email: elements.profileEmail.value,
            department: elements.profileDepartment.value,
            phone: elements.profilePhone.value,
          }),
        });
        await loadUsers();
        showNotice("Profile updated.");
      } catch (error) {
        showNotice(error.message, "error");
      }
    }

    async function changePassword(event) {
      event.preventDefault();

      try {
        await requestJson("/api/users/me/password", {
          method: "PATCH",
          body: JSON.stringify({
            currentPassword: elements.currentPassword.value,
            newPassword: elements.newPassword.value,
          }),
        });
        elements.passwordForm.reset();
        showNotice("Password changed.");
      } catch (error) {
        showNotice(error.message, "error");
      }
    }

    async function handleUserAction(event) {
      const button = event.target.closest("button[data-action]");

      if (!button) {
        return;
      }

      const user = state.users.find((item) => String(item.id) === String(button.dataset.id));

      if (!user) {
        return;
      }

      if (button.dataset.action === "edit") {
        openForm(user);
        return;
      }

      if (button.dataset.action === "role") {
        const role = prompt("Assign role: ADMIN, CLUB_LEADER, or STUDENT", user.role);

        if (!role) {
          return;
        }

        try {
          await requestJson("/api/users/" + user.id + "/role", {
            method: "PATCH",
            body: JSON.stringify({ role }),
          });
          await loadUsers();
          showNotice("Role assigned.");
        } catch (error) {
          showNotice(error.message, "error");
        }
        return;
      }

      if (button.dataset.action === "delete") {
        if (!confirm("Delete this user account?")) {
          return;
        }

        try {
          await requestJson("/api/users/" + user.id, { method: "DELETE" });
          await loadUsers();
          showNotice("User deleted.");
        } catch (error) {
          showNotice(error.message, "error");
        }
      }
    }

    elements.actorRole.addEventListener("change", () => {
      elements.actorId.value = elements.actorRole.value === "ADMIN" ? "1" : "2";
      loadUsers();
      loadProfile().catch((error) => showNotice(error.message, "error"));
    });
    elements.closeFormButton.addEventListener("click", closeForm);
    elements.loadProfileButton.addEventListener("click", () => {
      loadProfile().catch((error) => showNotice(error.message, "error"));
    });
    elements.newUserButton.addEventListener("click", () => openForm());
    elements.passwordForm.addEventListener("submit", changePassword);
    elements.profileForm.addEventListener("submit", updateProfile);
    elements.resetFormButton.addEventListener("click", () => openForm());
    elements.searchInput.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderUsers();
    });
    elements.userForm.addEventListener("submit", saveUser);
    elements.usersContainer.addEventListener("click", handleUserAction);

    loadUsers();
    loadProfile().catch((error) => showNotice(error.message, "error"));
  </script>
</body>
</html>`;
}

module.exports = userManagementPage;
