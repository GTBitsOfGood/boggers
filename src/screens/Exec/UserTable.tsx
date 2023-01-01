import React, {useEffect, useState, useMemo} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import PaginationTable, {TColumn} from "./PaginationTable";
import DeleteUserButton from "./DeleteUserButton";
import TableContext from "../../../utils/TableContext";
import {getCurrSemesterYear} from "../../../utils/utilFunctions";

interface AdminDashboardRow {
  key: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  semester: string;
  year: int;
  department: string;
  role: string;
  preference: string;
  project: string;
  notes: any;
  status: string;
}

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  access: {
    type: Number;
    default: 0;
    enum: [0, 1, 2];
  };
  tenures: any;
  preference: string;
  status: string;
  image: string;
  emailVerified: boolean;
}

function UserTable({currentSemester, setSemester, setSemesters, url, filter}) {
  const [userList, setUserList] = useState<IUser[]>([]);

  useEffect(() => {
    fetch("/api/get_users")
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        const {users} = response;
        setUserList(users);

        const semesters = new Set();
        let randomSemester = null;
        users.forEach((user) => {
          user.tenures.forEach((tenure) => {
            semesters.add(`${tenure.semester} ${tenure.year}`);
            if (!randomSemester) {
              randomSemester = `${tenure.semester} ${tenure.year}`;
            }
          });
        });
        setSemesters(semesters);

        let curr = getCurrSemesterYear();
        curr = `${curr.semester} ${curr.year}`;
        setSemester(semesters.has(curr) ? curr : randomSemester);
      });
  }, []);

  const regex = new RegExp(filter, "i");

  const memberRowData: AdminDashboardRow[] = [];
  userList.forEach((member, index) => {
    const {id, tenures, firstName, lastName, email, phoneNumber, preference, image} = member;

    const currentTenure = tenures.find((tenure) => currentSemester === `${tenure.semester} ${tenure.year}`);
    if (!currentTenure || !regex.test(`${firstName} ${lastName}`)) return;
    const {role, notes, department, project, status} = currentTenure;
    memberRowData.push({
      key: `${id}${index}`,
      member: {
        id,
        firstName,
        lastName,
        phoneNumber,
        email,
        image,
      },
      preference,
      notes,
      department,
      role,
      project,
      status,
    });
  });

  const columns: TColumn[] = [
    {id: "member", label: "Member"},
    {id: "department", label: "Department"},
    {id: "role", label: "Role"},
    {id: "project", label: "Project"},
    {id: "status", label: "Status"},
    {id: "notes", label: "Notes"},
  ];

  if (!userList) {
    return (
      <div style={{width: "0", margin: "auto"}}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <TableContext.Provider value={{userList, setUserList}}>
      <PaginationTable rows={memberRowData} columns={columns} currentSemester={currentSemester} url={url} />
    </TableContext.Provider>
  );
}

export default UserTable;
