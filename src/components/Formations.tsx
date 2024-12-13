import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Formation {
  name: string;
  type: string;
  players: { [position: string]: string };
  gamesPlayed: number;
}

export default function FormationsPage() {
  const navigate = useNavigate();
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    // Get formations from local storage when the component mounts
    const storedFormations = JSON.parse(localStorage.getItem('formations') || '[]');
    setFormations(storedFormations);
  }, []);

  const handleDeleteFormation = (index: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this formation?');
    if (!confirmDelete) return;

    const updatedFormations = formations.filter((_, i) => i !== index);
    setFormations(updatedFormations);
    localStorage.setItem('formations', JSON.stringify(updatedFormations));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Formaciones</h1>
        <button
          onClick={() => navigate('/add-formation')}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19] flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Formacion</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border-2 border-[#218b21] overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#000000]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Partidos Jugados
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formations.length > 0 ? (
              formations.map((formation, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formation.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formation.gamesPlayed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-4">
                    <button
                      onClick={() => navigate(`/formation-details/${index}`)}
                      className="text-[#218b21] hover:text-[#000000]"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleDeleteFormation(index)}
                      className="text-red-600 hover:text-red-800 flex items-center space-x-2"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Eliminar</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay formaciones disponibles. Hace click en "Agregar Formacion" para crear una.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}




