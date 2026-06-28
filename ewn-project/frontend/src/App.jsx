import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Sidebar from './components/layout/Sidebar';
import LoginModal from './components/auth/LoginModal';
import Home from './pages/Home';
import MergePdf from './pages/pdf/MergePdf';
import CompressPdf from './pages/pdf/CompressPdf';
import EditPdf from './pages/pdf/EditPdf';
import PdfToImage from './pages/pdf/PdfToImage';
import ImageToPdf from './pages/pdf/ImageToPdf';
import WordToPdf from './pages/pdf/WordToPdf';
import PdfToWord from './pages/pdf/PdfToWord';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LoginModal />
      <SpeedInsights />

      {/* Full page layout */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Sticky top navbar */}
        <Navbar />

        {/* Body: sidebar + main content side by side */}
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          {/* Main content area grows to fill remaining space */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '2rem 1.5rem 4rem', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/merge-pdf" element={<MergePdf />} />
                <Route path="/compress-pdf" element={<CompressPdf />} />
                <Route path="/edit-pdf" element={<EditPdf />} />
                <Route path="/pdf-to-image" element={<PdfToImage />} />
                <Route path="/image-to-pdf" element={<ImageToPdf />} />
                <Route path="/word-to-pdf" element={<WordToPdf />} />
                <Route path="/pdf-to-word" element={<PdfToWord />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
