import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css'; 

// Context
import { AuthContext } from './context/AuthContext';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import EmployerDashboard from './pages/EmployerDashboard';
import CreateJob from './pages/CreateJob';
import ApplicantsPage from "./pages/ApplicantsPage";
import MyApplications from "./pages/MyApplications"; // ✅ NEW: Import for seekers

const AppLayout = () => {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF] dark:bg-slate-950 dark:text-white font-bold text-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          Loading CareerVista...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFF] dark:bg-slate-950 transition-colors duration-300">
      
      {!isAuthPage && <Header />}

      <div className={`grow flex flex-row w-full px-4 py-6 md:px-8 gap-8 ${isAuthPage ? 'items-center justify-center' : ''}`}>
        
        {!isAuthPage && <Sidebar />}

        <main className="flex-1 flex flex-col gap-6 min-w-0">
          <Routes>
            {/* 🏠 HOMEPAGE: Role-based Landing */}
            <Route 
              path="/" 
              element={user?.role === 'employer' ? <EmployerDashboard /> : <Home />} 
            />

            {/* 🔐 AUTH ROUTES */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            
            {/* 👤 USER ROUTES */}
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/job/:id" element={<JobDetails />} />
            
            {/* ✅ NEW: SEEKER SPECIFIC ROUTES */}
            <Route 
              path="/my-applications" 
              element={user?.role === 'seeker' ? <MyApplications /> : <Navigate to="/" />} 
            />

            {/* 🏢 EMPLOYER ROUTES */}
            <Route 
              path="/create-job" 
              element={user?.role === 'employer' ? <CreateJob /> : <Navigate to="/" />} 
            />
            <Route 
              path="/applicants/:jobId" 
              element={user?.role === 'employer' ? <ApplicantsPage /> : <Navigate to="/" />} 
            />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

      </div>

      {!isAuthPage && <Footer />}
      
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;