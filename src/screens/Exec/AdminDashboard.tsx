import React, {useMemo, useEffect, useState} from "react";
import {Typography, Grid, Stack, Box, styled, alpha, InputBase, Button, MenuItem, Select} from "@mui/material";
import {makeStyles} from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import ScreenGrid from "./ScreenGrid";
import UserTable from "./UserTable";
import Image from "next/image";
import BOG from "../../public/BOG.svg";
import UploadCSVModal from "./UploadCSVModal";
import urls from "../../../utils/urls";
import { sortTenures } from "../../../utils/utilFunctions";

const truncateFilename = (filename) => {
  return filename.length > 15 ? `${filename.slice(0, 12)}...csv` : filename;
};

function AdminDashboardPage() {
  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileBlob, setFileBlob] = useState(null);

  const Search = styled("div")(({theme}) => ({
    position: "relative",
    border: "solid",
    borderColor: "#C4C4C4",
    borderWidth: "1px",
    height: "3rem",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
  }));

  const SearchIconWrapper = styled("div")(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1.35, 1, 1.5, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "21ch",
      },
    },
  }));

  const changeSemesterHandler = (event) => {
    setSemester(event.target.value);
  };

  const uploadAndCloseModal = async () => {
    console.log("fileBlob", fileBlob);
    fetch(urls.base + urls.api.bulkUpload, {
      method: "POST",
      body: fileBlob,
      headers: {
        "Content-Type": "text/csv",
      },
    });
    setShowUploadModal(!showUploadModal);
  };

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
      <UploadCSVModal displayModal={showUploadModal} closeModal={uploadAndCloseModal} setFileUrl={setFileUrl} setFileBlob={setFileBlob} />
      <ScreenGrid>
        <Grid item>
          <Box sx={{display: "flex", alignItems: "center"}} style={{marginBottom: "1.5rem"}}>
            <Box sx={{display: "flex", alignItems: "center", columnGap: 1.5}}>
              <Image
                alt="BOG logo"
                src={BOG}
                width={70}
                height={70}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
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
            <Box sx={{display: "flex", justifySelf: "flex-end", marginLeft: "auto", columnGap: 2}}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search…" inputProps={{"aria-label": "search"}} />
              </Search>
              <Button
                variant="outlined"
                style={{
                  color: "black",
                  fontWeight: "400",
                  height: "3rem",
                  backgroundColor: fileBlob ? "#EAE6FF" : "none",
                }}
                onClick={() => setShowUploadModal(true)}>
                UPLOAD CSV
              </Button>
              <Select
                value={semester}
                MenuProps={{PaperProps:{sx:{maxHeight: 150}}}}
                style={{
                  height: "3rem",
                  width: "9rem",
                  textAlign: "center",
                }}
                onChange={changeSemesterHandler}
              >
                {Array.from(semesters).sort(sortTenures(false)).map((semester) => {
                  return (
                    <MenuItem value={semester} style={{justifyContent: "center"}}>
                      {semester.toUpperCase()}
                    </MenuItem>
                  );
                })
                }
              </Select>
            </Box>
          </Box>
          <div style={{height: "75vh", width: "90vw"}}>
            <UserTable currentSemester={semester} setSemester={setSemester} setSemesters={setSemesters} />
          </div>
        </Grid>
      </ScreenGrid>
    </>
  );
}

export default AdminDashboardPage;
