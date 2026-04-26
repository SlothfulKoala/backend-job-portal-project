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

function App() {
  return (
    <BrowserRouter>
      {/* We wrap EVERYTHING in the layout div so Header, 
          Sidebar, and Footer are always visible.
      */}
      <div className="min-h-screen flex flex-col bg-[#FDFDFF] dark:bg-slate-950">
        <Header />

        <div className="grow flex flex-row w-full max-w-7xl mx-auto px-4 py-6 md:px-8 gap-8">
          <Sidebar />

          <main className="flex-1 flex flex-col gap-6 min-w-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/job/:id" element={<JobDetails />} />
              {/* Add a 404 catch-all if needed */}
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