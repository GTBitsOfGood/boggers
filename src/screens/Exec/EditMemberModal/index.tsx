import React, {useState, useContext, useEffect} from "react";
import style from "./EditMemberModal.module.css";
import {Typography, TextField, Button, MenuItem, Select} from "@mui/material";
import fields from "../../../../utils/fields";
import urls from "../../../../utils/urls";
import sendRequest from "../../../../utils/sendToBackend";
import TableContext from "../../../../utils/TableContext";
import ConfirmationModal from "../ConfirmationModal";

const Label = ({label}) => {
  return (
    <Typography
      variant="h3"
      style={{
        fontFamily: "Poppins",
        color: "#333333",
        fontSize: "20px",
        fontWeight: "500",
        marginRight: "0.8rem",
      }}>
      {label}
    </Typography>
  );
};

const splitSemesterString = (semesterString) => {
  const [semester, year] = semesterString.split(" ");
  return [semester.charAt(0).toUpperCase() + semester.slice(1).toLowerCase(), Number.parseInt(year)];
};

export default function EditMemberModal({row, isVisible, closeModal, currentSemester}) {
  const {userList, setUserList} = useContext(TableContext);
  const [semester, year] = splitSemesterString(currentSemester);
  const [confirmModal, setConfirmModal] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [project, setProject] = useState("");
  const [preference, setPreference] = useState("");
  const [status, setStatus] = useState("");
  const [memberType, setMemberType] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (row) {
      setFirstName(row.member.firstName);
      setLastName(row.member.lastName);
      setEmail(row.member.email);
      setPhoneNumber(row.member.phoneNumber);
      setDepartment(row.department);
      setRole(row.role);
      setProject(row.project);
      setPreference(row.preference);
      setStatus(row.status);
      setNotes(row.notes ?? "");
    }
  }, [row]);

  const updateHandler = async () => {
    closeModal();
    const result = await sendRequest(urls.api.updateMember, "PUT", {
      memberId: row.member.id,
      firstName,
      lastName,
      email,
      phoneNumber,
      semester,
      year,
      department,
      role,
      project,
      preference,
      status,
      notes,
    });
    console.log(result);

    if (result.success) {
      setUserList(userList.map((user) => (user.id === row.member.id ? result.user : user)));
    }
  };

  const animation = {
    false: {
      background: {visibility: "hidden"},
      container: {visibility: "hidden", opacity: 0},
    },
    true: {
      background: {visibility: "visible"},
      container: {visibility: "visible", opacity: 1},
    },
  };

  const {departments, roles, projects, preferences, statuses, memberTypes} = fields;
  return (
    <div>
      <div className={style.background} style={animation[isVisible].background} onClick={() => closeModal()} />
      <ConfirmationModal
        confirmModal={confirmModal}
        handleCancel={() => setConfirmModal(0)}
        handleConfirm={() => {
          setConfirmModal(0);
          closeModal();
        }}
        userId={row?.member.id}
        semester={semester}
        year={year}
      />
      <div className={style.editModalContainer} style={animation[isVisible].container}>
        <div className={style.exitButton} onClick={() => closeModal()}>
          X
        </div>
        <div className={style.editModalTitleContainer}>
          <img className={style.arrow} />
          <div>
            <p className={style.header}>{`${firstName} ${lastName}`}</p>
            <p className={style.subHeader}>{`${semester} ${year}`}</p>
          </div>
        </div>

        <div className={style.fieldListContainer}>
          <div className={style.fieldContainer}>
            <Label label="FIRST NAME" />
            <TextField size="small" style={{width: "100%"}} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className={style.fieldContainer}>
            <Label label="LAST NAME" />
            <TextField size="small" style={{width: "100%"}} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className={style.fieldContainer}>
            <Label label="EMAIL" />
            <TextField size="small" style={{width: "100%"}} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={style.fieldContainer}>
            <Label label="PHONE NUMBER" />
            <TextField size="small" style={{width: "100%"}} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div className={style.fieldContainer}>
            <Label label="DEPARTMENT" />
            <Select size="small" style={{width: "100%"}} value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departments.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="ROLE" />
            <Select size="small" style={{width: "100%"}} value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="PROJECT" />
            <Select size="small" style={{width: "100%"}} value={project} onChange={(e) => setProject(e.target.value)}>
              {projects.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="TECH PREFERENCE" />
            <Select size="small" style={{width: "100%"}} value={preference} onChange={(e) => setPreference(e.target.value)}>
              {preferences.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="STATUS" />
            <Select size="small" style={{width: "100%"}} value={status} onChange={(e) => setStatus(e.target.value)}>
              {statuses.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="MEMBER TYPE" />
            <Select size="small" style={{width: "100%"}} value={memberType} onChange={(e) => setMemberType(e.target.value)}>
              {Object.keys(memberTypes).map((key) => (
                <MenuItem key={memberTypes[key]} value={key}>
                  {memberTypes[key]}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className={style.noteContainer}>
          <Label label="NOTES" />
          <TextField className={style.noteField} multiline value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className={style.updateButtonGroup}>
          <Button variant="contained" onClick={() => setConfirmModal(1)}>
            REMOVE TENURE
          </Button>
          <Button variant="contained" onClick={() => setConfirmModal(2)}>
            REMOVE MEMBER
          </Button>
          <Button variant="contained" onClick={updateHandler}>
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
}
