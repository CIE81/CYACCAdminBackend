import nodemailer from 'nodemailer';

let transporter;

export const getTransporter = async () => {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
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
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
};
