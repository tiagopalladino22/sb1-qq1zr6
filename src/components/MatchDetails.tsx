import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface PlayerStats {
  goals: number;
  assists: number;
  matches: number;
  yellowCards?: number;
  redCards?: number;
}

interface Player {
  id?: string;
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

interface Score {
  home: number;
  away: number;
}

interface CardInfo {
  player: string;
  type: 'yellow' | 'red';
}

interface Substitution {
  playerOut: string;
  playerIn: string;
  minute: number;
}

interface Scorer {
  player: string;
  minute: number;
}

interface Match {
  id: string;
  rival: string;
  date: string;
  location: 'local' | 'visitor'; // Nuevo campo para local/visitante
  score: Score;
  formation: string;
  formationPlayers: { [position: string]: string };
  scorers: Scorer[];
  assists: string[];
  cards: CardInfo[];
  shotsFor: number;
  shotsAgainst: number;
  subs: Substitution[];
}

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);

    if (id) {
      const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
      const matchDetails = storedMatches.find((m: Match) => m.id === id) || null;
      setMatch(matchDetails);
    }
  }, [id]);

  if (!match) {
    return <div>Loading...</div>;
  }

  const homeTeamName = "Highland";

  // Helper functions
  const findPlayerData = (playerName: string) => {
    return players.find((player) => player.name === playerName);
  };

  const renderPlayerRow = (playerName: string, position: string) => {
    const player = findPlayerData(playerName);
    if (!player) return null;

    const goals = match.scorers
      .filter((scorer) => scorer.player === playerName)
      .map((scorer) => `${scorer.minute}'`);

    const assists = match.assists.filter((assist) => assist === playerName).length;
    const cards = match.cards.filter((card) => card.player === playerName);
    const subsIn = match.subs.find((sub) => sub.playerIn === playerName);
    const subsOut = match.subs.find((sub) => sub.playerOut === playerName);

    let nameDisplay = playerName;
    if (subsOut) nameDisplay += ` ↩ (${subsOut.minute}')`;
    if (subsIn) nameDisplay += ` ↪ (${subsIn.minute}')`;

    return (
      <tr key={playerName} className="border-b">
        <td className="px-2 py-1 text-sm">{position}</td>
        <td className="px-2 py-1 text-sm">{player.number}</td>
        <td className="px-2 py-1 text-sm">
          {nameDisplay}{' '}
          <span>
            {goals.length > 0 && `⚽ (${goals.join(', ')})`}
            {Array(assists).fill('🅰').join(' ')}
            {cards.map((card) =>
              card.type === 'yellow' ? '🟨' : '🟥'
            )}
          </span>
        </td>
        <td className="px-2 py-1 text-sm">{player.birthdate || 'N/A'}</td>
        <td className="px-2 py-1 text-sm">{player.height || 'N/A'}</td>
      </tr>
    );
  };

  const renderLineup = () => {
    const lineup = Object.entries(match.formationPlayers).map(([position, playerName]) => {
      const positionAbbr = position.split('-')[0].toUpperCase();
      return renderPlayerRow(playerName, positionAbbr);
    });

    return lineup.filter((row) => row !== null);
  };

  const renderSubstitutes = () => {
    const substituteNames = players.filter(
      (player) =>
        !Object.values(match.formationPlayers).includes(player.name)
    );

    return substituteNames.map((substitute) => renderPlayerRow(substitute.name, 'SUB'));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detalles del Partido</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19]"
        >
          Volver
        </button>
      </div>

      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-600">Fecha</p>
          <p className="text-xl font-bold text-gray-900">{match.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Rival</p>
          <p className="text-xl font-bold text-gray-900">{match.rival}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Local/Visitante</p>
          <p className="text-xl font-bold text-gray-900">
            {match.location === 'local' ? 'Local' : 'Visitante'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Resultado</p>
          <p className="text-xl font-bold text-gray-900">
            {match.score.home} - {match.score.away}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Formacion Utilizada</p>
          <p className="text-xl font-bold text-gray-900">{match.formation}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Tiros a puerta</p>
          <p className="text-xl font-bold text-gray-900">
            Nosotros: {match.shotsFor} | Rival: {match.shotsAgainst}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Formacion de {homeTeamName}</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Pos</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">N°</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Jugador</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Nacimiento</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Altura (cm)</th>
            </tr>
          </thead>
          <tbody>{renderLineup()}</tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Suplentes</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Pos</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">N°</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Jugador</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Nacimiento</th>
              <th className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Altura (cm)</th>
            </tr>
          </thead>
          <tbody>{renderSubstitutes()}</tbody>
        </table>
      </div>
    </div>
  );
}




