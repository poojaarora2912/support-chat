import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import SupportChatbot from './pages/chatbot';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<SupportChatbot />} />
        </Route>
        <Route path="/index.html" element={<AppLayout />}>
          <Route index element={<SupportChatbot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
