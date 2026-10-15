import React from 'react';
import { Heart, Sparkles, Shield, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">PetAdopt Shelter</span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Connecting rescue pets with loving homes. Every animal deserves a second chance at happiness and lifelong family companionship.
            </p>
            {/* <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-400" /> Verified 501(c)(3) Non-Profit
              </span>
            </div> */}
          </div>

          {/* Quick Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Shelter Info</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>380015, Nehru Nagar, Ahmedabad, Gujarat</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>+91 84017926</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>het@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Adoption Hours */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Shelter Hours</h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span className="text-stone-300">10:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-stone-300">9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-stone-300">11:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} PawAdopt Management System. Built for full adoption lifecycle management.</p>
        </div>
      </div>
    </footer>
  );
};
