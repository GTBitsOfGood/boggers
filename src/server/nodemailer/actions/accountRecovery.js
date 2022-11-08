import urls from "../../../../utils/urls";

async function sendAccountRecoveryEmail(transporter, email, token) {
  return transporter.sendMail({
    from: "hello@bitsofgood.org", // sender address
    to: email, // list of receivers
    subject: "Boggers Account Recovery", // Subject line
    text: `${urls.base + urls.pages.resetPassword}/${token}`, // plain text body
    html: `<p>${urls.base + urls.pages.resetPassword}/${token}</p>`, // html body
  });
}

export default sendAccountRecoveryEmail;
