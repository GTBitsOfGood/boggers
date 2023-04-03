import styles from "./InputField.module.css";
import displayMobileView from "../../../utils/screen.js";

export default function InputField({ fieldName, fieldState, setFieldState, onChange, isOptional }) {
  const changeHandler = onChange || ((e) => setFieldState(e.target.value));

  const isMobile = () => {
    const mobile = displayMobileView();
    return mobile;
  };

  const mobileView = isMobile();

  return (
    <div className={styles.InputField}>
      <div className={styles.InputFieldHeader}>
        <div className={mobileView ? styles.MobileInputFieldHeader : styles.InputFieldName}>{fieldName}</div>
        {isOptional ? <div className={styles.InputFieldOptional}> (OPTIONAL)</div> : ""}
      </div>
      <input className={styles.InputFieldInput} value={fieldState} onChange={changeHandler} />
    </div>
  );
}
