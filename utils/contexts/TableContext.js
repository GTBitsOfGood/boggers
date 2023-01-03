import React from "react";

const TableContext = React.createContext({
  userList: [],
  setUserList: () => {},
});

export default TableContext;
