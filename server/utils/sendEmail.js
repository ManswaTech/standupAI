const nodemailer = require('nodemailer');
const dns = require('dns').promises;

const verifyEmailValid = async (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) return false;

  const domain = email.split('@')[1];
  try {
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') return false;
    return true;
  }
};

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER or EMAIL_PASS is missing in .env');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: process.env.EMAIL_PASS.replace(/\s+/g, ''),
    },
  });

  await transporter.sendMail({
    from: `"SmartTeam" <${process.env.EMAIL_USER.trim()}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail, verifyEmailValid };