const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const db = require("./config/db"); 

const adminRoutes = require("./routes/adminRoutes");
const brandsRoutes = require("./routes/brandsRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const statsRoutes = require("./routes/statsRoutes");
const careerRoutes = require('./routes/careerRoutes');
const blogRoutes = require("./routes/blogRoutes");
const testimonialsRoutes = require("./routes/testimonialsRoutes");
const contactRoutes = require('./routes/contactRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const resourceRepositoryRoutes = require('./routes/resourceRepositoryRoutes');
const metaTagsRoutes = require('./routes/metaTags');
const app = express();

const allowedOrigins = [
  "https://dashboardkavin.saitechnosolutions.co.in",
  "http://dashboardkavin.saitechnosolutions.co.in",
  "https://kavinhealthcare.saitechnosolutions.co.in",
  "http://kavinhealthcare.saitechnosolutions.co.in",
  "http://172.16.0.23:5173",
  "http://172.16.0.23:5174",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admin", adminRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/stats", statsRoutes);
app.use('/api/career', careerRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/resource-repository', resourceRepositoryRoutes);
app.use('/api/meta-tags', metaTagsRoutes);
app.use("/admin", adminRoutes);
app.use("/brands", brandsRoutes);
app.use("/banner", bannerRoutes);
app.use("/stats", statsRoutes);
app.use('/career', careerRoutes);
app.use("/blogs", blogRoutes);
app.use("/testimonials", testimonialsRoutes);
app.use('/contact', contactRoutes);
app.use('/services', serviceRoutes);
app.use('/resource-repository', resourceRepositoryRoutes);
app.use('/meta-tags', metaTagsRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const multer = require('multer');

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: 'File upload error: ' + err.message });
  }
  res.status(500).json({ success: false, message: 'Internal server error: ' + err.message });
});

const PORT = process.env.PORT || 5000;

db.ready.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Server not started because MySQL is unavailable:", err.message);
  process.exitCode = 1;
});
