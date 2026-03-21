import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Email Transporter (Lazy initialization)
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.warn('Email configuration is missing. Emails will not be sent.');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT),
      secure: SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

// API Routes
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const mailTransporter = getTransporter();
  if (!mailTransporter) {
    return res.status(503).json({ error: 'Email service not configured' });
  }

  const mailOptions = {
    from: process.env.FROM_EMAIL || 'no-reply@pegasusedu.com',
    to: email,
    subject: 'Pegasus Edu - Şifre Sıfırlama',
    text: `Merhaba,\n\nŞifrenizi sıfırlamak için bir talepte bulundunuz. Lütfen aşağıdaki bağlantıyı kullanın:\n\n${process.env.APP_URL}/reset-password?token=mock-token\n\nBu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ea580c;">Pegasus Edu</h2>
        <p>Merhaba,</p>
        <p>Şifrenizi sıfırlamak için bir talepte bulundunuz. Lütfen aşağıdaki butona tıklayarak şifrenizi sıfırlayın:</p>
        <a href="${process.env.APP_URL}/reset-password?token=mock-token" style="display: inline-block; padding: 10px 20px; background-color: #ea580c; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Şifremi Sıfırla</a>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">Bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
      </div>
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Reset link sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/support/contact', async (req, res) => {
  const { email, message, name } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  const mailTransporter = getTransporter();
  if (!mailTransporter) {
    return res.status(503).json({ error: 'Email service not configured' });
  }

  const mailOptions = {
    from: process.env.FROM_EMAIL || 'no-reply@pegasusedu.com',
    to: process.env.SUPPORT_EMAIL || 'support@pegasusedu.com',
    subject: `Yeni Destek Talebi - ${name || email}`,
    text: `Gönderen: ${name || 'Belirtilmedi'} (${email})\n\nMesaj:\n${message}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ea580c;">Yeni Destek Talebi</h2>
        <p><strong>Gönderen:</strong> ${name || 'Belirtilmedi'} (${email})</p>
        <p><strong>Mesaj:</strong></p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Support message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
