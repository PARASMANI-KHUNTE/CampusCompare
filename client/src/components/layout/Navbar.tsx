import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, Heart, LogOut, Scale, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCompareStore } from '../../stores/compareStore';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { items: compareItems } = useCompareStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Colleges', path: '/colleges' },
    { name: 'Predictor', path: '/predictor' },
    { name: 'Discussions', path: '/discussions' },
    { name: 'Compare', path: '/compare' },
  ];

  return (
    <nav
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100/50'
          : 'bg-white/80 backdrop-blur-xl border-b border-transparent'
      }`}
    >
      <div className="container-custom h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-primary-600 p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-gray-900">
            Campus<span className="text-primary-600">Compare</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all duration-200 py-2 border-b-2 ${
                      isActive
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-600 hover:text-primary-600 border-transparent'
                    }`
                  }
                >
                  {link.name === 'Compare' ? (
                    <span className="flex items-center gap-1.5">
                      <Scale className="w-4 h-4" />
                      Compare
                      {compareItems.length > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary-600 rounded-full">
                          {compareItems.length}
                        </span>
                      )}
                    </span>
                  ) : (
                    link.name
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user?.role === 'ADMIN' && (
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                )}
                <Link
                  to="/saved"
                  className="relative text-gray-600 hover:text-primary-600 transition-colors"
                  title="Saved Colleges"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link to="/profile" className="flex items-center gap-2.5 group" title="My Profile">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm transition-transform duration-200 group-hover:scale-105 overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user?.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block group-hover:text-primary-600 transition-colors">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          className="md:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white"
          >
            <div className="border-t border-gray-100 shadow-lg px-4 py-4 flex flex-col gap-3">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.name === 'Compare' ? (
                    <span className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-3">
                        <Scale className="w-5 h-5" />
                        Compare
                      </span>
                      {compareItems.length > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary-600 rounded-full">
                          {compareItems.length}
                        </span>
                      )}
                    </span>
                  ) : (
                    link.name
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-100 pt-3 mt-1">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/saved"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                >
                  <Heart className="w-5 h-5 text-gray-400" />
                  Saved Colleges
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-primary-700 hover:bg-primary-50 rounded-lg font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  My Profile
                </Link>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg mt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold overflow-hidden">
                      {user?.avatarUrl ? (
                        <img src={user?.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
