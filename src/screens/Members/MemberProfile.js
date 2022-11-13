import styles from "./MemberProfile.module.css";
import React, {useState, useEffect} from "react";
import {getSession} from "next-auth/react";
import axios from "axios";
import sendRequest from "../../../utils/sendToBackend";
import urls from "../../../utils/urls";

import UploadPhotoModal from "./UploadPhotoModal/UploadPhotoModal";
import InputField from "./InputField/InputField";
import RadioField from "./RadioField/RadioField";
import FooterElement from "./FooterElement/FooterElement";
import SuccessBox from "./SuccessBox/SuccessBox";

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
  const [admin, setAdmin] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(Avatar.src);
  const [imageBlob, setImageBlob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [success, setSuccess] = useState(0);

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("johndoe@gatech.edu");
  const [phoneNumber, setPhoneNumber] = useState("1234567890");
  const [preference, setPreference] = useState("Full-stack");

  const [tenures, setTenures] = useState([]);
  const [currIndex, setCurrIndex] = useState(-1);
  const [semester, setSemester] = useState("Fall");
  const [year, setYear] = useState("2022");
  const [department, setDepartment] = useState("-");
  const [role, setRole] = useState("-");
  const [project, setProject] = useState("-");
  const [status, setStatus] = useState("-");

  const requestStatus = (success) => {
    setTimeout(() => setSaved(false), 1000);
    setSuccess(success ? 1 : 2);
    setTimeout(() => setSuccess(0), 5000);
  };
  console.log("success", success);

  useEffect(() => {
    const getInitialData = async () => {
      const currentUser = await getSession();
      const isAdmin = currentUser.user.access > 0;
      setAdmin(isAdmin);

      const result = await sendRequest(urls.api.getUser, "GET");
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
      setImageUrl(result.payload.imageUrl ? result.payload.imageUrl + "?random=" + Math.floor(Math.random() * 1000000) : Avatar.src);

      let index = -1,
        semester,
        year,
        department,
        role,
        project,
        status;
      if (!isAdmin && tenures.length > 0) {
        index = tenures.length - 1;
        ({semester, year, department, role, project, status} = tenures[index]);
      } else {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth();
        year = date.getFullYear();
        if ((month >= 0 && month <= 3) || (month == 4 && day <= 14)) {
          semester = "Spring";
        } else if ((month == 4 && day >= 15) || (month >= 5 && month <= 6) || (month == 7 && day <= 14)) {
          semester = "Summer";
        } else {
          semester = "Fall";
        }

        if (isAdmin) {
          index = tenures.findIndex((tenure) => tenure.semester === semester && tenure.year === year);
          if (index === -1) {
            department = role = project = status = "";
          } else {
            ({department, role, project, status} = tenures[index]);
          }
        } else {
          department = role = project = status = "-";
        }
      }

      setCurrIndex(index);
      setSemester(semester);
      setYear(year);
      setDepartment(department);
      setRole(role);
      setProject(project);
      setStatus(status);
    };

    getInitialData();
  }, []);

  const handleSave = async () => {
    setSaved(true);
    const id = (await getSession()).user.id;

    const newTenures = tenures.map((tenure) => structuredClone(tenure));
    const updatedTenure = {semester, year, department, role, project, status};
    if (currIndex === -1) {
      newTenures.push(updatedTenure);
    } else {
      newTenures[currIndex] = updatedTenure;
    }

    const result = await sendRequest(urls.api.updateMember, "PUT", {
      memberId: id,
      firstName,
      lastName,
      email,
      phoneNumber,
      preference,
      semester,
      year,
      department,
      role,
      project,
      status,
    });

    if (result.success) {
      setTenures(newTenures);
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

    console.log(imageResult);
    if (imageResult.data.success) {
      setImageBlob(null);
    }
    requestStatus(imageResult.data.success);
  };

  const handleArrowClick = (isLeft) => {
    let index = currIndex == -1 ? -1 : isLeft ? Math.max(currIndex - 1, 0) : Math.min(currIndex + 1, tenures.length - 1);
    let newSemester,
      newYear = year,
      department,
      role,
      project,
      status;
    if (admin) {
      if (isLeft) {
        if (semester === "Spring") {
          newSemester = "Fall";
          newYear -= 1;
        } else if (semester === "Summer") {
          newSemester = "Spring";
        } else {
          newSemester = "Summer";
        }
      } else {
        if (semester === "Spring") {
          newSemester = "Summer";
        } else if (semester === "Summer") {
          newSemester = "Fall";
        } else {
          newSemester = "Spring";
          newYear += 1;
        }
      }

      index = tenures.findIndex((tenure) => tenure.semester === newSemester && tenure.year === newYear);
      if (index === -1) {
        department = role = project = status = "";
      } else {
        ({department, role, project, status} = tenures[index]);
      }
    } else if (currIndex == -1) {
      return;
    } else {
      ({semester: newSemester, year: newYear, department, role, project, status} = tenures[index]);
    }
    setCurrIndex(index);
    setSemester(newSemester);
    setYear(newYear);
    setDepartment(department);
    setRole(role);
    setProject(project);
    setStatus(status);
  };

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
        setImageUrl={setImageUrl}
        setImageBlob={setImageBlob}
      />
      <div className={styles.MemberProfileBody}>
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
          <FooterElement admin={admin} title="DEPARTMENT" state={department} setState={setDepartment} />
          <FooterElement admin={admin} title="ROLE" state={role} setState={setRole} />
          <FooterElement admin={admin} title="PROJECT" state={project} setState={setProject} />
          <FooterElement admin={admin} title="STATUS" state={status} setState={setStatus} />
        </div>
      </div>
    </div>
  );
};
