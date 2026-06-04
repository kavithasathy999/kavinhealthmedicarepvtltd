const db = require('../config/db');

exports.addService = (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.filename : null;
  if (!title || !description || !image) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  const query = 'INSERT INTO services (title, description, image) VALUES (?, ?, ?)';
  db.query(query, [title, description, image], (err, result) => {
    if (err) {
      console.error('Error adding service:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.status(201).json({ success: true, message: 'Service added successfully', id: result.insertId });
  });
};

exports.getServices = (req, res) => {
  const query = 'SELECT * FROM services ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.status(200).json({ success: true, services: results });
  });
};

exports.deleteService = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM services WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting service:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  });
};

exports.updateService = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required' });
  }

  let query;
  let params;

  if (image) {
    query = 'UPDATE services SET title = ?, description = ?, image = ? WHERE id = ?';
    params = [title, description, image, id];
  } else {
    query = 'UPDATE services SET title = ?, description = ? WHERE id = ?';
    params = [title, description, id];
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error updating service:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.status(200).json({ success: true, message: 'Service updated successfully' });
  });
};
