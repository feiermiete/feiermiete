import express from "express";
import { publicRoutes } from "./routes/publicRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", publicRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Feiermiete läuft auf Port ${port}`);
});
