import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import PaginationTable from "./PaginationTable/PaginationTable";
import TableContext from "../../../contexts/TableContext";
import { User } from "../types";
import sendRequest from "../../../server/utils/sendToBackend";

function UserTable({ currentSemester, newMembers, roleFilter, departmentFilter }) {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const response = await sendRequest(
        `/api/get_users?department=${departmentFilter}&role=${roleFilter}` +
          `&semester=${currentSemester.split(" ")[0]}&year=${currentSemester.split(" ")[1]}`,
        "GET",
      );
      const { users } = response;
      setUserList(users);
    })();
  }, [roleFilter, currentSemester, newMembers, departmentFilter]);

  if (!userList) {
    return (
      <div style={{ width: "0", margin: "auto" }}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <TableContext.Provider value={{ userList, setUserList }}>
      <PaginationTable rows={userList} currentSemester={currentSemester} />
    </TableContext.Provider>
  );
}

export default UserTable;
