const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

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

// ─── Cloudinary ───
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

function uploadToCloudinary(fileBuffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "marshall-admin" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
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
    const result = await uploadToCloudinary(req.file.buffer, "image");
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload video
app.post("/api/admin/upload-video", adminAuth, upload.single("video"), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer, "video");
    res.json({ url: result.secure_url });
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

const nodemailer = require("nodemailer");

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

    // Prepare email notification
    const mailOptions = {
      from: `"Marshall Haber Creative Group" <noreply@marshallhaber.com>`,
      to: "marshall@marshallhaber.com, frontdesk@marshallhaber.com, syedimtiyazali141@gmail.com",
      subject: `New Lead Submitted: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fbf0f2; color: #020817;">
          <h2 style="color: #020817; border-bottom: 2px solid #020817; padding-bottom: 10px; margin-bottom: 20px;">New Form Submission Received</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2B59C3; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Services:</td>
              <td style="padding: 8px 0;">
                ${services && services.length > 0 
                  ? services.map(s => `<span style="display: inline-block; background-color: #020817; color: #fff; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-right: 4px;">${s}</span>`).join("")
                  : "None selected"
                }
              </td>
            </tr>
          </table>
          <div style="background-color: #fff; padding: 15px; border-radius: 6px; border: 1px solid #eaeaea; margin-top: 15px;">
            <h4 style="margin-top: 0; color: #020817; margin-bottom: 8px;">Message:</h4>
            <p style="margin: 0; line-height: 1.5; white-space: pre-wrap;">${message || "No message provided"}</p>
          </div>
          <p style="font-size: 11px; color: #666; margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 10px; text-align: center;">
            This submission has been saved to your administration portal database.
          </p>
        </div>
      `
    };

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || ""
      }
    });

    // Check if SMTP is configured, else log it
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log("Notification email sent successfully to all recipients");
    } else {
      console.warn("SMTP credentials not configured in environment. Saved submission to DB without email dispatch.");
    }

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
