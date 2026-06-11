const db = require("../config/db");
const fs = require('fs');
const path = require('path');

exports.getResourceRepository = async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM resource_repository ORDER BY id DESC");
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching Resource Repository:", error);
        res.status(500).json({ success: false, message: "Failed to fetch Resource Repository" });
    }
};

exports.addResourceRepository = async (req, res) => {
    try {
        const { headline, report_year, meta_title, meta_description, meta_keywords } = req.body;
        const pdf_url = req.file ? req.file.filename : null;
        if (!headline || !pdf_url) {
            return res.status(400).json({ success: false, message: "Headline and PDF file are required" });
        }
        let file_size = "";
        if (req.file) {
            const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(1);
            file_size = `${sizeInMB} MB`;
        }
        const query = "INSERT INTO resource_repository (headline, pdf_url, file_size, report_year, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const [result] = await db.promise().query(query, [headline, pdf_url, file_size, report_year || null, meta_title || '', meta_description || '', meta_keywords || '']);
        res.status(201).json({ success: true, message: "Added successfully", id: result.insertId });
    } catch (error) {
        console.error("Error adding investors relation:", error);
        res.status(500).json({ success: false, message: "Failed to add" });
    }
};

exports.updateResourceRepository = async (req, res) => {
    try {
        const { id } = req.params;
        const { headline, report_year, meta_title, meta_description, meta_keywords } = req.body;
        const pdf_url = req.file ? req.file.filename : null;
        let query, values;
        if (pdf_url) {
            const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(1);
            const file_size = `${sizeInMB} MB`;
            query = "UPDATE resource_repository SET headline=?, pdf_url=?, file_size=?, report_year=?, meta_title=?, meta_description=?, meta_keywords=? WHERE id=?";
            values = [headline, pdf_url, file_size, report_year || null, meta_title || '', meta_description || '', meta_keywords || '', id];
        } else {
            query = "UPDATE resource_repository SET headline=?, report_year=?, meta_title=?, meta_description=?, meta_keywords=? WHERE id=?";
            values = [headline, report_year || null, meta_title || '', meta_description || '', meta_keywords || '', id];
        }
        const [result] = await db.promise().query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        res.status(200).json({ success: true, message: "Updated successfully" });
    } catch (error) {
        console.error("Error updating investors relation:", error);
        res.status(500).json({ success: false, message: "Failed to update" });
    }
};

exports.deleteResourceRepository = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.promise().query("SELECT pdf_url FROM resource_repository WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        const pdfUrl = rows[0].pdf_url;
        if (pdfUrl) {
            const filePath = path.join(__dirname, "..", "uploads", pdfUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await db.promise().query("DELETE FROM resource_repository WHERE id = ?", [id]);
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting investors relation:", error);
        res.status(500).json({ success: false, message: "Failed to delete" });
    }
};

exports.downloadResourceReport = (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, "..", "uploads", filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "File not found" });
        }
        res.download(filePath, filename);
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).json({ success: false, message: "Failed to download file" });
    }
};
