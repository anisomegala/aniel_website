// src/pages/api/fb-lead.js
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, firstName, lastName, message } = req.body;

  // 1. Meta Hashing Logic
  const hashData = (data) => {
    if (!data) return null;
    return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
  };

  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FB_ACCESS_TOKEN;
  const fbUrl = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;

  const eventData = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: req.headers.referer,
        user_data: {
          em: [hashData(email)],
          fn: [hashData(firstName)],
          ln: [hashData(lastName)],
        },
        custom_data: {
          currency: 'USD',
          value: 1.00,
        },
      },
    ],
  };

  // 2. Nodemailer Configuration for iCloud
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.me.com',
    port: 587,
    secure: false, // iCloud uses STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // Add this temporarily to check your connection
  transporter.verify(function (error, success) {
    if (error) {
      console.log("❌ iCloud Connection Error:", error);
    } else {
      console.log("✅ iCloud is ready to send emails!");
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
    subject: `New Lead: ${firstName} ${lastName}`,
    text: `New inquiry from: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h3>New Project Inquiry</h3>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f4f4f4; border-radius: 10px;">
        <strong>Message:</strong><br/>
        ${message.replace(/\n/g, '<br/>')}
      </div>
    `,
  };

  try {
    // Fire both actions: Facebook CAPI and Email notification
    const [fbResponse, mailResponse] = await Promise.all([
      fetch(fbUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      }),
      transporter.sendMail(mailOptions)
    ]);

    const fbResult = await fbResponse.json();
    return res.status(200).json({ success: true, fbResult, mailId: mailResponse.messageId });
  } catch (error) {
    console.error("Integration Error:", error);
    return res.status(500).json({ error: error.message });
  }
}