import React, { useEffect, useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Match {
  id: number;
  rival: string;
  date: string;
  score: { home: number; away: number };
  formation: string;
  scorers: string[];
  assists: string[];
}

export default function MatchRegistry() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Get matches from local storage when the component is mounted
    const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');

    // Sort matches by date in descending order
    const sortedMatches = storedMatches.sort(
      (a: Match, b: Match) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setMatches(sortedMatches);
    setFilteredMatches(sortedMatches);
  }, []);

  const applyFilter = (query: string, data: Match[]) => {
    const q = query.toLowerCase();
    return data.filter(
      match =>
        match.rival.toLowerCase().includes(q) || match.date.includes(q)
    );
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = applyFilter(query, matches);
    setFilteredMatches(filtered);
  };

  const deleteMatch = (id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this match?'
    );
    if (!confirmDelete) return;

    const updatedMatches = matches.filter(m => m.id !== id);

    // Sort the remaining matches again
    const sortedMatches = updatedMatches.sort(
      (a: Match, b: Match) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setMatches(sortedMatches);

    // Re-apply the filter with the current search query after deletion
    const filtered = applyFilter(searchQuery, sortedMatches);
    setFilteredMatches(filtered);

    localStorage.setItem('matches', JSON.stringify(sortedMatches));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Registro de Partidos</h1>
        <button
          onClick={() => navigate('/add-match')}
          className="mt-4 lg:mt-0 bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19] flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Partido</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleFilter}
          placeholder="Buscar por fecha o rival..."
          className="w-full pl-10 pr-4 py-2 border-2 border-[#218b21] rounded-lg focus:ring-2 focus:ring-[#218b21] focus:border-[#218b21]"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border-2 border-[#218b21] overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#000000]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Rival
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Resultado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Formacion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match, index) => (
                <tr key={match.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {match.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {match.rival}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {match.score.home} - {match.score.away}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {match.formation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => navigate(`/match-details/${match.id}`)}
                        className="inline-flex items-center space-x-2 text-[#218b21] hover:text-[#000000]"
                      >
                        <Eye className="h-5 w-5" />
                        <span>Ver Detalles</span>
                      </button>
                      <button
                        onClick={() => deleteMatch(match.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No se encontraron partidos. Hace click en "Agregar Partido" para registrar un nuevo encuentro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
