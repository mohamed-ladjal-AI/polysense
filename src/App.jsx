import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DashboardPage from './pages/DashboardPage';
import LiveProcessPage from './pages/LiveProcessPage';
import AIPredictionsPage from './pages/AIPredictionsPage';
import AlertsPage from './pages/AlertsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './hooks/useAuth';

function DashboardShell({ isFullPage, setIsFullPage }) {
  return (
    <div className={`bg-brand-dark text-brand-text antialiased text-sm flex flex-col ${isFullPage ? 'min-h-screen overflow-visible' : 'h-screen overflow-hidden'}`}>
      <div className={`flex flex-1 ${isFullPage ? 'min-h-screen overflow-visible' : 'overflow-hidden'}`}>
        <Sidebar isFullPage={isFullPage} />

        <main className={`flex-1 flex flex-col relative ${isFullPage ? 'min-h-screen overflow-visible' : 'h-full overflow-hidden'}`}>
          <Header isFullPage={isFullPage} onToggleFullPage={() => setIsFullPage(!isFullPage)} />

          <div className={`flex-1 p-4 md:p-6 pb-6 ${isFullPage ? 'overflow-visible' : 'overflow-y-auto scrollbar-thin'}`}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/live-process" element={<LiveProcessPage />} />
              <Route path="/ai-predictions" element={<AIPredictionsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [isFullPage, setIsFullPage] = useState(false);

  if (!user) return <LoginPage />;

  return <DashboardShell isFullPage={isFullPage} setIsFullPage={setIsFullPage} />;
}