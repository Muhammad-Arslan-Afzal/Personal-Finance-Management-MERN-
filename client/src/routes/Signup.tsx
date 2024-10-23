import { useState } from "react";
import { Paper, TextField, Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import avatar from "../assets/avatar.png";
import apiRequest from "../lib/apiRequest";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState<String>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest.post("/auth/signup", formData);
      navigate("/login");
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vh",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "space-between",
          flexDirection: "column",
          p: 4,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" gutterBottom align="center">
              Create an Account
            </Typography>
          </Box>
          <Box>
            <Grid container>
              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={avatar}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2, // Adds space between the TextFields
                    width: "100%",
                  }}
                >
                  <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    id="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button variant="contained" size="large" type="submit">
                    Register
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </form>
        {error && (
          <Box textAlign="center">
            <Typography variant="body1" sx={{ color: "red" }} gutterBottom>
              {error}
            </Typography>
          </Box>
        )}
        <Box>
          <Typography variant="body1" align="center" sx={{ my: 2 }}>
            Already have an account?
            <Link
              to="/login"
              style={{ textDecoration: "none", marginLeft: "8px" }}
            >
              Log in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
