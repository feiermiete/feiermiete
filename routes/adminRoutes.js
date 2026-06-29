import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../lib/prisma.js";
import { sendMailjetTestEmail } from "../utils/mailjet.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  renderAdminDashboard,
  renderAdminProducts,
  renderNewProductForm,
  renderEditProductForm,
  renderAdminInquiries
} from "../views/adminProductsView.js";
import {
  renderAdminInquiryDetail,
  renderInquiryContract
} from "../views/adminInquiryViews.js";

export const adminRoutes = express.Router();

const uploadDir = path.join(process.cwd(), "public", "images", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const ae = String.fromCharCode(228);
    const oe = String.fromCharCode(246);
    const ue = String.fromCharCode(252);
    const ss = String.fromCharCode(223);

    const base = path.basename(file.originalname || "bild", ext)
      .toLowerCase()
      .split(ae).join("ae")
      .split(oe).join("oe")
      .split(ue).join("ue")
      .split(ss).join("ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    cb(null, Date.now() + "-" + (base || "bild") + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Nur JPG, PNG, WEBP oder SVG erlaubt."));
    }
    cb(null, true);
  }
});

function uploadedImageUrl(req) {
  if (!req.file) return req.body.imageUrl || "";
  return "/public/images/uploads/" + req.file.filename;
}

function euroToCents(value) {
  const number = Number(String(value || "0").replace(",", "."));
  if (Number.isNaN(number)) return 0;
  return Math.round(number * 100);
}

adminRoutes.post("/login", (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD || "feiermiete-admin";
  const cookieSecret = process.env.ADMIN_COOKIE_SECRET || adminPassword;

  if (req.body.password === adminPassword) {
    res.cookie("feiermiete_admin", cookieSecret, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 12
    });

    return res.redirect("/admin");
  }

  res.status(401).send("Falsches Passwort");
});

adminRoutes.post("/logout", (req, res) => {
  res.clearCookie("feiermiete_admin");
  res.redirect("/admin");
});

adminRoutes.use(requireAdmin);

adminRoutes.get("/", async (req, res) => {
  const productCount = await prisma.product.count();
  const inquiryCount = await prisma.inquiry.count();

  res.send(renderAdminDashboard({
    productCount,
    inquiryCount
  }));
});

adminRoutes.get("/products", async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.send(renderAdminProducts({ products }));
});

adminRoutes.get("/products/new", async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  res.send(renderNewProductForm({ categories }));
});

adminRoutes.post("/products", upload.single("imageFile"), async (req, res) => {
  await prisma.product.create({
    data: {
      name: req.body.name || "",
      description: req.body.description || "",
      priceCents: euroToCents(req.body.priceEuro),
      depositCents: euroToCents(req.body.depositEuro),
      stockQuantity: Number(req.body.stockQuantity || 0),
      imageUrl: uploadedImageUrl(req),
      categoryId: normalizeCategoryId(req.body.categoryId),
      isActive: req.body.isActive === "on"
    }
  });

  res.redirect("/admin/products");
});

adminRoutes.get("/products/:id/edit", async (req, res) => {
  const id = Number(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id }
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  if (!product) {
    return res.status(404).send("Produkt nicht gefunden");
  }

  res.send(renderEditProductForm({ product, categories }));
});

adminRoutes.post("/products/:id/update", upload.single("imageFile"), async (req, res) => {
  const id = Number(req.params.id);

  await prisma.product.update({
    where: { id },
    data: {
      name: req.body.name || "",
      description: req.body.description || "",
      priceCents: euroToCents(req.body.priceEuro),
      depositCents: euroToCents(req.body.depositEuro),
      stockQuantity: Number(req.body.stockQuantity || 0),
      imageUrl: uploadedImageUrl(req),
      categoryId: normalizeCategoryId(req.body.categoryId),
      isActive: req.body.isActive === "on"
    }
  });

  res.redirect("/admin/products");
});

adminRoutes.post("/products/:id/toggle", async (req, res) => {
  const id = Number(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    return res.status(404).send("Produkt nicht gefunden");
  }

  await prisma.product.update({
    where: { id },
    data: {
      isActive: !product.isActive
    }
  });

  res.redirect("/admin/products");
});

adminRoutes.post("/products/:id/delete", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.product.delete({
    where: { id }
  });

  res.redirect("/admin/products");
});

adminRoutes.get("/inquiries", async (req, res) => {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  res.send(renderAdminInquiries({ inquiries }));
});

adminRoutes.get("/inquiries/:id", async (req, res) => {
  const id = Number(req.params.id);

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      items: true
    }
  });

  if (!inquiry) {
    return res.status(404).send("Anfrage nicht gefunden");
  }

  res.send(renderAdminInquiryDetail(inquiry, { saved: req.query.saved === "1" }));
});


function parseAdminDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

adminRoutes.post("/inquiries/:id/update", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.inquiry.update({
    where: { id },
    data: {
      customerName: req.body.customerName || "",
      companyName: req.body.companyName || null,
      email: req.body.email || "",
      phone: req.body.phone || null,
      eventDate: parseAdminDate(req.body.eventDate),
      deliveryAddress: req.body.deliveryAddress || null,
      status: req.body.status || "OPEN",
      adminNote: req.body.adminNote || "",
      rentalTotalCents: euroToCents(req.body.rentalTotalEuro),
      depositTotalCents: euroToCents(req.body.depositTotalEuro),
      deliveryFeeCents: euroToCents(req.body.deliveryFeeEuro)
    }
  });

  res.redirect(`/admin/inquiries/${id}?saved=1`);
});

adminRoutes.get("/inquiries/:id/contract", async (req, res) => {
  const id = Number(req.params.id);

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      items: true
    }
  });

  if (!inquiry) {
    return res.status(404).send("Anfrage nicht gefunden");
  }

  res.send(renderInquiryContract(inquiry));
});





adminRoutes.get("/test-mailjet", async (req, res) => {
  try {
    const result = await sendMailjetTestEmail();

    res.type("html").send(`
      <!doctype html>
      <html lang="de">
        <head>
          <meta charset="utf-8" />
          <title>Mailjet Test</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.5; }
            pre { background: #f3f3f3; padding: 20px; white-space: pre-wrap; }
            .ok { color: green; font-weight: bold; }
            .bad { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Mailjet Test</h1>
          <p class="${result.ok ? "ok" : "bad"}">Status: ${result.ok ? "OK / gesendet" : "FEHLER / nicht gesendet"}</p>
          <pre>${JSON.stringify(result, null, 2)}</pre>
          <p><a href="/admin">Zurück zum Admin</a></p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).type("html").send(`
      <h1>Mailjet Test Fehler</h1>
      <pre>${String(error.stack || error.message || error)}</pre>
      <p><a href="/admin">Zurück zum Admin</a></p>
    `);
  }
});




function makeSlug(value, fallback = "artikel") {
  const ae = String.fromCharCode(228);
  const oe = String.fromCharCode(246);
  const ue = String.fromCharCode(252);
  const ss = String.fromCharCode(223);

  const base = String(value || fallback)
    .toLowerCase()
    .trim()
    .split(ae).join("ae")
    .split(oe).join("oe")
    .split(ue).join("ue")
    .split(ss).join("ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || fallback;
}

function normalizeCategoryId(value) {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}
