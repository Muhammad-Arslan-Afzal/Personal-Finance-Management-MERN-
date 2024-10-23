import { useContext, useState } from "react";
import { Paper, TextField, Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import avatar from "../assets/avatar.png";
import apiRequest from "../lib/apiRequest";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useContext must be used within an AuthContextProvider");
  }

  const { updateUser } = authContext;
  const navigate = useNavigate();
  const [error, setError] = useState<String>("");
  const [formData, setFormData] = useState({
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
      const response = await apiRequest.post("/auth/login", formData);

      // Assuming the response data is in the format { message: string, user: { name: string, email: string } }
      const user = response.data.user; // Extract user data from response
      if (user) {
        updateUser(user); // Update context with the user object
        navigate("/home");
      }
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
              Log In
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
                    Log in
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
            Don't have an account?
            <Link
              to="/signup"
              style={{ textDecoration: "none", marginLeft: "8px" }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
