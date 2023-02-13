import urls from "../../../server/utils/urls";

async function sendEmailVerificationEmail(transporter, email, token) {
  const info = await transporter.sendMail({
    from: urls.emailId, // sender address
    to: email, // list of receivers
    subject: "Boggers Email Verification", // Subject line
    text: `${urls.base + urls.pages.emailVerification}/${token}`, // plain text body
    html: `<p>${urls.base + urls.pages.emailVerification}/${token}</p>`, // html body
  });
  return info;
}

export default sendEmailVerificationEmail;
