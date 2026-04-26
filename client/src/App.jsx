import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Profile from './pages/Profile'; // <-- Kept your Profile import!

function App() {
  return (
    <BrowserRouter>
      {/* Teammate's global background colors applied to the root flex container.
        This ensures dark mode covers the whole viewport. 
      */}
      <div className="min-h-screen flex flex-col bg-[#FDFDFF] dark:bg-slate-950 transition-colors duration-300">
        
        <Header />

        {/* Teammate's max-w-7xl provides the correct responsive width constraints */}
        <div className="grow flex flex-row w-full max-w-7xl mx-auto px-4 py-6 md:px-8 gap-8">
          
          <Sidebar />

          <main className="flex-1 flex flex-col gap-6 min-w-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/job/:id" element={<JobDetails />} />
              
              {/* Your Profile Route */}
              <Route path="/profile" element={<Profile />} />
              
              {/* Teammate's 404 Catch-all (redirects bad URLs to Home) */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

        </div>

        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;