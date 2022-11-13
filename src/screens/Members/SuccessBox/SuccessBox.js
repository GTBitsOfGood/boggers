import Check from "../../../public/check.png";
import Warning from "../../../public/warning.png";
import styles from "./SuccessBox.module.css";

const SuccessBox = ({success, closeBox}) => {
  let header, message, icon, color;
  if (success) {
    header = "CHANGES SAVED";
    message = "Your changes were saved successfully!";
    icon = Check.src;
    color = "#13b461";
  } else {
    header = "UNSAVED CHANGES";
    message = "Your changes could not be saved. Please try again or refresh your browser.";
    icon = Warning.src;
    color = "#c63636";
  }

  return (
    <div className={styles.SuccessBox} style={{borderColor: color}}>
      <img className={styles.SuccessBoxIcon} src={icon} />
      <div className={styles.SuccessBoxCenter}>
        <div className={styles.SuccessBoxCenterHeader} style={{color}}>
          {header}
        </div>
        <div className={styles.SuccessBoxCenterMessage}>{message}</div>
      </div>
      <div className={styles.SuccessBoxCross} style={{color}} onClick={closeBox}>
        &#10006;
      </div>
    </div>
  );
};

export default SuccessBox;
