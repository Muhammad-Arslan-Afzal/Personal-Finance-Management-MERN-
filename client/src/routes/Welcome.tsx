import { Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";
import moneyVallet from "../assets/moneyVallet.jpg";

export default function Welcome() {
  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "60%",
        p: 4,
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <img src={moneyVallet} style={{ width: "100%", height: "100%" }} />
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" gutterBottom lineHeight={2}>
            Take Control of Your Finances One Smart Decision at a Time
          </Typography>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ my: 3 }}
            component={Link}
            to="/login"
          >
            Log In
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            component={Link}
            to="/signup"
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
