import express from "express";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  renderAdminDashboard,
  renderAdminProducts,
  renderNewProductForm,
  renderEditProductForm,
  renderAdminInquiries
} from "../views/adminProductsView.js";

export const adminRoutes = express.Router();
adminRoutes.get("/", async (req, res) => {
  res.redirect("/admin/inquiries");
});

adminRoutes.get("/inquiries", async (req, res) => {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  res.send(renderAdminInquiries(inquiries));
});

function euroToCents(value) {
  const number = Number(String(value || "0").replace(",", "."));
  if (Number.isNaN(number)) return 0;
  return Math.round(number * 100);
}

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
