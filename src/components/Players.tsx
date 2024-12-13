import React, { useEffect, useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlayerStats {
  goals: number;
  assists: number;
  matches: number;
  yellowCards?: number;
  redCards?: number;
}

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  height?: string;
  weight?: string;
  birthdate?: string;
  preferredFoot?: string;
  photo?: string;
  stats?: PlayerStats;
}

export default function Players() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedPlayers: Player[] = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);
  }, []);

  const filteredPlayers = players.filter(player => {
    const term = searchTerm.toLowerCase();
    return (
      player.name.toLowerCase().includes(term) ||
      player.position.toLowerCase().includes(term)
    );
  });

  const deletePlayer = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this player?");
    if (!confirmDelete) return;

    const updatedPlayers = players.filter(p => p.id !== id);
    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Jugadores</h1>
        <button
          onClick={() => navigate('/add-player')}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19] flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Jugador</span>
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o posicion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-[#218b21] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button className="px-4 py-2 border-2 border-[#218b21] rounded-lg flex items-center space-x-2 hover:bg-gray-50">
          <Filter className="h-5 w-5 text-[#218b21]" />
          <span>Filtrar</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-[#218b21]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#000000]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Jugador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Posicion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Numero
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Estadisticas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => {
                // Explicitly type stats with a fallback
                const stats: PlayerStats = player.stats || {
                  goals: 0,
                  assists: 0,
                  matches: 0,
                  yellowCards: 0,
                  redCards: 0
                };
                return (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full" src={player.photo || 'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg'} alt={player.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{player.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {player.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col space-y-1">
                        <span>{stats.goals} goals</span>
                        <span>{stats.assists} assists</span>
                        <span>{stats.matches} matches</span>
                        <span>{stats.yellowCards || 0} yellow cards</span>
                        <span>{stats.redCards || 0} red cards</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button
                        onClick={() => navigate(`/player/${player.id}`)}
                        className="text-[#218b21] hover:text-[#000000]"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => deletePlayer(player.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron jugadores. Intenta con otra busqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}





