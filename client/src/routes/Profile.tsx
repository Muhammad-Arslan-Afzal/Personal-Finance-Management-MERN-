import { useContext, useState } from "react";
import { Paper, TextField, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import avatar from "../assets/avatar.png";
import apiRequest from "../lib/apiRequest";
import { AuthContext } from "../context/AuthContext";

export default function Update() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useContext must be used within an AuthContextProvider");
  }

  const { updateUser } = authContext;
  const navigate = useNavigate();
  const [error, setError] = useState<String>("");
  const [formData, setFormData] = useState({
    name: "",
    newPassword: "",
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
      const response = await apiRequest.put("/user", formData);
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
            Update Profile
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
                  id="newPassword" // This should match the key in formData
                  type="password" // Set the type to password to hide the text input
                  label="New Password"
                  variant="outlined"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <Button variant="contained" size="large" type="submit">
                  update
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
    </Paper>
  );
}
