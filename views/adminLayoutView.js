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
            grid-template-columns: 260px 1fr;
            min-height: 100vh;
          }

          .sidebar {
            background: #151515;
            color: white;
            padding: 28px 22px;
          }

          .brand {
            font-size: 24px;
            font-weight: 800;
            color: #d1111b;
            margin-bottom: 6px;
          }

          .claim {
            font-size: 12px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #aaa;
            margin-bottom: 34px;
          }

          .sidebar a {
            display: block;
            color: white;
            text-decoration: none;
            padding: 13px 14px;
            border-radius: 14px;
            margin-bottom: 8px;
            font-weight: 700;
          }

          .sidebar a:hover {
            background: rgba(255,255,255,0.08);
          }

          .main {
            padding: 34px;
          }

          .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 28px;
          }

          h1 {
            margin: 0;
            font-size: 34px;
            letter-spacing: -0.04em;
          }

          .button {
            display: inline-block;
            background: #d1111b;
            color: white;
            text-decoration: none;
            border: none;
            border-radius: 999px;
            padding: 13px 20px;
            font-weight: 800;
            cursor: pointer;
          }

          .card {
            background: white;
            border-radius: 22px;
            padding: 24px;
            box-shadow: 0 18px 45px rgba(0,0,0,0.06);
            border: 1px solid rgba(0,0,0,0.05);
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            text-align: left;
            padding: 14px 10px;
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

          .muted {
            color: #777;
          }

          @media (max-width: 800px) {
            .admin-shell {
              grid-template-columns: 1fr;
            }

            .sidebar {
              position: static;
            }

            .form-grid {
              grid-template-columns: 1fr;
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
            <a href="/admin/products">Equipment</a>
            <a href="/admin/products/new">Equipment hinzufügen</a>
            <a href="/">Website ansehen</a>
          </aside>

          <main class="main">
            ${content}
          </main>
        </div>
      </body>
    </html>
  `;
}
