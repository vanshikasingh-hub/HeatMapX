import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DemoBanner from './components/common/DemoBanner';

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

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#F7FAFC] text-[#102A43] font-sans antialiased">
        <DemoBanner />
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/map" element={<HeatMapPage />} />
            <Route path="/physics" element={<PhysicsPage />} />
            <Route path="/explain" element={<ExplainableAIPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/mitigation" element={<MitigationPage />} />
            <Route path="/digital-twin" element={<DigitalTwinPage />} />
            <Route path="/cool-routes" element={<CoolRoutesPage />} />
            <Route path="/heat-equity" element={<HeatEquityPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/citizen-action" element={<CitizenActionPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
