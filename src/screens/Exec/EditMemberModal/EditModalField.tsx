import React from "react";
import {TextField, Select, Typography, MenuItem} from "@mui/material";

enum FieldType {
  MultiSelect,
  Select,
  Text,
  Email,
  LargeText,
}

export default function EditModalField({label, value, type}) {
  const getInputField = () => {
    if (type === FieldType.Text) {
      return <TextField></TextField>;
    } else if (type === FieldType.Select) {
      return <Select value={}></Select>;
    }
  };

  return (
    <div>
      <Typography
        variant="h2"
        style={{
          fontFamily: "Poppins",
          color: "#333333",
          fontSize: "2.2rem",
          fontWeight: "500",
          marginRight: "0.8rem",
        }}>
        {label}
      </Typography>
      {}
    </div>
  );
}

export {FieldType};
