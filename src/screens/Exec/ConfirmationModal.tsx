import React, {useContext} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import urls from "../../../utils/urls";
import sendRequest from "../../../utils/sendToBackend";
import TableContext from "../../../utils/TableContext";

interface IConfirmModal {
  isOpen: boolen;
  handleCancel: Function;
  handleConfirm: Function;
  userId: string;
}

export default function ConfirmationModal({isOpen, handleCancel, handleConfirm, userId}: IConfirmModal) {
  const {userList, setUserList} = useContext(TableContext);

  const deleteUser = async () => {
    handleConfirm();
    const res = await sendRequest(urls.api.deleteUser, "DELETE", {id: userId});
    if (res.success) {
      setUserList(userList.filter((user) => user.id !== userId));
    }
  };

  return (
    <div>
      <Dialog aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" open={isOpen}>
        <DialogTitle id="alert-dialog-title">Are you sure you want to remove this user?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is permanent. User information will not be able to be recovered.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button autoFocus onClick={deleteUser}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
