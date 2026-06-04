const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getAllBlogs = (req, res) => {
  const query = 'SELECT * FROM blogs ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Blog fetch failed:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

exports.createBlog = (req, res) => {
  const { blog_date, read_time, title, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: 'Image is required' });
  }

  const imageUrl = `/uploads/blogs/${req.file.filename}`;
  const query = 'INSERT INTO blogs (blog_date, image_url, read_time, title, description) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [blog_date, imageUrl, read_time, title, description], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, blog_date, image_url: imageUrl, read_time, title, description });
  });
};

exports.updateBlog = (req, res) => {
  const { id } = req.params;
  const { blog_date, read_time, title, description } = req.body;
  const newImage = req.file;

  const getBlogQuery = 'SELECT image_url FROM blogs WHERE id = ?';
  db.query(getBlogQuery, [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Blog not found' });
    let imageUrl = results[0].image_url;
    if (newImage) {
      if (imageUrl) {
        const oldPath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imageUrl = `/uploads/blogs/${newImage.filename}`;
    }
    const updateQuery = 'UPDATE blogs SET blog_date = ?, image_url = ?, read_time = ?, title = ?, description = ? WHERE id = ?';
    db.query(updateQuery, [blog_date, imageUrl, read_time, title, description, id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Blog updated successfully', id, blog_date, image_url: imageUrl, read_time, title, description });
    });
  });
};

exports.deleteBlog = (req, res) => {
  const { id } = req.params;

  const getBlogQuery = 'SELECT image_url FROM blogs WHERE id = ?';
  db.query(getBlogQuery, [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Blog not found' });
    const imageUrl = results[0].image_url;
    if (imageUrl) {
      const oldPath = path.join(__dirname, '..', imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    db.query('DELETE FROM blogs WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Blog deleted successfully' });
    });
  });
};
