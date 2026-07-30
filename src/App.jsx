import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AgenticChat from './pages/AgenticChat';
import LiveMonitor from './pages/LiveMonitor';
import Analytics from './pages/Analytics';
import Contacts from './pages/Contacts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<AgenticChat />} />
          <Route path="/monitor" element={<LiveMonitor />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/contacts" element={<Contacts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;