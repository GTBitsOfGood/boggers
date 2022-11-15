import React, {useEffect, useState, useMemo} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {PaginationTable, TColumn} from "./PaginationTable";
import DeleteUserButton from "./DeleteUserButton";
import {bool} from "aws-sdk/clients/redshiftdata";

interface AdminDashboardRow {
  key: string;
  member: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  department: string;
  role: string;
  preference: string;
  project: string;
  notes: any;
  status: string;
}

interface IUser {
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
}

function UserTable({currentSemester}) {
  const [userList, setUserList] = useState<IUser[]>([]);

  useEffect(() => {
    fetch("/api/get_users")
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        const {users} = response;
        setUserList(users);
      });
  }, [currentSemester]);

  const rowData = useMemo(() => {
    const memberRowData: AdminDashboardRow[] = [];
    userList.forEach((member, index) => {
      const {tenures, firstName, lastName, email, phoneNumber, preference} = member;

      const currentTenure = tenures.find((tenure) => currentSemester.toLowerCase() === `${tenure.semester} ${tenure.year}`.toLowerCase());
      if (!currentTenure) return;
      const {role, notes, department, project, status} = currentTenure;
      memberRowData.push({
        key: `${index}`,
        member: {
          firstName,
          lastName,
          phoneNumber,
          email,
        },
        preference,
        notes,
        department,
        role,
        project,
        status,
      });
    });
    return memberRowData;
  }, [userList]);

  const columns: TColumn[] = [
    {id: "member", label: "Member"},
    {id: "department", label: "Department"},
    {id: "role", label: "Role"},
    {id: "project", label: "Project"},
    {id: "status", label: "Status"},
    {id: "notes", label: "Notes"},
  ];

  const removeUser = (user: IUser) => {
    setUserList(userList.filter((entry: IUser) => entry && entry.email && entry.email !== user.email));
  };

  if (!userList) {
    return (
      <div style={{width: "0", margin: "auto"}}>
        <CircularProgress size={80} />
      </div>
    );
  }
  // return <PaginationTable rows={userList.map((user: IUser, index) => createAdminDashboardRow(user, index))} columns={columns} />;
  return <PaginationTable rows={rowData} columns={columns} currentSemester={currentSemester} />;
}

export default UserTable;
