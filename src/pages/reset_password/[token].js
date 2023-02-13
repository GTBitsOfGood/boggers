import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import sendRequest from "../../server/utils/sendToBackend";
import urls from "../../server/utils/urls";
import styles from "./ResetPassword.module.css";
import { checkAccountRecovery } from "../../server/mongodb/actions/AccountRecovery";
import connectMongo from "../../server/mongodb/connectMongo";
import Head from "next/head";

export default function ResetPassword({ exists, token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  async function changePassword(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({
        success: false,
        header: "PASSWORDS DO NOT MATCH",
        body: "Please try again",
      });
    } else {
      const res = await sendRequest(urls.api.resetPassword, "POST", { password, token });
      if (res.success) {
        setMessage({
          success: true,
          header: "PASSWORD CHANGED",
          body: "You can now login with your new password",
        });
      } else {
        setMessage({
          success: false,
          header: "YOUR TOKEN IS INVALID",
          body: "Please try again later",
        });
      }
    }
  }

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 7000);
    }
  }, [message]);

  const router = useRouter();
  if (exists) {
    return (
      <div className={styles.body}>
        <Head>
          <title>Reset Password</title>
        </Head>
        {message ? (
          <div className={styles.messageContainer}>
            <img alt="Status Icon" src={message.success ? "/Check.png" : "/warning.png"} width="12px" height="12px" />
            <div className={styles.messageTextContainer}>
              <p className={styles.messageHeader} style={message.success ? { color: "#13B461" } : {}}>
                {message.header}
              </p>
              <p className={styles.messageBody}>{message.body}</p>
            </div>
            <div
              className={styles.messageClose}
              style={message.success ? { color: "#13B461" } : {}}
              onClick={() => {
                setMessage(null);
              }}>
              &#10006;
            </div>
          </div>
        ) : null}
        <div className={styles.container}>
          <div id={styles.mainHeading} className={styles.heading}>
            Password Reset
          </div>
          <div className={styles.inputCountainer}>
            <label className={styles.inputHeading}>PASSWORD</label>
            <input
              className={styles.inputBar}
              value={password}
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.inputCountainer}>
            <label className={styles.inputHeading}>CONFIRM PASSWORD</label>
            <input
              className={styles.inputBar}
              value={confirmPassword}
              type="password"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className={styles.buttonGroup}>
            <div className={styles.loginButton} onClick={() => router.push(urls.base + urls.pages.login)}>
              Back to Login
            </div>
            <div className={styles.saveButton} onClick={changePassword}>
              Save
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`${styles.body} ${styles.invalidBody}`}>
        <div className={styles.heading}>Token is Invalid or Expired</div>
        <div className={styles.subHeading}>
          Enter your email in the forgot password page and we&apos;ll send you a new verification email
        </div>
        <div className={styles.button} onClick={() => router.push(urls.base + urls.pages.login)}>
          Back to Login
        </div>
      </div>
    );
  }
}

ResetPassword.title = "Reset Password | Boggers";

export const getServerSideProps = async (context) => {
  const { token } = context.params;
  await connectMongo();
  return {
    props: { exists: await checkAccountRecovery(token), token },
  };
};
