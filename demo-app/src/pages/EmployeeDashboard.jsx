import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
  Stack,
  Grid,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import CreateRequest from "./CreateRequest";

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

function EmployeeDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

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

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/manpower/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userRequests = (response.data.data || []).filter(
        (req) => req.createdBy && req.createdBy._id === user?.id
      );
      setRequests(userRequests);
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
    fetchRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          background:
            "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          position: "relative",
          overflowX: "hidden",
          overflowY: "auto", // ✅ ให้ scroll ได้แน่นอน
        }}
      >
        {/* Background effects */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(120, 120, 220, 0.15) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(100, 200, 230, 0.15) 0%, transparent 20%)",
            pointerEvents: "none",
          }}
        />

        {/* Navbar */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Employee Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mr: 2 }}>
               {user?.fullName} ({user?.position} - {user?.department})
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Scrollable section */}
        <Box
          sx={{
            mt: 6,
            mb: 8,
            position: "relative",
            zIndex: 1,
            display: "block",
            minHeight: "calc(100vh - 120px)", // Adjust based on navbar height
            overflowY: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ pb: 6, minHeight: "100%", overflowY: "auto" }}>
            <Paper
              sx={{
                p: 4,
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
                bgcolor: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                  <Tab label="MY REQUESTS" />
                  <Tab label="CREATE REQUEST" />
                </Tabs>
              </Box>

              {/* My Requests */}
              {tabValue === 0 && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h5">My Manpower Requests</Typography>
                    <Box>
                      <IconButton onClick={fetchRequests} color="primary" sx={{ mr: 1 }}>
                        <RefreshIcon />
                      </IconButton>
                      <Button variant="contained" onClick={() => setTabValue(1)}>
                        New Request
                      </Button>
                    </Box>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : requests.length === 0 ? (
                    <Box sx={{ textAlign: "center", p: 4 }}>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        No requests found
                      </Typography>
                      <Button variant="contained" onClick={() => setTabValue(1)}>
                        Create Your First Request
                      </Button>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Request No</strong></TableCell>
                            <TableCell><strong>Position</strong></TableCell>
                            <TableCell><strong>Department</strong></TableCell>
                            <TableCell><strong>Quantity</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Request Date</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {requests.map((request) => (
                            <TableRow key={request._id} hover>
                              <TableCell>{request.requestNo || "N/A"}</TableCell>
                              <TableCell>{request.position?.title || "N/A"}</TableCell>
                              <TableCell>{request.department?.name || "N/A"}</TableCell>
                              <TableCell>{request.requestedHeadcount || 0}</TableCell>
                              <TableCell>{request.requestType || "N/A"}</TableCell>
                              <TableCell>{getStatusChip(request.status)}</TableCell>
                              <TableCell>
                                {request.requestDate
                                  ? new Date(request.requestDate).toLocaleDateString("th-TH")
                                  : "N/A"}
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<InfoIcon />}
                                  onClick={() => handleViewDetails(request)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}

              {/* Create Request */}
              {tabValue === 1 && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h5">Create New Manpower Request</Typography>
                    <Button variant="outlined" onClick={() => setTabValue(0)}>
                      Back to Requests
                    </Button>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    width: '100%',
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 300px)'
                  }}>
                    <CreateRequest
                      onFormSubmit={() => {
                        fetchRequests();
                        setTabValue(0);
                      }}
                    />
                  </Box>
                </>
              )}
            </Paper>
          </Container>
        </Box>

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
            sx: { backgroundColor: "rgba(0, 0, 0, 0.85)" },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                <Card elevation={0} sx={{
                  bgcolor: "rgba(144, 202, 249, 0.15)",
                  border: "1px solid rgba(144, 202, 249, 0.3)",
                  backdropFilter: "blur(10px)",
                }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <WorkIcon sx={{ fontSize: 20, color: "primary.main" }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            POSITION
                          </Typography>
                        </Box>
                        <Typography variant="h6">
                          {selectedRequest.position?.title || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BusinessIcon sx={{ fontSize: 20, color: "primary.main" }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            DEPARTMENT
                          </Typography>
                        </Box>
                        <Typography variant="h6">
                          {selectedRequest.department?.name || "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card elevation={0} sx={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  bgcolor: "rgba(255,255,255,0.03)",
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: "primary.main" }}>
                      Request Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption">Request Type</Typography>
                        <Chip
                          label={selectedRequest.requestType || "N/A"}
                          size="small"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption">Employment Type</Typography>
                        <Chip
                          label={selectedRequest.employmentType || "N/A"}
                          size="small"
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption">Headcount</Typography>
                        <Typography variant="h6">
                          {selectedRequest.requestedHeadcount || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption">Request Date</Typography>
                        <Typography variant="body2">
                          {selectedRequest.requestDate
                            ? new Date(selectedRequest.requestDate).toLocaleDateString("th-TH", {
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

                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    bgcolor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DescriptionIcon sx={{ fontSize: 20, color: "primary.main" }} />
                      <Typography variant="subtitle2" sx={{ color: "primary.main" }}>
                        Reason / Justification
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        mt: 1,
                        p: 2,
                        bgcolor: "rgba(0,0,0,0.3)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: "pre-wrap",
                          color: selectedRequest.reason
                            ? "text.primary"
                            : "text.secondary",
                          fontStyle: selectedRequest.reason ? "normal" : "italic",
                        }}
                      >
                        {selectedRequest.reason || "No reason provided"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Stack>
            )}
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseDialog} variant="outlined" size="large">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default EmployeeDashboard;
