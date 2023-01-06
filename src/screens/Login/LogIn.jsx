import { signIn } from "next-auth/react";
import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import urls from "../../../utils/urls";
import sendRequest from "../../../utils/sendToBackend";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (failed) {
      setTimeout(() => {
        setFailed(null);
      }, 7000);
    }
  }, [failed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await sendRequest(urls.api.checkVerified, "POST", { email });
    if (!res.success) {
      setLoading(false);
      if (res.isUnauthNewUser) {
        return setFailed({
          header: "EMAIL NOT VERIFIED",
          body: `You need to verify your email before logging in. An email was sent to ${email}`,
        });
      } else {
        return setFailed({
          header: "INCORRECT LOGIN",
          body: "Your credentials were incorrect.",
        });
      }
    }

    const authRes = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    if (authRes.ok) {
      Router.replace(urls.base + urls.pages.members);
    } else {
      setLoading(false);
      setFailed({
        header: "INCORRECT LOGIN",
        body: "Your credentials were incorrect.",
      });
    }
  };

  return (
    <div className={classes.body}>
      {failed ? (
        <div className={classes.errorContainer}>
          <img alt="Warning Sign" src="/warning.png" width="12px" height="12px" />
          <div className={classes.errorTextContainer}>
            <p className={classes.errorHeader}>{failed.header}</p>
            <p className={classes.errorBody}>{failed.body}</p>
          </div>
          <div
            className={classes.errorClose}
            onClick={() => {
              setFailed(null);
            }}>
            &#10006;
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <h1 style={{ display: "none" }}>Hi</h1>
      <div className={classes.bodyContainer}>
        <div className={classes.baseContainer}>
          <div className={classes.image}>
            <Image alt="BOG logo" src="/BOG.svg" width={125} height={125} />
          </div>

          <div>
            <p className={classes.header}>Welcome to Boggers</p>
          </div>
          <p className={classes.introduction}>Your Bits of Good Membership Platform</p>
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.inputCountainer}>
              <label className={classes.textStyle}>EMAIL</label>
              <input className={classes.inputBar} type="text" name="email" required onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className={classes.inputCountainer}>
              <label className={classes.textStyle}>PASSWORD</label>
              <input
                className={classes.inputBar}
                type="password"
                id="pass"
                name="password"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className={classes.submission}>
              {/* <p className={classes.forgot} onClick={() => Router.push(urls.base + urls.pages.ForgotPassword)}> */}
              <p className={classes.forgot}>
                <Link href={`${urls.base + urls.pages.forgotPassword}`}>
                  <a className={classes.forgotPasswordText}>Forgot password?</a>
                </Link>
              </p>

              <input
                className={classes.button}
                style={{ backgroundColor: loading ? "#4524ff" : "#2d285c" }}
                type="submit"
                value="Sign In"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

LoginPage.title = "Login | Boggers";
