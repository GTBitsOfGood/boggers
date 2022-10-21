import React, {useState} from "react";
import classes from "./Login.module.css";

export function LoginPage() {
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [password, setPassword] = useState("");
  return (
    <div className={classes.body}>
      <div className={classes.baseContainer}>
        <div>
          <p className={classes.header}>Welcome to boggers</p>
        </div>
        <p className={classes.introduction}>Your Bits of Good Membership Platform</p>
        <form className={classes.form} action="http://localhost:3000/api/auth/callback/credentials" method="POST">
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
              minLength={8}
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
