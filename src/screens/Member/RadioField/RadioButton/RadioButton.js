import styles from "./RadioButton.module.css";

export default function RadioButton({ name, preference, onChange }) {
  return (
    <div className={styles.RadioButton}>
      <input
        className={styles.RadioButtonInput}
        type="radio"
        defaultValue={name}
        name="preference"
        checked={name === preference}
        onChange={onChange}
      />
      <label>{name}</label>
    </div>
  );
}
