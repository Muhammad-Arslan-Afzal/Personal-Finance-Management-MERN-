import { useRouteError } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

interface RouteError {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError; // Type assertion for RouteError
  console.error(error);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <Typography variant="h2" color="error" gutterBottom>
          Oops!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sorry, an unexpected error has occurred.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <i>{error?.statusText || error?.message}</i>
        </Typography>
      </Paper>
    </Box>
  );
}
