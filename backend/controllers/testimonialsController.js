const db = require("../config/db");

exports.getAllTestimonials = (req, res) => {
  const sql = "SELECT * FROM testimonials ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Testimonials fetch failed:", err.message);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(results);
  });
};

exports.createTestimonial = (req, res) => {
  const { name, designation, description, star_rating } = req.body;
  if (!name || !designation || !description || !star_rating) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const wordCount = description.trim().split(/\s+/).length;
  if (wordCount > 50) {
    return res.status(400).json({ message: "Description must be 50 words or less." });
  }
  if (star_rating < 1 || star_rating > 5) {
    return res.status(400).json({ message: "Star rating must be between 1 and 5." });
  }
  const sql =
    "INSERT INTO testimonials (name, designation, description, star_rating) VALUES (?, ?, ?, ?)";
  db.query(sql, [name.trim(), designation.trim(), description.trim(), star_rating], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.status(201).json({ message: "Testimonial created", id: result.insertId });
  });
};

exports.updateTestimonial = (req, res) => {
  const { id } = req.params;
  const { name, designation, description, star_rating } = req.body;
  if (!name || !designation || !description || !star_rating) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const wordCount = description.trim().split(/\s+/).length;
  if (wordCount > 50) {
    return res.status(400).json({ message: "Description must be 50 words or less." });
  }
  const sql =
    "UPDATE testimonials SET name=?, designation=?, description=?, star_rating=? WHERE id=?";
  db.query(sql, [name.trim(), designation.trim(), description.trim(), star_rating, id], (err) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json({ message: "Testimonial updated" });
  });
};

exports.deleteTestimonial = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM testimonials WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json({ message: "Testimonial deleted" });
  });
};
