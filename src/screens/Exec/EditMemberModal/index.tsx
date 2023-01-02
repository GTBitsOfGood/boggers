import React, { useState, useContext, useEffect, useRef } from "react";
import style from "./EditMemberModal.module.css";
import { Typography, TextField, Button, MenuItem, Select } from "@mui/material";
import fields from "../../../../utils/fields";
import urls from "../../../../utils/urls";
import sendRequest from "../../../../utils/sendToBackend";
import TableContext from "../../../../utils/TableContext";
import ConfirmationModal from "../ConfirmationModal";
import { EditMemberModalProps, User } from "../types";

const Label = ({ label }) => {
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

export default function EditMemberModal({ row, isVisible, closeModal, currentSemester }: EditMemberModalProps) {
  const { userList, setUserList } = useContext(TableContext);
  const scrollRef = useRef(null);
  const [confirmModal, setConfirmModal] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState(0);
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [project, setProject] = useState("");
  const [preference, setPreference] = useState("");
  const [status, setStatus] = useState("");
  const [memberType, setMemberType] = useState("");
  const [notes, setNotes] = useState("");

  const splitSemesterString = (semesterString) => {
    const [semester, year] = semesterString.split(" ");
    return [semester, Number.parseInt(year)];
  };

  useEffect(() => {
    if (row) {
      setFirstName(row.firstName);
      setLastName(row.lastName);
      setEmail(row.email);
      setPhoneNumber(row.phoneNumber);
      setPreference(row.preference);
    }
  }, [row]);

  useEffect(() => {
    if (row && semester && year) {
      const tenure = row.tenures[`${semester} ${year}`];
      setDepartment(tenure.department);
      setRole(tenure.role);
      setProject(tenure.project);
      setStatus(tenure.status);
      setNotes(tenure.notes ?? "");
    }
  }, [row, semester, year]);

  useEffect(() => {
    if (isVisible) {
      scrollRef.current.scrollTop = 0;

      const [semester, year] = splitSemesterString(currentSemester);
      setSemester(semester);
      setYear(year);
    }
  }, [isVisible]);

  const semesterHandler = (e) => {
    const [semester, year] = splitSemesterString(e.target.value);
    setSemester(semester);
    setYear(year);
  };

  const updateHandler = async () => {
    closeModal();
    const result = await sendRequest(urls.api.updateMember, "PUT", {
      memberId: row.id,
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
      const users: User[] = JSON.parse(JSON.stringify(userList));
      const index = users.findIndex((user) => user.id === row.id);
      const semesterString = `${semester} ${year}`;

      const tenures = users[index].tenures;
      tenures[semesterString] = { ...tenures[semesterString], semester, year, department, role, project, status, notes };
      users[index] = { ...users[index], firstName, lastName, email, phoneNumber, preference, tenures };
      setUserList(users);
    }
  };

  const animation = {
    false: {
      background: { visibility: "hidden" },
      container: { visibility: "hidden", opacity: 0 },
    },
    true: {
      background: { visibility: "visible" },
      container: { visibility: "visible", opacity: 1 },
    },
  };

  const { departments, roles, projects, preferences, statuses, memberTypes } = fields;
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
        userId={row?.id}
        semester={semester}
        year={year}
      />
      <div className={style.editModalContainer} style={animation[isVisible].container} ref={scrollRef}>
        <div className={style.exitButton} onClick={() => closeModal()}>
          X
        </div>
        <div className={style.editModalTitleContainer}>
          <p className={style.header}>{`${firstName} ${lastName}`}</p>
          <Select
            className={style.subHeader}
            size="small"
            value={semester && year ? `${semester} ${year}` : ""}
            onChange={semesterHandler}
            sx={{ boxShadow: "none", ".MuiOutlinedInput-notchedOutline": { border: 0 } }}>
            {row ? (
              Object.keys(row.tenures).map((key) => (
                <MenuItem key={`semester_${key}`} value={key} style={{ fontFamily: "Poppins" }}>
                  {key}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={`${semester} ${year}`} style={{ fontFamily: "Poppins" }}>{`${semester} ${year}`}</MenuItem>
            )}
          </Select>
        </div>

        <div className={style.fieldListContainer}>
          <div className={style.fieldContainer}>
            <Label label="FIRST NAME" />
            <TextField
              size="small"
              inputProps={{ style: { fontFamily: "Poppins" } }}
              style={{ width: "100%" }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className={style.fieldContainer}>
            <Label label="LAST NAME" />
            <TextField
              size="small"
              inputProps={{ style: { fontFamily: "Poppins" } }}
              style={{ width: "100%" }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className={style.fieldContainer}>
            <Label label="EMAIL" />
            <TextField
              size="small"
              inputProps={{ style: { fontFamily: "Poppins" } }}
              style={{ width: "100%" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={style.fieldContainer}>
            <Label label="PHONE NUMBER" />
            <TextField
              size="small"
              inputProps={{ style: { fontFamily: "Poppins" } }}
              style={{ width: "100%" }}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className={style.fieldContainer}>
            <Label label="DEPARTMENT" />
            <Select
              size="small"
              style={{ width: "100%", fontFamily: "Poppins" }}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}>
              {departments.map((key) => (
                <MenuItem key={key} value={key} style={{ fontFamily: "Poppins" }}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="ROLE" />
            <Select size="small" style={{ width: "100%", fontFamily: "Poppins" }} value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((key) => (
                <MenuItem key={key} value={key} style={{ fontFamily: "Poppins" }}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="PROJECT" />
            <Select
              size="small"
              style={{ width: "100%", fontFamily: "Poppins" }}
              value={project}
              onChange={(e) => setProject(e.target.value)}>
              {projects.map((key) => (
                <MenuItem key={key} value={key} style={{ fontFamily: "Poppins" }}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="TECH PREFERENCE" />
            <Select
              size="small"
              style={{ width: "100%", fontFamily: "Poppins" }}
              value={preference}
              onChange={(e) => setPreference(e.target.value)}>
              {preferences.map((key) => (
                <MenuItem key={key} value={key} style={{ fontFamily: "Poppins" }}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="STATUS" />
            <Select
              size="small"
              style={{ width: "100%", fontFamily: "Poppins" }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}>
              {statuses.map((key) => (
                <MenuItem key={key} value={key} style={{ fontFamily: "Poppins" }}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={style.fieldContainer}>
            <Label label="MEMBER TYPE" />
            <Select
              size="small"
              style={{ width: "100%", fontFamily: "Poppins" }}
              value={memberType}
              onChange={(e) => setMemberType(e.target.value)}>
              {Object.keys(memberTypes).map((key) => (
                <MenuItem key={memberTypes[key]} value={key} style={{ fontFamily: "Poppins" }}>
                  {memberTypes[key]}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className={style.noteContainer}>
          <Label label="NOTES" />
          <TextField
            className={style.noteField}
            multiline
            inputProps={{ style: { fontFamily: "Poppins" } }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
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
