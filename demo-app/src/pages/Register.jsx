import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  Container,
  InputAdornment,
  IconButton
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";

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

function Register() {
  const [formData, setFormData] = useState({
    employeeId: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeId, username, password, confirmPassword } = formData;

    if (!employeeId || !username || !password || !confirmPassword) {
      Swal.fire("Warning", "Please fill in all fields", "warning");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        employeeId,
        username,
        password,
      });
      Swal.fire("Success", "Registration successful! You can now log in.", "success");
      navigate("/login");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
       <div className="gradient-bg">
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <Box className="glass-card">
             <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Logo/Icon Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <BusinessIcon
                  sx={{
                    fontSize: 40,
                    color: "#90caf9",
                    mr: 1,
                  }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  BIS SA
                </Typography>
              </Box>

              <Avatar
                sx={{
                  m: 1,
                  bgcolor: "secondary.main",
                  width: 56,
                  height: 56,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 30 }} />
              </Avatar>

              <Typography
                component="h2"
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Sign Up
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Create Your Account
              </Typography>

              <Divider
                sx={{
                  width: "100%",
                  mb: 3,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                }}
              />

              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="employeeId"
                  label="Employee ID"
                  name="employeeId"
                  autoComplete="off"
                  value={formData.employeeId}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    fontSize: "16px",
                    backgroundColor: "rgba(160, 160, 160, 0.2)",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "rgba(160, 160, 160, 0.3)",
                      boxShadow: "0 5px 20px rgba(0, 0, 0, 0.4)",
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link component={RouterLink} to="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.5)",
                  textAlign: "center",
                  display: "block",
                }}
              >
                © 2025 BIS SA. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default Register;
