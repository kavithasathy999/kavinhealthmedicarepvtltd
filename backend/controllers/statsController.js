const db = require("../config/db");

exports.getAllStats = (req, res) => {
  const sql = "SELECT * FROM stats ORDER BY display_order ASC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Stats fetch failed:", err.message);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(results);
  });
};

exports.updateStat = (req, res) => {
  const { id } = req.params;
  const { value, label, suffix, display_order } = req.body;
  if (!value || !label) {
    return res.status(400).json({ message: "Value and label are required." });
  }
  const sql =
    "UPDATE stats SET value=?, label=?, suffix=?, display_order=? WHERE id=?";
  db.query(
    sql,
    [value, label.trim(), suffix?.trim() || "", display_order || 0, id],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json({ message: "Stat updated" });
    }
  );
};

exports.deleteStat = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM stats WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json({ message: "Stat deleted" });
  });
};
