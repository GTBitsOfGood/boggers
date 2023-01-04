import styles from "./EditMemberField.module.css";
import { styled, Typography, Select, MenuItem, TextField } from "@mui/material";

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

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    height: "27px",
  },
  "& .MuiSelect-outlined > div": {
    maxWidth: "17ch",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export default function EditMemberField({ label, type, state, setState, onChange, menu, keyFunc=(key)=>key }) {
  onChange = onChange || ((e) => setState(e.target.value));

  return (
    <div style={{ margin: "0px 10px" }}>
      <Label label={label} />
      {type === "select" ? (
        <StyledSelect
          className={styles.select}
          size="small"
          value={state}
          onChange={onChange}>
          {menu.map((key) => (
            <MenuItem className={styles.menuItem} key={keyFunc(key)} value={key}>
              <div className={`${styles.menuItemText} ${state === key ? styles.selected : styles.unselected}`}>{keyFunc(key)}</div>
            </MenuItem>
          ))}
        </StyledSelect>
      ) : (
        <TextField
          size="small"
          type={type}
          inputProps={{ style: { fontFamily: "Poppins" } }}
          style={{ width: "100%" }}
          sx={{ "& .MuiInputBase-input": { height: "27px" } }}
          value={state}
          onChange={onChange}
        />
      )}
    </div>
  );
}
