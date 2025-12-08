import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import dbConnection from "./config/dbCon.js";
import authRoutes from "./routes/auth/authRoutes.js";
import commentRoutes from "./routes/comments/commentRoutes.js";
import imageRoutes from "./routes/images/imageRoutes.js";
import downloadRoutes from "./routes/downloads/downloadRoutes.js"

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
dbConnection();
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/downloads",downloadRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
