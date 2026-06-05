function mainLayout(title, content) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; background: #f5f7fb; color: #1f2937; }
                header { background: #0f766e; color: white; padding: 16px 28px; }
                nav { display: flex; gap: 14px; flex-wrap: wrap; }
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
            </style>
        </head>
        <body>
            <header>
                <h1>Club Management System</h1>
                <nav>
                    <a href="/users">Users</a>
                    <a href="/users/new">Create User</a>
                    <a href="/members">Members</a>
                    <a href="/members/new">Add Member</a>
                    <a href="/events">Events</a>
                    <a href="/events/new">Add Event</a>
                </nav>
            </header>
            <main>${content}</main>
        </body>
        </html>
    `;
}

module.exports = mainLayout;
