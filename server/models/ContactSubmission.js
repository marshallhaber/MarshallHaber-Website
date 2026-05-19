const mongoose = require("mongoose");

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

module.exports = mongoose.model("ContactSubmission", ContactSubmissionSchema);
