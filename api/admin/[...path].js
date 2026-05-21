const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

// ─── Cached MongoDB connection across serverless invocations ───
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// ─── Mongoose Model ───
const PageContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true },
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

const PageContent =
  mongoose.models.PageContent ||
  mongoose.model("PageContent", PageContentSchema);

// ─── ImageKit ───
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

// ─── Auth middleware ───
function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ─── Express app ───
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Connect to DB before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Upload image
app.post("/api/admin/upload-image", adminAuth, upload.single("image"), async (req, res) => {
  try {
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

// Upload video
app.post("/api/admin/upload-video", adminAuth, upload.single("video"), async (req, res) => {
  try {
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
app.get("/api/admin/pages", async (req, res) => {
  try {
    const pages = await PageContent.find().sort({ page: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single page
app.get("/api/admin/pages/:page", async (req, res) => {
  try {
    const doc = await PageContent.findOne({ page: req.params.page });
    res.json(doc || { page: req.params.page, sections: {} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (upsert) page
app.put("/api/admin/pages/:page", adminAuth, async (req, res) => {
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

// POST bulk import pages
app.post("/api/admin/import", adminAuth, async (req, res) => {
  try {
    const pages = req.body.pages;
    if (!Array.isArray(pages)) return res.status(400).json({ error: "Expected { pages: [...] }" });
    const results = [];
    for (const { page, sections } of pages) {
      await PageContent.findOneAndUpdate(
        { page },
        { page, sections },
        { upsert: true, new: true, runValidators: true }
      );
      results.push(page);
    }
    res.json({ success: true, imported: results.length, pages: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const IMAGE_EXT = /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i;

function collectImageUrls(obj, out = new Set()) {
  if (!obj || typeof obj !== "object") return out;
  if (Array.isArray(obj)) { obj.forEach(v => collectImageUrls(v, out)); return out; }
  for (const val of Object.values(obj)) {
    if (typeof val === "string" && IMAGE_EXT.test(val) && val.startsWith("http")) out.add(val);
    else if (val && typeof val === "object") collectImageUrls(val, out);
  }
  return out;
}

function replaceImageUrls(obj, map) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(v => replaceImageUrls(v, map));
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = (typeof v === "string" && map[v]) ? map[v] : (v && typeof v === "object" ? replaceImageUrls(v, map) : v);
  }
  return out;
}

// POST migrate logos - re-download all external image URLs and re-upload to ImageKit
app.post("/api/admin/migrate-logos", adminAuth, async (req, res) => {
  try {
    const pages = await PageContent.find();
    const ikEndpoint = (process.env.IMAGEKIT_URL_ENDPOINT || "").replace(/\/$/, "");
    const allUrls = new Set();
    for (const p of pages) collectImageUrls(p.sections, allUrls);
    const toMigrate = [...allUrls].filter(u => !u.startsWith(ikEndpoint));

    const urlMap = {};
    for (const url of toMigrate) {
      try {
        const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!resp.ok) { urlMap[url] = null; continue; }
        const buffer = Buffer.from(await resp.arrayBuffer());
        const fileName = url.split("/").pop().split("?")[0] || "logo.png";
        const result = await uploadToImageKit(buffer, fileName, "/marshall-admin/logos");
        urlMap[url] = result.url;
      } catch {
        urlMap[url] = null;
      }
    }

    let updatedPages = 0;
    for (const p of pages) {
      const sectionsStr = JSON.stringify(p.sections);
      const hasMatch = toMigrate.some(u => urlMap[u] && sectionsStr.includes(u));
      if (hasMatch) {
        const newSections = replaceImageUrls(JSON.parse(sectionsStr), urlMap);
        await PageContent.findOneAndUpdate({ page: p.page }, { sections: newSections });
        updatedPages++;
      }
    }

    const succeeded = Object.values(urlMap).filter(Boolean).length;
    res.json({
      success: true,
      scanned: toMigrate.length,
      succeeded,
      failed: toMigrate.length - succeeded,
      updatedPages,
      mapping: urlMap,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const ContactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    services: { type: [String], default: [] },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", ContactSubmissionSchema);

// POST contact submission
app.post("/api/admin/contact", async (req, res) => {
  try {
    const { name, email, phone, services, message } = req.body;
    
    // Save to database
    const submission = new ContactSubmission({
      name,
      email,
      phone,
      services: services || [],
      message
    });
    await submission.save();

    const { error: emailError } = await resend.emails.send({
      from: "Marshall Haber Creative Group <noreply@updates.marshallhaber.com>",
      to: ["marshall@marshallhaber.com", "frontdesk@marshallhaber.com", "syedimtiyazali141@gmail.com"],
      subject: `New Lead Submitted: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fbf0f2; color: #020817;">
          <h2 style="color: #020817; border-bottom: 2px solid #020817; padding-bottom: 10px; margin-bottom: 20px;">New Form Submission Received</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2B59C3; text-decoration: none;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;">${phone || "Not provided"}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Services:</td><td style="padding: 8px 0;">${services && services.length > 0 ? services.map(s => `<span style="display:inline-block;background:#020817;color:#fff;padding:2px 8px;border-radius:12px;font-size:11px;margin-right:4px;">${s}</span>`).join("") : "None selected"}</td></tr>
          </table>
          <div style="background-color: #fff; padding: 15px; border-radius: 6px; border: 1px solid #eaeaea; margin-top: 15px;">
            <h4 style="margin-top: 0; color: #020817; margin-bottom: 8px;">Message:</h4>
            <p style="margin: 0; line-height: 1.5; white-space: pre-wrap;">${message || "No message provided"}</p>
          </div>
          <p style="font-size: 11px; color: #666; margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 10px; text-align: center;">Saved to your admin portal database.</p>
        </div>
      `
    });

    if (emailError) console.error("Resend error:", emailError);
    else console.log("Notification email sent via Resend");

    res.status(201).json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all contact submissions
app.get("/api/admin/contact", adminAuth, async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a contact submission
app.delete("/api/admin/contact/:id", adminAuth, async (req, res) => {
  try {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
