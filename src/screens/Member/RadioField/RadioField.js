import styles from "./RadioField.module.css";
import RadioButton from "./RadioButton/RadioButton";

export default function RadioField({ preference, setPreference }) {
  const onChange = (e) => setPreference(e.target.value);

  return (
    <div className={styles.RadioField}>
      <div className={styles.RadioFieldHeader}>TECH PREFERENCE</div>
      <div className={styles.RadioFieldGroup}>
        <RadioButton name="Front-end" preference={preference} onChange={onChange} />
        <RadioButton name="Back-end" preference={preference} onChange={onChange} />
        <RadioButton name="Full-stack" preference={preference} onChange={onChange} />
      </div>
    </div>
  );
}
