import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpenseTrends from "./ExpenseTrends";
import apiRequest from "../lib/apiRequest";

interface Column {
  id: "category" | "amount" | "currency" | "dateSpent" | "actions";
  label: string;
  minWidth?: number;
  align?: "center";
}

const columns: readonly Column[] = [
  { id: "category", label: "Expense category", minWidth: 170 },
  { id: "amount", label: "Amount", minWidth: 100, align: "center" },
  { id: "currency", label: "Currency", minWidth: 100, align: "center" },
  {
    id: "dateSpent",
    label: "Date Received",
    minWidth: 170,
    align: "center",
  },
  { id: "actions", label: "Actions", minWidth: 170, align: "center" },
];

interface Data {
  _id: string;
  category: string;
  amount: number;
  currency: string;
  dateSpent: string; // Date should be in YYYY-MM-DD format
}

// function createData(
//   source: string,
//   amount: number,
//   currency: string,
//   dateReceived: string
// ): Data {
//   return { source, amount, currency, dateReceived };
// }

// const initialRows = [
//   createData("Rent", 5000, "€", "2024-10-01"),
//   createData("Food", 1500, "$", "2024-09-25"),
//   createData("Entertainment", 2000, "€", "2024-09-15"),
// ];

export default function Expenses() {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterMonth, setFilterMonth] = React.useState<string>("");
  // New state to manage table vs dummy text visibility
  const [showTable, setShowTable] = React.useState(true);
  // Dialog state
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [editData, setEditData] = React.useState<Data | null>(null);
  const [newData, setNewData] = React.useState<Data>({
    _id: "",
    category: "",
    amount: 0,
    currency: "",
    dateSpent: "", // Default date
  });
  React.useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await apiRequest.get("/expense/");
        const data = Array.isArray(response.data) ? response.data : [];
        setRows(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);
  React.useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await apiRequest.get("/expense/");
        const data = Array.isArray(response.data) ? response.data : [];
        setRows(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
    setNewData({
      _id: "",
      category: "",
      amount: 0,
      currency: "",
      dateSpent: "",
    });
  };

  const handleAddSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (newData.dateSpent > today) {
      alert("Date spent cannot be in the future.");
      return;
    }
    if (newData.amount <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }

    try {
      const response = await apiRequest.post("/expense/", newData);
      const addedExpense = response.data;
      setRows([...rows, addedExpense]);
      handleAddClose();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  const handleEditSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (editIndex !== null && editData) {
      if (editData.dateSpent > today) {
        alert("Date spent cannot be in the future.");
        return;
      }
      if (editData.amount <= 0) {
        alert("Amount must be greater than zero.");
        return;
      }

      try {
        const response = await apiRequest.put(
          `/expense/${editData._id}`,
          editData
        );
        const updatedExpense = response.data;

        const updatedRows = rows.map((row, index) =>
          index === editIndex ? updatedExpense : row
        );
        setRows(updatedRows);
        handleEditClose();
      } catch (error) {
        console.error("Error updating expense:", error);
        alert("Failed to update expense. Please try again.");
      }
    }
    handleEditClose();
  };

  const handleEditOpen = (index: number) => {
    setEditIndex(index);
    setEditData(rows[index]);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setEditData(null);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (confirmDelete) {
      try {
        const response = await apiRequest.delete(`/expense/${id}`);
        if (response.status === 200) {
          setRows((prevRows) => prevRows.filter((row) => row._id !== id));
        } else {
          alert("Failed to delete expense. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense. Please try again.");
      }
    }
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFilterMonth(event.target.value);
  };

  const handleFieldChange =
    (field: keyof Data) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (editData) {
        setEditData({
          ...editData,
          [field]: event.target.value,
        });
      }
    };

  const handleNewFieldChange =
    (field: keyof Data) => (event: React.ChangeEvent<HTMLInputElement>) => {
      // console.log(event.target.value);
      setNewData({
        ...newData,
        [field]:
          field === "amount"
            ? parseFloat(event.target.value)
            : event.target.value,
      });
    };

  const filteredRows = filterMonth
    ? rows.filter((row) => {
        const rowDate = new Date(row.dateSpent);
        const filterDate = new Date(filterMonth);
        return (
          rowDate.getFullYear() === filterDate.getFullYear() &&
          rowDate.getMonth() === filterDate.getMonth()
        );
      })
    : rows;

  // Calculate total income by currency
  const totalIncomeByCurrency = filteredRows.reduce((acc, row) => {
    if (!acc[row.currency]) {
      acc[row.currency] = 0;
    }
    acc[row.currency] += row.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Toggle function for showing the income table or dummy text
  const toggleTable = () => {
    setShowTable((prev) => !prev);
  };
  return (
    <Box sx={{}}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Button size="medium" onClick={toggleTable}>
          {showTable ? "Expense Trends" : "Expense Table"}
        </Button>
      </Box>
      {showTable ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <TextField
              type="month"
              label="Filter by Month"
              onChange={handleFilterChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                my: 3,
                maxWidth: "120px",
              }}
            />
            {/* Display Total Income by Currency */}
            <Box sx={{ width: "120px" }}>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                Total Expense
              </Typography>
              <Divider />
              <ul
                style={{
                  listStyleType: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 0,
                }}
              >
                {Object.entries(totalIncomeByCurrency).map(
                  ([currency, total]) => (
                    <li key={currency}>
                      {total.toLocaleString()} {currency}
                    </li>
                  )
                )}
              </ul>
            </Box>
            <IconButton
              color="primary"
              onClick={handleAddOpen}
              title="Add Expense"
            >
              <AddCircleIcon fontSize="large" />
            </IconButton>
          </Box>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          {columns.map((column) => {
                            const value = row[column.id as keyof Data];
                            if (column.id === "actions") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <Grid container>
                                    <Grid size={{ xs: 6 }}>
                                      <IconButton
                                        color="secondary"
                                        onClick={() => handleEditOpen(index)}
                                        title="Edit"
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                      <IconButton
                                        color="error"
                                        onClick={() => handleDelete(row._id)}
                                        title="Delete"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.id === "dateSpent"
                                  ? new Date(value).toLocaleDateString()
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </>
      ) : (
        <ExpenseTrends />
      )}
      {/* Add Income Dialog */}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Expense category"
            fullWidth
            onChange={handleNewFieldChange("category")}
            value={newData.category}
            sx={{ my: 2 }}
          >
            {["Rent", "Food", "Entertainment"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            label="Amount"
            fullWidth
            onChange={handleNewFieldChange("amount")}
            value={newData.amount}
            sx={{ mb: 2 }}
            InputProps={{
              inputProps: { min: 0 },
            }}
          />
          <TextField
            select
            label="Currency"
            fullWidth
            onChange={handleNewFieldChange("currency")}
            value={newData.currency}
            sx={{ mb: 2 }}
          >
            {["€", "$"].map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="date"
            label="Date Received"
            fullWidth
            onChange={handleNewFieldChange("dateSpent")}
            value={newData.dateSpent}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddSubmit}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Income Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Income</DialogTitle>
        <DialogContent>
          {editData && (
            <>
              <TextField
                select
                label="Expense category"
                fullWidth
                onChange={handleFieldChange("category")}
                value={editData.category}
                sx={{ my: 2 }}
              >
                {["Rent", "Food", "Entertainment"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="number"
                label="Amount"
                fullWidth
                onChange={handleFieldChange("amount")}
                value={editData.amount}
                sx={{ mb: 2 }}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
              <TextField
                select
                label="Currency"
                fullWidth
                onChange={handleFieldChange("currency")}
                value={editData.currency}
                sx={{ mb: 2 }}
              >
                {["€", "$"].map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                label="Date Received"
                fullWidth
                onChange={handleFieldChange("dateSpent")}
                value={editData.dateSpent}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
