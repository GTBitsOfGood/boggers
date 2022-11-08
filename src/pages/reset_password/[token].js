import React, {useState} from "react";
import {useRouter} from "next/router";
import urls from "../../../utils/urls";

export default function ResetPassword() {
  const router = useRouter();
  const {token} = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function changePassword() {
    if (password !== confirmPassword) {
      alert("passwords don't match");
    } else {
      await fetch(urls.base + urls.api.resetPassword, {
        method: "POST",
        body: JSON.stringify({
          password,
          token,
        }),
      });
      alert("Password changed successfully");
    }
  }

  return (
    <div>
      <div
        style={{
          borderStyle: "none none solid",
          marginBottom: "1rem",
        }}>
        <h1>Reset Password</h1>
      </div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}>
        <label>
          Password:
          <input type="password" id="pass" name="password" minLength={8} required onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            id="pass-confirm"
            name="password"
            minLength={8}
            required
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
        <input type="submit" value="Save" onClick={changePassword} />
      </form>
    </div>
  );
}
