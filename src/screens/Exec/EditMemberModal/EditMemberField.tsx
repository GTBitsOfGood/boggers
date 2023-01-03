import styles from "./EditMemberField.module.css";
import { Typography, Select, MenuItem, TextField } from "@mui/material";

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

export default function EditMemberField({ label, state, type, onChange, menu }) {
  return (
    <div className={styles.fieldContainer}>
      <Label label={label} />
      {type === "select" ? (
        <Select size="small" style={{ width: "100%", fontFamily: "Poppins" }} value={state} onChange={onChange}>
          {menu.map((key) => (
            <MenuItem key={key} value={key} style={{ fontFamily: "Poppins" }}>
              {key}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          size="small"
          type={type}
          inputProps={{ style: { fontFamily: "Poppins" } }}
          style={{ width: "100%" }}
          value={state}
          onChange={onChange}
        />
      )}
    </div>
  );
}
