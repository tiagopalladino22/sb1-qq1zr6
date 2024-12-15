import React, { useEffect, useState } from 'react';
import { Users, Trophy, TrendingUp, Calendar } from 'lucide-react';
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
  id: string;      // Ensure your AddMatch assigns an id (e.g., crypto.randomUUID())
  rival: string;   // Changed from 'opponent' to 'rival' to match stored data
  date: string;
  score: Score;
  formation: string;
  scorers: string[];
  assists: string[];
  // ... other fields if any (cards, subs, etc.)
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  
  const homeTeamName = "Highland"; // Set your home team name here

  useEffect(() => {
    // Fetch data from local storage
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');

    setPlayers(storedPlayers);
    setMatches(storedMatches);
  }, []);

  const totalPlayers = players.length;
  const matchesPlayed = matches.length;
  const wins = matches.filter(match => match.score.home > match.score.away).length;
  const winRate = matchesPlayed ? Math.round((wins / matchesPlayed) * 100) : 0;

  // For nextMatch, if you have actual upcoming matches logic you should filter future dates.
  // Here, we just show 'No upcoming matches' if no logic is implemented.
  // Assuming the last match in 'matches' might not necessarily be upcoming.
  const nextMatch = "No hay"; // Placeholder or implement logic for upcoming

  // Stats displayed in cards
  const stats = [
    { label: 'Jugadores', value: totalPlayers.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Partidos', value: matchesPlayed.toString(), icon: Trophy, color: 'bg-green-500' },
    { label: '% Victorias', value: `${winRate}%`, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Proximo Partido', value: nextMatch, icon: Calendar, color: 'bg-red-500' },
  ];

  // Recent Performance (last 5 matches)
  const lastFiveMatches = matches.slice(-5);
  const recentPerformance = lastFiveMatches.map(match => {
    if (match.score.home > match.score.away) {
      return 'W';
    } else if (match.score.home < match.score.away) {
      return 'L';
    } else {
      return 'D';
    }
  });

  // Top performers by goals then assists
  const topPerformers = players
    .map(player => ({
      name: player.name,
      goals: player.stats?.goals || 0,
      assists: player.stats?.assists || 0,
      matches: player.stats?.matches || 0,
    }))
    .sort((a, b) => {
      if (b.goals !== a.goals) {
        return b.goals - a.goals;
      } else {
        return b.assists - a.assists;
      }
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
        <button
          onClick={() => navigate('/match-planning')}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19]"
        >
          Planificar Partido
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Performance Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Ultimos Resultados</h2>
          <div className="space-y-4">
            {recentPerformance.length > 0 ? (
              lastFiveMatches.map((match, index) => {
                const result = recentPerformance[index];
                return (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          result === 'W' ? 'bg-green-100 text-green-600' : result === 'L' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {result}
                      </span>
                      <span className="text-gray-700">{homeTeamName} vs {match.rival}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">{match.score.home} - {match.score.away}</span>
                      <button
                        onClick={() => navigate(`/match-details/${match.id}`)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-600">No hay partidos recientes</div>
            )}
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Mejores Jugadores</h2>
          <div className="space-y-4">
            {topPerformers.length > 0 ? (
              topPerformers.map((player, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {player.name.charAt(0)}
                    </div>
                    <span className="text-gray-700">{player.name}</span>
                  </div>
                  <span className="text-gray-600">
                    {player.goals > 0 ? `${player.goals} goals` : player.assists > 0 ? `${player.assists} assists` : `${player.matches} matches`}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-600">No hay informacion disponible</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

