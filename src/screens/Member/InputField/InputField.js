import styles from "./InputField.module.css";

export default function InputField({ fieldName, fieldState, setFieldState, onChange, isOptional }) {
  const changeHandler = onChange || ((e) => setFieldState(e.target.value));
  return (
    <div className={styles.InputField}>
      <div className={styles.InputFieldHeader}>
        <div className={styles.InputFieldName}>{fieldName}</div>
        {isOptional ? <div className={styles.InputFieldOptional}> (OPTIONAL)</div> : ""}
      </div>
      <input className={styles.InputFieldInput} value={fieldState} onChange={changeHandler} />
    </div>
  );
}
