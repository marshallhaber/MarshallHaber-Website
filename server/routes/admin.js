const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const PageContent = require("../models/PageContent");
const adminAuth = require("../middleware/auth");

const upload = multer({ storage: multer.memoryStorage() });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadToImageKit(fileBuffer, fileName, folder) {
  const file = await toFile(fileBuffer, fileName);
  const result = await imagekit.files.upload({
    file,
    fileName: fileName || "upload",
    folder: folder,
    useUniqueFileName: true,
  });
  return { url: result.url };
}

router.post("/upload-image", adminAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image file provided" });
    const result = await uploadToImageKit(
      req.file.buffer,
      req.file.originalname || "image.png",
      "/marshall-admin/images"
    );
    res.json({ url: result.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/upload-video", adminAuth, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No video file provided" });
    const result = await uploadToImageKit(
      req.file.buffer,
      req.file.originalname || "video.mp4",
      "/marshall-admin/videos"
    );
    res.json({ url: result.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all pages
router.get("/pages", async (req, res) => {
  try {
    const pages = await PageContent.find().sort({ page: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single page content
router.get("/pages/:page", async (req, res) => {
  try {
    const doc = await PageContent.findOne({ page: req.params.page });
    res.json(doc || { page: req.params.page, sections: {} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (upsert) page content
router.put("/pages/:page", adminAuth, async (req, res) => {
  try {
    const doc = await PageContent.findOneAndUpdate(
      { page: req.params.page },
      { page: req.params.page, sections: req.body.sections },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
