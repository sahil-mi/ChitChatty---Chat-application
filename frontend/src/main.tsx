import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Updated import for `react-router-dom`
import Signin from "./pages/auth/login";
import Home from "./pages/home/home";
import Signup from "./pages/auth/signup";
import { Snackbars } from "./components/BasicComponents";
import ProtectedRoute from "./utils/utils";

function App() {
  const [openSnack, setOpenSnack] = useState(false);
  const [snackData, setSnackData] = useState(null);

  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  return (
    <BrowserRouter>
      {openSnack ? (
        <Snackbars
          open={openSnack}
          setOpen={handleCloseSnack}
          data={snackData}
        />
      ) : null}
      <Routes>
        <Route
          path="/"
          element={
            <Signin setOpenSnack={setOpenSnack} setSnackData={setSnackData} />
          }
        />
        <Route
          path="/sign-in"
          element={
            <Signin setOpenSnack={setOpenSnack} setSnackData={setSnackData} />
          }
        />
        <Route
          path="/sign-up"
          element={
            <Signup setOpenSnack={setOpenSnack} setSnackData={setSnackData} />
          }
        />
        <Route
          path="/home/"
          element={
            <ProtectedRoute>
              <Home setOpenSnack={setOpenSnack} setSnackData={setSnackData} />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* Add a Snackbar or Toast component if needed */}
    </BrowserRouter>
  );
}

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<App />);
