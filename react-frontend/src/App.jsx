import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NetworkStatus from './components/NetworkStatus';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/DashboardNew';
import Search from './pages/Search';
import ListingDetails from './pages/ListingDetailsCompact';
import StoreDetails from './pages/StoreDetails';
import MapExplorer from './pages/MapExplorer';
import CreateStore from './pages/CreateStore';
import EditStore from './pages/EditStore';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Favorites from './pages/Favorites';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import AdminListings from './pages/AdminListings';
import AdminLocationSuggestions from './pages/AdminLocationSuggestions';
import SuggestLocation from './pages/SuggestLocation';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import EnhancedMapExplorer from './pages/EnhancedMapExplorer';
import StoreLandingPage from './pages/StoreLandingPage';
import StoreLandingPageEnhanced from './pages/StoreLandingPageEnhanced';
import ManageSpareParts from './pages/ManageSpareParts';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/search" element={<Search />} />
              <Route path="/listings/:id" element={<ListingDetails />} />
              <Route path="/stores/:id" element={<StoreDetails />} />
              <Route path="/store/:slug" element={<StoreLandingPageEnhanced />} />
              
              {/* Protected Map Routes - Login Required */}
              <Route path="/map" element={<ProtectedRoute><MapExplorer /></ProtectedRoute>} />
              <Route path="/map/enhanced" element={<ProtectedRoute><EnhancedMapExplorer /></ProtectedRoute>} />
              <Route path="/suggest-location" element={<ProtectedRoute><SuggestLocation /></ProtectedRoute>} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/stores/create" element={<ProtectedRoute><CreateStore /></ProtectedRoute>} />
              <Route path="/stores/:id/edit" element={<ProtectedRoute><EditStore /></ProtectedRoute>} />
              <Route path="/listings/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
              <Route path="/listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
              <Route path="/stores/:storeId/spare-parts" element={<ProtectedRoute><ManageSpareParts /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/stores" element={<ProtectedRoute><AdminStores /></ProtectedRoute>} />
              <Route path="/admin/listings" element={<ProtectedRoute><AdminListings /></ProtectedRoute>} />
              <Route path="/admin/location-suggestions" element={<ProtectedRoute><AdminLocationSuggestions /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <PWAInstallPrompt />
          <NetworkStatus />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
