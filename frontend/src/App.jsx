import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Body from './components/Body.jsx'
import CategoryPage from './components/CategoryPage.jsx'
import Cart from './components/Cart.jsx'
import Profile from './components/Profile.jsx'
import Footer from './components/Footer.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import Auth from './components/Auth.jsx'
import InfoPage from './components/InfoPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleOpenAuth = () => setShowAuthModal(true);
  const handleCloseAuth = () => setShowAuthModal(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {showAuthModal && <Auth onClose={handleCloseAuth} />}
      
      <Header onOpenAuth={handleOpenAuth} />
      <main className="main-content-wrapper">
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart onOpenAuth={handleOpenAuth} />} />
          <Route path="/profile" element={<Profile onOpenAuth={handleOpenAuth} />} />
          <Route path="/pages/:slug" element={<InfoPage />} />
          <Route path="/about" element={<Navigate to="/pages/ve-chung-toi" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
