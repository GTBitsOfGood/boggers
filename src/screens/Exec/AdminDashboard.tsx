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

const truncateFilename = (filename) => {
  return filename.length > 15 ? `${filename.slice(0, 12)}...csv` : filename;
};

function AdminDashboardPage() {
  const [semester, setSemester] = useState("FALL 2022");
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
        width: "20ch",
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
      <UploadCSVModal displayModal={showUploadModal} closeModal={uploadAndCloseModal} setFileUrl={setFileUrl} setFileBlob={setFileBlob} />
      <ScreenGrid>
        <Grid item>
          <Box sx={{display: "flex"}} style={{marginBottom: "1rem"}}>
            <Box sx={{display: "flex", columnGap: 1}}>
              <Image
                alt="BOG logo"
                src={BOG}
                width={50}
                height={30}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  marginTop: "0.1rem",
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
                style={{
                  height: "3rem",
                }}
                onChange={changeSemesterHandler}>
                <MenuItem value={"FALL 2022"}>FALL 2022</MenuItem>
                <MenuItem value={"SPRING 2022"}>SPRING 2022</MenuItem>
                <MenuItem value={"FALL 2021"}>FALL 2021</MenuItem>
                // TODO: un-hardcode this
              </Select>
            </Box>
          </Box>
          <div style={{height: "75vh", width: "80vw"}}>
            <UserTable currentSemester={semester} />
          </div>
        </Grid>
      </ScreenGrid>
    </>
  );
}

export default AdminDashboardPage;