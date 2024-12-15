import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';

interface MatchHistory {
  date: string;
  score: { home: number; away: number };
  notes: string;
}

interface Rival {
  name: string;
  logo: string;
  homeGround: string;
  primaryColor: string;
  secondaryColor: string;
  notes: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  matchHistory: MatchHistory[];
}

export default function AddRival() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Rival>({
    name: '',
    logo: '',
    homeGround: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    notes: '',
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    matchHistory: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get existing rivals from local storage and add the new rival
    const existingRivals: Rival[] = JSON.parse(localStorage.getItem('rivals') || '[]');
    const updatedRivals = [...existingRivals, formData];
    localStorage.setItem('rivals', JSON.stringify(updatedRivals));

    // Navigate back to the rivals list page
    navigate('/rivals');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Agregar Rival</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Nombre</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">Escudo URL</label>
          <input
            type="url"
            value={formData.logo}
            onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/rivals')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19] flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Guardar Rival</span>
          </button>
        </div>
      </form>
    </div>
  );
}
