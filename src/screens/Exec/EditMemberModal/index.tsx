import React, {useState, useContext} from "react";
import style from "./EditMemberModal.module.css";
import {Typography, TextField, Button, MenuItem, Select} from "@mui/material";
import fields from "../../../../utils/fields";
import urls from "../../../../utils/urls";
import sendRequest from "../../../../utils/sendToBackend";
import TableContext from "../../../../utils/TableContext";

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
  const {userList, setUserList} = useContext(TableContext);
  const [semester, year] = splitSemesterString(currentSemester);

  const [firstName, setFirstName] = useState(row.member.firstName);
  const [lastName, setLastName] = useState(row.member.lastName);
  const [email, setEmail] = useState(row.member.email);
  const [phoneNumber, setPhoneNumber] = useState(row.member.phoneNumber);
  const [department, setDepartment] = useState(row.department);
  const [role, setRole] = useState(row.role);
  const [project, setProject] = useState(row.project);
  const [preference, setPreference] = useState(row.preference);
  const [status, setStatus] = useState(row.status);
  const [memberType, setMemberType] = useState(0);
  const [notes, setNotes] = useState(row.notes ?? "");

  const updateHandler = async () => {
    setShowModal(false);
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
  }

  const {departments, roles, projects, preferences, statuses, memberTypes} = fields;
  return (
    <div>
      <div className={style.background} onClick={() => setShowModal(false)} />
      <div className={style.editModalContainer}>
        <div className={style.exitButton} onClick={() => setShowModal(false)}>
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
                <MenuItem value={key}>{key}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="ROLE" />
            <Select size="small" style={{width: "100%"}} value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((key) => (
                <MenuItem value={key}>{key}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="PROJECT" />
            <Select size="small" style={{width: "100%"}} value={project} onChange={(e) => setProject(e.target.value)}>
              {projects.map((key) => (
                <MenuItem value={key}>{key}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="TECH PREFERENCE" />
            <Select size="small" style={{width: "100%"}} value={preference} onChange={(e) => setPreference(e.target.value)}>
              {preferences.map((key) => (
                <MenuItem value={key}>{key}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="STATUS" />
            <Select size="small" style={{width: "100%"}} value={status} onChange={(e) => setStatus(e.target.value)}>
              {statuses.map((key) => (
                <MenuItem value={key}>{key}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="MEMBER TYPE" />
            <Select size="small" style={{width: "100%"}} value={memberType} onChange={(e) => setMemberType(e.target.value)}>
              {Object.keys(memberTypes).map((key) => (
                <MenuItem value={key}>{memberTypes[key]}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className={style.noteContainer}>
          <Label label="NOTES" />
          <TextField className={style.noteField} multiline value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className={style.updateButtonGroup}>
          <Button variant="contained" style={{marginLeft: "10px"}}>
            {" "}
            REMOVE MEMBER
          </Button>
          <Button variant="contained" style={{marginLeft: "10px"}} onClick={updateHandler}>
            {" "}
            SAVE{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
