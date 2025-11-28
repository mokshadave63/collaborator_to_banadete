import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DesignProvider } from './context/DesignContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DesignStudio from './pages/DesignStudio';
import Gallery from './pages/Gallery';
import Community from './pages/Community';
import Library from './pages/Library';
import SharedDesign from './pages/SharedDesign';

function App() {
  return (
    <AuthProvider>
      <DesignProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/studio" element={<DesignStudio />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/community" element={<Community />} />
                <Route path="/library" element={<Library />} />
                <Route path="/share/:shareId" element={<SharedDesign />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </DesignProvider>
    </AuthProvider>
  );
}

export default App;