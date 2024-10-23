import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Welcome from "./routes/Welcome";
import Login from "./routes/Login";
import MainPage from "./routes/MainPage";
import { Box } from "@mui/material";
import Signup from "./routes/Signup";
import Dashboard from "./routes/Dashboard";
import ErrorPage from "./routes/ErrorPage"; // Import the ErrorPage
import Income from "./routes/Income";
import Expenses from "./routes/Expenses";
import Investments from "./routes/Investments";
import Savings from "./routes/Savings";
import Profile from "./routes/Profile";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Welcome />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/home",
      element: <MainPage />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "income",
          element: <Income />,
        },
        {
          path: "expenses",
          element: <Expenses />,
        },
        {
          path: "investments",
          element: <Investments />,
        },
        {
          path: "savings",
          element: <Savings />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <RouterProvider router={router} />
    </Box>
  );
}

export default App;
