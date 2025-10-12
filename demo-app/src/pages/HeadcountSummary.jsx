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

function HeadcountSummary() {
  const { user, logout } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

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

  useEffect(() => {
    fetchDepartments();
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          width: "100vw",
          height: "100vh",
          overflowY: "auto",
          bgcolor: "#0a192f",
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
              Headcount Summary
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
                Headcount Summary
              </Typography>
              <IconButton onClick={fetchDepartments} color="primary">
                <RefreshIcon />
              </IconButton>
            </Box>

            {departmentsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : departments.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", p: 3 }}>
                No department data available
              </Typography>
            ) : (
              <TableContainer sx={{ maxHeight: 400, overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Department Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Organization Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Max Headcount</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Current Headcount</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept._id}>
                        <TableCell>{dept.name || "N/A"}</TableCell>
                        <TableCell>{dept.organization?.name }</TableCell>
                        <TableCell>{dept.maxHeadcount ?? "-"}</TableCell>
                        <TableCell>{dept.currentHeadcount ?? "-"}</TableCell>
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
      </Box>
    </ThemeProvider>
  );
}

export default HeadcountSummary;
