import React, { useState } from "react";

const LoginPage = ():JSX.Element => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
      <div>
        <div>
          <h1>Wealcome to project bogger</h1>
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
            <input type="text" name="password" onChange={(event) => setPassword(event.target.value)}/>
          </label>
          <button type="submit" style={{maxWidth: "5rem"}}>Log in</button>
        </form>
      </div>
    )
}

export default LoginPage
