import React from "react";

const DashboardContext = React.createContext({
  url: "",
  isAddUser: false,
  setIsAddUser: () => {},
  setSemester: () => {},
  semesters: new Set(),
  setSemesters: () => {},
});

export default DashboardContext;
