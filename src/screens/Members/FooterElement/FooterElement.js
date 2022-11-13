import styles from "./FooterElement.module.css";

export default function FooterElement({admin, title, state, setState}) {
  const fieldInput =
    title === "STATUS" ? (
      <select className={styles.FooterElementInput} value={state} onChange={(e) => setState(e.target.value)}>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    ) : (
      <input className={styles.FooterElementInput} value={state} onChange={(e) => setState(e.target.value)} />
    );
  return (
    <div className={styles.FooterElement}>
      <div className={styles.FooterElementTitle}>{title}</div>
      {admin ? fieldInput : <div className={styles.FooterElementValue}>{state}</div>}
    </div>
  );
}
