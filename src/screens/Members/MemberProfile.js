import styles from "./MemberProfile.module.css";
import React, {useState, useEffect} from "react";
import {getSession} from "next-auth/react";
import axios from "axios";

import UploadPhotoModal from "./UploadPhotoModal/UploadPhotoModal";
import InputField from "./InputField/InputField";
import RadioField from "./RadioField/RadioField";
import FooterElement from "./FooterElement/FooterElement";
import sendRequest from "../../../utils/sendToBackend";

import Avatar from "../../public/Avatar.png";
import Pencil from "../../public/Pencil.png";
import Save from "../../public/Save.png";

const convertToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};

export const MemberProfile = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [image, setImage] = useState(Avatar.src);
  const [saved, setSaved] = useState(false);

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@gatech.edu");
  const [phoneNumber, setPhoneNumber] = useState("1234567890");
  const [preference, setPreference] = useState("Full-stack");
  const [imageBlob, setImageBlob] = useState(null);

  const [tenures, setTenures] = useState([]);
  const [currIndex, setCurrIndex] = useState(-1);

  useEffect(() => {
    const getInitialData = async () => {
      const result = await sendRequest("get_user", "GET");
      const userData = result.payload.user;
      setFirstName(userData.firstName ?? "");
      setLastName(userData.lastName ?? "");
      setEmail(userData.email ?? "");
      setPhoneNumber(userData.phoneNumber ?? "");
      setPreference(userData.preference ?? "");

      const tenures = userData.tenures.sort((a, b) => {
        if (a.year < b.year) {
          return -1;
        } else if (a.year > b.year) {
          return 1;
        } else if (
          (a.semester === "Spring" && (b.semester === "Spring" || b.semester === "Fall")) ||
          (a.semester === "Summer" && b.semester === "Fall")
        ) {
          return -1;
        } else {
          return 1;
        }
      });
      console.log("tenures: ", tenures);
      setTenures(tenures);
      setCurrIndex(tenures.length > 0 ? tenures.length - 1 : -1);
      setImage(result.payload.imageUrl ? result.payload.imageUrl + "?random=" + Math.floor(Math.random() * 1000000) : Avatar.src);
    };

    getInitialData();
  }, []);

  const handleSave = async () => {
    setSaved(true);
    const id = (await getSession()).user.id;
    sendRequest("update_member", "PUT", {
      memberId: id,
      firstName,
      lastName,
      email,
      phoneNumber,
      preference,
      semester,
      year,
      isAdminView: false,
    });

    if (imageBlob) {
      const convertedFile = await convertToBase64(imageBlob);
      axios.put("/api/image_upload", {
        image: convertedFile,
        name: imageBlob.name,
        type: imageBlob.type,
      });
      setImageBlob(null);
    }

    setTimeout(() => setSaved(false), 1000);
  };

  let semester, year, department, role, project, status;
  if (tenures.length === 0) {
    semester = "Spring";
    year = 2022;
    department = role = project = status = "-";
  } else {
    semester = tenures[currIndex].semester;
    year = tenures[currIndex].year;
    department = tenures[currIndex].department;
    role = tenures[currIndex].role;
    project = tenures[currIndex].project;
    status = tenures[currIndex].status;
    console.log(currIndex);
    console.log(semester, year, department, role, project, status);
  }

  const buttonTransition = {
    original: {width: "135px", backgroundColor: "#2d285c", borderColor: "#2d285c"},
    new: {width: "150px", backgroundColor: "#0f904d", borderColor: "#0f904d"},
  };

  return (
    <div className={styles.MemberProfile}>
      {displayModal ? <div className={styles.MemberProfileOverlay} onClick={() => setDisplayModal(false)} /> : null}
      <UploadPhotoModal
        closeModal={() => setDisplayModal(false)}
        displayModal={displayModal}
        setImage={setImage}
        setImageBlob={setImageBlob}
      />
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
            <div
              className={styles.MemberProfileSaveButton}
              style={saved ? buttonTransition.new : buttonTransition.original}
              onClick={handleSave}>
              <img src={Save.src} alt="Save Icon" />
              {saved ? "Saved!" : "Save"}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.MemberProfileFooter}>
        <div className={styles.MemberProfileFooterPageContainer}>
          <div className={styles.MemberProfileFooterPage}>
            <div
              className={styles.MemberProfileFooterPageArrow}
              onClick={() => setCurrIndex(currIndex == -1 ? -1 : Math.max(currIndex - 1, 0))}
              style={{cursor: "pointer"}}>
              &lt;
            </div>
            <div className={styles.MemberProfileFooterPageName}>{`${semester.toUpperCase()} ${year}`}</div>
            <div
              className={styles.MemberProfileFooterPageArrow}
              onClick={() => setCurrIndex(currIndex == -1 ? -1 : Math.min(currIndex + 1, tenures.length - 1))}
              style={{cursor: "pointer"}}>
              &gt;
            </div>
          </div>
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
