import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-white group">
              <div className="bg-primary-600 p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-105">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Campus<span className="text-primary-400">Compare</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your trusted platform to discover, compare, and choose the perfect college for your future career.
            </p>
            <div className="flex gap-3 mt-2">
              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '🐦', label: 'Twitter' },
                { icon: '📷', label: 'Instagram' },
                { icon: '💼', label: 'LinkedIn' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-sm transition-all duration-200 hover:scale-105"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Search Colleges', path: '/colleges' },
                { name: 'Compare Colleges', path: '/compare' },
                { name: 'My Saved Colleges', path: '/saved' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-primary-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Courses */}
          <div>
            <h4 className="text-white font-semibold mb-5 uppercase tracking-wider text-xs">Top Courses</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'B.Tech Colleges', course: 'B.Tech' },
                { name: 'MBA Colleges', course: 'MBA' },
                { name: 'MBBS Colleges', course: 'MBBS' },
                { name: 'Design Colleges', course: 'B.Des' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={`/colleges?course=${item.course}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-primary-400 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 uppercase tracking-wider text-xs">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 group">
                <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-primary-600/30 transition-colors">
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                </div>
                <span className="text-sm text-gray-400">123 Education Hub, Tech Park Phase 2, Bangalore, India</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-primary-600/30 transition-colors">
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                </div>
                <span className="text-sm text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-primary-600/30 transition-colors">
                  <Mail className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                </div>
                <span className="text-sm text-gray-400">hello@campuscompare.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CampusCompare. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="#" className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="#" className="text-sm text-gray-500 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
