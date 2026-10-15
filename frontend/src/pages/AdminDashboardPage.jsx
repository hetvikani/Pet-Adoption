import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { StatusBadge } from '../components/StatusBadge';
import {
  ShieldCheck,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  AlertCircle,
  X,
  FileCheck2,
  Users,
  Dog
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('pets'); // 'pets' | 'applications'
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters for applications
  const [appStatusFilter, setAppStatusFilter] = useState('all');

  // Filters for pets
  const [petStatusFilter, setPetStatusFilter] = useState('all');
  const [petSearch, setPetSearch] = useState('');

  // Pet Modal (Add / Edit)
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [petFormData, setPetFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    size: 'Medium',
    color: '',
    description: '',
    photos: '',
    status: 'available',
    adoptionFee: '',
    location: '',
    vaccinated: true,
    neutered: true,
    specialNeeds: 'None'
  });

  // Review Application Modal
  const [reviewingApp, setReviewingApp] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch all pets (including pending and adopted for admin)
  const fetchAdminPets = async () => {
    try {
      const params = {
        limit: 50,
        status: petStatusFilter !== 'all' ? petStatusFilter : 'all'
      };
      if (petSearch.trim()) params.search = petSearch.trim();

      const res = await axiosClient.get('/pets', { params });
      if (res.data?.success) {
        setPets(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch pets list.');
    }
  };

  // Fetch all applications
  const fetchAdminApplications = async () => {
    try {
      const params = {};
      if (appStatusFilter !== 'all') params.status = appStatusFilter;
      const res = await axiosClient.get('/applications', { params });
      if (res.data?.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch applications.');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchAdminPets(), fetchAdminApplications()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [petStatusFilter, appStatusFilter]);

  // Handle Pet Form Open
  const handleOpenAddPet = () => {
    setEditingPet(null);
    setPetFormData({
      name: '',
      species: 'Dog',
      breed: '',
      age: '',
      gender: 'Male',
      size: 'Medium',
      color: '',
      description: '',
      photos: '',
      status: 'available',
      adoptionFee: '',
      location: '',
      vaccinated: true,
      neutered: true,
      specialNeeds: 'None'
    });
    setShowPetModal(true);
  };

  const handleOpenEditPet = (pet) => {
    setEditingPet(pet);
    setPetFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender || 'Unknown',
      size: pet.size || 'Medium',
      color: pet.color || '',
      description: pet.description,
      photos: pet.photos ? pet.photos.join(', ') : '',
      status: pet.status,
      adoptionFee: pet.adoptionFee || 0,
      location: pet.location || 'Main Shelter',
      vaccinated: pet.healthStatus?.vaccinated ?? true,
      neutered: pet.healthStatus?.neutered ?? true,
      specialNeeds: pet.healthStatus?.specialNeeds || 'None'
    });
    setShowPetModal(true);
  };

  const handleSavePet = async (e) => {
    e.preventDefault();
    try {
      const photoArray = petFormData.photos
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      const payload = {
        name: petFormData.name,
        species: petFormData.species,
        breed: petFormData.breed,
        age: Number(petFormData.age),
        gender: petFormData.gender,
        size: petFormData.size,
        color: petFormData.color,
        description: petFormData.description,
        photos: photoArray,
        status: petFormData.status,
        adoptionFee: Number(petFormData.adoptionFee),
        location: petFormData.location,
        healthStatus: {
          vaccinated: petFormData.vaccinated,
          neutered: petFormData.neutered,
          specialNeeds: petFormData.specialNeeds
        }
      };

      if (editingPet) {
        await axiosClient.put(`/pets/${editingPet._id}`, payload);
        setSuccessMsg(`Pet "${payload.name}" updated successfully!`);
      } else {
        await axiosClient.post('/pets', payload);
        setSuccessMsg(`New pet "${payload.name}" added successfully!`);
      }

      setShowPetModal(false);
      fetchAdminPets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save pet.');
    }
  };

  const handleDeletePet = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"? This will also remove any related adoption applications.`)) {
      return;
    }
    try {
      await axiosClient.delete(`/pets/${id}`);
      setSuccessMsg(`Pet "${name}" deleted.`);
      fetchAdminPets();
      fetchAdminApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete pet.');
    }
  };

  const handleUpdatePetStatusQuick = async (id, newStatus) => {
    try {
      await axiosClient.patch(`/pets/${id}/status`, { status: newStatus });
      setSuccessMsg(`Status updated to ${newStatus}.`);
      fetchAdminPets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update pet status.');
    }
  };

  // Review Application
  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    try {
      await axiosClient.patch(`/applications/${appId}/status`, {
        status: newStatus,
        adminNotes
      });
      setSuccessMsg(`Application status updated to ${newStatus}. Associated pet status synchronized.`);
      setReviewingApp(null);
      setAdminNotes('');
      fetchAdminApplications();
      fetchAdminPets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application.');
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-1 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Shelter Administration Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Admin Dashboard</h1>
        </div>

        {activeTab === 'pets' && (
          <button
            onClick={handleOpenAddPet}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Pet
          </button>
        )}
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-8 space-x-8">
        <button
          onClick={() => setActiveTab('pets')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'pets'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-stone-500 hover:text-stone-800'
            }`}
        >
          <Dog className="w-4 h-4" />
          <span>Pets Inventory ({pets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === 'applications'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-stone-500 hover:text-stone-800'
            }`}
        >
          <Users className="w-4 h-4" />
          <span>
            Adoption Applications ({applications.length})
            {applications.filter((a) => a.status === 'pending').length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
                {applications.filter((a) => a.status === 'pending').length} pending
              </span>
            )}
          </span>
        </button>
      </div>

      {/* TAB 1: PET INVENTORY */}
      {activeTab === 'pets' && (
        <div className="space-y-6">
          {/* Filters for pets */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-stone-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search pet by name or breed..."
                value={petSearch}
                onChange={(e) => setPetSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAdminPets()}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={petStatusFilter}
                onChange={(e) => setPetStatusFilter(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>

              <button
                onClick={fetchAdminPets}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-semibold text-stone-700"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Pet</th>
                    <th className="py-3 px-4">Species & Breed</th>
                    <th className="py-3 px-4">Age / Gender</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Adoption Fee</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {pets.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-stone-400">
                        No pets found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    pets.map((p) => (
                      <tr key={p._id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.photos?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80'}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                            />
                            <div>
                              <span className="font-bold text-stone-900 block">{p.name}</span>
                              <span className="text-[10px] text-stone-400">{p.location || 'Shelter'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-stone-800">{p.species}</span>
                          <span className="text-stone-400 block text-[11px]">{p.breed}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span>{p.age} yr{p.age === 1 ? '' : 's'}</span>
                          <span className="text-stone-400 block text-[11px]">{p.gender}</span>
                        </td>
                        <td className="py-3 px-4">
                          {/* Quick Status Dropdown */}
                          <select
                            value={p.status}
                            onChange={(e) => handleUpdatePetStatusQuick(p._id, e.target.value)}
                            className="text-xs px-2 py-1 rounded-lg border border-stone-200 bg-white font-medium"
                          >
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="adopted">Adopted</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-800">
                          {p.adoptionFee > 0 ? `₹${p.adoptionFee}` : 'Free'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditPet(p)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                              title="Edit Pet"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePet(p._id, p.name)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                              title="Delete Pet"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADOPTION APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Filter Status */}
          <div className="flex items-center gap-2 bg-white p-4 rounded-2xl border border-stone-200">
            <span className="text-xs font-semibold text-stone-600">Filter Status:</span>
            <select
              value={appStatusFilter}
              onChange={(e) => setAppStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-400 text-xs">
                No adoption applications found.
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  {/* Left: Pet & Applicant Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={app.pet?.photos?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80'}
                      alt={app.pet?.name || 'Pet'}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-stone-900">
                          {app.fullName}
                        </span>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Applied for <strong className="text-stone-800">{app.pet?.name || 'Pet'}</strong> ({app.pet?.breed || app.pet?.species})
                      </p>
                      <div className="text-[11px] text-stone-400 mt-1 flex flex-wrap gap-x-3">
                        <span>Email: {app.email}</span>
                        <span>Phone: {app.phone}</span>
                        <span>Housing: {app.housingType}</span>
                        <span>Yard: {app.hasFencedYard ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Reasoning snippet */}
                  <div className="flex-1 max-w-sm bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-600">
                    <p className="line-clamp-2">
                      <strong className="text-stone-700">Reason:</strong> "{app.reasonForAdopting}"
                    </p>
                    {app.adminNotes && (
                      <p className="mt-1 text-[11px] text-stone-500 italic">
                        Notes: {app.adminNotes}
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                    <button
                      onClick={() => {
                        setReviewingApp(app);
                        setAdminNotes(app.adminNotes || '');
                      }}
                      className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                    >
                      Full Details
                    </button>

                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateApplicationStatus(app._id, 'approved')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PET */}
      {showPetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setShowPetModal(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-stone-900 mb-4">
              {editingPet ? `Edit Pet: ${editingPet.name}` : 'Add New Pet to Shelter'}
            </h3>

            <form onSubmit={handleSavePet} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Pet Name *</label>
                  <input
                    type="text"
                    required
                    value={petFormData.name}
                    onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Species *</label>
                  <select
                    value={petFormData.species}
                    onChange={(e) => setPetFormData({ ...petFormData, species: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Breed *</label>
                  <input
                    type="text"
                    required
                    value={petFormData.breed}
                    onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Age (Years) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={petFormData.age}
                    onChange={(e) => setPetFormData({ ...petFormData, age: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Gender</label>
                  <select
                    value={petFormData.gender}
                    onChange={(e) => setPetFormData({ ...petFormData, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Size</label>
                  <select
                    value={petFormData.size}
                    onChange={(e) => setPetFormData({ ...petFormData, size: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Extra Large">Extra Large</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Status</label>
                  <select
                    value={petFormData.status}
                    onChange={(e) => setPetFormData({ ...petFormData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Adoption Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15000"
                    value={petFormData.adoptionFee}
                    onChange={(e) => setPetFormData({ ...petFormData, adoptionFee: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Shelter Location</label>
                  <input
                    type="text"
                    placeholder="Ahmedabad"
                    value={petFormData.location}
                    onChange={(e) => setPetFormData({ ...petFormData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Photo URLs (Comma separated image links)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..., https://..."
                  value={petFormData.photos}
                  onChange={(e) => setPetFormData({ ...petFormData, photos: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Pet Description & Personality *</label>
                <textarea
                  rows="3"
                  required
                  value={petFormData.description}
                  onChange={(e) => setPetFormData({ ...petFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={petFormData.vaccinated}
                    onChange={(e) => setPetFormData({ ...petFormData, vaccinated: e.target.checked })}
                    className="rounded text-rose-600"
                  />
                  <span>Vaccinated</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={petFormData.neutered}
                    onChange={(e) => setPetFormData({ ...petFormData, neutered: e.target.checked })}
                    className="rounded text-rose-600"
                  />
                  <span>Neutered/Spayed</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowPetModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 shadow-md shadow-rose-600/20"
                >
                  {editingPet ? 'Update Pet' : 'Create Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPLICATION FULL REVIEW */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setReviewingApp(null)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-stone-400">Application Review</span>
              <StatusBadge status={reviewingApp.status} />
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-4">
              {reviewingApp.fullName} for {reviewingApp.pet?.name}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <p><strong>Applicant Email:</strong> {reviewingApp.email}</p>
                <p><strong>Contact Phone:</strong> {reviewingApp.phone}</p>
                <p><strong>Living Address:</strong> {reviewingApp.address}</p>
                <p><strong>Housing:</strong> {reviewingApp.housingType} (Fenced Yard: {reviewingApp.hasFencedYard ? 'Yes' : 'No'})</p>
                <p><strong>Other Pets:</strong> {reviewingApp.hasOtherPets ? 'Yes' : 'No'}</p>
                <p><strong>Experience:</strong> {reviewingApp.priorPetExperience}</p>
              </div>

              <div>
                <strong className="block text-stone-700 mb-1">Applicant Statement:</strong>
                <p className="p-3 bg-stone-50 rounded-xl text-stone-600 italic border border-stone-100">
                  "{reviewingApp.reasonForAdopting}"
                </p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Shelter Notes / Feedback to Applicant:
                </label>
                <textarea
                  rows="2"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Home check passed, scheduled pickup for Saturday morning..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setReviewingApp(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600"
                >
                  Close
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateApplicationStatus(reviewingApp._id, 'rejected')}
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700"
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateApplicationStatus(reviewingApp._id, 'approved')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                  >
                    Approve Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
