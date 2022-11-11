/* eslint-disable no-unused-vars */
import styles from "./MemberProfile.module.css";
import React, {useState, useEffect} from "react";
import {getSession} from "next-auth/react";

import UploadPhotoModal from "./UploadPhotoModal/UploadPhotoModal";
import InputField from "./InputField/InputField";
import RadioField from "./RadioField/RadioField";
import FooterElement from "./FooterElement/FooterElement";
import sendRequest from "../../../utils/sendToBackend";

import Avatar from "../../public/Avatar.png";
import Pencil from "../../public/Pencil.png";
import Save from "../../public/Save.png";
import Photo from "./Photo.jpg";

export const MemberProfile = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [image, setImage] = useState(Avatar.src);

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@gatech.edu");
  const [phoneNumber, setPhoneNumber] = useState("1234567890");
  const [preference, setPreference] = useState("Full-stack");

  const [department, setDepartment] = useState("Engineering");
  const [role, setRole] = useState("Developer");
  const [project, setProject] = useState("Umi Feeds");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    const getData = async () => {
      const user = await getSession();
      const result = await sendRequest("get_user", "GET");
      const userData = result.payload.user;
      console.log(userData);
      setFirstName(userData.firstName ?? "");
      setLastName(userData.lastName ?? "");
      setEmail(userData.email ?? "");
      setPhoneNumber(userData.phoneNumber ?? "");
      setPreference(userData.preference ?? "");
      console.log(result.payload.imageUrl);
      setImage(result.payload.imageUrl ?? Avatar.src);
    };

    getData();
  }, []);

  const closeModal = () => setDisplayModal(false);

  return (
    <div className={styles.MemberProfile}>
      {displayModal ? (
        <>
          <div className={styles.MemberProfileOverlay} onClick={() => setDisplayModal(false)} />
          <UploadPhotoModal closeModal={closeModal} setImage={setImage} />
        </>
      ) : null}
      <div className={styles.MemberProfileBody}>
        <div className={styles.MemberProfileHeader}>
          <div className={styles.MemberProfileImageContainer} onClick={() => setDisplayModal(true)}>
            <img className={styles.MemberProfileImage} src={image} alt="User Picture" />
            <div className={styles.MemberProfileImageOverlay} />
            <div className={styles.MemberProfilePencilBackground}>
              <img className={styles.MemberProfilePencil} src={Pencil.src} alt="Edit Pencil Icon" />
            </div>
          </div>
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
      <div className={styles.MemberProfileFooter}>
        <div className={styles.MemberProfileFooterPage}>
          <div className={styles.MemberProfileFooterPageArrow}>&lt;</div>
          <div className={styles.MemberProfileFooterPageName}>SPRING 2022</div>
          <div className={styles.MemberProfileFooterPageArrow}>&gt;</div>
        </div>
        <div className={styles.MemberProfileFooterBottom}>
          <FooterElement title="DEPARTMENT" state={department} />
          <FooterElement title="ROLE" state={role} />
          <FooterElement title="PROJECT" state={project} />
          <FooterElement title="STATUS" state={status} />
        </div>
      </div>
    </div>
  );
};
