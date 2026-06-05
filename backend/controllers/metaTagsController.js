const db = require('../config/db');

exports.getAllMetaTags = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM page_meta_tags ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMetaTagByRoute = async (req, res) => {
  try {
    const { route } = req.query;
    if (!route) return res.status(400).json({ success: false, message: 'Route parameter is required' });
    const [rows] = await db.promise().query('SELECT * FROM page_meta_tags WHERE page_route = ?', [route]);
    if (rows.length === 0) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMetaTag = async (req, res) => {
  try {
    const { page_route, meta_title, meta_description, meta_keywords } = req.body;
    if (!page_route) return res.status(400).json({ success: false, message: 'Page route is required' });
    const [existing] = await db.promise().query('SELECT * FROM page_meta_tags WHERE page_route = ?', [page_route]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Meta tags for this route already exist' });
    }
    const [result] = await db.promise().query(
      'INSERT INTO page_meta_tags (page_route, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?)',
      [page_route, meta_title, meta_description, meta_keywords]
    );
    const [newRecord] = await db.promise().query('SELECT * FROM page_meta_tags WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newRecord[0], message: 'Meta tags created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMetaTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { page_route, meta_title, meta_description, meta_keywords } = req.body;
    if (!page_route) return res.status(400).json({ success: false, message: 'Page route is required' });
    const [existing] = await db.promise().query('SELECT id FROM page_meta_tags WHERE page_route = ? AND id != ?', [page_route, id]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Another entry already uses this route' });
    }
    await db.promise().query(
      'UPDATE page_meta_tags SET page_route = ?, meta_title = ?, meta_description = ?, meta_keywords = ? WHERE id = ?',
      [page_route, meta_title, meta_description, meta_keywords, id]
    );
    const [updated] = await db.promise().query('SELECT * FROM page_meta_tags WHERE id = ?', [id]);
    if (updated.length === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, data: updated[0], message: 'Meta tags updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMetaTag = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.promise().query('DELETE FROM page_meta_tags WHERE id = ?', [id]);    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, message: 'Meta tags deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
