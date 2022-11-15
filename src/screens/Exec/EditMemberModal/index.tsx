import React, {useState} from "react";
import style from "./EditMemberModal.module.css";
import {Typography, TextField, Button, MenuItem, Select} from "@mui/material";
import fields from "../../../../utils/fields";

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
  return [semester.charAt(0).toUpperCase() + semester.slice(1).toLowerCase(), year];
};

export default function EditMemberModal({row, setShowModal, currentSemester}) {
  const {department: memberDepartment, role: memberRole, project: memberProject, preference: memberPreference, status: memberStatus} = row;

  const {firstName: memberFirstName, lastName: memberLastName, email: memberEmail, phoneNumber: memberPhoneNumber} = row.member;
  const [memberSemester, memberYear] = splitSemesterString(currentSemester);
  console.log(row);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newSemester, setNewSemester] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newPreference, setNewPreference] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const {departments, roles, projects, preferences, status, memberTypes} = fields;
  return (
    <div className={style.background}>
      <div className={style.editModalContainer}>
        <div className={style.exitButton} onClick={() => setShowModal(false)}>
          X
        </div>
        <div className={style.editModalTitleContainer}>
          <img className={style.arrow} />
          <div>
            <p className={style.header}>{`${memberFirstName} ${memberLastName}`}</p>
            <p className={style.subHeader}>{`${memberSemester} ${memberYear}`}</p>
            {/* <p className={style.header}>Luke Kim</p>
            <p className={style.subHeader}>Spring 2022</p> */}
          </div>
        </div>

        <div className={style.fieldListContainer}>
          <div className={style.fieldContainer}>
            <Label label="FIRST NAME" />
            <TextField size="small" style={{width: "100%"}} value={memberFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
          </div>
          <div className={style.fieldContainer}>
            <Label label="LAST NAME" />
            <TextField size="small" style={{width: "100%"}} value={memberLastName} onChange={(e) => setNewLastName(e.target.value)} />
          </div>
          <div className={style.fieldContainer}>
            <Label label="EMAIL" />
            <TextField size="small" style={{width: "100%"}} value={memberEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>
          <div className={style.fieldContainer}>
            <Label label="PHONE NUMBER" />
            <TextField size="small" style={{width: "100%"}} value={memberPhoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} />
          </div>
          <div className={style.fieldContainer}>
            <Label label="DEPARTMENT" />
            <Select size="small" style={{width: "100%"}} value={memberDepartment} onChange={(e) => setNewDepartment(e.target.value)}>
              {Object.keys(departments).map((key) => (
                <MenuItem value={departments[key]}>{departments[key]}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="ROLE" />
            <Select size="small" style={{width: "100%"}} value={memberRole} onChange={(e) => setNewRole(e.target.value)}>
              {Object.keys(roles).map((key) => (
                <MenuItem value={roles[key]}>{roles[key]}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="PROJECT" />
            <Select size="small" style={{width: "100%"}} value={memberProject} onChange={(e) => setNewProject(e.target.value)}>
              {Object.keys(projects).map((key) => (
                <MenuItem value={projects[key]}>{projects[key]}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="TECH PREFERENCE" />
            <Select size="small" style={{width: "100%"}} value={memberPreference} onChange={(e) => setNewPreference(e.target.value)}>
              {Object.keys(preferences).map((key) => (
                <MenuItem value={preferences[key]}>{preferences[key]}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="STATUS" />
            <Select size="small" style={{width: "100%"}} value={memberStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {Object.keys(status).map((key) => (
                <MenuItem value={status[key]}>{status[key]}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="MEMBER TYPE" />
            <TextField label="" size="small" style={{width: "100%"}} />
          </div>
        </div>
        <div className={style.noteContainer}>
          <Label label="NOTES" />
          <TextField multiline style={{width: "100%", height: "150px", overflow: "auto"}} />
        </div>
        <div className={style.updateButtonGroup}>
          <Button variant="contained" style={{marginLeft: "10px"}}>
            {" "}
            REMOVE MEMBER
          </Button>
          <Button variant="contained" style={{marginLeft: "10px"}}>
            {" "}
            SAVE{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
