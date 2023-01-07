import styles from "./EditMemberField.module.css";
import { useState, useEffect } from "react";
import { styled, Typography, Select, MenuItem, TextField } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

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

const StyledSelect = styled(Select)(() => ({
  "& .MuiSelect-select": {
    height: "27px",
  },
  "& .MuiSelect-outlined > div": {
    maxWidth: "17ch",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export default function EditMemberField({
  label,
  type,
  state,
  setState,
  onChange,
  menu,
  keyFunc = (key) => key,
  isError,
  errorMessage = "Cannot be empty",
}) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isError);
  }, [isError]);

  const changeHandler = (e) => {
    setError(false);
    if (onChange) {
      onChange(e);
    } else {
      setState(e.target.value);
    }
  };

  return (
    <div style={{ margin: "0px 10px" }}>
      <Label label={label} />
      {type === "select" ? (
        <FormControl error={error} style={{ width: "100%" }}>
          <StyledSelect className={styles.select} size="small" value={state} onChange={changeHandler}>
            {menu.map((key) => (
              <MenuItem className={styles.menuItem} key={keyFunc(key)} value={key}>
                <div className={`${styles.menuItemText} ${state === key ? styles.selected : styles.unselected}`}>{keyFunc(key)}</div>
              </MenuItem>
            ))}
          </StyledSelect>
          <FormHelperText>{error ? errorMessage : ""}</FormHelperText>
        </FormControl>
      ) : (
        <TextField
          size="small"
          error={error}
          type={type}
          inputProps={{ style: { fontFamily: "Poppins" } }}
          style={{ width: "100%" }}
          sx={{ "& .MuiInputBase-input": { height: "27px" } }}
          value={state}
          onChange={changeHandler}
          helperText={error ? errorMessage : ""}
        />
      )}
    </div>
  );
}
