import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DemoBanner from './components/common/DemoBanner';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AreaProvider } from './context/AreaContext';
import LocationPromptModal from './components/common/LocationPromptModal';
import AreaSelectorModal from './components/common/AreaSelectorModal';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import HeatMapPage from './pages/HeatMapPage';
import PhysicsPage from './pages/PhysicsPage';
import ExplainableAIPage from './pages/ExplainableAIPage';
import ForecastPage from './pages/ForecastPage';
import MitigationPage from './pages/MitigationPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import CoolRoutesPage from './pages/CoolRoutesPage';
import HeatEquityPage from './pages/HeatEquityPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CitizenActionPage from './pages/CitizenActionPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SecurityPrivacyPage from './pages/SecurityPrivacyPage';

import LocationAccessPage from './pages/LocationAccessPage';
import Global3DEnvironment from './components/background/Global3DEnvironment';

// Root gate routing: directs new visitors to Login, authenticated users to Location personalization, and ready users to Dashboard
function RootGateway() {
  const { isAuthenticated } = useAuth();
  const locPromptShown = typeof window !== 'undefined' ? localStorage.getItem('heatmapx_loc_prompt_shown') : null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!locPromptShown) {
    return <Navigate to="/personalize-location" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <ErrorBoundary title="HeatMapX Platform Error">
      <AuthProvider>
        <AreaProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-[#f0f9ff] text-[#0f172a] font-sans antialiased selection:bg-[#FF7A18]/25 selection:text-[#0f172a] relative">
              {/* Living 3D Spatial Background Environment */}
              <Global3DEnvironment />

              <DemoBanner />
              <Navbar />
              <AreaSelectorModal />
              
              <main className="flex-1 relative z-10">
              <Routes>
                {/* Root Gate: First screen is Login, then Personalize Location, then Dashboard */}
                <Route path="/" element={<RootGateway />} />

                {/* Authentication & Personalization Onboarding */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/personalize-location" element={<LocationAccessPage />} />

                {/* Core Dashboards */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/kanpur" element={<DashboardPage />} />
                <Route path="/kanpur-nagar" element={<DashboardPage />} />
                <Route path="/city/:cityId" element={<DashboardPage />} />
                <Route path="/landing" element={<LandingPage />} />

                {/* Spatial GIS & Microclimate Physics */}
                <Route path="/map" element={<HeatMapPage />} />
                <Route path="/physics" element={<PhysicsPage />} />
                <Route path="/explain" element={<ExplainableAIPage />} />
                <Route path="/forecast" element={<ForecastPage />} />

                {/* Decision Support & Twin */}
                <Route path="/mitigation" element={<MitigationPage />} />
                <Route path="/digital-twin" element={<DigitalTwinPage />} />
                <Route path="/cool-routes" element={<CoolRoutesPage />} />
                <Route path="/heat-equity" element={<HeatEquityPage />} />
                
                {/* Analytics redirected cleanly to Dashboard */}
                <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
                <Route path="/citizen-action" element={<CitizenActionPage />} />

                {/* Security & Mission */}
                <Route path="/security" element={<SecurityPrivacyPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </AreaProvider>
    </AuthProvider>
  </ErrorBoundary>
);
}
