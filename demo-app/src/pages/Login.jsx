import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
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
  InputAdornment,
  IconButton,
  Container,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BusinessIcon from "@mui/icons-material/Business";
import { Link as RouterLink } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// สร้าง Dark Theme
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
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": { color: "#90caf9" },
          "& .MuiInput-underline:after": { borderBottomColor: "#90caf9" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
            "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
            "&.Mui-focused fieldset": { borderColor: "#90caf9" },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);
  const [passwordForm, setPasswordForm] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  const { login } = useContext(AuthContext);

  const handleChangePassword = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/changeAllPassword`, {
        username: passwordForm.username,
        oldPassword: passwordForm.oldPassword,
        newpassword: passwordForm.newPassword,
      });
      Swal.fire("Success", "Password changed successfully", "success");
      setChangePasswordDialogOpen(false);
      setPasswordForm({ username: "", newPassword: "" });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to change password",
        "error"
      );
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter both username and password",
        confirmButtonColor: "#90caf9",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${username}!`,
          confirmButtonColor: "#90caf9",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: result.message || "Incorrect username or password",
          confirmButtonColor: "#f48fb1",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Cannot connect to the server. Please try again later.",
        confirmButtonColor: "#f48fb1",
      });
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
                Sign In
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Manpower Management System
              </Typography>

              <Divider
                sx={{
                  width: "100%",
                  mb: 3,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                }}
              />

              <Box
                component="form"
                onSubmit={handleLogin}
                noValidate
                sx={{ width: "100%" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputLabelProps={{
                    style: { color: "rgba(0, 0, 0, 0.7)" },
                  }}
                  InputProps={{
                    style: { color: "white" },
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
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputLabelProps={{
                    style: { color: "rgba(0, 0, 0, 0.7)" },
                  }}
                  InputProps={{
                    style: { color: "white" },
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    fontSize: "16px",
                    color: "#ffffffff", // Muted gray text
                    backgroundColor: "rgba(160, 160, 160, 0.2)", // Muted gray semi-transparent background
                    borderColor: "rgba(160, 160, 160, 0.5)", // Muted gray semi-transparent border
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "rgba(160, 160, 160, 0.3)",
                      boxShadow: "0 5px 20px rgba(0, 0, 0, 0.4)",
                    },
                    "&:disabled": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Link
                      href="#"
                      variant="body2"
                      sx={{
                        color: "#ffffffff",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() => setChangePasswordDialogOpen(true)}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ textAlign: { sm: "right" } }}>
                    <Link component={RouterLink} to="/register" variant="body2">
                      Don't have an account? Sign Up
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
      <Dialog
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#23284d", // สีทึบ
            backgroundImage: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          },
        }}
      >
        <DialogTitle>Change User Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={passwordForm.username}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, username: e.target.value })
            }
          />
          <TextField
            label="Old Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            color="primary"
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default Login;