import React, {useState} from "react";
import classes from "./Login.module.css";
import {signIn} from "next-auth/react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    await signIn("credentials", {
      email: email,
      password: password,
      redirect: true,
    });
  };
  return (
    <div className={classes.body}>
      <div className={classes.baseContainer}>
        <div>
          <p className={classes.header}>Welcome to boggers</p>
        </div>
        <p className={classes.introduction}>Your Bits of Good Membership Platform</p>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.inputCountainer}>
            <label className={classes.textStyle}>EMAIL:</label>
            <input className={classes.inputBar} type="text" name="email" required onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className={classes.inputCountainer}>
            <label className={classes.textStyle}>PASSWORD:</label>
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
            <p className={classes.forgot}>Forgot password?</p>
            <input className={classes.button} type="submit" value="Sign in" />
          </div>
        </form>
      </div>
    </div>
  );
}
