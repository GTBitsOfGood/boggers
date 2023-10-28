import React from "react";

const DashboardContext = React.createContext({
  url: "",
  isAddUser: false,
  setIsAddUser: () => {},
});

export default DashboardContext;
