import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { checkHealth } from '../services/api';
import Footer from './Footer.jsx';

export default function Home() {
  const [serverStatus, setServerStatus] = useState('loading');
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await checkHealth();
        setServerStatus(response.data.status);
        setError(null);
      } catch (err) {
        setError('Server is not responding');
        setServerStatus('offline');
      }
    };

    checkServer();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full">
        <div className="px-8 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-bold text-black">Cozy Corner</h1>
          </Link>
          <div className="flex items-center gap-8">
            <nav className="flex gap-8">
              <Link to="/architects" className="text-black hover:text-[#CDB4DB] font-medium transition">
                Find Architects
              </Link>
{user?.role === 'architect' ? (
                <>
                  <Link to="/architect/my-profile" className="text-black hover:text-[#CDB4DB] font-medium transition">
                    My Profile
                  </Link>
                  <Link to="/architect/requests" className="text-black hover:text-[#CDB4DB] font-medium transition">
                    Requests
                  </Link>
                </>
              ) : user?.role === 'user' && (
                <Link to="/my-requests" className="text-black hover:text-[#CDB4DB] font-medium transition">
                  My Requests
                </Link>
              )}
            </nav>
            <div className="flex items-center gap-3 pl-8 border-l border-gray-200">
              <div className="w-10 h-10 bg-[#CDB4DB] rounded-full flex items-center justify-center text-black font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-black text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full px-8 py-24 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Find Your Perfect <span className="text-[#CDB4DB]">Architect</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Connect with talented architects and designers. Transform your space into something extraordinary.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-2 flex items-center shadow-sm hover:shadow-md transition">
                <input
                  type="text"
                  placeholder="Search by location, specialty..."
                  className="flex-grow px-6 py-3 outline-none text-black placeholder-gray-400"
                />
                <button 
                  onClick={() => navigate('/architects')}
                  className="px-8 py-3 bg-[#CDB4DB] text-black font-semibold rounded-xl hover:bg-opacity-90 transition"
                >
                  Search
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/architects')}
                className="px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition"
              >
                Browse Architects
              </button>
              {user?.role === 'architect' && (
                <button
                  onClick={() => navigate('/architect/my-profile')}
                  className="px-8 py-3 border-2 border-[#CDB4DB] text-black font-semibold rounded-xl hover:bg-[#CDB4DB] hover:bg-opacity-10 transition"
                >
                  View My Profile
                </button>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20 pt-12 border-t border-gray-200">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#CDB4DB] mb-2">500+</p>
              <p className="text-gray-600 font-medium">Architects</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#CDB4DB] mb-2">1000+</p>
              <p className="text-gray-600 font-medium">Projects Completed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#CDB4DB] mb-2">4.9★</p>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-gray-50 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-black text-center mb-16">Why Choose Cozy Corner?</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#CDB4DB] bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  ✨
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Verified Professionals</h3>
                <p className="text-gray-600">All architects are verified and have proven track records.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#CDB4DB] bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  🎯
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Easy Booking</h3>
                <p className="text-gray-600">Request quotes and manage projects all in one place.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#CDB4DB] bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  🛡️
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Secure & Safe</h3>
                <p className="text-gray-600">Your projects and data are protected with industry-leading security.</p>
              </div>
            </div>
          </div>

          {/* Server Status (Minimal) */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div
                className={`w-2 h-2 rounded-full ${
                  serverStatus === 'loading'
                    ? 'bg-yellow-500 animate-pulse'
                    : serverStatus.includes('running')
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              ></div>
              <p className="text-sm">
                {serverStatus === 'loading' ? 'Checking system...' : `System ${serverStatus === 'offline' ? 'Offline' : 'Online'}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
