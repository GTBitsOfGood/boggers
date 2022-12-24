import React, {useEffect, useState} from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@mui/material";
import EditMemberModal from "./EditMemberModal";
import styles from "./PaginationTable.module.css";

interface TableProps {
  rows: TRow[];
  columns: TColumn[];
  currentSemester: any;
}

interface RowProps {
  row: TRow;
  columns: TColumn[];
  onClick: any;
}

interface TColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center" | "justify" | "inherit";
}

interface TRow {
  key: string;
  [key: string]: any;
}

function Row({row, columns, onClick}: RowProps) {
  const {key, member, department, role, preference, project, notes, status} = row;
  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={`${row.key}TR`} onClick={onClick}>
      <TableCell key={`member_${key}`} align="left">
        <p className={styles.rowMemberName}>{`${member.firstName} ${member.lastName}`}</p>
        <p className={styles.rowEmail}>{member.email}</p>
        <p className={styles.rowPhoneNumber}>{member.phoneNumber}</p>
      </TableCell>
      <TableCell key={`department_${key}`} align="center">
        <div className={styles.orangeHighlight}>
          <p>{department}</p>
        </div>
      </TableCell>
      <TableCell key={`role_${key}`} align="center">
        <div className={styles.orangeHighlight}>
          <p>{department}</p>
        </div>
      </TableCell>
      <TableCell key={`project_${key}`} align="center">
        <div className={styles.orangeHighlight}>
          <p>{project}</p>
        </div>
      </TableCell>
      <TableCell key={`status_${key}`} align="center">
        <div className={status === "Active" ? styles.greenHighlight : styles.redHighlight}>
          <p>{status}</p>
        </div>
      </TableCell>
      <TableCell key={`notes_${key}`} align="center">
        <p>{notes}</p>
      </TableCell>
    </TableRow>
  );
}

function PaginationTable({rows, columns, currentSemester}: TableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function headerStyle(column) {
    if (column.label !== "Notes") {
      return {
        minWidth: column.minWidth,
        border: "hidden",
        borderRight: "solid",
        borderWidth: "1px",
        borderColor: "#DCDCDC",
        backgroundColor: "#EEEEEE",
        color: "#727474",
      };
    } else {
      return {
        minWidth: column.minWidth,
        backgroundColor: "#EEEEEE",
        color: "#727474",
      };
    }
  }

  const showModalHandler = (row) => {
    setSelectedRow(row);
  };

  return (
    <>
      {selectedRow && <EditMemberModal setShowModal={() => setSelectedRow(null)} row={selectedRow} currentSemester={currentSemester} />}
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}>
        <TableContainer className={styles.TableContainer} sx={{flexGrow: 1, flexShrink: 1}}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || "center"} style={headerStyle(column)}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return <Row row={row} key={row.key} columns={columns} onClick={(event) => showModalHandler(row)} />;
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
          sx={{flexShrink: 0, flexGrow: 0}}
        />
      </Paper>
    </>
  );
}

export {PaginationTable};
export type {TRow, TColumn};
