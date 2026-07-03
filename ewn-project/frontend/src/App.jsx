import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Sidebar from './components/layout/Sidebar';
import LoginModal from './components/auth/LoginModal';
import { ThemeProvider } from './context/ThemeContext';

// Home is small and is the most likely first paint, so keep it eager.
import Home from './pages/Home';

// Tool pages pull in heavy libraries (pdf-lib, pdfjs-dist, mammoth, jspdf,
// docx, html2canvas, jszip) - lazy-load each one so visiting the homepage
// doesn't download every tool's dependencies up front.
const MergePdf = lazy(() => import('./pages/pdf/MergePdf'));
const CompressPdf = lazy(() => import('./pages/pdf/CompressPdf'));
const EditPdf = lazy(() => import('./pages/pdf/EditPdf'));
const PdfToImage = lazy(() => import('./pages/pdf/PdfToImage'));
const ImageToPdf = lazy(() => import('./pages/pdf/ImageToPdf'));
const WordToPdf = lazy(() => import('./pages/pdf/WordToPdf'));
const PdfToWord = lazy(() => import('./pages/pdf/PdfToWord'));
const BlogList = lazy(() => import('./pages/blogs/BlogList'));
const BlogPost = lazy(() => import('./pages/blogs/BlogPost'));
const Contact = lazy(() => import('./pages/legal/Contact'));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
    Loading tool...
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <LoginModal />

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
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/merge-pdf" element={<MergePdf />} />
                    <Route path="/compress-pdf" element={<CompressPdf />} />
                    <Route path="/edit-pdf" element={<EditPdf />} />
                    <Route path="/pdf-to-image" element={<PdfToImage />} />
                    <Route path="/image-to-pdf" element={<ImageToPdf />} />
                    <Route path="/word-to-pdf" element={<WordToPdf />} />
                    <Route path="/pdf-to-word" element={<PdfToWord />} />
                    <Route path="/blog" element={<BlogList />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;