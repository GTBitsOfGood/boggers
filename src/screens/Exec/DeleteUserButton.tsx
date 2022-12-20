import React, {useState} from "react";
import Button from "@mui/material/Button";
import {deleteData} from "./api";
import LoadingButton from "./LoadingButton";
import ConfirmationModal from "./ConfirmationModal";

interface DeleteUserButtonProps {
  email: string;
  removeRow: (user: string) => void;
}

function DeleteUserButton({email, removeRow}: DeleteUserButtonProps) {
  const [isLoading, setLoading] = useState(false);
  async function handleDelete() {
    setLoading(true);
    if (await deleteData(email)) {
      removeRow(email);
    } else {
      setLoading(false);
    }
  }
  if (isLoading) {
    return <LoadingButton />;
  }
  return (
    <ConfirmationModal
      buttonText="Remove User"
      title="Are you sure you want to remove this user?"
      body="This action is permanent. User information will not be able to be recovered."
      onConfirm={() => handleDelete()}
    />
  );
}

export default DeleteUserButton;
