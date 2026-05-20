const fs = require("fs");
const { requireAdmin } = require("../_lib/auth");
const { parseMultipart } = require("../_lib/parseForm");
const { uploadBuffer } = require("../_lib/imagekit");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!requireAdmin(req, res)) return;

  try {
    const { files } = await parseMultipart(req);
    const file = Array.isArray(files.video) ? files.video[0] : files.video;
    if (!file) return res.status(400).json({ error: "No video file" });

    const buffer = fs.readFileSync(file.filepath);
    const result = await uploadBuffer(
      buffer,
      file.originalFilename || "video",
      "/marshall-admin/videos"
    );
    res.json({ url: result.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.config = { api: { bodyParser: false } };
