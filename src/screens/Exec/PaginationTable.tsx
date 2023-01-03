import React, { useEffect, useState, useContext, useRef } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import EditMemberModal from "./EditMemberModal";
import styles from "./PaginationTable.module.css";
import { baseAwsUrl } from "../../../utils/awsConfig";
import Row from "./Row";
import { TColumn, TableProps } from "./types";
import DashboardContext from "../../../utils/contexts/DashboardContext";

const columns: TColumn[] = [
  { id: "member", label: "Member" },
  { id: "department", label: "Department" },
  { id: "role", label: "Role" },
  { id: "project", label: "Project" },
  { id: "status", label: "Status" },
  { id: "notes", label: "Notes" },
];

function PaginationTable({ rows, currentSemester }: TableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { isAddUser, setIsAddUser } = useContext(DashboardContext);
  const tableRef = useRef(null);

  useEffect(() => {
    setPage(0);
    tableRef.current.scrollTop = 0;
  }, [currentSemester]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    tableRef.current.scrollTop = 0;
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(event.target.value);
    setPage(0);
    tableRef.current.scrollTop = 0;
  };

  function headerStyle(column) {
    let style = {
      minWidth: column.minWidth,
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
          if (isAddUser) setIsAddUser(false)
          else setSelectedRow(null)
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
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <Row
                    currentSemester={currentSemester}
                    row={row}
                    key={row.id}
                    columns={columns}
                    onClick={(event) => showModalHandler(row)}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
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
