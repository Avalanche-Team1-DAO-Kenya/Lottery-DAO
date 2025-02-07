import './App.css'
import Ticket from './pages/Ticket'
import Home	 from './pages/home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import AdminDashboard from './pages/AdminDashboard'
import WinnersPage from './Components/Winner'


import { Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      <div className="app-container">
        <Navbar />
        
        <main className="main-content">
          {/* Move grid overlay outside of Routes */}
          <div className='grid-overlay'></div>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buy-tickets" element={<Ticket />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/winner" element={<WinnersPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </>
  );
  
}

export default App
