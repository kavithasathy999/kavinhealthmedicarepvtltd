const db = require("../config/db");

const uploadProfilePicture = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  const imageUrl = `/uploads/profile_picture/${req.file.filename}`;
  
  db.query("SELECT * FROM admin_profile WHERE id = 1", (err, results) => {
    if (err) {
      console.error("Admin profile lookup failed:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length > 0) {
      db.query("UPDATE admin_profile SET image_url = ? WHERE id = 1", [imageUrl], (err) => {
        if (err) {
          console.error("Admin profile update failed:", err.message);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ imageUrl });
      });
    } else {
      db.query("INSERT INTO admin_profile (id, image_url) VALUES (1, ?)", [imageUrl], (err) => {
        if (err) {
          console.error("Admin profile insert failed:", err.message);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ imageUrl });
      });
    }
  });
};

const getProfilePicture = (req, res) => {
  db.query("SELECT image_url FROM admin_profile WHERE id = 1", (err, results) => {
    if (err) {
      console.error("Admin profile fetch failed:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length > 0 && results[0].image_url) {
      res.json({ imageUrl: results[0].image_url });
    } else {
      res.json({ imageUrl: null });
    }
  });
};

module.exports = {
  uploadProfilePicture,
  getProfilePicture,
};
