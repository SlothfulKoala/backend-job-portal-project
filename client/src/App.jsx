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
import EmployerDashboard from './pages/EmployerDashboard'; // ✅ New
import CreateJob from './pages/CreateJob';                 // ✅ New

const AppLayout = () => {
  const location = useLocation();
  
  // ✅ 1. Bring in the AuthContext to act as the "Traffic Cop"
  const { user, loading } = useContext(AuthContext);
  
  // Check if the current URL is login or signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // ✅ 2. Prevent the app from rendering the wrong page while checking local storage/token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF] dark:bg-slate-950 dark:text-white font-bold">
        Loading CareerVista...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFF] dark:bg-slate-950 transition-colors duration-300">
      
      {/* Hide Header on Auth Pages */}
      {!isAuthPage && <Header />}

      <div className={`grow flex flex-row w-full px-4 py-6 md:px-8 gap-8 ${isAuthPage ? 'items-center justify-center' : ''}`}>
        
        {/* Hide Sidebar on Auth Pages */}
        {!isAuthPage && <Sidebar />}

        <main className="flex-1 flex flex-col gap-6 min-w-0">
          <Routes>
            {/* ✅ 3. DYNAMIC HOMEPAGE: Employers see Dashboard, Seekers/Guests see Home */}
            <Route 
              path="/" 
              element={user?.role === 'employer' ? <EmployerDashboard /> : <Home />} 
            />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* ✅ 4. PROTECTED ROUTE: Only Employers can hit this URL */}
            <Route 
              path="/create-job" 
              element={user?.role === 'employer' ? <CreateJob /> : <Navigate to="/" />} 
            />

            <Route path="*" element={<Home />} />
          </Routes>
        </main>

      </div>

      {/* Hide Footer on Auth Pages */}
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