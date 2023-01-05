import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import sendRequest from "../../../utils/sendToBackend";
import urls from "../../../utils/urls";
import styles from "./EmailVerification.module.css";

const mapping = {
  0: {
    heading: "Token is Invalid or Expired",
    subHeading: "Enter your email in the login page and we'll send you a new verification email",
  },
  1: {
    heading: "Your Email Has Been Verified",
    subHeading: "You can now login to your account",
  },
  2: {
    heading: "Your Email Has Been Verified",
    subHeading: "An email has been sent to you to set up your password",
  },
};

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (token) {
      sendRequest(urls.api.emailVerification, "POST", { token }).then((res) => setDisplay(!res?.success ? 0 : res.isNewUser ? 2 : 1));
    }
  }, []);

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
