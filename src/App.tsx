import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardAdmin from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import { Button } from "./components/ui/button";

// PrivateRoute component
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.id}/dashboard/`} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.id}/dashboard/`} replace />
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route
        path="/:userId/dashboard/"
        element={
          <PrivateRoute>
            {/* <div>
              <h1>Admin Dashboard</h1>
              <p>Welcome, Admin</p>
              <Button variant="default">Default Button</Button>
            </div> */}
            <DashboardAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/:id"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
