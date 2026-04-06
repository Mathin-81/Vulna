import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Scan from './pages/Scan';
import Dashboard from './pages/Dashboard';
import VulnerabilityDetail from './pages/VulnerabilityDetail';

import LiveScanMonitor from './pages/LiveScanMonitor';
import VulnerabilityExplorer from './pages/VulnerabilityExplorer';
import ThreatIntelligence from './pages/ThreatIntelligence';
import ScanHistory from './pages/ScanHistory';
import SecurityReports from './pages/SecurityReports';
import AiInsights from './pages/AiInsights';
import TeamCollaboration from './pages/TeamCollaboration';
import SystemSettings from './pages/SystemSettings';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/upload" element={<PageTransition><Upload /></PageTransition>} />
        <Route path="/scan" element={<PageTransition><Scan /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/vulnerability/:id" element={<PageTransition><VulnerabilityDetail /></PageTransition>} />
        <Route path="/live-monitor" element={<PageTransition><LiveScanMonitor /></PageTransition>} />
        <Route path="/vulnerabilities" element={<PageTransition><VulnerabilityExplorer /></PageTransition>} />
        <Route path="/threat-intelligence" element={<PageTransition><ThreatIntelligence /></PageTransition>} />
        <Route path="/history" element={<PageTransition><ScanHistory /></PageTransition>} />
        <Route path="/reports" element={<PageTransition><SecurityReports /></PageTransition>} />
        <Route path="/insights" element={<PageTransition><AiInsights /></PageTransition>} />
        <Route path="/collaboration" element={<PageTransition><TeamCollaboration /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><SystemSettings /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden bg-slate-950 font-sans text-slate-200">
        <Navbar />
        <main className="flex-1 w-full overflow-x-hidden relative overflow-y-auto">
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none transform -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none transform translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 w-full mx-auto min-h-full flex flex-col p-6 pt-[100px] md:p-8 md:pt-[108px]">
            <div className="flex-1">
              <AnimatedRoutes />
            </div>
            <Footer className="mt-6" />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
