import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StaffDashboard from "./pages/staff/StaffDashboard";
import VerifyOtp from "./pages/VerifyOtp";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RoleRedirect from "./routes/RoleRedirect";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={
            <RoleRedirect>
              <Home />
            </RoleRedirect>
          } />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>

          }
          />

          <Route path="/verify-otp" element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>

          }
          />

          {/* Staff only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="Staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;