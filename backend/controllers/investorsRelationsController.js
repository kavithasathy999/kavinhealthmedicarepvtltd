const db = require("../config/db");
const fs = require('fs');
const path = require('path');

exports.getInvestorsRelations = async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM investors_relations ORDER BY id DESC");
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching investors relations:", error);
        res.status(500).json({ success: false, message: "Failed to fetch investors relations" });
    }
};

exports.addInvestorRelation = async (req, res) => {
    try {
        const { headline, report_year } = req.body;
        const pdf_url = req.file ? req.file.filename : null;
        if (!headline || !pdf_url) {
            return res.status(400).json({ success: false, message: "Headline and PDF file are required" });
        }
        let file_size = "";
        if (req.file) {
            const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(1);
            file_size = `${sizeInMB} MB`;
        }
        const query = "INSERT INTO investors_relations (headline, pdf_url, file_size, report_year) VALUES (?, ?, ?, ?)";
        const [result] = await db.promise().query(query, [headline, pdf_url, file_size, report_year || null]);
        res.status(201).json({ success: true, message: "Added successfully", id: result.insertId });
    } catch (error) {
        console.error("Error adding investors relation:", error);
        res.status(500).json({ success: false, message: "Failed to add" });
    }
};

exports.updateInvestorRelation = async (req, res) => {
    try {
        const { id } = req.params;
        const { headline, report_year } = req.body;
        const pdf_url = req.file ? req.file.filename : null;
        let query, values;
        if (pdf_url) {
            const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(1);
            const file_size = `${sizeInMB} MB`;
            query = "UPDATE investors_relations SET headline=?, pdf_url=?, file_size=?, report_year=? WHERE id=?";
            values = [headline, pdf_url, file_size, report_year || null, id];
        } else {
            query = "UPDATE investors_relations SET headline=?, report_year=? WHERE id=?";
            values = [headline, report_year || null, id];
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

exports.deleteInvestorRelation = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.promise().query("SELECT pdf_url FROM investors_relations WHERE id = ?", [id]);        
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
        await db.promise().query("DELETE FROM investors_relations WHERE id = ?", [id]);
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting investors relation:", error);
        res.status(500).json({ success: false, message: "Failed to delete" });
    }
};
