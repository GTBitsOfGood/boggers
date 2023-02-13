import styles from "./RadioField.module.css";
import RadioButton from "./RadioButton/RadioButton";
import fields from "../../../server/utils/fields";

export default function RadioField({ preference, setPreference }) {
  const onChange = (e) => setPreference(e.target.value);

  return (
    <div className={styles.RadioField}>
      <div className={styles.RadioFieldHeader}>TECH PREFERENCE</div>
      <div className={styles.RadioFieldGroup}>
        {fields.preferences.map((iPreference) => (
          <RadioButton key={iPreference} name={iPreference} preference={preference} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}
