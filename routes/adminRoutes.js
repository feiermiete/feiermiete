import express from "express";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  renderAdminDashboard,
  renderAdminProducts,
  renderNewProductForm,
  renderEditProductForm
} from "../views/adminProductsView.js";

export const adminRoutes = express.Router();

function euroToCents(value) {
  if (!value) return null;
  return Math.round(Number(String(value).replace(",", ".")) * 100);
}

adminRoutes.post("/login", (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD || "feiermiete-admin";
  const cookieSecret = process.env.ADMIN_COOKIE_SECRET || adminPassword;

  if (req.body.password !== adminPassword) {
    return res.redirect("/admin");
  }

  res.cookie("feiermiete_admin", cookieSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 8
  });

  res.redirect("/admin");
});

adminRoutes.post("/logout", (req, res) => {
  res.clearCookie("feiermiete_admin");
  res.redirect("/admin");
});

adminRoutes.use(requireAdmin);

adminRoutes.get("/", async (req, res) => {
  const productCount = await prisma.product.count();
  const activeProductCount = await prisma.product.count({
    where: { isActive: true }
  });
  const inquiryCount = await prisma.inquiry.count();

  res.send(renderAdminDashboard({
    productCount,
    activeProductCount,
    inquiryCount
  }));
});

adminRoutes.get("/products", async (req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  res.send(renderAdminProducts({ products }));
});

adminRoutes.get("/products/new", async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  res.send(renderNewProductForm({ categories }));
});

adminRoutes.post("/products", async (req, res) => {
  const {
    name,
    slug,
    description,
    priceEuro,
    depositEuro,
    imageUrl,
    categoryId
  } = req.body;

  await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      priceCents: euroToCents(priceEuro) || 0,
      depositCents: euroToCents(depositEuro),
      imageUrl: imageUrl || null,
      categoryId: categoryId ? Number(categoryId) : null,
      isActive: true
    }
  });

  res.redirect("/admin/products");
});

adminRoutes.get("/products/:id/edit", async (req, res) => {
  const id = Number(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    return res.redirect("/admin/products");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  res.send(renderEditProductForm({ product, categories }));
});

adminRoutes.post("/products/:id/update", async (req, res) => {
  const id = Number(req.params.id);

  const {
    name,
    slug,
    description,
    priceEuro,
    depositEuro,
    imageUrl,
    categoryId,
    isActive
  } = req.body;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || null,
      priceCents: euroToCents(priceEuro) || 0,
      depositCents: euroToCents(depositEuro),
      imageUrl: imageUrl || null,
      categoryId: categoryId ? Number(categoryId) : null,
      isActive: isActive === "on"
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
    return res.redirect("/admin/products");
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
