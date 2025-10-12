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
  Chip,
  CircularProgress,
  IconButton,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Card,
  CardContent,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
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

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    position: "",
    department: "",
    requestType: "",
    status: "",
  });
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    department: "",
    position: "",
    employmentType: "Permanent",
    hireDate: "",
  });

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

  const fetchDepartments = async () => {
    setDepartmentsLoading(true);
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
    } finally {
      setDepartmentsLoading(false);
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

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/manpower/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load requests";
      Swal.fire({
        icon: "error",
        title: "Error Loading Requests",
        text: errorMessage,
        confirmButtonColor: "#f48fb1",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions(); // เพิ่มตรงนี้
    fetchRequests();
    fetchDepartments();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MenuProps to force black background for opened listboxes
  const filterSelectMenuProps = {
    MenuProps: {
      PaperProps: {
        sx: {
          bgcolor: "#ffffffff",
          color: "#fff",
        },
      },
    },
  };

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

  const handleApprove = async (requestNo) => {
    try {
      const result = await Swal.fire({
        title: "Approve Request?",
        text: "Do you want to approve this request?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4caf50",
        cancelButtonColor: "#f48fb1",
        confirmButtonText: "Yes, approve it",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await axios.post(
          `${API_BASE_URL}/manpower/requests/${requestNo}/approve`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Approved!",
          text: "Request has been approved",
          confirmButtonColor: "#90caf9",
          timer: 1500,
        });
        fetchRequests();
      }
    } catch (error) {
      console.error("Error approving request:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to approve request",
        confirmButtonColor: "#f48fb1",
      });
    }
  };

  const handleReject = async (requestNo) => {
    try {
      const result = await Swal.fire({
        title: "Reject Request?",
        text: "Please provide a reason for rejection",
        input: "textarea",
        inputPlaceholder: "Enter reason for rejection...",
        inputAttributes: {
          "aria-label": "Enter reason for rejection",
        },
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f44336",
        cancelButtonColor: "#90caf9",
        confirmButtonText: "Yes, reject it",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "You need to provide a reason for rejection!";
          }
        },
      });

      if (result.isConfirmed) {
        await axios.post(
          `${API_BASE_URL}/manpower/requests/${requestNo}/reject`,
          {
            comment: result.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: "Request has been rejected",
          confirmButtonColor: "#90caf9",
          timer: 1500,
        });
        fetchRequests();
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to reject request",
        confirmButtonColor: "#f48fb1",
      });
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      Draft: { color: "default", label: "Draft" },
      WaitingApproval: { color: "warning", label: "Waiting Approval" },
      Approved: { color: "success", label: "Approved" },
      Rejected: { color: "error", label: "Rejected" },
      Cancelled: { color: "default", label: "Cancelled" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      position: "",
      department: "",
      requestType: "",
      status: "",
    });
  };

  // Filter requests based on selected filters
  const filteredRequests = requests.filter((request) => {
    if (filters.position && request.position?._id !== filters.position)
      return false;
    if (filters.department && request.department?._id !== filters.department)
      return false;
    if (filters.requestType && request.requestType !== filters.requestType)
      return false;
    if (filters.status && request.status !== filters.status) return false;
    return true;
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          width: "100vw",
          height: "100vh",
          overflowY: "auto",
          background: 'linear-gradient(135deg, #1a2a6c, #2c3e50, #4a235a)',
          position: 'relative'
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
              Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {user?.fullName} ({user?.position} - {user?.department})
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" component="h2">
                Manpower Requests
              </Typography>
              <Box>
                <Button
                  component={Link}
                  to="/manage-employee"
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Manage Employees
                </Button>
                <Button
                  component={Link}
                  to="/headcount-summary"
                  variant="contained"
                  color="secondary"
                  sx={{ mr: 2 }}
                >
                  Headcount Summary
                </Button>
                <Button
                  component={Link}
                  to="/manpower-plan"
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Manpower Plan
                </Button>
                <IconButton onClick={fetchRequests} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Filter Section */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                bgcolor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <FilterListIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filters
                </Typography>
                <Chip
                  label={`${filteredRequests.length} of ${requests.length}`}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <FormControl
                  size="small"
                  sx={{ 
                    minWidth: 200, 
                    flex: "1 1 200px", 
                    maxWidth: 250,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff'
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={filters.position}
                    onChange={(e) =>
                      handleFilterChange("position", e.target.value)
                    }
                    label="Position"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: 'rgb(30, 40, 50)',
                          '& .MuiMenuItem-root': {
                            color: '#ffffff',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>All Positions</em>
                    </MenuItem>
                    {positions.map((pos) => (
                      <MenuItem key={pos._id} value={pos._id}>
                        {pos.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  size="small"
                  sx={{ 
                    minWidth: 200, 
                    flex: "1 1 200px", 
                    maxWidth: 250,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff'
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.department}
                    onChange={(e) =>
                      handleFilterChange("department", e.target.value)
                    }
                    label="Department"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: 'rgb(30, 40, 50)',
                          '& .MuiMenuItem-root': {
                            color: '#ffffff',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>All Departments</em>
                    </MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  size="small"
                  sx={{ 
                    minWidth: 180, 
                    flex: "1 1 180px", 
                    maxWidth: 220,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff'
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <InputLabel>Request Type</InputLabel>
                  <Select
                    value={filters.requestType}
                    onChange={(e) =>
                      handleFilterChange("requestType", e.target.value)
                    }
                    label="Request Type"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: 'rgb(30, 40, 50)',
                          '& .MuiMenuItem-root': {
                            color: '#ffffff',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>All Types</em>
                    </MenuItem>
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Replacement">Replacement</MenuItem>
                    <MenuItem value="Project">Project</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  size="small"
                  sx={{ 
                    minWidth: 180, 
                    flex: "1 1 180px", 
                    maxWidth: 220,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff'
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    label="Status"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: 'rgb(30, 40, 50)',
                          '& .MuiMenuItem-root': {
                            color: '#ffffff',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>All Status</em>
                    </MenuItem>
                    <MenuItem value="WaitingApproval">
                      Waiting Approval
                    </MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                  sx={{
                    height: "40px",
                    minWidth: 120,
                    px: 3,
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Paper>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredRequests.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", p: 4 }}>
                {requests.length === 0
                  ? "No requests found"
                  : "No requests match the selected filters"}
              </Typography>
            ) : (
              <TableContainer sx={{ maxHeight: 600, overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: "rgba(26, 31, 55, 0.95)" }}>
                        <strong>Request No</strong>
                      </TableCell>
                      <TableCell sx={{ bgcolor: "rgba(26, 31, 55, 0.95)" }}>
                        <strong>Position</strong>
                      </TableCell>
                      <TableCell sx={{ bgcolor: "rgba(26, 31, 55, 0.95)" }}>
                        <strong>Department</strong>
                      </TableCell>
                      <TableCell sx={{ bgcolor: "rgba(26, 31, 55, 0.95)" }}>
                        <strong>Quantity</strong>
                      </TableCell>
                      <TableCell sx={{ bgcolor: "rgba(26, 31, 55, 0.95)" }}>
                        <strong>Type</strong>
                      </TableCell>
                      <TableCell sx={{ bgcolor: "rgba(26, 31, 55, 0.95)" }}>
                        <strong>Reason</strong>
                      </TableCell>
                      <TableCell sx={{ bgcolor: "rgba(26, 31, 55, 0.95)" }}>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ bgcolor: "rgba(26, 31, 55, 0.95)" }}
                      >
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request._id} hover>
                        <TableCell>{request.requestNo || "N/A"}</TableCell>
                        <TableCell>
                          {request.position?.title || "N/A"}
                        </TableCell>
                        <TableCell>
                          {request.department?.name || "N/A"}
                        </TableCell>
                        <TableCell>{request.requestedHeadcount || 0}</TableCell>
                        <TableCell>{request.requestType || "N/A"}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {request.reason || "No reason provided"}
                          </Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(request.status)}</TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<InfoIcon />}
                              onClick={() => handleViewDetails(request)}
                            >
                              View
                            </Button>
                            {request.status === "WaitingApproval" && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() =>
                                    handleApprove(request.requestNo)
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  startIcon={<CancelIcon />}
                                  onClick={() =>
                                    handleReject(request.requestNo)
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>

        {/* Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: "#1a1f37",
              backgroundImage: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.85)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Request Details
              </Typography>
              {selectedRequest && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRequest.requestNo}
                  </Typography>
                  {getStatusChip(selectedRequest.status)}
                </Box>
              )}
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            {selectedRequest && (
              <Stack spacing={2.5}>
                {/* Header Card */}
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: "rgba(144, 202, 249, 0.15)",
                    border: "1px solid rgba(144, 202, 249, 0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <WorkIcon
                            sx={{ fontSize: 20, color: "primary.main" }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 600 }}
                          >
                            POSITION
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {selectedRequest.position?.title || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <BusinessIcon
                            sx={{ fontSize: 20, color: "primary.main" }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 600 }}
                          >
                            DEPARTMENT
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {selectedRequest.department?.name || "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Request Information */}
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
                    >
                      Request Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          Request Type
                        </Typography>
                        <Chip
                          label={selectedRequest.requestType || "N/A"}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          Employment Type
                        </Typography>
                        <Chip
                          label={selectedRequest.employmentType || "N/A"}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            display: "flex",

                            alignItems: "center",
                            gap: 0.5,
                            mb: 0.5,
                          }}
                        >
                          <PeopleIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Headcount
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {selectedRequest.requestedHeadcount || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mb: 0.5,
                          }}
                        >
                          <CalendarTodayIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Request Date
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {selectedRequest.requestDate
                            ? new Date(
                                selectedRequest.requestDate
                              ).toLocaleDateString("th-TH", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Reason Card */}
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <DescriptionIcon
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        Reason / Justification
                      </Typography>
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.7,
                          whiteSpace: "pre-wrap",
                          color: selectedRequest.reason
                            ? "text.primary"
                            : "text.secondary",
                          fontStyle: selectedRequest.reason
                            ? "normal"
                            : "italic",
                        }}
                      >
                        {selectedRequest.reason || "No reason provided"}
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>

                {/* Created By */}
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon
                        sx={{ fontSize: 20, color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Created By
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ mt: 0.5, fontWeight: 500 }}
                    >
                      {selectedRequest.createdBy?.employee?.fullName || selectedRequest.createdBy?.username || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            )}
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            {selectedRequest &&
              selectedRequest.status === "WaitingApproval" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => {
                      handleCloseDialog();
                      handleApprove(selectedRequest.requestNo);
                    }}
                    sx={{ minWidth: 120 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      handleCloseDialog();
                      handleReject(selectedRequest.requestNo);
                    }}
                    sx={{ minWidth: 120 }}
                  >
                    Reject
                  </Button>
                </>
              )}
            <Button onClick={handleCloseDialog} variant="outlined" size="large">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Employee Dialog */}
        <Dialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: "#23284d", // สีทึบ ไม่โปร่งใส
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
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, firstName: e.target.value })
              }
            />
            <TextField
              label="Lastname"
              fullWidth
              margin="normal"
              value={newEmployee.lastName}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, lastName: e.target.value })
              }
            />
            {/* เพิ่ม Select สำหรับ department และ position ตามที่มีข้อมูล */}
            <FormControl fullWidth margin="normal" size="small" sx={{ mb: 2 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={newEmployee.department}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, department: e.target.value })
                }
                label="Department"
                {...filterSelectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Department</em>
                </MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" size="small" sx={{ mb: 2 }}>
              <InputLabel>Position</InputLabel>
              <Select
                value={newEmployee.position}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, position: e.target.value })
                }
                label="Position"
                {...filterSelectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Position</em>
                </MenuItem>
                {positions.map((pos) => (
                  <MenuItem key={pos._id} value={pos._id}>
                    {pos.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" size="small" sx={{ mb: 2 }}>
              <InputLabel>Employment Type</InputLabel>
              <Select
                value={newEmployee.employmentType}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    employmentType: e.target.value,
                  })
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
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, hireDate: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={addEmployee} variant="contained" color="primary">
              Add
            </Button>
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
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    position: e.target.value,
                  })
                }
                label="Position"
                {...filterSelectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Position</em>
                </MenuItem>
                {positions.map((pos) => (
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
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
