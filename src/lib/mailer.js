import nodemailer from 'nodemailer';

// ── Transporter (Gmail example — .env mein creds daalo) ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,   // aapka Gmail: abc@gmail.com
    pass: process.env.MAIL_PASS,   // Gmail App Password (not your login password)
  },
});

// ── Send inquiry email to agent ──
export async function sendInquiryEmail({ agentEmail, agentName, property, inquiry }) {
  const subject = `New Inquiry — ${property.title}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
      <div style="background: #2e5d42; padding: 24px 32px;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px;">New Property Inquiry</h2>
        <p style="color: #a8c5b5; margin: 6px 0 0; font-size: 14px;">Someone is interested in your listing</p>
      </div>

      <div style="padding: 28px 32px; background: #ffffff;">
        <h3 style="color: #2e5d42; margin: 0 0 4px; font-size: 16px;">Property</h3>
        <p style="margin: 0 0 20px; font-size: 15px; color: #1a2e22; font-weight: 600;">${property.title}</p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #6b7c72;">📍 ${property.location}, ${property.city}</p>
        <p style="margin: 0 0 28px; font-size: 15px; color: #c8a96e; font-weight: 700;">₹${Number(property.price).toLocaleString('en-IN')}</p>

        <hr style="border: none; border-top: 1px solid #e8e8e8; margin-bottom: 24px;" />

        <h3 style="color: #2e5d42; margin: 0 0 16px; font-size: 16px;">Inquiry Details</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px; width: 100px;">Name</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px; font-weight: 600;">${inquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px;">
              <a href="mailto:${inquiry.email}" style="color: #2e5d42;">${inquiry.email}</a>
            </td>
          </tr>
          ${inquiry.phone ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px;">Phone</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px;">
              <a href="tel:${inquiry.phone}" style="color: #2e5d42;">${inquiry.phone}</a>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px; vertical-align: top;">Message</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px; line-height: 1.6;">${inquiry.message}</td>
          </tr>
        </table>
      </div>

      <div style="padding: 16px 32px; background: #f0f4f1; text-align: center;">
        <p style="color: #6b7c72; font-size: 12px; margin: 0;">
          This email was sent from your Estate real estate platform.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from:    `"Estate Platform" <${process.env.MAIL_USER}>`,
    to:      agentEmail,
    subject,
    html,
  });
}