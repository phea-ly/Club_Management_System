function buildNav(currentUser) {
    if (!currentUser) {
        return `
            <a href="/auth/login">Sign In</a>
        `;
    }

    const role = String(currentUser.role || "").toLowerCase();
    const links = [];

    if (role === "admin") {
        links.push(`
            <a href="/users">Users</a>
            <a href="/users/new">Create User</a>
        `);
    }

    if (role === "admin" || role === "club_leader" || role === "member") {
        links.push(`
            <a href="/clubs">Clubs</a>
            <a href="/events">Events</a>
        `);
    }

    if (role === "admin" || role === "club_leader") {
        links.push(`
            <a href="/members">Members</a>
            <a href="/members/new">Add Member</a>
            <a href="/events/new">Add Event</a>
            <a href="/attendance">Attendance</a>
        `);
    }

    links.push(`
        <a href="/profile/${currentUser.id}">My Profile</a>
        <form method="POST" action="/auth/logout" style="margin:0;padding:0;background:transparent;">
            <button class="secondary" type="submit" style="padding:8px 12px;">Logout</button>
        </form>
    `);

    return links.join("");
}

function mainLayout(title, content, options = {}) {
    const { currentUser = null } = options;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; background: linear-gradient(180deg, #f8fafc 0%, #edf7f7 100%); color: #1f2937; }
                header { background: linear-gradient(135deg, #0f766e, #155e75); color: white; padding: 16px 28px; box-shadow: 0 12px 30px rgba(15, 118, 110, 0.18); }
                header .header-inner { display: flex; justify-content: space-between; gap: 16px; align-items: center; flex-wrap: wrap; }
                nav { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
                nav a { color: white; text-decoration: none; font-weight: 600; }
                main { max-width: 1050px; margin: 28px auto; padding: 0 18px; }
                table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
                th, td { padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
                th { background: #ecfeff; }
                form { background: white; padding: 18px; border-radius: 8px; margin-bottom: 18px; }
                label { display: block; margin-top: 12px; font-weight: 700; }
                input, select, textarea { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
                button, .button { display: inline-block; border: 0; border-radius: 6px; padding: 9px 12px; background: #0f766e; color: white; text-decoration: none; cursor: pointer; }
                .button.secondary, button.secondary { background: #475569; }
                .button.danger, button.danger { background: #b91c1c; }
                .actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
                .toolbar { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 18px; }
                .inline-filter { display: flex; gap: 8px; align-items: center; padding: 0; margin: 0; background: transparent; }
                .inline-filter select { min-width: 180px; margin-top: 0; }
                .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: capitalize; }
                .badge-active, .badge-scheduled { background: #d1fae5; color: #047857; }
                .badge-inactive, .badge-cancelled, .badge-suspended { background: #fee2e2; color: #b91c1c; }
                .badge-pending { background: #fef3c7; color: #b45309; }
                .badge-completed { background: #dbeafe; color: #1d4ed8; }
                .muted { color: #64748b; }
                .user-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(255,255,255,0.14); }
                .user-chip strong { text-transform: capitalize; }
            </style>
        </head>
        <body>
            <header>
                <div class="header-inner">
                    <div>
                        <h1 style="margin:0;">Club Management System</h1>
                        ${currentUser ? `<div class="user-chip"><span>Signed in as</span><strong>${currentUser.name}</strong><span>(${String(currentUser.role).toUpperCase()})</span></div>` : ""}
                    </div>
                    <nav>
                        ${buildNav(currentUser)}
                    </nav>
                </div>
            </header>
            <main>${content}</main>
        </body>
        </html>
    `;
}

module.exports = mainLayout;
