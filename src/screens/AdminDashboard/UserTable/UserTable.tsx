import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import PaginationTable from "./PaginationTable/PaginationTable";
import TableContext from "../../../contexts/TableContext";
import { User } from "../types";
import sendRequest from "../../../server/utils/sendToBackend";

function UserTable({ currentSemester, newMembers, roleFilter, departmentFilter, filter }) {
  const [userList, setUserList] = useState<User[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [userListLength, setUserListLength] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await sendRequest(
        `/api/get_users?query=${filter}&department=${departmentFilter}&role=${roleFilter}` +
          `&semester=${currentSemester.split(" ")[0]}&year=${currentSemester.split(" ")[1]}&rowsPerPage=${rowsPerPage}&page=${page}`,
        "GET",
      );
      const { users } = response;
      setUserList(users);
    })();
  }, [roleFilter, currentSemester, newMembers, departmentFilter, filter, rowsPerPage, page]);

  useEffect(() => {
    (async () => {
      const response = await sendRequest(
        `/api/get_users?query=${filter}&department=${departmentFilter}&role=${roleFilter}` +
          `&semester=${currentSemester.split(" ")[0]}&year=${currentSemester.split(" ")[1]}&rowsPerPage=${1000}&page=${0}`,
        "GET",
      );
      const { users } = response;

      setUserListLength(users.length);
    })();
  }, [roleFilter, currentSemester, newMembers, departmentFilter, filter]);

  if (!userList) {
    return (
      <div style={{ width: "0", margin: "auto" }}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <TableContext.Provider value={{ userList, setUserList }}>
      <PaginationTable
        rows={userList}
        currentSemester={currentSemester}
        setRowsPerPage={setRowsPerPage}
        rowsPerPage={rowsPerPage || 10}
        setPage={setPage}
        page={page || 0}
        userListLength={userListLength || 0}
      />
    </TableContext.Provider>
  );
}

export default UserTable;
