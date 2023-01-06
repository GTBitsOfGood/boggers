import React from "react";
import { useRouter } from "next/router";
import urls from "../../../utils/urls";
import styles from "./EmailVerification.module.css";
import connectMongo from "../../server/mongodb/connectMongo";
import { emailVerification } from "../../server/utils/emailFunctions";

const mapping = {
  0: {
    heading: "Token is Invalid or Expired",
    subHeading: "Enter your email in the login page and we'll send you a new verification email",
  },
  1: {
    heading: "Your Email Has Been Verified",
    subHeading: "An email has been sent to you to set up your password",
  },
  2: {
    heading: "Your Email Has Been Verified",
    subHeading: "You can now login to your account",
  },
};

EmailVerification.title = "Email Verification";

export default function EmailVerification({ display }) {
  const router = useRouter();
  return (
    <div className={styles.body}>
      <div className={styles.heading}>{mapping[display].heading}</div>
      <div className={styles.subHeading}>{mapping[display].subHeading}</div>
      <div className={styles.button} onClick={() => router.push(urls.base + urls.pages.login)}>
        Back to Login
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { token } = context.params;
  const mongoRes = await connectMongo();
  if (!mongoRes.success) {
    return {
      props: { display: 0 },
    };
  }
  const emailVerificationRes = await emailVerification(token);
  return {
    props: { display: !emailVerificationRes?.success ? 0 : emailVerificationRes.isNewUser ? 1 : 2 },
  };
};
