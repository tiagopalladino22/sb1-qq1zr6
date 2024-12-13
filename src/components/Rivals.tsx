import React, { useEffect, useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Rival {
  name: string;
  logo: string;
  homeGround: string;
  primaryColor: string;
  secondaryColor: string;
  notes: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  matches: {
    date: string;
    score: { home: number; away: number };
    formationUsed: string;
  }[];
}

export default function Rivals() {
  const navigate = useNavigate();
  const [rivals, setRivals] = useState<Rival[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Obtener rivales desde localStorage y recalcular estadísticas
    const storedRivals: Rival[] = JSON.parse(localStorage.getItem("rivals") || "[]");
  
    const updatedRivals = storedRivals.map((rival) => {
      // Ensure `rival.matches` is an array before using it
      const matches = Array.isArray(rival.matches) ? rival.matches : [];
  
      const wins = matches.filter((match) => match.score.home > match.score.away).length;
      const losses = matches.filter((match) => match.score.home < match.score.away).length;
      const draws = matches.filter((match) => match.score.home === match.score.away).length;
  
      return {
        ...rival,
        matchesPlayed: matches.length, // Total partidos jugados
        wins,
        losses,
        draws,
      };
    });
  
    setRivals(updatedRivals);
  }, []);
  
  const handleDeleteRival = (index: number) => {
    const updatedRivals = rivals.filter((_, i) => i !== index);
    setRivals(updatedRivals);
    localStorage.setItem('rivals', JSON.stringify(updatedRivals));
  };

  const filteredRivals = rivals.filter((rival) =>
    rival.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rivales</h1>
        <button
          onClick={() => navigate('/add-rival')}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19] flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Rival</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar rivales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-2 border-[#218b21] rounded-lg focus:ring-2 focus:ring-[#196a19] focus:border-[#196a19]"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border-2 border-[#218b21] overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#000000]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Equipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Partidos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Record
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRivals.length > 0 ? (
              filteredRivals.map((rival, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {rival.logo && (
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full" src={rival.logo} alt={rival.name} />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{rival.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rival.matchesPlayed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rival.wins}W - {rival.losses}L - {rival.draws}D
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => navigate(`/rival-details/${index}`)}
                        className="text-[#218b21] hover:text-[#000000] flex items-center space-x-1"
                      >
                        <span>Ver Detalles</span>
                      </button>
                      <button
                        onClick={() => handleDeleteRival(index)}
                        className="text-red-500 hover:text-red-700 flex items-center space-x-1"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay rivales disponibles. Hace click "Agregar Rival" para crear uno.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



