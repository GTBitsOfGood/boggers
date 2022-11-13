import {signIn} from "next-auth/react";
import React, {useState} from "react";

export function LoginPage() {
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [password, setPassword] = useState("");

  async function forgotPassword() {
    const res = await fetch("/api/forgot_password", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });
    if (res.status === 404) {
      alert(`User with email ${email} not found`);
    } else {
      alert("Email sent");
    }
  }

  async function login(event) {
    event.preventDefault();
    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });
    if (res.status === 401) {
      alert(`You need to verify your email before logging in. An email was sent to ${email}`);
    }
    await signIn("credentials", {email, password});
  }

  return (
    <div>
      <div
        style={{
          borderStyle: "none none solid",
          marginBottom: "1rem",
        }}>
        <h1>Log In</h1>
      </div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
        onSubmit={login}>
        <label>
          Email:
          <input type="text" name="email" onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" id="pass" name="password" minLength={1} required onChange={(event) => setPassword(event.target.value)} />
        </label>
        <input type="submit" value="Login" />
      </form>
      <button onClick={forgotPassword}>Forgot Password</button>
    </div>
  );
}
