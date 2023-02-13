import urls from "../../../server/utils/urls";

async function sendEmailVerificationEmail(transporter, email, token) {
  return transporter.sendMail(
    {
      from: urls.emailId, // sender address
      to: email, // list of receivers
      subject: "Boggers Email Verification", // Subject line
      text: `${urls.base + urls.pages.emailVerification}/${token}`, // plain text body
      html: `<p>${urls.base + urls.pages.emailVerification}/${token}</p>`, // html body
    },
    (err, info) => {
      console.log("info1:", info.envelope);
      console.log("info2:", info.messageId);
      console.log("err:", err);
    },
  );
}

export default sendEmailVerificationEmail;
