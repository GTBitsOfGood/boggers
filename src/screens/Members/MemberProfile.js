import styles from "./MemberProfile.module.css";
import React, {useState, useEffect} from "react";
import {signOut} from "next-auth/react";
import axios from "axios";

import sendRequest from "../../../utils/sendToBackend";
import urls from "../../../utils/urls";
import {sortTenures, getCurrSemesterYear, convertToBase64} from "../../../utils/memberProfileUtils";

import UploadPhotoModal from "./UploadPhotoModal/UploadPhotoModal";
import InputField from "./InputField/InputField";
import RadioField from "./RadioField/RadioField";
import FooterElement from "./FooterElement/FooterElement";
import SuccessBox from "./SuccessBox/SuccessBox";

import Avatar from "../../public/Avatar.png";
import Pencil from "../../public/Pencil.png";
import Save from "../../public/Save.png";
import LogoutIcon from "@mui/icons-material/Logout";

export const MemberProfile = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(Avatar.src);
  const [imageBlob, setImageBlob] = useState(null);
  const [success, setSuccess] = useState(0);
  const [saved, setSaved] = useState(0);

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@gatech.edu");
  const [phoneNumber, setPhoneNumber] = useState("1234567890");
  const [preference, setPreference] = useState("Full-stack");
  const [emailVerified, setEmailVerified] = useState(true);
  const [tenures, setTenures] = useState([]);
  const [currIndex, setCurrIndex] = useState(-1);

  const requestStatus = (success) => {
    setSuccess(success ? 1 : 2);
    setSaved(success ? 2 : 3);
    setTimeout(() => setSaved(0), 2000);
    setTimeout(() => setSuccess(0), 5000);
  };

  useEffect(() => {
    const getInitialData = async () => {
      const result = await sendRequest(urls.api.getUser, "GET");
      if (!result.success) {
        return requestStatus(false);
      }
      const {user, imageUrl} = result.payload;
      const tenures = sortTenures(user.tenures);

      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setEmail(user.email ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setPreference(user.preference ?? "");
      setTenures(tenures);
      setImageUrl(user.image ? imageUrl + "?random=" + Math.floor(Math.random() * 1000000) : Avatar.src);
      setCurrIndex(tenures.length > 0 ? tenures.length - 1 : -1);
    };

    getInitialData();
  }, []);

  const handleSave = async () => {
    setSaved(1);
    const result = await sendRequest(urls.api.updateMember, "PUT", {
      isMemberView: true,
      firstName,
      lastName,
      email,
      phoneNumber,
      preference,
    });

    if (result.success) {
      if (result.emailChanged) {
        setEmailVerified(false);
      }
    } else {
      return requestStatus(false);
    }

    let imageResult;
    if (imageBlob) {
      const convertedFile = await convertToBase64(imageBlob);
      imageResult = await axios.put(urls.api.imageUpload, {
        image: convertedFile,
        name: imageBlob.name,
        type: imageBlob.type,
      });
    } else {
      return requestStatus(true);
    }

    if (imageResult.data.success) {
      setImageBlob(null);
    }
    requestStatus(imageResult.data.success);
  };

  const handleArrowClick = (isLeft) => {
    if (currIndex === -1) {
      return;
    }
    setCurrIndex(isLeft ? Math.max(currIndex - 1, 0) : Math.min(currIndex + 1, tenures.length - 1));
  };

  let semester, year, department, role, project, status_;
  if (currIndex !== -1) {
    ({semester, year, department, role, project} = tenures[currIndex]);
    status_ = tenures[currIndex].status;
  } else {
    ({semester, year} = getCurrSemesterYear());
    department = role = project = status_ = "-";
  }

  const buttonTransition = [
    {styles: {width: "135px", backgroundColor: "#2d285c", borderColor: "#2d285c"}, message: "Save"},
    {styles: {width: "185px", backgroundColor: "#fc5b42", borderColor: "#fc5b42"}, message: "Processing"},
    {styles: {width: "145px", backgroundColor: "#0f904d", borderColor: "#0f904d"}, message: "Saved!"},
    {styles: {width: "140px", backgroundColor: "#c63636", borderColor: "#c63636"}, message: "Error!"},
  ];

  return (
    <div className={styles.MemberProfile}>
      {displayModal ? <div className={styles.MemberProfileOverlay} onClick={() => setDisplayModal(false)} /> : null}
      <UploadPhotoModal
        closeModal={() => setDisplayModal(false)}
        displayModal={displayModal}
        setImageUrl={setImageUrl}
        setImageBlob={setImageBlob}
      />
      <LogoutIcon className={styles.MemberProfileLogout} onClick={() => signOut()} />
      <div className={styles.MemberProfileHeader}>
        <div className={styles.MemberProfileImageContainer} onClick={() => setDisplayModal(true)}>
          <img className={styles.MemberProfileImage} src={imageUrl} alt="User Picture" />
          <div className={styles.MemberProfileImageOverlay} />
          <div className={styles.MemberProfilePencilBackground}>
            <img className={styles.MemberProfilePencil} src={Pencil.src} alt="Edit Pencil Icon" />
          </div>
        </div>
        <div className={styles.MemberProfileName}>{`${firstName} ${lastName}`}</div>
        {success === 0 ? null : <SuccessBox success={success === 1} closeBox={() => setSuccess(0)} />}
      </div>
      <div className={styles.MemberProfileFields}>
        <InputField fieldName="FIRST NAME" fieldState={firstName} setFieldState={setFirstName} />
        <InputField fieldName="LAST NAME" fieldState={lastName} setFieldState={setLastName} />
        <div>
          <InputField fieldName="EMAIL" fieldState={email} setFieldState={setEmail} />
          {emailVerified ? null : (
            <p style={{color: "red"}}>
              A verification email has been sent to your new email.
              <br />
              Your email will not be changed until it is verified.
            </p>
          )}
        </div>
        <InputField fieldName="PHONE NUMBER" fieldState={phoneNumber} setFieldState={setPhoneNumber} isOptional={true} />
        <div className={styles.MemberProfileRadioSave}>
          <RadioField preference={preference} setPreference={setPreference} />
          <div className={styles.MemberProfileSave}>
            <div className={styles.MemberProfileSaveButton} style={buttonTransition[saved].styles} onClick={handleSave}>
              <img src={Save.src} alt="Save Icon" />
              {buttonTransition[saved].message}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.MemberProfileFooter}>
        <div className={styles.MemberProfileFooterPageContainer}>
          <div className={styles.MemberProfileFooterPage}>
            <div className={styles.MemberProfileFooterPageArrow} onClick={() => handleArrowClick(true)} style={{cursor: "pointer"}}>
              &lt;
            </div>
            <div className={styles.MemberProfileFooterPageName}>{`${semester.toUpperCase()} ${year}`}</div>
            <div className={styles.MemberProfileFooterPageArrow} onClick={() => handleArrowClick(false)} style={{cursor: "pointer"}}>
              &gt;
            </div>
          </div>
        </div>
        <div className={styles.MemberProfileFooterBottom}>
          <FooterElement title="DEPARTMENT" state={department} />
          <FooterElement title="ROLE" state={role} />
          <FooterElement title="PROJECT" state={project} />
          <FooterElement title="STATUS" state={status_} />
        </div>
      </div>
    </div>
  );
};
