import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ClipboardList, 
  Heart, 
  Calendar, 
  Home, 
  Sparkles, 
  AlertCircle,
  FileCheck2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/applications/my');
      if (res.data?.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      setError('Unable to load your applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Profile Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-rose-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-stone-900">{user?.name}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 capitalize">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{user?.email} • {user?.phone || 'No phone set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <div className="text-center px-4 border-r border-stone-200">
            <span className="block text-2xl font-bold text-stone-900">{applications.length}</span>
            <span className="text-[11px] uppercase font-bold text-stone-500">Applications</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-2xl font-bold text-emerald-600">
              {applications.filter((a) => a.status === 'approved').length}
            </span>
            <span className="text-[11px] uppercase font-bold text-stone-500">Approved</span>
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-rose-600" />
              <span>My Adoption Applications</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Track review statuses, shelter notes, and decisions for pets you applied for.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl transition-colors"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            Find more pets
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-stone-200 rounded-2xl"></div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">No Applications Yet</h3>
            <p className="text-xs text-stone-500 mb-6">
              You haven't submitted any adoption applications yet. Browse our animals to find a companion.
            </p>
            <Link
              to="/"
              className="px-5 py-2.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 shadow-md shadow-rose-600/20"
            >
              Browse Pets Available for Adoption
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Pet preview */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <img
                      src={app.pet?.photos?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'}
                      alt={app.pet?.name || 'Pet'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-stone-900">
                        {app.pet?.name || 'Unknown Pet'}
                      </h4>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {app.pet?.species} • {app.pet?.breed}
                    </p>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Details & Notes */}
                <div className="flex-1 max-w-md bg-stone-50 rounded-xl p-3 border border-stone-100 text-xs text-stone-600 space-y-1">
                  <p className="line-clamp-1">
                    <strong>Reason:</strong> "{app.reasonForAdopting}"
                  </p>
                  {app.adminNotes ? (
                    <p className="text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                      <strong>Shelter Message:</strong> {app.adminNotes}
                    </p>
                  ) : (
                    <p className="text-stone-400 italic">Under review by adoption committee.</p>
                  )}
                </div>

                {/* Pet link */}
                {app.pet?._id && (
                  <Link
                    to={`/pets/${app.pet._id}`}
                    className="shrink-0 flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-rose-600 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-colors"
                  >
                    <span>View Pet Listing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
