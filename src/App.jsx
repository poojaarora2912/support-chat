import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AUTH_LOGIN_SUCCESS_EVENT } from "./constants/auth";
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
          {/* <Route index element={<SupportChatbot />} /> */}
        </Route>
        {/* Catch-all: redirect to login so login page is shown first */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    AuthService.isAuthenticated()
  );
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(AuthService.isAuthenticated());

    checkAuth();

    const onLoginSuccess = () => checkAuth();

    window.addEventListener(AUTH_LOGIN_SUCCESS_EVENT, onLoginSuccess);
    return () =>
      window.removeEventListener(AUTH_LOGIN_SUCCESS_EVENT, onLoginSuccess);
  }, []);

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
