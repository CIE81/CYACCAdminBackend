import nodemailer from 'nodemailer';

let transporter;

const resolveFromAddress = () => {
  const fromName = process.env.EMAIL_FROM_NAME || 'CYACC Admin';
  const fromEmail = process.env.EMAIL_USER;
  if (!fromEmail) {
    throw new Error('EMAIL_USER environment variable is required for sending emails.');
  }
  return `"${fromName}" <${fromEmail}>`;
};

export const getTransporter = async () => {
  if (transporter) {
    return transporter;
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error('EMAIL_USER and EMAIL_PASSWORD environment variables are required for the email service.');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  if (process.env.NODE_ENV !== 'test') {
    await transporter.verify();
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const tx = await getTransporter();
  return tx.sendMail({
    from: resolveFromAddress(),
    to,
    subject,
    text,
    html
  });
};
