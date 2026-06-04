const nodemailer = require('nodemailer');
const db = require('../config/db');
const { createBlog } = require('./blogController');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async (req, res) => {
  const { name, email, phone, companyName, companyEmail, department, message } = req.body;
  if (!name || !email || !phone || !companyName || !companyEmail || !message) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }
  const adminMailOptions = {
    from: `"Kavin Health & Medicare Pvt Ltd." <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Appointment Request — ${department}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>New Appointment Request - Kavin Health & Medicare Pvt Ltd.</title>
        <style>
          @media screen and (max-width: 600px) {
            .bg-wrapper { padding: 20px 10px !important; }
            .main-card { border-radius: 16px !important; }
            .pad-header { padding: 30px 24px !important; }
            .pad-subheader { padding: 16px 24px !important; }
            .pad-body { padding: 30px 24px !important; }
            .pad-footer { padding: 24px 24px !important; }
            .grid-cell { padding: 14px 16px !important; }
            
            .brand-title { font-size: 20px !important; }
            .body-text { font-size: 14px !important; }
            .grid-label { font-size: 12px !important; }
            .grid-value { font-size: 13px !important; width: 100% !important; display: block !important; padding-top: 4px !important; border: none !important; }
            .grid-label-cell { border-bottom: none !important; padding-bottom: 0 !important; width: 100% !important; display: block !important; }
            .grid-value-cell { border-bottom: 1px solid #f1f5f9 !important; padding-top: 4px !important; width: 100% !important; display: block !important; }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" class="bg-wrapper" style="background-color:#f8fafc;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" class="main-card" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.06);border:1px solid #e2e8f0;margin:0 auto;">
                <tr>
                  <td class="pad-header" style="background:linear-gradient(135deg, #1b4332 0%, #50ad77 100%);padding:40px 48px;text-align:left;position:relative;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <h1 class="brand-title" style="margin:0;color:#ffffff;font-size:23px;font-weight:800;letter-spacing:-0.5px;line-height:1.3;">
                            Kavin Health & Medicare Pvt Ltd.
                          </h1>
                          <p style="margin:6px 0 0;color:#d1fae5;font-size:13px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;">
                            Enterprise Portal Internal Alert
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="pad-subheader" style="background-color:#f1f5f9;padding:16px 48px;border-bottom:1px solid #e2e8f0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="font-size:12px;color:#475569;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Classification:</span>
                          <span style="display:inline-block;background-color:#e8f5ec;color:#2c7a4e;font-size:12px;font-weight:700;padding:4px 12px;border-radius:9999px;margin-left:6px;border:1px solid #bce3cc;">
                            ${department}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- ── MAIN BODY ── -->
                <tr>
                  <td class="pad-body" style="padding:40px 48px;">
                    <p class="body-text" style="margin:0 0 28px;font-size:15px;color:#334155;line-height:1.6;">
                      Hello Admin, <br/><br/>
                      A new premium business inquiry and appointment request has been submitted via the <strong>Kavin Health & Medicare</strong> digital touchpoint. Detailed information regarding the lead is structured below:
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                      <tr>
                        <td colspan="2" class="grid-cell" style="background-color:#f8fafc;padding:14px 20px;border-bottom:1px solid #edf2f7;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">
                          Primary Contact Details
                        </td>
                      </tr>
                      <tr>
                        <td class="grid-cell grid-label-cell" style="padding:16px 20px;font-size:13px;font-weight:600;color:#64748b;width:35%;border-bottom:1px solid #f1f5f9;">Full Name</td>
                        <td class="grid-cell grid-value-cell" style="padding:16px 20px;font-size:14px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;">${name}</td>
                      </tr>
                      <tr>
                        <td class="grid-cell grid-label-cell" style="padding:16px 20px;font-size:13px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;">Personal Email</td>
                        <td class="grid-cell grid-value-cell" style="padding:16px 20px;font-size:14px;border-bottom:1px solid #f1f5f9;word-break:break-all;">
                          <a href="mailto:${email}" style="color:#50ad77;text-decoration:none;font-weight:600;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td class="grid-cell grid-label-cell" style="padding:16px 20px;font-size:13px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;">Phone Number</td>
                        <td class="grid-cell grid-value-cell" style="padding:16px 20px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;">
                          <a href="tel:+${phone}" style="color:#0f172a;text-decoration:none;font-weight:700;">+${phone}</a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" class="grid-cell" style="background-color:#f8fafc;padding:14px 20px;border-top:6px solid #f8fafc;border-bottom:1px solid #edf2f7;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">
                          Corporate Information
                        </td>
                      </tr>
                      <tr>
                        <td class="grid-cell grid-label-cell" style="padding:16px 20px;font-size:13px;font-weight:600;color:#64748b;border-bottom:1px solid #f1f5f9;">Company Name</td>
                        <td class="grid-cell grid-value-cell" style="padding:16px 20px;font-size:14px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;">${companyName}</td>
                      </tr>
                      <tr>
                        <td class="grid-cell grid-label-cell" style="padding:16px 20px;font-size:13px;font-weight:600;color:#64748b;">Company Email</td>
                        <td class="grid-cell grid-value-cell" style="padding:16px 20px;font-size:14px;word-break:break-all;">
                          <a href="mailto:${companyEmail}" style="color:#50ad77;text-decoration:none;font-weight:600;">${companyEmail}</a>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                      <tr>
                        <td class="grid-cell" style="background-color:#f8fafc;border-left:4px solid #50ad77;border-radius:4px 12px 12px 4px;padding:20px 24px;">
                          <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">
                            Message / Requirement Summary
                          </p>
                          <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.7;white-space: pre-line;">
                            "${message}"
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="pad-footer" style="background-color:#0f172a;padding:24px 48px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                      This transmission is an automated executive notification via <strong style="color:#50ad77;">Kavin Health & Medicare</strong>.
                    </p>
                    <p style="margin:8px 0 0;font-size:11px;color:#64748b;">
                      © ${new Date().getFullYear()} Kavin Health & Medicare Pvt Ltd. All rights reserved.
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

  const sql = "INSERT INTO contacts (name, email, phone, companyName, companyEmail, department, message) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [name, email, phone, companyName, companyEmail, department, message];

  db.query(sql, values, async (dbErr, result) => {
    if (dbErr) {
      console.error('Database error:', dbErr);
      return res.status(500).json({ message: 'Failed to save contact inquiry.' });
    }
    try {
      await transporter.sendMail(adminMailOptions);
      return res.status(200).json({ message: 'Your inquiry has been submitted successfully.', id: result.insertId });
    } catch (err) {
      console.error('Email send error:', err);
      return res.status(200).json({ 
        message: 'Your inquiry has been submitted successfully, but we encountered an issue sending the admin notification email.',
        id: result.insertId 
      });
    }
  });
};

const getContacts = (req, res) => {
  const sql = "SELECT * FROM contacts ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const updateContact = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, companyName, companyEmail, department, message } = req.body;
  const sql = "UPDATE contacts SET name=?, email=?, phone=?, companyName=?, companyEmail=?, department=?, message=? WHERE id=?";
  const values = [name, email, phone, companyName, companyEmail, department, message, id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Contact updated successfully" });
  });
};

const deleteContact = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM contacts WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Contact deleted successfully" });
  });
};

module.exports = { sendContactEmail, getContacts, updateContact, deleteContact };