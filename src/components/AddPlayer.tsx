import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';

export default function AddPlayer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: crypto.randomUUID(),
    name: '',
    position: 'Forward',
    number: '',
    height: '',
    weight: '',
    birthdate: '',
    preferredFoot: 'Right',
    photo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get the existing players from local storage
    const existingPlayers = JSON.parse(localStorage.getItem('players') || '[]');

    // Add the new player to the existing players list
    const updatedPlayers = [...existingPlayers, formData];

    // Save the updated list back to local storage
    localStorage.setItem('players', JSON.stringify(updatedPlayers));

    // Navigate to the players list page
    navigate('/players');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Player</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numero de Camiseta
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posicion
            </label>
            <select
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Goalkeeper">Arquero</option>
              <option value="Defender">Defensor</option>
              <option value="Midfielder">Mediocampista</option>
              <option value="Forward">Delantero</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pierna Habil
            </label>
            <select
              value={formData.preferredFoot}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredFoot: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Right">Derecho</option>
              <option value="Left">Izquierdo</option>
              <option value="Both">Ambas</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Altura (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nacimiento
            </label>
            <input
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link de la foto
          </label>
          <input
            type="url"
            value={formData.photo}
            onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/players')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19] flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Guardar Jugador</span>
          </button>
        </div>
      </form>
    </div>
  );
}
