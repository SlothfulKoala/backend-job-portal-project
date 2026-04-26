import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'; 

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

const AppLayout = () => {
  const location = useLocation();
  
  // Check if the current URL is login or signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFF] dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Hide Header on Auth Pages */}
      {!isAuthPage && <Header />}

      {/* 2. Removed 'max-w-7xl mx-auto' to allow edge-to-edge layout.
             Added an inline condition to perfectly center the login card when auth pages are active. */}
      <div className={`grow flex flex-row w-full px-4 py-6 md:px-8 gap-8 ${isAuthPage ? 'items-center justify-center' : ''}`}>
        
        {/* 3. Hide Sidebar on Auth Pages */}
        {!isAuthPage && <Sidebar />}

        <main className="flex-1 flex flex-col gap-6 min-w-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

      </div>

      {/* 4. Hide Footer on Auth Pages for a cleaner look */}
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