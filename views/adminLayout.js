export function renderAdminLayout({ title = "Admin", content = "" }) {
  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title} - Feiermiete Admin</title>
        <link rel="stylesheet" href="/public/css/style.css" />
        <style>
          body {
            margin: 0;
            background: #f3eee7;
            color: #181818;
            font-family: Arial, Helvetica, sans-serif;
          }

          .admin-shell {
            display: grid;
            grid-template-columns: 260px minmax(0, 1fr);
            min-height: 100vh;
          }

          .admin-sidebar {
            background: #111;
            color: #fff;
            padding: 34px 24px;
            min-height: 100vh;
          }

          .admin-brand strong,
          .admin-sidebar .brand {
            display: block;
            color: #d40016;
            font-size: 28px;
            font-weight: 900;
            line-height: 1;
          }

          .admin-brand span,
          .admin-sidebar .brand-sub,
          .admin-sidebar p {
            display: block;
            margin-top: 8px;
            text-transform: uppercase;
            letter-spacing: .18em;
            font-size: 11px;
            color: #bdbdbd;
          }

          .admin-sidebar nav {
            display: flex;
            flex-direction: column;
            gap: 18px;
            margin-top: 46px;
            align-items: flex-start;
          }

          .admin-sidebar nav a {
            color: #fff;
            text-decoration: none;
            font-weight: 800;
            font-size: 15px;
            line-height: 1.25;
            white-space: nowrap;
          }

          .admin-sidebar nav a:hover {
            color: #ffb8b8;
          }

          .admin-sidebar form {
            margin-top: 56px;
          }

          .admin-sidebar button {
            background: transparent;
            border: 0;
            padding: 0;
            color: #ffb8b8;
            font-weight: 800;
            cursor: pointer;
            font-size: 15px;
          }

          .admin-main {
            padding: 42px;
            width: 100%;
            max-width: 1440px;
          }

          @media (max-width: 900px) {
            .admin-shell {
              grid-template-columns: 1fr;
            }

            .admin-sidebar {
              min-height: auto;
            }

            .admin-main {
              padding: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="admin-shell">
          <aside class="admin-sidebar">
            <div class="admin-brand">
              <strong>Feiermiete</strong>
              <span>Admin Bereich</span>
            </div>

            <nav>
              <a href="/admin">Dashboard</a>
              <a href="/admin/products">Equipment verwalten</a>
              <a href="/admin/products/new">Equipment hinzufügen</a>
              <a href="/admin/inquiries">Anfragen</a>
              <a href="/" target="_blank">Website ansehen</a>
            </nav>

            <form method="POST" action="/admin/logout">
              <button type="submit">Ausloggen</button>
            </form>
          </aside>

          <main class="admin-main">
            ${content}
          </main>
        </div>
      </body>
    </html>
  `;
}
