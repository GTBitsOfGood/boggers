import styles from "./Row.module.css";
import React, { useContext } from "react";
import { RowProps } from "../../../types";
import { TableRow, TableCell } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import DashboardContext from "../../../../../contexts/DashboardContext";

function Row({ row, currentSemester, onClick }: RowProps) {
  const { id, firstName, lastName, email, phoneNumber, image, emailVerified } = row;
  const { department, role, project, status, notes } = !!row.tenures[currentSemester] && row.tenures[currentSemester];
  const { url } = useContext(DashboardContext);

  const cellStyle = {
    border: "none",
    borderRight: "solid",
    borderBottom: "solid",
    borderWidth: "1px",
    borderColor: "#DCDCDC",
  };

  return (
    <>
      {!!row.tenures[currentSemester] && (
        <TableRow hover role="checkbox" tabIndex={-1} key={`${id}${currentSemester}TR`} onClick={onClick}>
          <TableCell
            key={`member_${id}${currentSemester}`}
            align="left"
            style={{
              ...cellStyle,
              display: "flex",
              alignItems: "center",
              columnGap: "1.5rem",
            }}>
            {
              // eslint-disable-next-line @next/next/no-img-element
            }
            <img key={`image_${id}${currentSemester}`} src={image ? url + id : "/Avatar.png"} height={50} width={50} />
            <div>
              <p className={styles.rowMemberName}>{`${firstName} ${lastName}${emailVerified ? "" : "*"}`}</p>
              <p className={styles.rowEmail}>{email}</p>
              <p className={styles.rowPhoneNumber}>{phoneNumber}</p>
            </div>
          </TableCell>
          <TableCell key={`department_${id}`} align="center" style={cellStyle}>
            <div className={styles.orangeHighlight}>
              <p>{department}</p>
            </div>
          </TableCell>
          <TableCell key={`role_${id}`} align="center" style={cellStyle}>
            <div className={styles.orangeHighlight}>
              <p>{role}</p>
            </div>
          </TableCell>
          <TableCell key={`project_${id}`} align="center" style={cellStyle}>
            <div className={styles.orangeHighlight}>
              <p>{project}</p>
            </div>
          </TableCell>
          <TableCell key={`status_${id}`} align="center" style={cellStyle}>
            <div className={status === "Active" ? styles.greenHighlight : styles.redHighlight}>
              <p>{status}</p>
            </div>
          </TableCell>
          <TableCell key={`notes_${id}`} align="center" style={{ ...cellStyle, borderRight: "none" }}>
            {notes ? <ChatBubbleOutlineRoundedIcon style={{ color: "#657788" }} /> : null}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default Row;
