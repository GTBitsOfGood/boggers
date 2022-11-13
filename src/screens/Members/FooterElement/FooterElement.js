import styles from "./FooterElement.module.css";

export default function FooterElement({admin, title, state, setState}) {
  return (
    <div className={styles.FooterElement}>
      <div className={styles.FooterElementTitle}>{title}</div>
      {admin ? (
        <input className={styles.FooterElementValue} value={state} onChange={(e) => setState(e.target.value)} />
      ) : (
        <div className={styles.FooterElementValue}>{state}</div>
      )}
    </div>
  );
}
