import React, { useState, useEffect } from "react";
import { Typography, Grid, Box, styled, alpha, InputBase, Button, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UserTable from "./UserTable";
import Image from "next/image";
import UploadCSVModal from "./UploadCSVModal";
import urls from "../../../utils/urls";
import sendRequest from "../../../utils/sendToBackend";
import { sortTenures } from "../../../utils/utilFunctions";
import DashboardContext from "../../../utils/contexts/DashboardContext";

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
  border: "1px solid #C4C4C4",
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
    borderColor: "#473F91",
  },
}));

AdminDashboardPage.title = "Admin Dashboard";

function AdminDashboardPage({ url }) {
  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const [filter, setFilter] = useState("");
  const [isAddUser, setIsAddUser] = useState(false);
  const [newMembers, setNewMembers] = useState(null);

  const changeSemesterHandler = (event) => {
    setSemester(event.target.value);
  };

  const bulkUpload = async () => {
    console.log("fileBlob", fileBlob);
    const res = await sendRequest(urls.api.bulkUpload, "POST", fileBlob, { "Content-Type": "text/csv" }, false);
    console.log(res);
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
              <Image alt="BOG logo" src="/BOG.svg" width={70} height={70} />
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
            <Box sx={{ display: "flex", justifySelf: "flex-end", marginLeft: "auto", columnGap: 2 }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
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
            </Box>
          </Box>
          <div style={{ height: "75vh", width: "90vw" }}>
            <DashboardContext.Provider value={{ url, isAddUser, setIsAddUser, setSemester, semesters, setSemesters }}>
              <UserTable
                currentSemester={semester}
                newMembers={newMembers}
                clearNewMembers={() => setNewMembers(null)}
                semesters={semesters}
                setSemester={setSemester}
                setSemesters={setSemesters}
                filter={filter}
              />
            </DashboardContext.Provider>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default AdminDashboardPage;
