import styles from "../styles/Home.module.css";
import { signIn, signOut } from "next-auth/react";

export default function Home() {
  return (
    <div className={styles.container}>
      <button onClick={signIn}>sign in</button>
      <button onClick={signOut}>sign out</button>
    </div>
  );
}
