import { fileURLToPath } from "url";
import Path from "path";
import fs from "fs";
import downloadModel from "../models/downloads.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const uploadsDir = Path.resolve(__dirname, "..", "uploads");

export const downloadPhoto = async (req, res) => {
  try {
    const { fileName,imageId } = req.body;
    if (!fileName) {
      return res.status(400).json({ success: false, msg: "File name is required" });
    }

    const filePath = Path.resolve(uploadsDir, fileName);
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(400).json({ success: false, msg: "Invalid file path" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, msg: "File not found" });
    }

    await downloadModel.create({
      userId: req.userId,
      imageId,
      fileName,
      downloadedAt: new Date(),
    });

    return res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          return res.status(500).json({ success: false, msg: `Error during download: ${err.message}` });
        }
      }
    });
  } catch (error) {
    console.error("Catch error:", error);
    return res.status(500).json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};

export const getDownloadHistory = async (req, res) => {
  try {
    const history = await downloadModel.find({ userId: req.userId }).sort({ downloadedAt: -1 });
    return res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    console.error("History error:", error);
    return res.status(500).json({ success: false, msg: `Error getting download history: ${error.message}` });
  }
};

export const getDownloadHistoryCount = async (req, res) => {
  try {
    const count = await downloadModel.countDocuments({ imageId: req.params.id });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Count error:", error);
    return res.status(500).json({ success: false, msg: `Error getting download history count: ${error.message}` });
  }
};