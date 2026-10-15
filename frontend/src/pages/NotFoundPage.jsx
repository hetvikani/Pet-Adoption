import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-stone-900 mb-2">404</h1>
        <p className="text-stone-500 text-sm mb-6">Page not found or has been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 shadow-sm"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};
