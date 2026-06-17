export function renderAdminLayout({ title = "Admin", content = "" }) {
  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title} - Feiermiete Admin</title>
        <style>
          * { box-sizing: border-box; }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f6f2ed;
            color: #171717;
          }

          .admin-shell {
            display: grid;
            grid-template-columns: 280px 1fr;
            min-height: 100vh;
          }

          .sidebar {
            background: #141414;
            color: white;
            padding: 30px 24px;
            position: sticky;
            top: 0;
            height: 100vh;
          }

          .brand {
            font-size: 28px;
            font-weight: 900;
            color: #d1111b;
            letter-spacing: -0.05em;
            margin-bottom: 6px;
          }

          .claim {
            font-size: 11px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #aaa;
            margin-bottom: 38px;
          }

          .sidebar a,
          .logout-button {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            color: white;
            text-decoration: none;
            padding: 14px 15px;
            border-radius: 14px;
            margin-bottom: 8px;
            font-weight: 800;
            background: transparent;
            border: 0;
            text-align: left;
            font-size: 15px;
            cursor: pointer;
          }

          .sidebar a:hover,
          .logout-button:hover {
            background: rgba(255,255,255,0.08);
          }

          .logout-form {
            margin-top: 32px;
          }

          .logout-button {
            color: #ffb4b4;
          }

          .main {
            padding: 38px;
          }

          .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
          }

          h1 {
            margin: 0;
            font-size: 38px;
            letter-spacing: -0.05em;
          }

          h2 {
            margin: 0 0 8px;
            font-size: 32px;
            letter-spacing: -0.04em;
          }

          .muted {
            color: #777;
          }

          .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #d1111b;
            color: white;
            text-decoration: none;
            border: none;
            border-radius: 999px;
            padding: 14px 22px;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 15px 30px rgba(209,17,27,0.18);
          }

          .button.black {
            background: #171717;
            box-shadow: none;
          }

          .card {
            background: white;
            border-radius: 24px;
            padding: 26px;
            box-shadow: 0 18px 45px rgba(0,0,0,0.06);
            border: 1px solid rgba(0,0,0,0.05);
          }

          .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
            margin-bottom: 24px;
          }

          .stat-card strong {
            display: block;
            font-size: 34px;
            margin-bottom: 10px;
          }

          .admin-section-title {
            margin: 34px 0 18px;
          }

          .admin-section-title h2 {
            margin: 0 0 6px;
            font-size: 26px;
            letter-spacing: -0.04em;
          }

          .action-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
            margin-top: 24px;
          }

          .action-card {
            background: white;
            border-radius: 24px;
            padding: 24px;
            text-decoration: none;
            color: #171717;
            box-shadow: 0 18px 45px rgba(0,0,0,0.06);
            border: 1px solid rgba(0,0,0,0.05);
            min-height: 160px;
          }

          .action-card span {
            display: inline-flex;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            background: #d1111b;
            color: white;
            font-weight: 900;
            margin-bottom: 18px;
          }

          .action-card strong {
            display: block;
            font-size: 20px;
            margin-bottom: 8px;
          }

          .action-card p {
            margin: 0;
            color: #777;
            line-height: 1.5;
          }

          .todo-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
          }

          .todo-card {
            background: white;
            border-radius: 24px;
            padding: 24px;
            box-shadow: 0 18px 45px rgba(0,0,0,0.06);
            border: 1px solid rgba(0,0,0,0.05);
          }

          .todo-card strong {
            display: block;
            font-size: 18px;
            margin-bottom: 8px;
          }

          .todo-card p {
            margin: 0;
            color: #777;
            line-height: 1.5;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            text-align: left;
            padding: 15px 10px;
            border-bottom: 1px solid #eee;
            vertical-align: top;
          }

          th {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #777;
          }

          input, textarea, select {
            width: 100%;
            padding: 14px 15px;
            border-radius: 14px;
            border: 1px solid #ddd;
            font-size: 15px;
            font-family: Arial, sans-serif;
            background: white;
          }

          label {
            display: block;
            font-weight: 800;
            margin-bottom: 8px;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }

          .form-row {
            margin-bottom: 18px;
          }

          .full {
            grid-column: 1 / -1;
          }

          .actions-cell {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
          }

          .actions-cell form {
            margin: 0;
          }

          .small-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 34px;
            padding: 0 12px;
            border-radius: 999px;
            border: 0;
            background: #171717;
            color: white;
            text-decoration: none;
            font-weight: 800;
            font-size: 13px;
            cursor: pointer;
          }

          .small-button.secondary {
            background: #555;
          }

          .small-button.danger {
            background: #b00020;
          }

          .status {
            display: inline-flex;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 900;
          }

          .status.active {
            background: #e7f7ed;
            color: #117a37;
          }

          .status.inactive {
            background: #f3f3f3;
            color: #777;
          }

          .checkbox-row input {
            width: auto;
            margin-right: 8px;
          }

          .message-box {
            white-space: pre-wrap;
            line-height: 1.55;
            color: #555;
            max-width: 520px;
          }

          @media (max-width: 1000px) {
            .admin-shell {
              grid-template-columns: 1fr;
            }

            .sidebar {
              position: relative;
              height: auto;
            }

            .dashboard-grid,
            .action-grid,
            .todo-grid,
            .form-grid {
              grid-template-columns: 1fr;
            }

            .main {
              padding: 22px;
            }
          }
        </style>
      </head>
      <body>
        <div class="admin-shell">
          <aside class="sidebar">
            <div class="brand">Feiermiete</div>
            <div class="claim">Admin Bereich</div>

            <a href="/admin">Dashboard</a>
            <a href="/admin/products">Equipment verwalten</a>
            <a href="/admin/products/new">Equipment hinzufügen</a>
            <a href="/admin/inquiries">Anfragen</a>
            <a href="/">Website ansehen</a>

            <form class="logout-form" method="POST" action="/admin/logout">
              <button class="logout-button" type="submit">Ausloggen</button>
            </form>
          </aside>

          <main class="main">
            ${content}
          </main>
        </div>
      </body>
    </html>
  `;
}
