async function sendEmailVerificationEmail(transporter, email, token) {
  return transporter.sendMail({
    from: "hello@bitsofgood.org", // sender address
    to: email, // list of receivers
    subject: "Boggers Email Verification", // Subject line
    text: `https://boggers.vercel.app/email_verification/${token}`, // plain text body
    html: `<p>https://boggers.vercel.app/email_verification/${token}</p>`, // html body
  });
}

export default sendEmailVerificationEmail;
