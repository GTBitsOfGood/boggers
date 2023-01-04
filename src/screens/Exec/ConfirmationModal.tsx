import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import urls from "../../../utils/urls";
import sendRequest from "../../../utils/sendToBackend";
import TableContext from "../../../utils/contexts/TableContext";
import DashboardContext from "../../../utils/contexts/DashboardContext";
import { sortTenures, splitSemesterString } from "../../../utils/utilFunctions";

interface IConfirmModal {
  isOpen: boolean;
  handleCancel: Function;
  handleConfirm: Function;
  userId: string;
  semesterYear: string;
}

export default function ConfirmationModal({ confirmModal, handleCancel, handleConfirm, userId, semesterYear }: IConfirmModal) {
  const { userList, setUserList } = useContext(TableContext);
  const { setSemester, semesters, setSemesters } = useContext(DashboardContext);
  const [semester, year] = splitSemesterString(semesterYear);
  
  const mapping = {
    1: {
      lower: "tenure",
      upper: "Tenure",
      route: urls.api.deleteTenure,
      data: { id: userId, semester, year },
      newUserList: (() => {
        const newUserList = JSON.parse(JSON.stringify(userList));
        const user = newUserList.find((user) => user.id === userId);
        if (user) delete user.tenures[semesterYear];
        return newUserList;
      })(),
      semestersAffected: [semesterYear],
    },
    2: {
      lower: "user",
      upper: "User",
      route: urls.api.deleteUser,
      data: { id: userId },
      newUserList: userList.filter((user) => user.id !== userId),
      semestersAffected: Object.keys(userList.find((user) => user.id === userId)?.tenures || {}),
    },
  };

  const deleteUser = async () => {
    handleConfirm();
    const res = await sendRequest(mapping[confirmModal].route, "DELETE", mapping[confirmModal].data);
    if (res.success) {
      setUserList(mapping[confirmModal].newUserList);

      const newSemesters = new Set(semesters);
      mapping[confirmModal].semestersAffected.forEach((semesterYear) => {
        if (!mapping[confirmModal].newUserList.reduce((found, user) => found || !!user.tenures[semesterYear], false)) {
          newSemesters.delete(semesterYear);
        }
      });
      setSemesters(newSemesters);
      if (!newSemesters.has(semesterYear)) {
        setSemester(Array.from(newSemesters).sort(sortTenures(false))[0]);
      }
    }
  };

  return (
    <div>
      <Dialog aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" open={confirmModal !== 0}>
        <DialogTitle id="alert-dialog-title">Are you sure you want to remove this {mapping[confirmModal]?.lower}?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is permanent. {mapping[confirmModal]?.upper} information will not be able to be recovered.
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
