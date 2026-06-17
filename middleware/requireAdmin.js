export function requireAdmin(req, res, next) {
  const adminPassword = process.env.ADMIN_PASSWORD || "feiermiete-admin";
  const cookieSecret = process.env.ADMIN_COOKIE_SECRET || adminPassword;

  const adminCookie = req.cookies?.feiermiete_admin;

  if (adminCookie === cookieSecret) {
    return next();
  }

  res.status(401).send(`
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Login - Feiermiete</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f4efe8;
            color: #141414;
            min-height: 100vh;
            display: grid;
            place-items: center;
          }

          .login-box {
            width: min(420px, calc(100% - 32px));
            background: white;
            padding: 34px;
            box-shadow: 0 22px 70px rgba(0,0,0,0.10);
            border: 1px solid rgba(0,0,0,0.08);
          }

          h1 {
            margin: 0 0 10px;
            color: #c70012;
            font-size: 34px;
            letter-spacing: -0.05em;
          }

          p {
            color: #666;
            line-height: 1.5;
            margin-bottom: 24px;
          }

          input {
            width: 100%;
            padding: 15px;
            border: 1px solid #ddd;
            font-size: 16px;
            margin-bottom: 14px;
          }

          button {
            width: 100%;
            border: 0;
            background: #c70012;
            color: white;
            padding: 15px;
            font-size: 15px;
            font-weight: 900;
            cursor: pointer;
          }

          a {
            display: inline-block;
            margin-top: 18px;
            color: #141414;
            font-weight: 800;
          }

          .hint {
            font-size: 13px;
            color: #999;
            margin-top: 14px;
          }
        </style>
      </head>
      <body>
        <form class="login-box" method="POST" action="/admin/login">
          <h1>Feiermiete Admin</h1>
          <p>Bitte Passwort eingeben, um den Adminbereich zu öffnen.</p>
          <input type="password" name="password" placeholder="Admin-Passwort" required />
          <button type="submit">Einloggen</button>
          <div class="hint">Das Passwort wird nicht in der URL angezeigt.</div>
          <a href="/">Zur Website</a>
        </form>
      </body>
    </html>
  `);
}
