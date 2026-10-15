import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const PetFilterBar = ({
  search,
  setSearch,
  species,
  setSpecies,
  breed,
  setBreed,
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
  status,
  setStatus,
  speciesOptions = [],
  breedOptions = [],
  onReset
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4 mb-8">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by pet name, breed, or personality keywords..."
          className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Species Filter */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
            Species
          </label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          >
            <option value="all">All Species</option>
            {speciesOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Breed Filter */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
            Breed
          </label>
          <select
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          >
            <option value="all">All Breeds</option>
            {breedOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Age Range Filter */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
            Age (Years)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="25"
              placeholder="Min"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <span className="text-stone-400 text-xs font-medium">to</span>
            <input
              type="number"
              min="0"
              max="25"
              placeholder="Max"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
        </div>

        {/* Status / Reset */}
        <div className="flex items-end gap-2">
          {setStatus && (
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>
          )}

          <button
            onClick={onReset}
            type="button"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-xl transition-colors h-[42px]"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
