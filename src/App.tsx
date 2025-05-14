import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AdminPanel from './pages/AdminPanel';

// Hooks
import { useKonamiCode } from './hooks/useKonamiCode';

function App() {
  const location = useLocation();
  const [showAdmin, setShowAdmin] = useState(false);
  const konamiActivated = useKonamiCode();

  // Effect to handle "backdoor" access
  useEffect(() => {
    if (konamiActivated) {
      setShowAdmin(!showAdmin);
    }
  }, [konamiActivated]);

  // Check for secret URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const secretKey = params.get('secret');
    if (secretKey === 'admin1234') {
      setShowAdmin(true);
    }
  }, [location]);

  return (
    <Layout showAdmin={showAdmin}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          {showAdmin && <Route path="/admin" element={<AdminPanel />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;