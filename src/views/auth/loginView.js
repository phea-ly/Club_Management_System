const mainLayout = require("../layouts/mainLayout");
const escapeHtml = require("../../utils/escapeHtml");

function loginView({ error = "", returnTo = "" } = {}) {
    return mainLayout("Sign In", `
        <div style="max-width: 480px; margin: 64px auto; background: white; padding: 28px; border-radius: 18px; box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);">
            <p class="muted" style="margin-top:0; text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px;">Secure Access</p>
            <h2 style="margin-top:0;">Sign in to continue</h2>
            <p class="muted">Use your email and password to access the club management system.</p>

            ${error ? `
                <div style="background:#fee2e2;color:#991b1b;padding:12px 14px;border-radius:10px;margin:18px 0;">
                    ${escapeHtml(error)}
                </div>
            ` : ""}

            <form method="POST" action="/auth/login" style="padding:0;background:transparent;box-shadow:none;">
                <input type="hidden" name="returnTo" value="${escapeHtml(returnTo)}">

                <label>Email</label>
                <input type="email" name="email" autocomplete="email" required>

                <label>Password</label>
                <input type="password" name="password" autocomplete="current-password" required>

                <div class="actions" style="margin-top:18px;">
                    <button type="submit">Sign In</button>
                </div>
            </form>
        </div>
    `);
}

module.exports = loginView;
