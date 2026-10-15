import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import {
  Heart,
  User,
  LogOut,
  ShieldCheck,
  ClipboardList,
  Bell,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Poll notifications periodically if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifications = async () => {
      try {
        const res = await axiosClient.get('/notifications');
        if (res.data?.success) {
          setNotifications(res.data.data);
          setUnreadCount(res.data.unreadCount);
        }
      } catch (err) {
        // Silently fail if server rebooting
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleMarkAllRead = async () => {
    try {
      await axiosClient.patch('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-stone-900 via-rose-900 to-stone-800 bg-clip-text text-transparent">
                PetAdopt
              </span>
              <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-rose-600 font-bold ml-1.5 px-1.5 py-0.5 bg-rose-50 rounded">
                Shelter
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors"
            >
              Browse Pets
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* User Dashboard Link */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors"
                >
                  <ClipboardList className="w-4 h-4 text-stone-400" />
                  My Applications
                </Link>

                {/* Admin Portal Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors border border-amber-200"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Admin Panel
                  </Link>
                )}

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (unreadCount > 0) handleMarkAllRead();
                    }}
                    className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Content */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100">
                        <span className="font-semibold text-xs text-stone-700 uppercase tracking-wider">Notifications</span>
                        {notifications.length > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-stone-50">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-stone-400">No notifications yet.</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n._id} className={`p-3 text-xs ${n.read ? 'bg-white' : 'bg-rose-50/50'}`}>
                              <p className="font-semibold text-stone-800">{n.title}</p>
                              <p className="text-stone-600 mt-0.5">{n.message}</p>
                              <span className="text-[10px] text-stone-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Pill & Logout */}
                <div className="flex items-center gap-3 pl-2 border-l border-stone-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-600 font-bold text-xs uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-stone-800">{user.name.split(' ')[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-stone-700 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-xl shadow-md shadow-rose-600/20 transition-all hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-700 hover:text-rose-600"
          >
            Browse Available Pets
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-stone-700 hover:text-rose-600"
              >
                My Applications
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-amber-700"
                >
                  Admin Management
                </Link>
              )}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-stone-900">{user.name}</p>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-stone-300 font-semibold text-sm text-stone-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-sm shadow-md"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
