const db = require("../config/db");
const fs = require('fs');
const path = require('path');

const getBrands = (req, res) => {
  const type = req.query.type;
  let query = "SELECT * FROM brands";
  let params = [];
  if (type) {
    query += " WHERE type = ?";
    params.push(type);
  }
  
  db.query(query, params, (err, results) => {
    if (err) return res.json([]);
    res.json(results);
  });
};

const uploadBrand = (req, res) => {
  const type = req.body.type;
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" });
  }
  
  const imageUrl = `/uploads/brands/${req.file.filename}`;
  const query = "INSERT INTO brands (type, image_url) VALUES (?, ?)";
  
  db.query(query, [type, imageUrl], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ id: result.insertId, type, image_url: imageUrl });
  });
};

const deleteBrand = (req, res) => {
  const id = req.params.id;
  db.query("SELECT image_url FROM brands WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "Brand not found" });
    
    const imageUrl = results[0].image_url;
    db.query("DELETE FROM brands WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      
      const filePath = path.join(__dirname, "..", imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.json({ message: "Deleted successfully" });
    });
  });
};

const updateBrand = (req, res) => {
  const id = req.params.id;
  const type = req.body.type;
  
  if (req.file) {
    const imageUrl = `/uploads/brands/${req.file.filename}`;
    
    db.query("SELECT image_url FROM brands WHERE id = ?", [id], (err, results) => {
      if (!err && results.length > 0) {
        const oldImageUrl = results[0].image_url;
        const filePath = path.join(__dirname, "..", oldImageUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      const query = "UPDATE brands SET type = ?, image_url = ? WHERE id = ?";
      db.query(query, [type, imageUrl, id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Updated successfully" });
      });
    });
  } else {
    const query = "UPDATE brands SET type = ? WHERE id = ?";
    db.query(query, [type, id], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Updated successfully" });
    });
  }
};

module.exports = {
  getBrands,
  uploadBrand,
  deleteBrand,
  updateBrand
};
