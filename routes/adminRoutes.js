import express from "express";

export const adminRoutes = express.Router();

adminRoutes.get("/", async (req, res) => {
  res.send("Feiermiete Admin-Bereich kommt als Nächstes.");
});
