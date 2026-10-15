import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, Sparkles, ArrowRight } from 'lucide-react';

export const PetCard = ({ pet }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
  const displayImage = (pet.photos && pet.photos.length > 0 && pet.photos[0]) ? pet.photos[0] : defaultImage;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Image & Status Tag */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={displayImage}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute top-3 right-3 shadow-md rounded-full backdrop-blur-sm">
          <StatusBadge status={pet.status} />
        </div>
        <div className="absolute bottom-3 left-3 bg-stone-900/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{pet.species}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-xl font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
              {pet.name}
            </h3>
            {pet.adoptionFee > 0 ? (
              <span className="text-sm font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                ₹{pet.adoptionFee}
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Free Adoption
              </span>
            )}
          </div>

          <p className="text-sm font-medium text-stone-500 mb-3">
            {pet.breed} • {pet.gender}
          </p>

          <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mb-4">
            {pet.description}
          </p>
        </div>

        <div className="pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {pet.age} {pet.age === 1 ? 'year old' : 'years old'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              {pet.location || 'Shelter'}
            </span>
          </div>

          <Link
            to={`/pets/${pet._id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-50 hover:bg-rose-600 hover:text-white text-stone-700 text-sm font-semibold rounded-xl border border-stone-200 hover:border-transparent transition-all shadow-sm group-hover:shadow"
          >
            <span>Meet {pet.name}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
