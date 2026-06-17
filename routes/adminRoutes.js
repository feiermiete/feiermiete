import express from "express";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  renderAdminDashboard,
  renderAdminProducts,
  renderNewProductForm
} from "../views/adminProductsView.js";

export const adminRoutes = express.Router();

adminRoutes.use(requireAdmin);

function getPasswordQuery(req) {
  const password = req.query.password;
  return password ? `?password=${encodeURIComponent(password)}` : "";
}

function euroToCents(value) {
  if (!value) return null;
  return Math.round(Number(String(value).replace(",", ".")) * 100);
}

adminRoutes.get("/", async (req, res) => {
  const productCount = await prisma.product.count();
  const inquiryCount = await prisma.inquiry.count();

  res.send(renderAdminDashboard({
    productCount,
    inquiryCount,
    passwordQuery: getPasswordQuery(req)
  }));
});

adminRoutes.get("/products", async (req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  res.send(renderAdminProducts({
    products,
    passwordQuery: getPasswordQuery(req)
  }));
});

adminRoutes.get("/products/new", async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  res.send(renderNewProductForm({
    categories,
    passwordQuery: getPasswordQuery(req)
  }));
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

  res.redirect(`/admin/products${getPasswordQuery(req)}`);
});
