import React, { useEffect, useState, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import PaginationTable from "./PaginationTable/PaginationTable";
import TableContext from "../../../contexts/TableContext";
import { getCurrSemesterYear, sortTenures } from "../../../server/utils/memberFunctions";
import { DBUser, User } from "../types";
import sendRequest from "../../../server/utils/sendToBackend";

function UserTable({ currentSemester, newMembers, clearNewMembers, setSemester, semesters, setSemesters, filter }) {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const response = await sendRequest("/api/get_users", "GET");
      const { users } = response;

      const semesters = new Set();
      users.forEach((user: DBUser) => {
        user.tenures = user.tenures.reduce((tenures, tenure) => {
          const semesterYear = `${tenure.semester} ${tenure.year}`;
          semesters.add(semesterYear);
          tenures[semesterYear] = tenure;
          return tenures;
        }, {});
      });
      setUserList(users);
      setSemesters(semesters);

      if (semesters.size !== 0) {
        let curr = getCurrSemesterYear();
        curr = `${curr.semester} ${curr.year}`;
        setSemester(semesters.has(curr) ? curr : Array.from(semesters).sort(sortTenures(false))[0]);
      }
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
      if (!currentSemester) {
        setSemester(Array.from(newSemesters).sort(sortTenures(false))[0]);
      }
    }
  }, [newMembers]);

  const regex = useMemo(() => new RegExp(filter, "i"), [filter]);
  const users = useMemo(() => {
    return userList
      .filter((user) => {
        return regex.test(`${user.firstName} ${user.lastName}`);
      })
      .sort((a, b) => {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      });
  }, [userList, regex]);

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
