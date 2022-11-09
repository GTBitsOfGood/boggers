import {signIn} from "next-auth/react";
import React, {useState} from "react";
import classes from "./login.module.css";
import BOG from "../../public/BOG.svg";
import warnning from "../../public/warning.png";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import urls from "../../../utils/urls";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    }).then(({ok}) => {
      if (ok) {
        Router.push(urls.base + urls.pages.members);
      } else {
        setFailed(true);
      }
    });
  };

  return (
    <div className={classes.body}>
      {failed ? (
        <div className={classes.errorContainer}>
          <div className={classes.errorFirst}>
            <Image
              alt="BOG logo"
              src={warnning}
              width={20}
              height={10}
              style={{
                maxWidth: "100%",
                height: "auto",
                marginTop: "0.1rem",
              }}
            />
            <div className={classes.errorTextContainer}>
              <p className={classes.errorHead}>INCORRECT LOGIN</p>
              <p>Your Credentials were incorrect.</p>
            </div>
            <p
              className={classes.errorClose}
              onClick={() => {
                setFailed(false);
              }}>
              x
            </p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <h1 style={{display: "none"}}>Hi</h1>
      <div className={classes.bodyContainer}>
        <div className={classes.baseContainer}>
          <div className={classes.image}>
            <Image
              alt="BOG logo"
              src={BOG}
              width={100}
              height={100}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
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

              <input className={classes.button} type="submit" value="Sign in" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
