const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const renderLoginPage = (message = "", redirect = "/dashboard") => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login | Club Management</title>
  <style>
    :root {
      --bg: #eef4f0;
      --surface: #ffffff;
      --ink: #10221c;
      --muted: #5f6f69;
      --line: #d8e4de;
      --accent: #0f766e;
      --accent-dark: #0b5f59;
      --danger: #b42318;
      --shadow: 0 20px 45px rgba(13, 39, 33, 0.08);
    }

    * {
      box-sizing: border-box;
    }

    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      padding: 24px;
      font-family: Arial, Helvetica, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at top left, rgba(15, 118, 110, 0.15), transparent 35%),
        linear-gradient(180deg, #f8fbfa 0%, var(--bg) 100%);
    }

    main {
      width: min(100%, 420px);
      padding: 28px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    h1 {
      margin: 0;
      font-size: 30px;
      line-height: 1.1;
    }

    p {
      margin: 10px 0 24px;
      color: var(--muted);
      line-height: 1.5;
    }

    label {
      display: block;
      margin: 14px 0 6px;
      font-size: 13px;
      font-weight: 700;
    }

    input {
      width: 100%;
      min-height: 44px;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 12px;
      font: inherit;
    }

    button {
      width: 100%;
      min-height: 44px;
      margin-top: 18px;
      border: 0;
      border-radius: 12px;
      background: var(--accent);
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    button:hover {
      background: var(--accent-dark);
    }

    .message {
      margin: 0 0 14px;
      padding: 10px 12px;
      border-radius: 12px;
      background: #fff1f1;
      color: var(--danger);
    }

    .hint {
      margin: 16px 0 0;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <main>
    <h1>Club Management</h1>
    <p>Sign in to manage attendance, clubs, reports, and staff access.</p>
    ${message ? `<div class="message">${escapeHtml(message)}</div>` : ""}
    <form method="post" action="/login">
      <input name="redirect" type="hidden" value="${escapeHtml(redirect)}">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" value="admin@club.local" required>

      <label for="password">Password</label>
      <input id="password" name="password" type="password" value="admin123" required>

      <button type="submit">Log In</button>
    </form>
    <p class="hint">Default admin: admin@club.local / admin123</p>
  </main>
</body>
</html>`;

module.exports = renderLoginPage;
