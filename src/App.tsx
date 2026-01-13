import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import DocumentIntelligencePage from "./pages/DocumentIntelligencePage";
import CostProjectionPage from "./pages/CostProjectionPage";
import VerdictAnalyticsPage from "./pages/VerdictAnalyticsPage";
import VirtualCounselPage from "./pages/VirtualCounselPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/document-intelligence" element={<DocumentIntelligencePage />} />
        <Route path="/cost-projection" element={<CostProjectionPage />} />
        <Route path="/verdict-analytics" element={<VerdictAnalyticsPage />} />
        <Route path="/virtual-counsel" element={<VirtualCounselPage />} />
      </Routes>
    </Router>
  );
}

export default App;
