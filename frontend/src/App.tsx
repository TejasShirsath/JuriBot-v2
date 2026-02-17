import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import DocumentIntelligencePage from "./pages/DocumentIntelligencePage";
import CostProjectionPage from "./pages/CostProjectionPage";
import VerdictAnalyticsPage from "./pages/VerdictAnalyticsPage";
import VirtualCounselPage from "./pages/VirtualCounselPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-intelligence"
            element={
              <ProtectedRoute>
                <DocumentIntelligencePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cost-projection"
            element={
              <ProtectedRoute>
                <CostProjectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verdict-analytics"
            element={
              <ProtectedRoute>
                <VerdictAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/virtual-counsel"
            element={
              <ProtectedRoute>
                <VirtualCounselPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
