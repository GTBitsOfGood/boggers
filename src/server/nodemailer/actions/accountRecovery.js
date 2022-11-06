async function sendAccountRecoveryEmail(transporter, email, token) {
  return transporter.sendMail({
    from: "hello@bitsofgood.org", // sender address
    to: email, // list of receivers
    subject: "Boggers Account Recovery", // Subject line
    text: `https://boggers.vercel.app/reset_password/${token}`, // plain text body
    html: `<p>https://boggers.vercel.app/reset_password/${token}</p>`, // html body
  });
}

export default sendAccountRecoveryEmail;
