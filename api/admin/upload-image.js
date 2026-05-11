const fs = require("fs");
const { requireAdmin } = require("../_lib/auth");
const { parseMultipart } = require("../_lib/parseForm");
const { uploadBuffer } = require("../_lib/cloudinary");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!requireAdmin(req, res)) return;

  try {
    const { files } = await parseMultipart(req);
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!file) return res.status(400).json({ error: "No image file" });

    const buffer = fs.readFileSync(file.filepath);
    const result = await uploadBuffer(
      buffer,
      file.originalFilename || "image",
      "/marshall-admin/images"
    );
    res.json({ url: result.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Disable Vercel's default JSON body parsing so formidable can read the raw stream.
module.exports.config = { api: { bodyParser: false } };
