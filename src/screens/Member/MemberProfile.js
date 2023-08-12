import styles from "./MemberProfile.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";
import Router from "next/router";

import sendRequest from "../../server/utils/sendToBackend";
import urls from "../../server/utils/urls";
import { sortTenures, getCurrSemesterYear, convertToBase64 } from "../../server/utils/memberFunctions";
import LogoutIcon from "@mui/icons-material/Logout";

import UploadPhotoModal from "./UploadPhotoModal/UploadPhotoModal";
import InputField from "./InputField/InputField";
import RadioField from "./RadioField/RadioField";
import FooterElement from "./FooterElement/FooterElement";
import SuccessBox from "./SuccessBox/SuccessBox";
import { emailTester, phoneTester } from "../../server/utils/regex";
import displayMobileView from "../../utils/screen.js";

export default function MemberProfile({ session }) {
  const [displayModal, setDisplayModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("/Avatar.png");
  const [imageBlob, setImageBlob] = useState(null);
  const [success, setSuccess] = useState(0);
  const [saved, setSaved] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preference, setPreference] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);
  const [tenures, setTenures] = useState([]);
  const [currIndex, setCurrIndex] = useState(-1);
  const [message, setMessage] = useState("");
  const [deleteImage, setDeleteImage] = useState(false);

  const requestStatus = (success, message = "") => {
    setSuccess(success ? 1 : 2);
    setMessage(message);
    setSaved(success ? 2 : 3);
    setTimeout(() => setSaved(0), 2000);
    setTimeout(() => {
      setSuccess(0);
      setMessage("");
    }, 5000);
  };

  useEffect(() => {
    const getInitialData = async () => {
      const result = await sendRequest(urls.api.getUser, "GET");
      if (!result.success) {
        return requestStatus(false);
      }
      const { user, imageUrl } = result.payload;
      const tenures = user.tenures.sort(sortTenures(true));
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setOriginalEmail(user.email ?? "");
      setEmail(user.email ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setPreference(user.preference ?? "");
      setTenures(tenures);
      setImageUrl(user.image ? imageUrl + "?random=" + Math.floor(Math.random() * 1000000) : "/Avatar.png");
      setCurrIndex(tenures.length > 0 ? tenures.length - 1 : -1);
    };

    getInitialData();
  }, []);

  const isMobile = () => {
    const mobile = displayMobileView();
    return mobile;
  };

  const mobileView = isMobile();

  const handleSave = async () => {
    setSaved(1);

    if (!firstName) {
      return requestStatus(false, "First name cannot be empty.");
    } else if (!lastName) {
      return requestStatus(false, "Last name cannot be empty.");
    } else if (!emailTester(email)) {
      return requestStatus(false, "Email is of invalid format.");
    } else if (!phoneTester(phoneNumber)) {
      return requestStatus(false, "Phone number must contain only 10 digits.");
    } else if (!preference) {
      return requestStatus(false, "Please select a preference.");
    }

    const result = await sendRequest(urls.api.updateMember, "PUT", {
      memberId: session.user.id,
      isMemberView: true,
      firstName,
      lastName,
      originalEmail,
      email,
      phoneNumber,
      preference,
    });

    if (result.success) {
      if (result.emailChanged) {
        setEmailVerified(false);
        setInterval(() => setEmailVerified(true), 5000);
      }
    } else {
      return requestStatus(false);
    }

    if (deleteImage) {
      const imageResult = await sendRequest(urls.api.imageDelete, "DELETE");
      requestStatus(imageResult.success);
    } else if (imageBlob) {
      const convertedFile = await convertToBase64(imageBlob);
      const imageResult = await axios.put(urls.api.imageUpload, {
        image: convertedFile,
        type: imageBlob.type,
      });
      if (imageResult.data.success) {
        setImageBlob(null);
      }
      requestStatus(imageResult.data.success);
    } else {
      return requestStatus(true);
    }
  };

  const handleArrowClick = (isLeft) => {
    if (currIndex === -1) {
      return;
    }
    setCurrIndex(isLeft ? Math.max(currIndex - 1, 0) : Math.min(currIndex + 1, tenures.length - 1));
  };

  let semester, year, department, role, project, status_;
  if (currIndex !== -1) {
    ({ semester, year, department, role, project } = tenures[currIndex]);
    status_ = tenures[currIndex].status;
  } else {
    ({ semester, year } = getCurrSemesterYear());
    department = role = project = status_ = "-";
  }

  const buttonTransition = [
    { styles: { width: "135px", backgroundColor: "#2d285c", borderColor: "#2d285c" }, message: "Save" },
    { styles: { width: "185px", backgroundColor: "#fc5b42", borderColor: "#fc5b42" }, message: "Processing" },
    { styles: { width: "145px", backgroundColor: "#0f904d", borderColor: "#0f904d" }, message: "Saved!" },
    { styles: { width: "140px", backgroundColor: "#c63636", borderColor: "#c63636" }, message: "Error!" },
  ];

  return (
    <div className={styles.MemberProfile}>
      {displayModal ? <div className={styles.MemberProfileOverlay} onClick={() => setDisplayModal(false)} /> : null}
      <UploadPhotoModal
        closeModal={() => setDisplayModal(false)}
        displayModal={displayModal}
        setDeleteImage={setDeleteImage}
        setImageUrl={setImageUrl}
        setImageBlob={setImageBlob}
      />
      {session.user.access >= 1 ? (
        <div className={styles.MemberProfileAdminButton} onClick={() => Router.push(urls.base + urls.pages.admin)}>
          Admin View
        </div>
      ) : null}
      <LogoutIcon className={styles.MemberProfileLogout} onClick={() => signOut()} />
      <div className={styles.MemberProfileHeader}>
        <div className={styles.MemberProfileImageContainer} onClick={() => setDisplayModal(true)}>
          <img className={styles.MemberProfileImage} src={imageUrl} alt="User Picture" />
          <div className={styles.MemberProfileImageOverlay} />
          <div className={styles.MemberProfilePencilBackground}>
            <img className={styles.MemberProfilePencil} src="/Pencil.png" alt="Edit Pencil Icon" />
          </div>
        </div>
        <div className={styles.MemberProfileName}>{`${firstName} ${lastName}`}</div>
        {success === 0 ? null : <SuccessBox success={success === 1} closeBox={() => setSuccess(0)} message={message} />}
      </div>
      <div className={styles.MemberProfileFields}>
        <InputField fieldName="FIRST NAME" fieldState={firstName} setFieldState={setFirstName} />
        <InputField fieldName="LAST NAME" fieldState={lastName} setFieldState={setLastName} />
        <div>
          <InputField fieldName="EMAIL" fieldState={email} setFieldState={setEmail} />
          {emailVerified ? null : (
            <p style={{ color: "red" }}>
              A verification email has been sent to your new email.
              <br />
              Your email will not be changed until it is verified.
            </p>
          )}
        </div>
        <InputField
          fieldName="PHONE NUMBER"
          fieldState={phoneNumber}
          onChange={(e) => {
            if (/^[0-9]{0,10}$/g.test(e.target.value)) {
              setPhoneNumber(e.target.value);
            }
          }}
          isOptional={true}
        />
        <div className={mobileView ? styles.MobileMemberProfileRadioSave : styles.MemberProfileRadioSave}>
          <RadioField preference={preference} setPreference={setPreference} />
          <div className={mobileView ? styles.MobileMemberProfileSave : styles.MemberProfileSave}>
            <div className={styles.MemberProfileSaveButton} style={buttonTransition[saved].styles} onClick={handleSave}>
              <img src="/Save.png" alt="Save Icon" />
              {buttonTransition[saved].message}
            </div>
          </div>
        </div>
      </div>
      <div className={mobileView ? styles.MobileMemberProfileFooter : styles.MemberProfileFooter}>
        <div className={styles.MemberProfileFooterPageContainer}>
          <div className={styles.MemberProfileFooterPage}>
            <div className={styles.MemberProfileFooterPageArrow} onClick={() => handleArrowClick(true)} style={{ cursor: "pointer" }}>
              &lt;
            </div>
            <div className={styles.MemberProfileFooterPageName}>{`${semester.toUpperCase()} ${year}`}</div>
            <div className={styles.MemberProfileFooterPageArrow} onClick={() => handleArrowClick(false)} style={{ cursor: "pointer" }}>
              &gt;
            </div>
          </div>
        </div>
        <div className={mobileView ? styles.MobileMemberProfileFooterBottom : styles.MemberProfileFooterBottom}>
          <FooterElement title="DEPARTMENT" state={department} />
          <FooterElement title="ROLE" state={role} />
          <FooterElement title="PROJECT" state={project} />
          <FooterElement title="STATUS" state={status_} />
        </div>
      </div>
    </div>
  );
}

MemberProfile.title = "Member Profile | Boggers";
