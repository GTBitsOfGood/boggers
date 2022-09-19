import React, { useState } from "react";

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
      <div>
        <div style={{
          borderStyle: "none none solid",
          marginBottom: "1rem"
        }}>
          <h1>Log In</h1>
        </div>
        <form style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}>
          <label>
            Email:
            <input type="text" name="email" onChange={(event) => setEmail(event.target.value)}/>
          </label>
          <label>
            Password:
            <input type="password" id="pass" name="password" minLength={8} required onChange={(event) => setPassword(event.target.value)}/>
          </label>
          <input type="submit" value="Login"/>
        </form>
      </div>
    )
}