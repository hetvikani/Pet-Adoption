import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Heart,
  ArrowLeft,
  Calendar,
  MapPin,
  ShieldCheck,
  Sparkles,
  Check,
  AlertCircle,
  FileText,
  User,
  Home,
  X
} from 'lucide-react';

export const PetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Adoption modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  // Application form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    housingType: 'Apartment',
    hasFencedYard: false,
    hasOtherPets: false,
    priorPetExperience: '',
    reasonForAdopting: ''
  });

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/pets/${id}`);
        if (res.data?.success) {
          setPet(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Pet not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await axiosClient.post('/applications', {
        petId: pet._id,
        ...formData
      });

      if (res.data?.success) {
        setFormSuccess('Adoption application submitted successfully! You can track its progress in your dashboard.');
        setTimeout(() => {
          setShowModal(false);
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit application. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center px-4">
        <div className="p-8 bg-white rounded-3xl border border-stone-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-stone-900 mb-2">Pet Not Found</h2>
          <p className="text-sm text-stone-500 mb-6">{error || 'This pet listing does not exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Available Pets
          </Link>
        </div>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80';
  const mainPhoto = pet.photos && pet.photos.length > 0 ? pet.photos[0] : defaultImage;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all pets
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Photo gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 shadow-md">
            <img
              src={mainPhoto}
              alt={pet.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
            <div className="absolute top-4 right-4 shadow-lg">
              <StatusBadge status={pet.status} />
            </div>
            <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{pet.species}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pet Details & Adopt CTA */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">{pet.name}</h1>
                <div className="text-right">
                  <span className="text-xs uppercase text-stone-400 font-bold block">Adoption Fee</span>
                  <span className="text-xl font-bold text-stone-800">
                    {pet.adoptionFee > 0 ? `₹${pet.adoptionFee}` : 'Free'}
                  </span>
                </div>
              </div>
              <p className="text-base text-stone-600 font-medium">
                {pet.breed} • {pet.gender} • {pet.size} Size
              </p>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
                <span className="text-[11px] uppercase font-bold text-stone-400 block mb-0.5">Age</span>
                <span className="font-bold text-stone-800 text-sm">{pet.age} yr{pet.age === 1 ? '' : 's'}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
                <span className="text-[11px] uppercase font-bold text-stone-400 block mb-0.5">Gender</span>
                <span className="font-bold text-stone-800 text-sm">{pet.gender}</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
                <span className="text-[11px] uppercase font-bold text-stone-400 block mb-0.5">Location</span>
                <span className="font-bold text-stone-800 text-sm truncate block">{pet.location || 'Shelter'}</span>
              </div>
            </div>

            {/* About & Bio */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-3">
              <h3 className="font-bold text-stone-900 text-base">About {pet.name}</h3>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">{pet.description}</p>
            </div>

            {/* Health & Medical Information */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-stone-600">Health & Medical</h4>
              <div className="grid grid-cols-2 gap-2 text-stone-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Vaccinations up to date</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Neutered / Spayed</span>
                </div>
              </div>
              {pet.healthStatus?.specialNeeds && pet.healthStatus.specialNeeds !== 'None' && (
                <p className="text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 font-medium">
                  <strong>Special Care Note:</strong> {pet.healthStatus.specialNeeds}
                </p>
              )}
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            {pet.status === 'available' ? (
              isAuthenticated ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-base shadow-lg shadow-rose-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  Apply to Adopt {pet.name}
                </button>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-3">
                  <p className="text-sm text-amber-900 font-medium">
                    Interested in welcoming {pet.name} to your home?
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      to="/login"
                      className="px-5 py-2.5 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 shadow-sm"
                    >
                      Log in to Apply
                    </Link>
                    <Link
                      to="/register"
                      className="px-5 py-2.5 bg-white border border-stone-300 text-stone-700 text-sm font-semibold rounded-xl hover:bg-stone-50"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )
            ) : (
              <div className="p-4 bg-stone-100 rounded-2xl text-center text-sm font-semibold text-stone-500">
                {pet.name} is currently {pet.status} and not accepting new applications.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Adoption Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase text-rose-600 tracking-wider">Official Adoption Form</span>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">
                Apply to Adopt {pet.name}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Please provide accurate details. Shelter staff will review your living environment and pet history.
              </p>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Het Vikani"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. het@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9876 4321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Housing Type *</label>
                  <select
                    value={formData.housingType}
                    onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">Single Family House</option>
                    <option value="Condo">Condo / Townhouse</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Home Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Springfield"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasFencedYard}
                    onChange={(e) => setFormData({ ...formData, hasFencedYard: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span className="text-xs font-medium text-stone-700">Home has a securely fenced yard</span>
                </label>
                <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasOtherPets}
                    onChange={(e) => setFormData({ ...formData, hasOtherPets: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <span className="text-xs font-medium text-stone-700">I currently have other pets</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Prior Pet Experience</label>
                <input
                  type="text"
                  value={formData.priorPetExperience}
                  onChange={(e) => setFormData({ ...formData, priorPetExperience: e.target.value })}
                  placeholder="e.g. Several years of pet ownership experience"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Why do you want to adopt {pet.name}? *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.reasonForAdopting}
                  onChange={(e) => setFormData({ ...formData, reasonForAdopting: e.target.value })}
                  placeholder="Share a little about your lifestyle, daily routine, and why this pet is the right match for your home..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
