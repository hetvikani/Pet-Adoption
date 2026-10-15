import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { PetCard } from '../components/PetCard';
import { PetFilterBar } from '../components/PetFilterBar';
import { Pagination } from '../components/Pagination';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

export const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('all');
  const [breed, setBreed] = useState('all');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Dynamic filter options
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [breedOptions, setBreedOptions] = useState([]);

  // Fetch pets with debounce or filter update
  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 9,
        status: 'available'
      };

      if (search.trim()) params.search = search.trim();
      if (species !== 'all') params.species = species;
      if (breed !== 'all') params.breed = breed;
      if (minAge !== '') params.minAge = minAge;
      if (maxAge !== '') params.maxAge = maxAge;

      const res = await axiosClient.get('/pets', { params });
      if (res.data?.success) {
        setPets(res.data.data);
        setTotalPages(res.data.pages);
        setTotalCount(res.data.total);

        // Update dropdown choices if available
        if (res.data.filterOptions) {
          if (res.data.filterOptions.species) setSpeciesOptions(res.data.filterOptions.species);
          if (res.data.filterOptions.breeds) setBreedOptions(res.data.filterOptions.breeds);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load pets at the moment. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [page, species, breed, minAge, maxAge]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPets();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleResetFilters = () => {
    setSearch('');
    setSpecies('all');
    setBreed('all');
    setMinAge('');
    setMaxAge('');
    setPage(1);
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-rose-900 via-stone-900 to-amber-950 text-white p-8 sm:p-12 mb-10 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Give a pet a forever home</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Meet Your Future Best Friend Today.
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Every day, rescue pets are waiting for loving families. Browse our verified dogs, cats, rabbits, and birds ready for instant adoption inquiries.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <PetFilterBar
          search={search}
          setSearch={setSearch}
          species={species}
          setSpecies={setSpecies}
          breed={breed}
          setBreed={setBreed}
          minAge={minAge}
          setMinAge={setMinAge}
          maxAge={maxAge}
          setMaxAge={setMaxAge}
          speciesOptions={speciesOptions}
          breedOptions={breedOptions}
          onReset={handleResetFilters}
        />

        {/* Header Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <span>Available Pets</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
              {totalCount} found
            </span>
          </h2>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-stone-200 rounded-2xl"></div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">No Pets Match Your Criteria</h3>
            <p className="text-sm text-stone-500 mb-6">
              Try adjusting your search keywords, species selection, or age ranges to discover more pets.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Pets Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
