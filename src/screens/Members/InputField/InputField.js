import styles from "./InputField.module.css";

export default function InputField({fieldName, fieldState, setFieldState, isOptional}) {
  return (
    <div className={styles.InputField}>
      <div className={styles.InputFieldHeader}>
        <div className={styles.InputFieldName}>{fieldName}</div>
        {isOptional ? <div className={styles.InputFieldOptional}> (OPTIONAL)</div> : ""}
      </div>
      <input
        className={styles.InputFieldInput}
        value={fieldState}
        onChange={(e) => {
          e.preventDefault();
          setFieldState(e.target.value);
        }}
      />
    </div>
  );
}
