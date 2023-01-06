import styles from "./Row.module.css";
import React, { useContext } from "react";
import { RowProps } from "./types";
import { TableRow, TableCell } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import DashboardContext from "../../../utils/contexts/DashboardContext";

const Image = React.memo(({ src }) => (
  <img
    src={src}
    alt="User Picture"
    style={{
      pointerEvents: "auto",
      width: "6rem",
      height: "6rem",
      objectFit: "cover",
      borderRadius: "50%",
    }}
  />
));

Image.displayName = "Image";

function Row({ row, currentSemester, onClick }: RowProps) {
  const { id, firstName, lastName, email, phoneNumber, image } = row;
  const { department, role, project, status, notes } = row.tenures[currentSemester];
  const { url } = useContext(DashboardContext);

  const cellStyle = {
    border: "none",
    borderRight: "solid",
    borderBottom: "solid",
    borderWidth: "1px",
    borderColor: "#DCDCDC",
  };

  return (
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
        <Image key={`image_${id}${currentSemester}`} src={image ? url + id : "/Avatar.png"} />
        <div>
          <p className={styles.rowMemberName}>{`${firstName} ${lastName}`}</p>
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
  );
}

export default Row;
