import React from "react";
import { useSelector } from "react-redux";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import AuthService from "./services/auth.service";
import LoginPage from "./pages/login";
import AppLayout from "./layout/AppLayout";
import SupportChatbot from "./pages/chatbot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SupportChatbot />} />
        </Route>
        {/* Catch-all: redirect to login so login page is shown first */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ children }) {
  const reduxAuthenticated = useSelector(
    (state) => state.user?.authentication?.authenticated
  );
  const isAuthenticated = AuthService.isAuthenticated();

  // Not authenticated: show login first (redirect to /login)
  if (!isAuthenticated) {
    if (location.pathname === "/login" || location.pathname === "/logout") {
      return <LoginPage />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated: show the app (support chatbot)
  return children;
}

export default App;
