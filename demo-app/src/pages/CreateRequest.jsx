import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Divider,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00bcd4" },
    secondary: { main: "#9c27b0" },
    background: {
      default: "#0a192f",
      paper: "rgba(255, 255, 255, 0.08)",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h4: { fontWeight: 700, color: "#fff" },
    body1: { color: "#e0e0e0" },
  },
});

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: "16px",
  backgroundColor: "rgba(255,255,255,0.07)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  backdropFilter: "blur(10px)",
}));

const CreateRequest = ({ onFormSubmit }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    department: "",
    position: "",
    requestType: "New",
    employmentType: "Permanent",
    requestedHeadcount: 1,
    reason: "",
  });
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/masters/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data.data || []);
    } catch {
      Swal.fire("Error", "Failed to load departments", "error");
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/masters/positions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPositions(res.data.data || []);
    } catch {
      Swal.fire("Error", "Failed to load positions", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" ? { position: "" } : {}),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.department || !formData.position) {
      Swal.fire(
        "Missing Info",
        "Please select department and position",
        "warning"
      );
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/manpower/requests`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "Request submitted successfully", "success").then(() => {
        if (onFormSubmit) {
          onFormSubmit();
        } else {
          // Fallback to original behavior if no callback provided
          setFormData({
            department: "",
            position: "",
            requestType: "New",
            employmentType: "Permanent",
            requestedHeadcount: 1,
            reason: "",
          });
        }
      });
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create request",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredPositions = positions.filter((p) => {
    if (!formData.department) return false;
    const deptId = p.department?._id || p.department;
    return deptId === formData.department;
  });

  return (
    <ThemeProvider theme={theme}>
      <Container 
        maxWidth="md" 
        sx={{ 
          minHeight: "100vh", 
          maxHeight: "100vh", 
          overflowY: "auto",
          pb: 2
        }}
      >
        <Card sx={{ 
          minHeight: "100%", 
          overflowY: "visible",
          '& .MuiContainer-root': {
            overflowY: "visible !important"
          }
        }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create New Manpower Request
          </Typography>
          <Divider sx={{ mb: 4, borderColor: "rgba(255,255,255,0.2)" }} />

          <Grid container spacing={3} justifyContent="center">
            {/* Row 1 */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                sx={{ 
                  minWidth: 320, 
                  width: "320px",
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#ffffff'
                  }
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { 
                      sx: { 
                        maxWidth: 320,
                        bgcolor: 'rgba(50, 50, 50, 0.9)',
                        '& .MuiMenuItem-root': {
                          color: '#ffffff'
                        }
                      } 
                    },
                  },
                }}
              >
                {departments.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={!formData.department}
                helperText={
                  !formData.department ? "Select a department first" : ""
                }
                sx={{ 
                  minWidth: 320, 
                  width: "320px",
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#ffffff'
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'rgba(255, 255, 255, 0.7)'
                  }
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { 
                      sx: { 
                        maxWidth: 320,
                        bgcolor: 'rgba(50, 50, 50, 0.9)',
                        '& .MuiMenuItem-root': {
                          color: '#ffffff'
                        }
                      } 
                    },
                  },
                }}
              >
                {filteredPositions.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Request Type"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                sx={{ 
                  minWidth: 320, 
                  width: "320px",
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#ffffff'
                  }
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { 
                      sx: { 
                        maxWidth: 320,
                        bgcolor: 'rgba(50, 50, 50, 0.9)',
                        '& .MuiMenuItem-root': {
                          color: '#ffffff'
                        }
                      } 
                    },
                  },
                }}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Replacement">Replacement</MenuItem>
                <MenuItem value="Project">Project</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Requested Headcount"
                name="requestedHeadcount"
                value={formData.requestedHeadcount}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                sx={{ minWidth: 320, width: "320px" }}
              />
            </Grid>

            {/* Row 3 */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Employment Type"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                sx={{ 
                  minWidth: 320, 
                  width: "320px",
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff'
                  },
                  '& .MuiInputLabel-root': {
                    color: '#ffffff'
                  }
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { 
                      sx: { 
                        maxWidth: 320,
                        bgcolor: 'rgba(50, 50, 50, 0.9)',
                        '& .MuiMenuItem-root': {
                          color: '#ffffff'
                        }
                      } 
                    },
                  },
                }}
              >
                <MenuItem value="Permanent">Permanent</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Intern">Intern</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                multiline
                rows={4}
                fullWidth
                label="Reason / Justification"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please describe the reason for this request..."
                sx={{ minWidth: 320, width: "320px" }}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 5,
            }}
          >
            <Button
              variant="contained"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                if (onFormSubmit) {
                  onFormSubmit();
                } else {
                  navigate("/employee-dashboard");
                }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
              onClick={() =>
                setFormData({
                  department: "",
                  position: "",
                  requestType: "New",
                  employmentType: "Permanent",
                  requestedHeadcount: 1,
                  reason: "",
                })
              }
            >
              Clear
            </Button>
            <Button
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default CreateRequest;
