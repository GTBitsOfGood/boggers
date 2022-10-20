import {signIn, signOut} from "next-auth/react";

export default function Home() {
  return (
    <div>
      <button onClick={signIn}>sign in</button>
      <button onClick={signOut}>sign out</button>
    </div>
  );
}
