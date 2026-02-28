import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { AUTH_LOGIN_SUCCESS_EVENT } from "./constants/auth";
import AuthService from "./services/auth.service";
import LoginPage from "./pages/login";
import MainPage from "./pages/main";

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
              <MainPage />
            </ProtectedRoute>
          }
        />
        {/* Catch-all: show login for any other path (e.g. extension loads with unexpected path) */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    AuthService.isAuthenticated()
  );

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(AuthService.isAuthenticated());

    checkAuth();

    const onLoginSuccess = () => checkAuth();
    
    window.addEventListener(AUTH_LOGIN_SUCCESS_EVENT, onLoginSuccess);
    return () =>
      window.removeEventListener(AUTH_LOGIN_SUCCESS_EVENT, onLoginSuccess);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return children;
}

export default App;
