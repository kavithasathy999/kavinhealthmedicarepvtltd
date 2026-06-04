const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.applyCareer = async (req, res) => {
    try {
        const { career_id, fullname, contact_number, email, qualification } = req.body;
        if (!career_id || !fullname || !contact_number || !email) {
            return res.status(400).json({ success: false, message: 'All required fields must be filled' });
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(fullname)) {
            return res.status(400).json({ success: false, message: 'Full name must contain only alphabets' });
        }
        let resume_url = null;
        let photo_url = null;
        if (req.files) {
            if (req.files.photo && req.files.photo.length > 0) {
                const photoFile = req.files.photo[0];
                if (photoFile.size > 3 * 1024 * 1024) {
                    return res.status(400).json({ success: false, message: 'Photo must be less than 3MB' });
                }
                photo_url = `${req.protocol}://${req.get('host')}/uploads/applications/${photoFile.filename}`;
            }
            if (req.files.resume && req.files.resume.length > 0) {
                const resumeFile = req.files.resume[0];
                if (resumeFile.size > 5 * 1024 * 1024) {
                    return res.status(400).json({ success: false, message: 'Resume must be less than 5MB' });
                }
                resume_url = `${req.protocol}://${req.get('host')}/uploads/applications/${resumeFile.filename}`;
            }
        }
        if (!resume_url || !photo_url) {
            return res.status(400).json({ success: false, message: 'Resume and photo are required' });
        }
        const [result] = await db.promise().query(
            'INSERT INTO career_applications (career_id, fullname, contact_number, email, qualification, resume_url, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [career_id, fullname, contact_number, email, qualification || '', resume_url, photo_url]
        );
        const [careerResult] = await db.promise().query('SELECT title FROM career_opportunities WHERE id = ?', [career_id]);
        const jobTitle = careerResult.length > 0 ? careerResult[0].title : 'Career Opportunity';
        const adminMailOptions = {
            from: `"Kavin Health & Medicare Pvt Ltd." <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Job Application — ${jobTitle}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <style>
                    @media screen and (max-width: 600px) {
                    .outer-pad   { padding: 16px 8px !important; }
                    .card-header { padding: 24px 20px !important; }
                    .card-header h1 { font-size: 18px !important; }
                    .card-body   { padding: 24px 20px !important; }
                    .intro-text  { font-size: 14px !important; }
                    .footer-text { font-size: 13px !important; }
                    .detail-row td { display: block !important; width: 100% !important; box-sizing: border-box !important; }
                    .detail-label  { border-bottom: none !important; padding-bottom: 4px !important; padding-top: 14px !important; }
                    .detail-value  { padding-top: 2px !important; border-bottom: 1px solid #f1f5f9 !important; padding-bottom: 14px !important; }
                    }
                </style>
                </head>
                <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" class="outer-pad" style="background-color:#f8fafc;padding:32px 16px;">
                    <tr>
                    <td align="center">
                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.07);border:1px solid #e2e8f0;">
                        <!-- Header -->
                        <tr>
                            <td class="card-header" style="background:linear-gradient(135deg,#1b4332 0%,#50ad77 100%);padding:32px 36px;">
                            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;line-height:1.3;">Kavin Health &amp; Medicare Pvt Ltd.</h1>
                            <p style="margin:6px 0 0;color:#d1fae5;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">New Job Application Received</p>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td class="card-body" style="padding:32px 36px;">
                            <p class="intro-text" style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
                                Hello Admin,<br/><br/>
                                A new candidate has applied for the <strong style="color:#0f172a;">${jobTitle}</strong> position. Here are the applicant's details:
                            </p>
                            <!-- Details table -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                                <tr class="detail-row" style="background-color:#f8fafc;">
                                <td class="detail-label" style="padding:14px 18px;font-size:13px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;width:38%;vertical-align:top;">Applicant Name</td>
                                <td class="detail-value" style="padding:14px 18px;font-size:14px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;word-break:break-word;">${fullname}</td>
                                </tr>
                                <tr class="detail-row">
                                <td class="detail-label" style="padding:14px 18px;font-size:13px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;width:38%;vertical-align:top;">Contact Number</td>
                                <td class="detail-value" style="padding:14px 18px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;">+${contact_number}</td>
                                </tr>
                                <tr class="detail-row" style="background-color:#f8fafc;">
                                <td class="detail-label" style="padding:14px 18px;font-size:13px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;width:38%;vertical-align:top;">Email Address</td>
                                <td class="detail-value" style="padding:14px 18px;font-size:14px;border-bottom:1px solid #f1f5f9;word-break:break-all;">
                                    <a href="mailto:${email}" style="color:#50ad77;text-decoration:none;font-weight:600;">${email}</a>
                                </td>
                                </tr>
                                <tr class="detail-row">
                                <td class="detail-label" style="padding:14px 18px;font-size:13px;font-weight:600;color:#64748b;width:38%;vertical-align:top;">Qualification</td>
                                <td class="detail-value" style="padding:14px 18px;font-size:14px;font-weight:600;color:#0f172a;word-break:break-word;">${qualification || 'N/A'}</td>
                                </tr>
                            </table>
                            <p class="footer-text" style="margin:24px 0 0;font-size:14px;color:#334155;line-height:1.7;">
                                You can view their uploaded resume and photo securely from the admin dashboard under the <strong>Applications</strong> tab.
                            </p>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                </table>
                </body>
                </html>
            `,
        };
        const userMailOptions = {
            from: `"Kavin Health & Medicare Pvt Ltd." <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Application Received — ${jobTitle}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <style>
                    @media screen and (max-width: 600px) {
                    .u-outer-pad   { padding: 16px 8px !important; }
                    .u-card-header { padding: 24px 20px !important; }
                    .u-card-header h1 { font-size: 18px !important; }
                    .u-card-body   { padding: 24px 20px !important; }
                    .u-greeting    { font-size: 15px !important; }
                    .u-body-text   { font-size: 14px !important; }
                    }
                </style>
                </head>
                <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" class="u-outer-pad" style="background-color:#f8fafc;padding:32px 16px;">
                    <tr>
                    <td align="center">
                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.07);border:1px solid #e2e8f0;">
                        <!-- Header -->
                        <tr>
                            <td class="u-card-header" style="background:linear-gradient(135deg,#1b4332 0%,#50ad77 100%);padding:32px 36px;">
                            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;line-height:1.3;">Kavin Health &amp; Medicare Pvt Ltd.</h1>
                            <p style="margin:6px 0 0;color:#d1fae5;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Application Acknowledgement</p>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td class="u-card-body" style="padding:32px 36px;">
                            <p class="u-greeting" style="margin:0 0 16px;font-size:16px;font-weight:700;color:#0f172a;">Dear ${fullname},</p>
                            <p class="u-body-text" style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.7;">
                                Thank you for expressing your interest in joining <strong style="color:#0f172a;">Kavin Health &amp; Medicare Pvt Ltd.</strong> We have successfully received your application for the <strong style="color:#0f172a;">${jobTitle}</strong> position.
                            </p>
                            <p class="u-body-text" style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.7;">
                                Our recruitment team will review your qualifications and experience carefully. If your profile matches our requirements, we will contact you for the next steps in the hiring process.
                            </p>
                            <p class="u-body-text" style="margin:0;font-size:15px;color:#334155;line-height:1.7;">
                                We wish you the best of luck with your career goals.<br/><br/>
                                Sincerely,<br/>
                                <strong style="color:#0f172a;">HR Department</strong><br/>
                                <span style="color:#50ad77;font-weight:600;">Kavin Health &amp; Medicare Pvt Ltd.</span>
                            </p>
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
                </table>
                </body>
                </html>
            `,
        };
        try {
            await Promise.all([
                transporter.sendMail(adminMailOptions),
                transporter.sendMail(userMailOptions)
            ]);
        } catch (emailErr) {
            console.error('Failed to send career application emails:', emailErr);
        }
        res.status(201).json({ success: true, message: 'Application submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.getOpportunities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;
        const [countResult] = await db.promise().query(
            'SELECT COUNT(*) as total FROM career_opportunities WHERE is_active = 1'
        );
        const total = countResult[0].total;
        const [rows] = await db.promise().query(
            'SELECT * FROM career_opportunities WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        res.json({
            success: true,
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.getAllOpportunities = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM career_opportunities ORDER BY display_order ASC, created_at DESC'
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.getOpportunityById = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM career_opportunities WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.createOpportunity = async (req, res) => {
    try {
        const { title, description, color_from, color_to, display_order, is_active } = req.body;
        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Title and description are required' });
        }
        const [result] = await db.promise().query(
            'INSERT INTO career_opportunities (title, description, color_from, color_to, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            [
                title,
                description,
                color_from || 'from-blue-500',
                color_to || 'to-cyan-400',
                display_order || 0,
                is_active !== undefined ? is_active : 1,
            ]
        );
        const [newRow] = await db.promise().query('SELECT * FROM career_opportunities WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: newRow[0], message: 'Opportunity created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.updateOpportunity = async (req, res) => {
    try {
        const { title, description, color_from, color_to, display_order, is_active } = req.body;
        const id = req.params.id;
        const [existing] = await db.promise().query('SELECT * FROM career_opportunities WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        await db.promise().query(
            'UPDATE career_opportunities SET title=?, description=?, color_from=?, color_to=?, display_order=?, is_active=? WHERE id=?',
            [
                title || existing[0].title,
                description || existing[0].description,
                color_from || existing[0].color_from,
                color_to || existing[0].color_to,
                display_order !== undefined ? display_order : existing[0].display_order,
                is_active !== undefined ? is_active : existing[0].is_active,
                id,
            ]
        );
        const [updated] = await db.promise().query('SELECT * FROM career_opportunities WHERE id = ?', [id]);
        res.json({ success: true, data: updated[0], message: 'Updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.deleteOpportunity = async (req, res) => {
    try {
        const [existing] = await db.promise().query('SELECT * FROM career_opportunities WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        await db.promise().query('DELETE FROM career_opportunities WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.toggleActive = async (req, res) => {
    try {
        const [existing] = await db.promise().query('SELECT * FROM career_opportunities WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        const newStatus = existing[0].is_active ? 0 : 1;
        await db.promise().query('UPDATE career_opportunities SET is_active = ? WHERE id = ?', [newStatus, req.params.id]);
        res.json({ success: true, is_active: newStatus, message: `Opportunity ${newStatus ? 'activated' : 'deactivated'}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT a.*, o.title as career_title 
             FROM career_applications a 
             LEFT JOIN career_opportunities o ON a.career_id = o.id 
             ORDER BY a.created_at DESC`
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.updateApplication = async (req, res) => {
    try {
        const { fullname, contact_number, email, qualification } = req.body;
        const id = req.params.id;
        const [existing] = await db.promise().query('SELECT * FROM career_applications WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        await db.promise().query(
            'UPDATE career_applications SET fullname=?, contact_number=?, email=?, qualification=? WHERE id=?',
            [
                fullname || existing[0].fullname,
                contact_number || existing[0].contact_number,
                email || existing[0].email,
                qualification || existing[0].qualification,
                id
            ]
        );
        const [updated] = await db.promise().query(
            `SELECT a.*, o.title as career_title 
             FROM career_applications a 
             LEFT JOIN career_opportunities o ON a.career_id = o.id 
             WHERE a.id = ?`,
            [id]
        );
        res.json({ success: true, data: updated[0], message: 'Application updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const [existing] = await db.promise().query('SELECT * FROM career_applications WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        if (existing[0].photo_url && existing[0].photo_url.includes('/uploads/applications/')) {
            const filename = existing[0].photo_url.split('/uploads/applications/')[1];
            const filePath = path.join(__dirname, '../uploads/applications', filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        if (existing[0].resume_url && existing[0].resume_url.includes('/uploads/applications/')) {
            const filename = existing[0].resume_url.split('/uploads/applications/')[1];
            const filePath = path.join(__dirname, '../uploads/applications', filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await db.promise().query('DELETE FROM career_applications WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Application deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};
