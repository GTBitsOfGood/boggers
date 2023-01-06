import styles from "./SuccessBox.module.css";

const SuccessBox = ({ success, closeBox, message }) => {
  let header, messageText, icon, color;
  if (success) {
    header = "CHANGES SAVED";
    messageText = message ?? "Your changes were saved successfully!";
    icon = "/Check.png";
    color = "#13b461";
  } else {
    header = "UNSAVED CHANGES";
    messageText = message ?? "Your changes could not be saved. Please try again or refresh your browser.";
    icon = "/Warning.png";
    color = "#c63636";
  }

  return (
    <div className={styles.SuccessBox} style={{ borderColor: color }}>
      <img className={styles.SuccessBoxIcon} src={icon} />
      <div className={styles.SuccessBoxCenter}>
        <div className={styles.SuccessBoxCenterHeader} style={{ color }}>
          {header}
        </div>
        <div className={styles.SuccessBoxCenterMessage}>{messageText}</div>
      </div>
      <div className={styles.SuccessBoxCross} style={{ color }} onClick={closeBox}>
        &#10006;
      </div>
    </div>
  );
};

export default SuccessBox;
