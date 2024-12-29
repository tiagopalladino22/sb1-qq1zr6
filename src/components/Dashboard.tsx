import React, { useEffect, useState } from 'react';
import { Users, Trophy, TrendingUp, Minus, Calendar,X, Star, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlayerStats {
  goals: number;
  assists: number;
  matches: number;
  yellowCards?: number;
  redCards?: number;
}

interface Player {
  name: string;
  stats?: PlayerStats;
}

interface Score {
  home: number;
  away: number;
}

interface Match {
  id: string;
  rival: string;
  date: string;
  score: Score;
  formation: string;
  scorers: string[];
  assists: string[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const homeTeamName = "Highland";

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');

    setPlayers(storedPlayers);
    setMatches(storedMatches);
  }, []);

  const totalPlayers = players.length;
  const matchesPlayed = matches.length;
  const wins = matches.filter(match => match.score.home > match.score.away).length;
  const draws = matches.filter(match => match.score.home === match.score.away).length;
  const losses = matchesPlayed - wins - draws;
  const totalPoints = matches.reduce((acc, match) => {
    if (match.score.home > match.score.away) {
      return acc + 3; // Victoria
    } else if (match.score.home === match.score.away) {
      return acc + 1; // Empate
    }
    return acc; // Derrota
  }, 0);
  
  const maxPoints = matchesPlayed * 3; // Puntos máximos posibles
  const pointPercentage = matchesPlayed ? Math.round((totalPoints / maxPoints) * 100) : 0;
  
  const recentMatches = matches.slice(-5);
  const topPerformers = players
    .map(player => ({
      name: player.name,
      goals: player.stats?.goals || 0,
      assists: player.stats?.assists || 0,
    }))
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 3);

  const stats = [
    { label: 'Jugadores', value: totalPlayers.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Partidos', value: matchesPlayed.toString(), icon: Trophy, color: 'bg-green-500' },
    { label: '% Puntos', value: `${pointPercentage}%`, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Victorias', value: wins.toString(), icon: Star, color: 'bg-yellow-500' },
    { label: 'Empates', value: draws.toString(), icon: Minus, color: 'bg-gray-500' },
    { label: 'Derrotas', value: losses.toString(), icon: X, color: 'bg-red-500' },
    
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard del Equipo</h1>
        <button
          onClick={() => navigate('/match-planning')}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19]"
        >
          Planificar Partido
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl  shadow-md shadow-[#218b21] p-6 flex items-center space-x-4">
              <div className={`${stat.color} p-3 rounded-full`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches Section */}
        <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Ultimos Partidos</h2>
          <ul className="space-y-4">
            {recentMatches.length > 0 ? (
              recentMatches.map(match => (
                <li key={match.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-700">
                    {homeTeamName} vs {match.rival}
                  </div>
                  <div className="text-gray-700">
                    {match.score.home} - {match.score.away}
                  </div>
                  <button
                    onClick={() => navigate(`/match-details/${match.id}`)}
                    className="text-[#218b21] hover:underline"
                  >
                    Ver Detalles
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No hay partidos recientes</p>
            )}
          </ul>
        </div>

        {/* Top Performers Section */}
        <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Mejores Jugadores</h2>
          <ul className="space-y-4">
            {topPerformers.length > 0 ? (
              topPerformers.map((player, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold">
                      {player.name.charAt(0)}
                    </div>
                    <span className="text-gray-700 font-semibold">{player.name}</span>
                  </div>
                  <div className="text-gray-600">
                    {player.goals} Goles, {player.assists} Asistencias
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No hay jugadores destacados</p>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Estadísticas Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total de Partidos</h3>
            <p className="text-lg font-bold text-gray-900">{matchesPlayed}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Victorias</h3>
            <p className="text-lg font-bold text-gray-900">{wins}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Derrotas</h3>
            <p className="text-lg font-bold text-gray-900">{losses}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Empates</h3>
            <p className="text-lg font-bold text-gray-900">{draws}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
