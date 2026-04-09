import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import NavBar from './components/NavBar.jsx'
import Home from './components/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ArchitectProfileForm from './pages/ArchitectProfileForm.jsx'
import ArchitectsListingPage from './pages/ArchitectsListingPage.jsx'
import ArchitectDetailPage from './pages/ArchitectDetailPage.jsx'
import MyProfilePage from './pages/MyProfilePage.jsx'
import ArchitectRequestsPage from './pages/ArchitectRequestsPage.jsx'
import MyRequestsPage from './pages/MyRequestsPage.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/architects" element={<ArchitectsListingPage />} />
          <Route path="/architects/:id" element={<ArchitectDetailPage />} />
          <Route path="/architect/create-profile" element={<ProtectedRoute component={ArchitectProfileForm} />} />
          <Route path="/architect/my-profile" element={<ProtectedRoute component={MyProfilePage} />} />
          <Route path="/architect/requests" element={<ProtectedRoute component={ArchitectRequestsPage} />} />
          <Route path="/my-requests" element={<ProtectedRoute component={MyRequestsPage} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
