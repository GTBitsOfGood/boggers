import React, { useState, useEffect } from "react";
import classes from "./ForgotPassword.module.css";
import Link from "next/link";
import urls from "../../server/utils/urls";
import sendRequest from "../../server/utils/sendToBackend";
import { emailTester } from "../../server/utils/regex";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 7000);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailTester(email)) {
      setMessage({
        success: false,
        header: "INCORRECT EMAIL",
        body: "The email you entered is not associated with a Boggers account.",
      });
      return;
    }
    const res = await sendRequest(urls.api.forgotPassword, "POST", { email });
    if (res.success) {
      setMessage({
        success: true,
        header: "I'M A SUCCESS",
        body: "Please refresh your email.",
      });
    } else {
      setMessage({
        success: false,
        header: `${res.exists ? "UNVERIFIED" : "INCORRECT"} EMAIL`,
        body: `The email you entered is not ${res.exists ? "verified" : "associated with a Boggers account"}.`,
      });
    }
  };

  return (
    <div className={classes.body}>
      {message ? (
        <div className={classes.messageContainer}>
          <img alt="Status Icon" src={message.success ? "/Check.png" : "/Warning.png"} width="12px" height="12px" />
          <div className={classes.messageTextContainer}>
            <p className={`${classes.messageHeader} ${classes[message.success]}`}>{message.header}</p>
            <p className={classes.messageBody}>{message.body}</p>
          </div>
          <div
            className={`${classes.messageClose} ${classes[message.success]}`}
            onClick={() => {
              setMessage(null);
            }}>
            &#10006;
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className={classes.bodyContainer}>
        <div className={classes.baseContainer}>
          <div>
            <p className={classes.header}>Forgot your password?</p>
          </div>
          <p className={classes.introduction}>{"Enter your email and we'll send you a new login"}</p>
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.inputCountainer}>
              <label className={classes.textStyle}>EMAIL</label>
              <input
                className={classes.inputBar}
                value={email}
                type="text"
                name="email"
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className={classes.submission}>
              <p className={classes.forgot}>
                <Link href="/login">
                  <a className={classes.backToLoginText}>Back to login</a>
                </Link>
              </p>
              <input className={classes.button} type="submit" value="Send" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ForgotPassword.title = "Forgot Password | Boggers";
