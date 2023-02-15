import urls from "../../../server/utils/urls";

async function sendEmailVerificationEmail(transporter, email, token) {
  const url = urls.base + urls.pages.emailVerification + "/" + token;
  const info = await transporter.sendMail({
    from: urls.emailId, // sender address
    to: email, // list of receivers
    subject: "Boggers Email Verification", // Subject line
    text: url, // plain text body
    html: `<a href="${url}">${url}</a>`, // html body
  });
  return info;
}

export default sendEmailVerificationEmail;
