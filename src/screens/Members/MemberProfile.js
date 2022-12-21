import styles from "./MemberProfile.module.css";
import React, {useState, useEffect} from "react";
import {useRouter} from "next/router";
import {getSession, signOut} from "next-auth/react";
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
import LogoutIcon from "@mui/icons-material/Logout";

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
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
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
  const [semester, setSemester] = useState("Fall");
  const [year, setYear] = useState("2022");
  const [department, setDepartment] = useState("-");
  const [role, setRole] = useState("-");
  const [project, setProject] = useState("-");
  const [status, setStatus] = useState("-");

  const requestStatus = (success) => {
    setSuccess(success ? 1 : 2);
    setSaved(success ? 2 : 3);
    setTimeout(() => setSaved(0), 2000);
    setTimeout(() => setSuccess(0), 5000);
  };

  const resetRouter = () => router.push(urls.base + urls.pages.members);

  useEffect(() => {
    const getInitialData = async () => {
      const queryLength = Object.keys(router.query).length;
      if (!(queryLength === 0 || queryLength === 3)) {
        return resetRouter();
      }

      const userViewing = await getSession();
      const isAdmin = false;
      setAdmin(isAdmin);

      let currentUserId;
      if (queryLength === 3) {
        if (
          !isAdmin ||
          !router.query.id ||
          !router.query.semester ||
          !router.query.year ||
          !["Spring", "Summer", "Fall"].includes(router.query.semester) ||
          !(Number.parseInt(router.query.year) >= 2010 && Number.parseInt(router.query.year) <= 2040)
        ) {
          return resetRouter();
        } else {
          currentUserId = router.query.id;
        }
      } else {
        currentUserId = userViewing.user.id;
      }

      const result = await sendRequest(urls.api.getUser + `?id=${currentUserId}`, "GET");
      if (!result.success) {
        return resetRouter();
      }
      setUser(currentUserId);

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
        if (queryLength === 3) {
          ({semester, year} = router.query);
          year = Number.parseInt(year);
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
        }

        if (isAdmin) {
          index = tenures.findIndex((tenure) => tenure.semester === semester && tenure.year === year);
          if (index === -1) {
            department = role = project = "";
            status = "Active";
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
  }, [router]);

  const handleSave = async () => {
    setSaved(1);
    const newTenures = tenures.map((tenure) => structuredClone(tenure));
    const updatedTenure = {semester, year, department, role, project, status};
    if (currIndex === -1) {
      newTenures.push(updatedTenure);
    } else {
      newTenures[currIndex] = updatedTenure;
    }

    const result = await sendRequest(urls.api.updateMember, "PUT", {
      memberId: user,
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
        department = role = project = "";
        status = "Active";
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
          <FooterElement admin={admin} title="DEPARTMENT" state={department} setState={setDepartment} />
          <FooterElement admin={admin} title="ROLE" state={role} setState={setRole} />
          <FooterElement admin={admin} title="PROJECT" state={project} setState={setProject} />
          <FooterElement admin={admin} title="STATUS" state={status} setState={setStatus} />
        </div>
      </div>
    </div>
  );
};
