import React, { useState, useEffect } from "react";
import { Typography, Grid, Box, styled, alpha, InputBase, Button, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import UserTable from "./UserTable/UserTable";
import Image from "next/image";
import UploadCSVModal from "./UploadCSVModal/UploadCSVModal";
import urls from "../../server/utils/urls";
import sendRequest from "../../server/utils/sendToBackend";
import { sortTenures } from "../../server/utils/memberFunctions";
import DashboardContext from "../../contexts/DashboardContext";
import Router from "next/router";
import { signOut } from "next-auth/react";
import fields from "../../server/utils/fields";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: "solid",
  borderColor: "#C4C4C4",
  borderWidth: "2px",
  height: "3rem",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    fontFamily: "Poppins",
    padding: theme.spacing(1.35, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "21ch",
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: "black",
  border: "solid",
  borderColor: "#C4C4C4",
  borderWidth: "2px",
  fontFamily: "Poppins",
  fontSize: "16px",
  fontWeight: "400",
  height: "3rem",
  width: theme.width,
  "&:hover": {
    backgroundColor: "#EAE6FF",
    borderColor: "#473F91",
  },
}));

const StyledSelect = styled(Select)(() => ({
  color: "black",
  fontFamily: "Poppins",
  fontSize: "16px",
  fontWeight: "400",
  height: "3rem",
  transition: "0.2s ease-out",
  width: "10rem",
  outline: "none",
  textAlign: "center",
  "&:hover": {
    backgroundColor: "#EAE6FF",
  },
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      border: "2px solid #c4c4c4",
    },
    "&:hover fieldset": {
      borderColor: "#473F91",
    },
  },
}));

function AdminDashboardPage({ url }) {
  const [semester, setSemester] = useState("All");
  const [department, setDepartment] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const [filter, setFilter] = useState("");
  const [isAddUser, setIsAddUser] = useState(false);
  const [newMembers, setNewMembers] = useState(null);
  const [role, setRole] = useState("All");

  const semesters = fields.semesterOptions;
  const roles = fields.roles;

  const departments = fields.departments;

  const changeSemesterHandler = (event) => {
    setSemester(event.target.value);
  };

  const changeDepartmentHandler = (event) => {
    setDepartment(event.target.value);
  };

  const changeRoleHandler = (event) => {
    setRole(event.target.value);
  };

  const bulkUpload = async () => {
    const res = await sendRequest(urls.api.bulkUpload, "POST", fileBlob, { "Content-Type": "text/csv" }, false);
    setNewMembers(res.members);
    setFileBlob(null);
  };

  useEffect(() => {
    if (fileBlob) {
      bulkUpload();
    }
  }, [fileBlob]);

  return (
    <>
      {showUploadModal ? (
        <div
          style={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            backgroundColor: "black",
            opacity: "30%",
            zIndex: 3,
          }}
          onClick={() => setShowUploadModal(false)}
        />
      ) : null}
      <UploadCSVModal displayModal={showUploadModal} closeModal={() => setShowUploadModal(false)} setFileBlob={setFileBlob} />
      <Grid container height="100vh" justifyContent="center" alignItems="center" flexDirection="column">
        <Grid item>
          <Box sx={{ display: "flex", alignItems: "center" }} style={{ marginBottom: "1.5rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1.5 }}>
              <Image
                alt="BOG logo"
                src="/BOG.svg"
                width={70}
                height={70}
                style={{ cursor: "pointer" }}
                onClick={() => Router.push(urls.pages.member)}
              />
              <Typography
                variant="h2"
                style={{
                  fontFamily: "Poppins",
                  color: "#333333",
                  fontSize: "2.2rem",
                  fontWeight: "500",
                }}>
                Members
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifySelf: "flex-end", alignItems: "center", marginLeft: "auto", columnGap: 2 }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search by name/email/phone number"
                  value={filter}
                  inputProps={{ "aria-label": "search" }}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </Search>
              <StyledButton theme={{ width: "8rem" }} onClick={() => setIsAddUser(true)}>
                ADD MEMBER
              </StyledButton>
              <StyledButton theme={{ width: "8rem" }} onClick={() => setShowUploadModal(true)}>
                UPLOAD CSV
              </StyledButton>
              <StyledSelect
                value={semester}
                onChange={changeSemesterHandler}
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
                {Array.from(semesters)
                  .sort(sortTenures(false))
                  .map((semester) => {
                    return (
                      <MenuItem key={semester} value={semester} style={{ justifyContent: "center", fontFamily: "Poppins" }}>
                        {semester.toUpperCase()}
                      </MenuItem>
                    );
                  })}
              </StyledSelect>
              <StyledSelect
                value={department}
                onChange={changeDepartmentHandler}
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
                {Array.from(departments)
                  .sort()
                  .map((department) => {
                    return (
                      <MenuItem key={department} value={department} style={{ justifyContent: "center", fontFamily: "Poppins" }}>
                        {department.toUpperCase()}
                      </MenuItem>
                    );
                  })}
              </StyledSelect>
              <StyledSelect
                value={role}
                onChange={changeRoleHandler}
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
                {Array.from(roles)
                  .sort()
                  .map((role) => {
                    return (
                      <MenuItem key={role} value={role} style={{ justifyContent: "center", fontFamily: "Poppins" }}>
                        {role.toUpperCase()}
                      </MenuItem>
                    );
                  })}
              </StyledSelect>
              <LogoutIcon style={{ width: "2rem", height: "2rem", cursor: "pointer" }} onClick={() => signOut()} />
            </Box>
          </Box>
          <div style={{ height: "78vh", width: "90vw" }}>
            <DashboardContext.Provider value={{ url, isAddUser, setIsAddUser }}>
              <UserTable
                filter={filter}
                currentSemester={semester}
                newMembers={newMembers}
                roleFilter={role}
                departmentFilter={department}
              />
            </DashboardContext.Provider>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

AdminDashboardPage.title = "Admin Dashboard | Boggers";

export default AdminDashboardPage;
