import React, { useEffect, useState, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import PaginationTable from "./PaginationTable";
import DeleteUserButton from "./DeleteUserButton";
import TableContext from "../../../utils/contexts/TableContext";
import { getCurrSemesterYear } from "../../../utils/utilFunctions";
import { DBUser, User } from "./types";
import sendRequest from "../../../utils/sendToBackend";

function UserTable({ currentSemester, newMembers, clearNewMembers, setSemester, semesters, setSemesters, filter }) {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const response = await sendRequest("/api/get_users", "GET");
      const { users } = response;

      const semesters = new Set();
      let randomSemester = null;
      users.forEach((user: DBUser) => {
        user.tenures = user.tenures.reduce((tenures, tenure) => {
          const semesterYear = `${tenure.semester} ${tenure.year}`;
          semesters.add(semesterYear);
          tenures[semesterYear] = tenure;
          if (!randomSemester) {
            randomSemester = semesterYear;
          }
          return tenures;
        }, {});
      });
      setUserList(users);
      setSemesters(semesters);

      let curr = getCurrSemesterYear();
      curr = `${curr.semester} ${curr.year}`;
      setSemester(semesters.has(curr) ? curr : randomSemester);
    })();
  }, []);

  useEffect(() => {
    if (newMembers) {
      const newUserList: User[] = JSON.parse(JSON.stringify(userList));

      const newSemesters = new Set(semesters);
      newMembers.forEach((user: DBUser) => {
        user.tenures = user.tenures.reduce((tenures, tenure) => {
          const semesterYear = `${tenure.semester} ${tenure.year}`;
          tenures[semesterYear] = tenure;
          newSemesters.add(semesterYear);
          return tenures;
        }, {});

        const index = newUserList.findIndex((u) => user.id === u.id);
        if (index === -1) {
          newUserList.push(user);
        } else {
          newUserList[index] = user;
        }
      });
      clearNewMembers();
      setUserList(newUserList);
      setSemesters(newSemesters);
    }
  }, [newMembers]);

  const regex = new RegExp(filter, "i");
  const users = useMemo(() => {
    return userList
      .filter((user) => {
        return regex.test(`${user.firstName} ${user.lastName}`);
      })
      .sort((a, b) => {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      });
  }, [userList, filter]);

  const rows = users.filter((user) => !!user.tenures[currentSemester]);

  if (!userList) {
    return (
      <div style={{ width: "0", margin: "auto" }}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <TableContext.Provider value={{ userList, setUserList }}>
      <PaginationTable rows={rows} currentSemester={currentSemester} />
    </TableContext.Provider>
  );
}

export default UserTable;
