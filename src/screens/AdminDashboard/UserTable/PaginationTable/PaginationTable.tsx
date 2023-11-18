import React, { useEffect, useState, useContext, useRef } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import EditMemberModal from "./EditMemberModal/EditMemberModal";
import styles from "./PaginationTable.module.css";
import Row from "./Row/Row";
import { TColumn, TableProps } from "../../types";
import DashboardContext from "../../../../contexts/DashboardContext";

const columns: TColumn[] = [
  { id: "member", label: "Member", width: "28%" },
  { id: "department", label: "Department", width: "15%" },
  { id: "role", label: "Role", width: "20%" },
  { id: "project", label: "Project", width: "19%" },
  { id: "status", label: "Status", width: "10%" },
  { id: "notes", label: "Notes", width: "8%" },
];

function PaginationTable({ rows, currentSemester, setRowsPerPage, rowsPerPage, setPage, page, userListLength }: TableProps) {
  const [selectedRow, setSelectedRow] = useState(null);
  const { isAddUser, setIsAddUser } = useContext(DashboardContext);
  const tableRef = useRef(null);

  useEffect(() => {
    setPage(0);
    tableRef.current.scrollTop = 0;
  }, [currentSemester, setPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    tableRef.current.scrollTop = 0;
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(event.target.value);
    tableRef.current.scrollTop = 0;
  };

  function headerStyle(column) {
    let style = {
      minWidth: column.minWidth,
      width: column.width,
      borderBottom: "none",
      backgroundColor: "#EEEEEE",
      color: "#727474",
      fontSize: "20px",
      fontWeight: 400,
    };

    if (column.label !== "Notes") {
      style = { ...style, border: "none", borderRight: "solid", borderBottom: "solid", borderWidth: "1px", borderColor: "#DCDCDC" };
    }
    return style;
  }

  const showModalHandler = (row) => {
    setSelectedRow(row);
  };

  return (
    <>
      <EditMemberModal
        isVisible={!!selectedRow || isAddUser}
        closeModal={() => {
          if (isAddUser) setIsAddUser(false);
          else setSelectedRow(null);
        }}
        row={selectedRow}
        currentSemester={currentSemester}
      />
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}>
        <TableContainer className={styles.TableContainer} sx={{ flexGrow: 1, flexShrink: 1 }} ref={tableRef}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || "center"} style={headerStyle(column)}>
                    {column.label.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <Row currentSemester={currentSemester} row={row} key={row.id} columns={columns} onClick={() => showModalHandler(row)} />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={userListLength}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ flexShrink: 0, flexGrow: 0 }}
        />
      </Paper>
    </>
  );
}

export default PaginationTable;
