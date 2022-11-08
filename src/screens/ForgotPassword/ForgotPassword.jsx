import React, {useState} from "react";
import classes from "./ForgotPassword.module.css";
import warnning from "../../public/warning.png";
import check from "../../public/check.png";
import Image from "next/image";
import Link from "next/link";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [send, setSend] = useState(false);
  const [error, setError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Please add api calls for forgot password here:

    //Upon sucess send:
    // setSend(true)
    //Upon failure:
    // setError(true)
  };
  return (
    <div className={classes.body}>
      {error ? (
        <div className={classes.errorContainer}>
          <div className={classes.errorFirst}>
            <Image
              alt="Error"
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
              <p className={classes.errorHead}>INCORRECT EMAIL</p>
              <p>The email you entered is not associated with a Boggers account.</p>
            </div>
            <p
              className={classes.errorClose}
              onClick={() => {
                setError(false);
              }}>
              x
            </p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {send ? (
        <div className={classes.errorContainer}>
          <div className={classes.errorFirst}>
            <Image
              alt="Sucess"
              src={check}
              width={20}
              height={10}
              style={{
                maxWidth: "100%",
                height: "auto",
                marginTop: "0.1rem",
              }}
            />
            <div className={classes.errorTextContainer}>
              <p className={classes.sendHead}>{"I'M A SUCCESS"}</p>
              <p>Please refresh your email.</p>
            </div>
            <p
              className={classes.sendClose}
              onClick={() => {
                setSend(false);
              }}>
              x
            </p>
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
              <label className={classes.textStyle}>EMAIL:</label>
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
