import styles from "./404Error.module.css";
import Router from "next/router";
import urls from "../../server/utils/urls";

export default function Error() {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>404 - Page Not Found</div>
      <div className={styles.button} onClick={() => Router.push(urls.base + urls.pages.login)}>
        Back to Login
      </div>
    </div>
  );
}

Error.title = "Page Not Found | Boggers";
