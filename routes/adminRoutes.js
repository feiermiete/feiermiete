import express from "express";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  renderAdminDashboard,
  renderAdminProducts,
  renderNewProductForm,
  renderEditProductForm,
  renderAdminInquiries,
  renderAdminInquiryDetail,
  renderInquiryContract
} from "../views/adminProductsView.js";

export const adminRoutes = express.Router();

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

  res.send(renderAdminProducts(products));
});

adminRoutes.get("/products/new", async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  res.send(renderNewProductForm(categories));
});

adminRoutes.post("/products", async (req, res) => {
  await prisma.product.create({
    data: {
      name: req.body.name || "",
      description: req.body.description || "",
      priceCents: euroToCents(req.body.priceEuro),
      depositCents: euroToCents(req.body.depositEuro),
      imageUrl: req.body.imageUrl || "",
      categoryId: Number(req.body.categoryId),
      active: req.body.active === "on"
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

  res.send(renderEditProductForm(product, categories));
});

adminRoutes.post("/products/:id/update", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.product.update({
    where: { id },
    data: {
      name: req.body.name || "",
      description: req.body.description || "",
      priceCents: euroToCents(req.body.priceEuro),
      depositCents: euroToCents(req.body.depositEuro),
      imageUrl: req.body.imageUrl || "",
      categoryId: Number(req.body.categoryId),
      active: req.body.active === "on"
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
      active: !product.active
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

  res.send(renderAdminInquiries(inquiries));
});

adminRoutes.get("/inquiries/:id", async (req, res) => {
  const id = Number(req.params.id);

  const inquiry = await prisma.inquiry.findUnique({
    where: { id }
  });

  if (!inquiry) {
    return res.status(404).send("Anfrage nicht gefunden");
  }

  res.send(renderAdminInquiryDetail(inquiry));
});

adminRoutes.post("/inquiries/:id/update", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.inquiry.update({
    where: { id },
    data: {
      status: req.body.status || "OPEN",
      adminNote: req.body.adminNote || "",
      rentalTotalCents: euroToCents(req.body.rentalTotalEuro),
      depositTotalCents: euroToCents(req.body.depositTotalEuro),
      deliveryFeeCents: euroToCents(req.body.deliveryFeeEuro)
    }
  });

  res.redirect(`/admin/inquiries/${id}`);
});

adminRoutes.get("/inquiries/:id/contract", async (req, res) => {
  const id = Number(req.params.id);

  const inquiry = await prisma.inquiry.findUnique({
    where: { id }
  });

  if (!inquiry) {
    return res.status(404).send("Anfrage nicht gefunden");
  }

  res.send(renderInquiryContract(inquiry));
});
