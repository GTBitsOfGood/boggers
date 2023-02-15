import urls from "../../../server/utils/urls";

async function sendAccountRecoveryEmail(transporter, email, token) {
  const url = urls.base + urls.pages.resetPassword + "/" + token;
  const info = await transporter.sendMail({
    from: urls.emailId, // sender address
    to: email, // list of receivers
    subject: "Boggers Account Recovery", // Subject line
    text: url, // plain text body
    html: `<a href="${url}">${url}</a>`, // html body
  });
  return info;
}

export default sendAccountRecoveryEmail;
