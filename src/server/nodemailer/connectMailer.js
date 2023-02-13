import nodemailer from "nodemailer";

async function connectMailer() {
  let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
}

export default connectMailer;
