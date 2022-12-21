import styles from "./FooterElement.module.css";

export default function FooterElement({title, state}) {
  return (
    <div className={styles.FooterElement}>
      <div className={styles.FooterElementTitle}>{title}</div>
      <div className={styles.FooterElementValue}>{state}</div>
    </div>
  );
}
