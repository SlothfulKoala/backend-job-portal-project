import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Import our new page components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobDetails from './pages/JobDetails';

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-cvBackground">
        <Routes>
          {/* 2. Map URLs to those specific pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/job/:id" element={<JobDetails />} /> 
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
