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
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

function ManpowerPlan() {
  const { user, logout } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  
  const [formData, setFormData] = useState({
    department: '',
    position: '',
    year: new Date().getFullYear(),
    plannedHeadcount: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    fetchPlans();
    fetchDepartments();
    fetchPositions();
  }, [token]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/hr/manpower-plans`);
      setPlans(res.data.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load manpower plans", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/masters/departments`);
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/masters/positions`);
      setPositions(res.data.data || []);
    } catch (err) {
      console.error("Error fetching positions:", err);
    }
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setIsEditMode(true);
      setSelectedPlan(plan);
      setFormData({
        department: plan.department?._id || '',
        position: plan.position?._id || '',
        year: plan.year,
        plannedHeadcount: plan.plannedHeadcount,
      });
    } else {
      setIsEditMode(false);
      setSelectedPlan(null);
      setFormData({
        department: '',
        position: '',
        year: new Date().getFullYear(),
        plannedHeadcount: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/hr/manpower-plans/${selectedPlan._id}`, formData);
        Swal.fire("Success", "Manpower plan updated successfully", "success");
      } else {
        await axios.post(`${API_BASE_URL}/hr/manpower-plans`, formData);
        Swal.fire("Success", "Manpower plan added successfully", "success");
      }
      fetchPlans();
      handleCloseDialog();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save plan", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/hr/manpower-plans/${id}`);
          Swal.fire(
            'Deleted!',
            'Manpower plan has been deleted.',
            'success'
          )
          fetchPlans();
        } catch (err) {
          Swal.fire("Error", err.response?.data?.message || "Failed to delete plan", "error");
        }
      }
    })
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Manpower Plan
            </Typography>
            <Typography variant="body1" sx={{ mr: 2, ml: 2 }}>
              Welcome, {user?.fullName} ({user?.position} - {user?.department})
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" component="h2">
                Manage Manpower Plans
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Add Plan
                </Button>
                <IconButton onClick={fetchPlans} color="primary" sx={{ ml: 2 }}>
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Year</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Planned Headcount</TableCell>
                      <TableCell>Current Headcount</TableCell>
                      <TableCell>Variance</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {plans.map((plan) => (
                      <TableRow key={plan._id}>
                        <TableCell>{plan.year}</TableCell>
                        <TableCell>{plan.department?.name || "N/A"}</TableCell>
                        <TableCell>{plan.position?.title || "N/A"}</TableCell>
                        <TableCell>{plan.plannedHeadcount}</TableCell>
                        <TableCell>{plan.department?.currentHeadcount || 0}</TableCell>
                        <TableCell>{plan.plannedHeadcount - (plan.department?.currentHeadcount || 0)}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleOpenDialog(plan)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(plan._id)} color="secondary">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>

        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2, mb: 4 }}>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            sx={{
              backgroundColor: '#90CAF9',
              color: 'black',
              '&:hover': {
                backgroundColor: '#64B5F6'
              },
              textTransform: 'none',
              fontSize: '1rem',
              py: 1,
              px: 4
            }}
          >
            BACK TO DASHBOARD
          </Button>
        </Container>

        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: "#1e3c72",
              color: "white"
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {isEditMode ? "Edit Manpower Plan" : "Add Manpower Plan"}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                label="Department"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#1e3c72',
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2a4d8f'
                        }
                      }
                    }
                  }
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Position</InputLabel>
              <Select
                name="position"
                value={formData.position}
                onChange={handleFormChange}
                label="Position"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#1e3c72',
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2a4d8f'
                        }
                      }
                    }
                  }
                }}
              >
                {positions.map((pos) => (
                  <MenuItem key={pos._id} value={pos._id}>{pos.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="year"
              label="Year"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.year}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="plannedHeadcount"
              label="Planned Headcount"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.plannedHeadcount}
              onChange={handleFormChange}
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">{isEditMode ? "Save" : "Add"}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default ManpowerPlan;
