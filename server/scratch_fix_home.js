require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const PageContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true },
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

const PageContent = mongoose.model('PageContent', PageContentSchema);

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
  
  let doc = await PageContent.findOne({ page: "home" });
  if (!doc) {
    doc = new PageContent({ page: "home", sections: {} });
  }
  
  doc.sections = doc.sections || {};
  doc.sections.works = doc.sections.works || {};
  doc.sections.works.headingBold = "We Partner With Companies";
  doc.sections.works.headingItalic = "That Need Momentum Vision, Transformation & Execution";
  
  doc.markModified('sections');
  
  await doc.save();
  console.log("Home page fixed!");
  mongoose.disconnect();
}

run().catch(console.error);
