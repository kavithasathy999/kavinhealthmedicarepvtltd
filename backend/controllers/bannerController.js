const db = require("../config/db");

const getBanners = (req, res) => {
  db.query("SELECT * FROM banners", (err, results) => {
    if (err) {
      console.error("Banner fetch failed:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

const updateBanners = (req, res) => {
  const slides = req.body; 
  db.query("TRUNCATE TABLE banners", (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error during clear" });
    }
    
    if (!slides || slides.length === 0) {
      return res.json({ message: "Banners updated successfully" });
    }

    const values = slides.map(s => [s.tag, s.title, s.description, s.image]);
    db.query("INSERT INTO banners (tag, title, description, image) VALUES ?", [values], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error during insert" });
      }
      res.json({ message: "Banners updated successfully" });
    });
  });
};

const uploadBannerImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }
  const imageUrl = `/uploads/banners/${req.file.filename}`;
  res.json({ imageUrl });
};

module.exports = {
  getBanners,
  updateBanners,
  uploadBannerImage
};
