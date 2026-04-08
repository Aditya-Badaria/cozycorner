import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-3xl">🏠</span>
              Cozy Corner
            </h3>
            <p className="text-gray-400 text-sm">
              Your comfortable space for connecting with talented interior architects.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/architects" className="text-gray-400 hover:text-white transition">
                  Find Architects
                </Link>
              </li>
              <li>
                <Link to="/architect/create-profile" className="text-gray-400 hover:text-white transition">
                  Create Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Interior Design Services</li>
              <li className="text-gray-400">Portfolio Showcase</li>
              <li className="text-gray-400">Professional Network</li>
              <li className="text-gray-400">Secure Messaging</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">📧 info@cozycorner.com</li>
              <li className="text-gray-400">📱 +1 (555) 123-4567</li>
              <li className="text-gray-400">📍 San Francisco, CA</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Cozy Corner. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition text-lg"
              title="Facebook"
            >
              f
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition text-lg"
              title="Twitter"
            >
              𝕏
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition text-lg"
              title="LinkedIn"
            >
              in
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition text-lg"
              title="Instagram"
            >
              📷
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex gap-6 text-sm mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
