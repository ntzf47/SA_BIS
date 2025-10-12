import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress,
  IconButton,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#f48fb1" },
    background: {
      default: "#002547db",
      paper: "rgba(255, 255, 255, 0.05)",
    },
  },
});

function ManageEmployee() {
  const { user, logout } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [changeDepartmentDialogOpen, setChangeDepartmentDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeForDepartmentChange, setSelectedEmployeeForDepartmentChange] = useState(null);
  const [newDepartmentId, setNewDepartmentId] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    department: "",
    position: "",
    employmentType: "Permanent",
    hireDate: "",
  });
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentMaxHeadcount, setNewDepartmentMaxHeadcount] = useState(0);

  const [isCreatePositionModalOpen, setIsCreatePositionModalOpen] = useState(false);
  const [newPositionTitle, setNewPositionTitle] = useState('');
  const [selectedDepartmentForPosition, setSelectedDepartmentForPosition] = useState('');

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/hr/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load employees", "error");
    } finally {
      setEmployeesLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleChangeDepartmentClick = (employee) => {
    setSelectedEmployeeForDepartmentChange(employee);
    setNewDepartmentId(employee.department?._id || ""); // Pre-fill with current department
    setChangeDepartmentDialogOpen(true);
  };

  const addEmployee = async () => {
    try {
      await axios.post(`${API_BASE_URL}/hr/employees`, newEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "Employee added successfully", "success");
      setAddDialogOpen(false);
      fetchEmployees();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to add employee",
        "error"
      );
    }
  };

  const updateEmployeePosition = async () => {
    try {
      await axios.patch(
        `${API_BASE_URL}/hr/employees/${selectedEmployee._id}`,
        { position: selectedEmployee.position },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", "Position updated successfully", "success");
      setEditDialogOpen(false);
      fetchEmployees();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update position",
        "error"
      );
    }
  };

  const changeEmployeeDepartment = async () => {
    try {
      await axios.patch(
        `${API_BASE_URL}/hr/employees/${selectedEmployeeForDepartmentChange._id}/change-department`,
        { department: newDepartmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", "Department updated successfully", "success");
      setChangeDepartmentDialogOpen(false);
      fetchEmployees();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update department",
        "error"
      );
    }
  };

  // Functions for Create Department
  const openCreateDepartmentModal = () => setIsCreateDepartmentModalOpen(true);
  const closeCreateDepartmentModal = () => {
    setIsCreateDepartmentModalOpen(false);
    setNewDepartmentName('');
    setNewDepartmentMaxHeadcount(0);
  };
  const handleNewDepartmentNameChange = (e) => setNewDepartmentName(e.target.value);
  const handleNewDepartmentMaxHeadcountChange = (e) => setNewDepartmentMaxHeadcount(Number(e.target.value));

  const createDepartment = async () => {
    try {
      await axios.post(`${API_BASE_URL}/masters/departments`, {
        name: newDepartmentName,
        maxHeadcount: newDepartmentMaxHeadcount,
        organization: '68d9305348fa0b9c29c6fec5' // Hardcoded organization ID
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "Department created successfully", "success");
      closeCreateDepartmentModal();
      fetchDepartments(); // Refresh departments list
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to create department",
        "error"
      );
    }
  };

  // Functions for Create Position
  const openCreatePositionModal = () => setIsCreatePositionModalOpen(true);
  const closeCreatePositionModal = () => {
    setIsCreatePositionModalOpen(false);
    setNewPositionTitle('');
    setSelectedDepartmentForPosition(''); // Reset selected department
  };
  const handleNewPositionTitleChange = (e) => setNewPositionTitle(e.target.value);

  const createPosition = async () => {
    try {
      await axios.post(`${API_BASE_URL}/masters/positions`, {
        title: newPositionTitle,
        department: selectedDepartmentForPosition // Link position to selected department
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "Position created successfully", "success");
      closeCreatePositionModal();
      fetchPositions(); // Refresh positions list
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to create position",
        "error"
      );
    }
  };

  const deleteEmployee = async (employeeId, employeeName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${employeeName}? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/hr/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted! ", "Employee has been deleted.", "success");
        fetchEmployees();
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to delete employee",
          "error"
        );
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/masters/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      Swal.fire({
        icon: "error",
        title: "Error Loading Departments",
        text: error.response?.data?.message || "Failed to load departments",
        confirmButtonColor: "#f48fb1",
      });
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/masters/positions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPositions(res.data.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load positions", "error");
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchDepartments();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#90caf9",
      cancelButtonColor: "#f48fb1",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been logged out successfully",
          confirmButtonColor: "#90caf9",
          timer: 1500,
        });
      }
    });
  };

  const filterSelectMenuProps = {
    MenuProps: {
      PaperProps: {
        sx: {
          bgcolor: '#000',
          color: '#fff'
        }
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          width: "100vw",
          height: "100vh",
          overflowY: "auto",
          background: 'linear-gradient(135deg, #1e3c72, #2a5298, #2c3e50)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(120, 120, 220, 0.15) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(100, 200, 230, 0.15) 0%, transparent 20%)',
            pointerEvents: 'none',
          }}
        />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Manage Employee
            </Typography>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {user?.fullName || user?.username}
              {user?.position && user?.department && ` (${user.position} - ${user.department})`}
              {user?.position && !user?.department && ` (${user.position})`}
              {!user?.position && user?.department && ` (${user.department})`}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper
            sx={{
              p: 3,
              mb: 4,
              bgcolor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                Manage Employees
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                  onClick={() => setAddDialogOpen(true)}
                >
                  Add Employee
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mr: 2 }}
                  onClick={openCreateDepartmentModal}
                >
                  Create Department
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mr: 2 }}
                  onClick={openCreatePositionModal}
                >
                  Create Position
                </Button>
                <IconButton onClick={fetchEmployees} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>

            {employeesLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : employees.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", p: 3 }}>
                No employee data available
              </Typography>
            ) : (
              <TableContainer
                sx={{
                  maxHeight: 400,
                  overflowY: "auto",
                  display: "block",
                  width: "100%",
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-thumb': { background: '#222', borderRadius: '4px' },
                  background: "rgba(0,0,0,0.1)"
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Firstname</strong></TableCell>
                      <TableCell><strong>Lastname</strong></TableCell>
                      <TableCell><strong>Department</strong></TableCell>
                      <TableCell><strong>Position</strong></TableCell>
                      <TableCell><strong>Employment Type</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp._id}>
                        <TableCell>{emp._id}</TableCell>
                        <TableCell>{emp.firstName || "-"}</TableCell>
                        <TableCell>{emp.lastName || "-"}</TableCell>
                        <TableCell>{emp.department?.name || "-"}</TableCell>
                        <TableCell>{emp.position?.title || "-"}</TableCell>
                        <TableCell>{emp.employmentType || "-"}</TableCell>
                                        <td>
                                            <button onClick={() => handleEdit(emp)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                                            <button onClick={() => handleChangeDepartmentClick(emp)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Change Dept</button>
                                            <button onClick={() => deleteEmployee(emp._id, emp.fullName)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                                        </td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
          <Button component={Link} to="/dashboard" variant="contained" color="primary">
            Back to Dashboard
          </Button>
        </Container>

        {/* Add Employee Dialog */}
        <Dialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: "#23284d",
              backgroundImage: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            },
          }}
        >
          <DialogTitle>Add Employee</DialogTitle>
          <DialogContent>
            <TextField
              label="Firstname"
              fullWidth
              margin="normal"
              value={newEmployee.firstName}
              onChange={e => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
            />
            <TextField
              label="Lastname"
              fullWidth
              margin="normal"
              value={newEmployee.lastName}
              onChange={e => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
            />
            <FormControl
              fullWidth
              margin="normal"
              size="small"
              sx={{ mb: 2 }}
            >
              <InputLabel>Department</InputLabel>
              <Select
                value={newEmployee.department}
                onChange={e =>
                  setNewEmployee({ ...newEmployee, department: e.target.value })
                }
                label="Department"
                {...filterSelectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Department</em>
                </MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              size="small"
              sx={{ mb: 2 }}
            >
              <InputLabel>Position</InputLabel>
              <Select
                value={newEmployee.position}
                onChange={e =>
                  setNewEmployee({ ...newEmployee, position: e.target.value })
                }
                label="Position"
                {...filterSelectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Position</em>
                </MenuItem>
                {positions.map(pos => (
                  <MenuItem key={pos._id} value={pos._id}>
                    {pos.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              size="small"
              sx={{ mb: 2 }}
            >
              <InputLabel>Employment Type</InputLabel>
              <Select
                value={newEmployee.employmentType}
                onChange={e =>
                  setNewEmployee({ ...newEmployee, employmentType: e.target.value })
                }
                label="Employment Type"
                {...filterSelectMenuProps}
              >
                <MenuItem value="Permanent">Permanent</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Intern">Intern</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Hire Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={newEmployee.hireDate}
              onChange={e => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={addEmployee} variant="contained" color="primary">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Employee Position Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: "#23284d",
              backgroundImage: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            },
          }}
        >
          <DialogTitle>Change Position</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Position</InputLabel>
              <Select
                value={selectedEmployee?.position || ""}
                onChange={e =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    position: e.target.value
                  })
                }
                label="Position"
                {...filterSelectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Position</em>
                </MenuItem>
                {positions.map(pos => (
                  <MenuItem key={pos._id} value={pos._id}>
                    {pos.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={updateEmployeePosition}
              variant="contained"
              color="primary"
              disabled={!selectedEmployee?.position}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Change Department Dialog */}
        <Dialog
          open={changeDepartmentDialogOpen}
          onClose={() => setChangeDepartmentDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: "#23284d",
              backgroundImage: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            },
          }}
        >
          <DialogTitle>Change Department for {selectedEmployeeForDepartmentChange?.fullName}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>New Department</InputLabel>
              <Select
                value={newDepartmentId}
                onChange={e => setNewDepartmentId(e.target.value)}
                label="New Department"
                {...filterSelectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Department</em>
                </MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangeDepartmentDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={changeEmployeeDepartment}
              variant="contained"
              color="primary"
              disabled={!newDepartmentId || newDepartmentId === selectedEmployeeForDepartmentChange?.department?._id}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Department Dialog */}
        <Dialog
          open={isCreateDepartmentModalOpen}
          onClose={closeCreateDepartmentModal}
          PaperProps={{
            sx: {
              bgcolor: "#23284d",
              backgroundImage: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            },
          }}
        >
          <DialogTitle>Create New Department</DialogTitle>
          <DialogContent>
            <TextField
              label="Department Name"
              fullWidth
              margin="normal"
              value={newDepartmentName}
              onChange={handleNewDepartmentNameChange}
            />
            <TextField
              label="Max Headcount"
              type="number"
              fullWidth
              margin="normal"
              value={newDepartmentMaxHeadcount}
              onChange={handleNewDepartmentMaxHeadcountChange}
              inputProps={{ min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCreateDepartmentModal}>Cancel</Button>
            <Button onClick={createDepartment} variant="contained" color="primary">Create</Button>
          </DialogActions>
        </Dialog>

        {/* Create Position Dialog */}
        <Dialog
          open={isCreatePositionModalOpen}
          onClose={closeCreatePositionModal}
          PaperProps={{
            sx: {
              bgcolor: "#23284d",
              backgroundImage: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            },
          }}
        >
          <DialogTitle>Create New Position</DialogTitle>
          <DialogContent>
            <FormControl
              fullWidth
              margin="normal"
              size="small"
              sx={{ mb: 2 }}
            >
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartmentForPosition}
                onChange={e => setSelectedDepartmentForPosition(e.target.value)}
                label="Department"
                {...filterSelectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Department</em>
                </MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Position Title"
              fullWidth
              margin="normal"
              value={newPositionTitle}
              onChange={handleNewPositionTitleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCreatePositionModal}>Cancel</Button>
            <Button onClick={createPosition} variant="contained" color="primary" disabled={!selectedDepartmentForPosition || !newPositionTitle}>Create</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default ManageEmployee;
