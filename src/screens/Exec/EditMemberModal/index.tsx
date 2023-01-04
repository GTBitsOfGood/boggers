import React, { useState, useContext, useEffect, useRef } from "react";
import style from "./EditMemberModal.module.css";
import { Typography, Select, MenuItem, TextField, Button } from "@mui/material";
import fields from "../../../../utils/fields";
import urls from "../../../../utils/urls";
import sendRequest from "../../../../utils/sendToBackend";
import ConfirmationModal from "../ConfirmationModal";
import { EditMemberModalProps, User } from "../types";
import { sortTenures, splitSemesterString } from "../../../../utils/utilFunctions";
import TableContext from "../../../../utils/contexts/TableContext";
import DashboardContext from "../../../../utils/contexts/DashboardContext";
import EditMemberField from "./EditMemberField";

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
  const { isAddUser, semesters, setSemesters } = useContext(DashboardContext);
  const scrollRef = useRef(null);
  const [confirmModal, setConfirmModal] = useState(0);
  const [isNewTenure, setIsNewTenure] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [semesterYear, setSemesterYear] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [project, setProject] = useState("");
  const [preference, setPreference] = useState("");
  const [status, setStatus] = useState("");
  const [memberType, setMemberType] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (row) {
      setFirstName(row.firstName);
      setLastName(row.lastName);
      setEmail(row.email);
      setPhoneNumber(row.phoneNumber);
      setPreference(row.preference);
      setMemberType(row.access.toString());
    }
  }, [row]);

  useEffect(() => {
    if (row && semesterYear) {
      const tenure = row.tenures[semesterYear];
      setDepartment(tenure ? tenure.department : "");
      setRole(tenure ? tenure.role : "");
      setProject(tenure ? tenure.project : "");
      setStatus(tenure ? tenure.status : "");
      setNotes(tenure ? tenure.notes : "");
    }
  }, [row, semesterYear]);

  useEffect(() => {
    if (isVisible) {
      setSemesterYear(currentSemester);
      scrollRef.current.scrollTop = 0;
      setIsNewTenure(isAddUser);
      setSemesterYear(currentSemester);
      if (isAddUser) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setPreference("");
        setDepartment("");
        setRole("");
        setProject("");
        setStatus("");
        setNotes("");
        setMemberType("");
      }
    }
  }, [isVisible]);

  useEffect(() => {
    setSemesterYear(currentSemester);
  }, [currentSemester]);

  const semesterHandler = (e) => {
    if (e.target.value === "Add Tenure") {
      setIsNewTenure(true);
    } else {
      setIsNewTenure(false);
      setSemesterYear(e.target.value);
    }
  };

  const updateHandler = async () => {
    closeModal();
    const [semester, year] = splitSemesterString(semesterYear);
    const result = await sendRequest(urls.api.updateMember, "PUT", {
      memberId: row?.id,
      firstName,
      lastName,
      email,
      phoneNumber,
      preference,
      access: Number.parseInt(memberType),
      semester,
      year,
      department,
      role,
      project,
      status,
      notes,
    });
    console.log(result);

    if (result.success) {
      const users: User[] = JSON.parse(JSON.stringify(userList));
      if (row) {
        const index = users.findIndex((user) => user.id === row.id);
        const tenures = users[index].tenures;
        tenures[semesterYear] = { ...tenures[semesterYear], semester, year, department, role, project, status, notes };
        users[index] = { ...users[index], firstName, lastName, email, phoneNumber, preference, tenures };
      } else {
        users.push({
          id: result.id,
          firstName,
          lastName,
          email,
          phoneNumber,
          preference,
          tenures: { [semesterYear]: { semester, year, department, role, project, status, notes } },
        });
      }
      setUserList(users);

      if (!semesters.has(semesterYear)) {
        const newSemesters = new Set(semesters);
        newSemesters.add(semesterYear);
        setSemesters(newSemesters);
      }
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

  const [semester, year] = splitSemesterString(semesterYear);

  const { semesterOptions, departments, roles, projects, preferences, statuses, memberTypes } = fields;
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
        semesterYear={semesterYear}
      />
      <div className={style.editModalContainer} style={animation[isVisible].container} ref={scrollRef}>
        <div className={style.exitButton} onClick={() => closeModal()}>
          X
        </div>
        <div className={style.editModalTitleContainer}>
          <p className={style.header}>{firstName || lastName ? `${firstName} ${lastName}` : "Enter Name"}</p>
          <Select
            className={style.subHeader}
            size="small"
            value={isNewTenure || isAddUser ? "Add Tenure" : semesterYear}
            onChange={semesterHandler}
            sx={{ boxShadow: "none", ".MuiOutlinedInput-notchedOutline": { border: 0 } }}
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "#0069ca1a",
                    color: "#78adff",
                  },
                  "& .MuiMenuItem-root.Mui-selected:hover": {
                    backgroundColor: "#0069ca23",
                  },
                },
              },
            }}>
            <MenuItem value="Add Tenure" style={{ fontFamily: "Poppins", justifyContent: "center" }}>
              <div>Add Tenure</div>
            </MenuItem>
            {row ? (
              Object.keys(row.tenures)
                .sort(sortTenures(false))
                .map((key) => (
                  <MenuItem key={`semester_${key}`} value={key} style={{ fontFamily: "Poppins", justifyContent: "center" }}>
                    <div>{key}</div>
                  </MenuItem>
                ))
            ) : !isAddUser ? (
              <MenuItem value={isNewTenure ? "Add Tenure" : semesterYear} style={{ fontFamily: "Poppins", justifyContent: "center" }}>
                <div>{isNewTenure ? "Add Tenure" : semesterYear}</div>
              </MenuItem>
            ) : null}
          </Select>
        </div>

        <div className={style.fieldListContainer}>
          <EditMemberField label="FIRST NAME" type="text" state={firstName} setState={setFirstName} />
          <EditMemberField label="LAST NAME" type="text" state={lastName} setState={setLastName} />
          <EditMemberField label="EMAIL" type="text" state={email} setState={setEmail} />
          <EditMemberField label="PHONE NUMBER" type="text" state={phoneNumber} setState={setPhoneNumber} />
          {isNewTenure && (
            <>
              <EditMemberField
                label="SEMESTER"
                type="select"
                state={semester}
                menu={semesterOptions}
                onChange={(e) => setSemesterYear(`${e.target.value} ${year}`)}
              />
              <EditMemberField label="YEAR" type="number" state={year} onChange={(e) => setSemesterYear(`${semester} ${e.target.value}`)} />
            </>
          )}
          <EditMemberField label="DEPARTMENT" type="select" state={department} menu={departments} setState={setDepartment} />
          <EditMemberField label="ROLE" type="select" state={role} menu={roles} setState={setRole} />
          <EditMemberField label="PROJECT" type="select" state={project} menu={projects} setState={setProject} />
          <EditMemberField label="TECH PREFERENCE" type="select" state={preference} menu={preferences} setState={setPreference} />
          <EditMemberField label="STATUS" type="select" state={status} menu={statuses} setState={setStatus} />
          <EditMemberField
            label="MEMBER TYPE"
            type="select"
            state={memberType}
            menu={Object.keys(memberTypes)}
            setState={setMemberType}
            keyFunc={(key) => memberTypes[key]}
          />
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
          {!isNewTenure && !isAddUser && (
            <Button variant="contained" onClick={() => setConfirmModal(1)}>
              REMOVE TENURE
            </Button>
          )}
          {!isAddUser && (
            <Button variant="contained" onClick={() => setConfirmModal(2)}>
              REMOVE MEMBER
            </Button>
          )}
          <Button variant="contained" onClick={updateHandler}>
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
}
