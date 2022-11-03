import styles from "./MemberProfile.module.css";
import React, {useState} from "react";
import InputField from "./InputField/InputField";
import Avatar from "../../public/Avatar.png";
import Save from "../../public/Save.png";
import RadioField from "./RadioField/RadioField";

export const MemberProfile = () => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@gatech.edu");
  const [phoneNumber, setPhoneNumber] = useState("1234567890");
  const [preference, setPreference] = useState("Full-stack");

  return (
    <div className={styles.MemberProfile}>
      <div className={styles.MemberProfileBody}>
        <div className={styles.MemberProfileHeader}>
          <img className={styles.MemberProfileImage} src={Avatar.src} alt="User Picture" />
          <div className={styles.MemberProfileName}>{`${firstName} ${lastName}`}</div>
        </div>
        <div className={styles.MemberProfileFields}>
          <InputField fieldName="FIRST NAME" fieldState={firstName} setFieldState={setFirstName} />
          <InputField fieldName="LAST NAME" fieldState={lastName} setFieldState={setLastName} />
          <InputField fieldName="EMAIL" fieldState={email} setFieldState={setEmail} />
          <InputField fieldName="PHONE NUMBER" fieldState={phoneNumber} setFieldState={setPhoneNumber} isOptional={true} />
        </div>
        <div className={styles.MemberProfileRadioSave}>
          <RadioField preference={preference} setPreference={setPreference} />
          <div className={styles.MemberProfileSave}>
            <div className={styles.MemberProfileSaveButton}>
              <img src={Save.src} alt="Save Icon" />
              Save
            </div>
          </div>
        </div>
      </div>
      <div className={styles.MemberProfileFooter}></div>
    </div>
  );
};
