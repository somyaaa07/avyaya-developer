import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,   
    pass: process.env.MAIL_PASS,   
  },
});


const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&#39;");

export async function sendInquiryEmail({ to, property, inquiry }) {
  const subject = `New Inquiry — ${property.title}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
      <div style="background: #2e5d42; padding: 24px 32px;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px;">New Property Inquiry</h2>
        <p style="color: #a8c5b5; margin: 6px 0 0; font-size: 14px;">A visitor is interested in one of your listings</p>
      </div>

      <div style="padding: 28px 32px; background: #ffffff;">
        <h3 style="color: #2e5d42; margin: 0 0 4px; font-size: 16px;">Property</h3>
        <p style="margin: 0 0 20px; font-size: 15px; color: #1a2e22; font-weight: 600;">${esc(property.title)}</p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #6b7c72;">📍 ${esc(property.location)}, ${esc(property.city)}</p>
        <p style="margin: 0 0 28px; font-size: 15px; color: #c8a96e; font-weight: 700;">₹${Number(property.price).toLocaleString('en-IN')}</p>

        <hr style="border: none; border-top: 1px solid #e8e8e8; margin-bottom: 24px;" />

        <h3 style="color: #2e5d42; margin: 0 0 16px; font-size: 16px;">Inquiry Details</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px; width: 100px;">Name</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px; font-weight: 600;">${esc(inquiry.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px;">Email</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px;">
              <a href="mailto:${esc(inquiry.email)}" style="color: #2e5d42;">${esc(inquiry.email)}</a>
            </td>
          </tr>
          ${inquiry.phone ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px;">Phone</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px;">
              <a href="tel:${esc(inquiry.phone)}" style="color: #2e5d42;">${esc(inquiry.phone)}</a>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7c72; font-size: 13px; vertical-align: top;">Message</td>
            <td style="padding: 8px 0; color: #1a2e22; font-size: 14px; line-height: 1.6;">${esc(inquiry.message)}</td>
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
    to,
    replyTo: inquiry.email,
    subject,
    html,
  });
}


export async function sendContactEnquiryEmail({ enquiry }) {
  const {
    name,
    phone,
    email,
    enquiryType,
    message,
  } = enquiry;

  const subject = `New Website Enquiry — ${name}`;

  const html = `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      background: #f9f9f9;
      border-radius: 12px;
      overflow: hidden;
    ">

      <div style="
        background: #1a2a22;
        padding: 24px 32px;
      ">
        <h2 style="
          color: #ffffff;
          margin: 0;
          font-size: 20px;
        ">
          New Website Enquiry
        </h2>

        <p style="
          color: #d8dfda;
          margin: 6px 0 0;
          font-size: 14px;
        ">
          Someone has submitted an enquiry through your website.
        </p>
      </div>

      <div style="
        padding: 28px 32px;
        background: #ffffff;
      ">

        <h3 style="
          color: #1a2a22;
          margin: 0 0 16px;
          font-size: 16px;
        ">
          Enquiry Details
        </h3>

        <table style="width: 100%; border-collapse: collapse;">

          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
              width: 130px;
            ">
              Name
            </td>

            <td style="
              padding: 8px 0;
              color: #1a2a22;
              font-size: 14px;
              font-weight: 600;
            ">
              ${name}
            </td>
          </tr>

          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
            ">
              Phone
            </td>

            <td style="
              padding: 8px 0;
              color: #1a2a22;
              font-size: 14px;
            ">
              ${phone}
            </td>
          </tr>

          ${
            email
              ? `
          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
            ">
              Email
            </td>

            <td style="
              padding: 8px 0;
              color: #1a2a22;
              font-size: 14px;
            ">
              ${email}
            </td>
          </tr>
          `
              : ""
          }

          ${
            enquiryType
              ? `
          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
            ">
              Enquiry Type
            </td>

            <td style="
              padding: 8px 0;
              color: #1a2a22;
              font-size: 14px;
            ">
              ${enquiryType}
            </td>
          </tr>
          `
              : ""
          }

          <tr>
            <td style="
              padding: 8px 0;
              color: #6b7c72;
              font-size: 13px;
              vertical-align: top;
            ">
              Message
            </td>

            <td style="
              padding: 8px 0;
              color: #1a2a22;
              font-size: 14px;
              line-height: 1.6;
            ">
              ${message}
            </td>
          </tr>

        </table>
      </div>

      <div style="
        padding: 16px 32px;
        background: #f0f4f1;
        text-align: center;
      ">
        <p style="
          color: #6b7c72;
          font-size: 12px;
          margin: 0;
        ">
          This email was sent from your company website.
        </p>
      </div>

    </div>
  `;

  await transporter.sendMail({
    from: `"Website Enquiry" <${process.env.MAIL_USER}>`,
    to: process.env.CONTACT_TO || process.env.MAIL_USER,
    replyTo: email || undefined,
    subject,
    html,
  });
}

