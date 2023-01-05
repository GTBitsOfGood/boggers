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
import Save from "../../../public/Save.png";

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
  const [user, setUser] = useState(null);

  const [id, setId] = useState("");
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

  const resetFields = () => {
    setId("");
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
  };

  useEffect(() => {
    if (row) {
      setUser(row);
    }
  }, [row]);

  useEffect(() => {
    if (user) {
      setId(user.id);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
      setPreference(user.preference);
      setMemberType(user.access.toString());
    }
  }, [user]);

  useEffect(() => {
    if (user && semesterYear) {
      const tenure = user.tenures[semesterYear];
      setDepartment(tenure ? tenure.department : "");
      setRole(tenure ? tenure.role : "");
      setProject(tenure ? tenure.project : "");
      setStatus(tenure ? tenure.status : "");
      setNotes(tenure ? tenure.notes : "");
    }
  }, [user, semesterYear]);

  useEffect(() => {
    if (isVisible) {
      setSemesterYear(currentSemester);
      scrollRef.current.scrollTop = 0;
      setIsNewTenure(isAddUser);
      setSemesterYear(currentSemester);
      if (isAddUser) {
        resetFields();
      }
    }
  }, [isVisible]);

  useEffect(() => {
    setSemesterYear(currentSemester);
  }, [currentSemester]);

  const semesterHandler = (e) => {
    if (e.target.value === "Add Tenure") {
      setIsNewTenure(true);
    } else if (isAddUser) {
      setSemesterYear(e.target.value);
    } else {
      setIsNewTenure(false);
      setSemesterYear(e.target.value);
    }
  };

  const updateHandler = async () => {
    closeModal();
    const [semester, year] = splitSemesterString(semesterYear);
    const result = await sendRequest(urls.api.updateMember, "PUT", {
      memberId: id,
      firstName,
      lastName,
      originalEmail: user?.email,
      email,
      phoneNumber,
      preference,
      originalAccess: user?.access,
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
      if (user) {
        const index = users.findIndex((u) => u.id === user.id);
        const tenures = users[index].tenures;
        tenures[semesterYear] = { ...tenures[semesterYear], semester, year, department, role, project, status, notes };
        users[index] = {
          ...users[index],
          firstName,
          lastName,
          email: result.email,
          phoneNumber,
          preference,
          tenures,
          access: Number.parseInt(memberType),
        };
      } else {
        users.push({
          id: result.id,
          firstName,
          lastName,
          email: result.email,
          phoneNumber,
          preference,
          tenures: { [semesterYear]: { semester, year, department, role, project, status, notes } },
          access: Number.parseInt(memberType),
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
        userId={id}
        acccess={user?.access}
        semesterYear={semesterYear}
      />
      <div className={style.editModalContainer} style={animation[isVisible].container} ref={scrollRef}>
        <div className={style.exitButton} onClick={() => closeModal()}>
          &#10006;
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
            {user ? (
              Object.keys(user.tenures)
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

        <div className={`${style.fieldListContainer} ${isAddUser || isNewTenure ? style.fieldListContainerExtended : ""}`}>
          <EditMemberField label="FIRST NAME" type="text" state={firstName} setState={setFirstName} />
          <EditMemberField label="LAST NAME" type="text" state={lastName} setState={setLastName} />
          <EditMemberField
            label="EMAIL"
            type="text"
            state={email}
            onChange={(e) => {
              const newEmail = e.target.value;
              if (isAddUser) {
                const foundUser = userList.find((u) => u.email === newEmail);
                setUser(foundUser);
                if (user && !foundUser) {
                  resetFields();
                }
              }
              setEmail(newEmail);
            }}
          />
          <EditMemberField
            label="PHONE NUMBER"
            type="text"
            state={phoneNumber}
            onChange={(e) => {
              if (/^[0-9]{0,10}$/g.test(e.target.value)) {
                setPhoneNumber(e.target.value);
              }
            }}
          />
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
          {(!isNewTenure || (isAddUser && user?.tenures[semesterYear]?.department)) && (
            <Button className={style.removeButton} onClick={() => setConfirmModal(1)}>
              REMOVE TENURE
            </Button>
          )}
          {(!isAddUser || user) && (
            <Button className={style.removeButton} onClick={() => setConfirmModal(2)}>
              REMOVE MEMBER
            </Button>
          )}
          <div className={style.saveButton} onClick={updateHandler}>
            <img src={Save.src} height={20} width={20} alt="Save Icon" />
            SAVE
          </div>
        </div>
      </div>
    </div>
  );
}
