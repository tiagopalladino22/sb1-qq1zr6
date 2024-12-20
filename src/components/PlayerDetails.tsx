import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlayerStats {
  goals: number;
  assists: number;
  matches: number;
  minutesPlayed?: number;
  yellowCards?: number;
  redCards?: number;
  positions?: {
    [position: string]: {
      minutesPlayed: number;
      goals: number;
      assists: number;
      yellowCards: number;
      redCards: number;
    };
  };
}


interface Substitution {
  playerOut: string;
  playerIn: string;
  minute: number;
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

interface Formation {
  name: string;
  type: string;
  roles: { [position: string]: string }; // Mapeo de posiciones a nombres personalizados
  defenderLines: number[];
  midfielderLines: number[];
  forwardLines: number[];
}


interface Match {
  id: string;
  formationPlayers: { [position: string]: string };
  scorers: string[];
  assists: string[];
  cards: { player: string; type: "yellow" | "red" }[];
  score: { home: number; away: number };
  shotsFor: number;
  shotsAgainst: number;
  date: string;
  formationUsed: string; // Formación utilizada
  subs: { playerOut: string; playerIn: string; minute: number }[]; // <-- Agregar subs aquí
}


export default function PlayerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [positionsPlayed, setPositionsPlayed] = useState<
    {
      position: string;
      minutes: number;
      goals: number;
      assists: number;
      yellowCards: number;
      redCards: number;
    }[]
  >([]);
  const [performance, setPerformance] = useState({
    asStarter: {
      matches: 0,
      wins: 0,
      draws: 0, // <-- Agregado
      losses: 0, // <-- Agregado
      goalsFor: 0,
      goalsAgainst: 0,
      shotsFor: 0,
      shotsAgainst: 0,
    },
    asSubstitute: {
      matches: 0,
      wins: 0,
      draws: 0, // <-- Agregado
      losses: 0, // <-- Agregado
      goalsFor: 0,
      goalsAgainst: 0,
      shotsFor: 0,
      shotsAgainst: 0,
    },
    notPlayed: {
      matches: 0,
      wins: 0,
      draws: 0, // <-- Agregado
      losses: 0, // <-- Agregado
      goalsFor: 0,
      goalsAgainst: 0,
      shotsFor: 0,
      shotsAgainst: 0,
    },
  });
  

  useEffect(() => {
    const storedPlayers: Player[] = JSON.parse(localStorage.getItem("players") || "[]");
    const storedMatches: Match[] = JSON.parse(localStorage.getItem("matches") || "[]");
    const storedFormations: Formation[] = JSON.parse(localStorage.getItem("formations") || "[]");
  
    const foundPlayer = storedPlayers.find((p) => p.id === id) || null;
    setPlayer(foundPlayer);
  
    setFormations(storedFormations); // Aseguramos cargar las formaciones
  
    const playerMatches = storedMatches.filter((match) =>
      Object.values(match.formationPlayers).includes(foundPlayer?.name || "")
    );
    setMatches(playerMatches);
  
    calculatePositionsPlayed(playerMatches, foundPlayer?.name || "");
    calculatePerformance(storedMatches, foundPlayer?.name || "");
  }, [id]);
  
  
  

  const calculatePositionsPlayed = (playerMatches: Match[], playerName: string) => {
    const positionsMap: {
      [key: string]: {
        minutes: number;
        goals: number;
        assists: number;
        yellowCards: number;
        redCards: number;
      };
    } = {};
  
    playerMatches.forEach((match) => {
      // Buscar sustituciones
      const subIn = match.subs?.find((sub) => sub.playerIn === playerName);
      const subOut = match.subs?.find((sub) => sub.playerOut);
  
      let assignedPosition = null;
  
      // Si el jugador entró como suplente
      if (subIn) {
        // Buscar la posición del jugador que salió
        assignedPosition = Object.entries(match.formationPlayers).find(
          ([, name]) => name === subOut?.playerOut
        )?.[0]; // Primera posición encontrada
  
        if (assignedPosition) {
          const minutesPlayed = 90 - subIn.minute;
  
          if (!positionsMap[assignedPosition]) {
            positionsMap[assignedPosition] = {
              minutes: 0,
              goals: 0,
              assists: 0,
              yellowCards: 0,
              redCards: 0,
            };
          }
  
          positionsMap[assignedPosition].minutes += minutesPlayed;
          positionsMap[assignedPosition].goals += match.scorers.filter((s) => s === playerName).length;
          positionsMap[assignedPosition].assists += match.assists.filter((a) => a === playerName).length;
          positionsMap[assignedPosition].yellowCards += match.cards.filter(
            (c) => c.player === playerName && c.type === "yellow"
          ).length;
          positionsMap[assignedPosition].redCards += match.cards.filter(
            (c) => c.player === playerName && c.type === "red"
          ).length;
        }
      }
  
      // Si el jugador empezó como titular
      Object.entries(match.formationPlayers).forEach(([position, name]) => {
        if (name === playerName) {
          const minutesPlayed = subOut?.playerOut === playerName ? subOut.minute : 90;
  
          if (!positionsMap[position]) {
            positionsMap[position] = {
              minutes: 0,
              goals: 0,
              assists: 0,
              yellowCards: 0,
              redCards: 0,
            };
          }
  
          positionsMap[position].minutes += minutesPlayed;
          positionsMap[position].goals += match.scorers.filter((s) => s === playerName).length;
          positionsMap[position].assists += match.assists.filter((a) => a === playerName).length;
          positionsMap[position].yellowCards += match.cards.filter(
            (c) => c.player === playerName && c.type === "yellow"
          ).length;
          positionsMap[position].redCards += match.cards.filter(
            (c) => c.player === playerName && c.type === "red"
          ).length;
        }
      });
    });
  
    const positions = Object.entries(positionsMap).map(([position, stats]) => ({
      position,
      ...stats,
    }));
  
    console.log("Final Positions Map:", positions);
    setPositionsPlayed(positions);
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  const calculatePerformance = (allMatches: Match[], playerName: string) => {
    const performanceStats = {
      asStarter: { matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, shotsFor: 0, shotsAgainst: 0 },
      asSubstitute: { matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, shotsFor: 0, shotsAgainst: 0 },
      notPlayed: { matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, shotsFor: 0, shotsAgainst: 0 },
    };
  
    allMatches.forEach((match) => {
      const isStarter = Object.values(match.formationPlayers).includes(playerName);
      const isSubstitute = match.subs.some((sub) => sub.playerIn === playerName);
  
      // Calcular el resultado del partido
      const result =
        match.score.home > match.score.away
          ? "win"
          : match.score.home < match.score.away
          ? "loss"
          : "draw";
  
      if (isStarter) {
        // Estadísticas como titular
        performanceStats.asStarter.matches++;
        if (result === "win") performanceStats.asStarter.wins++;
        if (result === "draw") performanceStats.asStarter.draws++;
        if (result === "loss") performanceStats.asStarter.losses++;
  
        performanceStats.asStarter.goalsFor += match.score.home;
        performanceStats.asStarter.goalsAgainst += match.score.away;
        performanceStats.asStarter.shotsFor += match.shotsFor;
        performanceStats.asStarter.shotsAgainst += match.shotsAgainst;
      } else if (isSubstitute) {
        // Estadísticas como suplente
        performanceStats.asSubstitute.matches++;
        if (result === "win") performanceStats.asSubstitute.wins++;
        if (result === "draw") performanceStats.asSubstitute.draws++;
        if (result === "loss") performanceStats.asSubstitute.losses++;
  
        performanceStats.asSubstitute.goalsFor += match.score.home;
        performanceStats.asSubstitute.goalsAgainst += match.score.away;
        performanceStats.asSubstitute.shotsFor += match.shotsFor;
        performanceStats.asSubstitute.shotsAgainst += match.shotsAgainst;
      } else {
        // No jugó
        performanceStats.notPlayed.matches++;
        if (result === "win") performanceStats.notPlayed.wins++;
        if (result === "draw") performanceStats.notPlayed.draws++;
        if (result === "loss") performanceStats.notPlayed.losses++;
  
        performanceStats.notPlayed.goalsFor += match.score.home;
        performanceStats.notPlayed.goalsAgainst += match.score.away;
        performanceStats.notPlayed.shotsFor += match.shotsFor;
        performanceStats.notPlayed.shotsAgainst += match.shotsAgainst;
      }
    });
  
    setPerformance(performanceStats);
  };
  
  

  if (!player) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <button
          onClick={() => navigate("/players")}
          className="text-[#218b21] hover:text-[#000000] flex items-center space-x-2 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <div className="text-center text-gray-500">Jugador no encontrado.</div>
      </div>
    );
  }

  const stats = player.stats || {
    goals: 0,
    assists: 0,
    matches: 0,
    yellowCards: 0,
    redCards: 0,
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <button
        onClick={() => navigate("/players")}
        className="text-[#218b21] hover:text-[#000000] flex items-center space-x-2"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver</span>
      </button>

      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 flex-shrink-0">
            <img
              className="h-20 w-20 rounded-full object-cover"
              src={player.photo || "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg"}
              alt={player.name}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">{player.name}</h2>
            <p className="text-black">
              #{player.number} | {player.position}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-black mb-2">Informacion Personal</h3>
            <ul className="space-y-1 text-black">
              {player.height && <li><strong>Altura:</strong> {player.height}</li>}
              {player.weight && <li><strong>Peso:</strong> {player.weight}</li>}
              {player.birthdate && <li><strong>Nacimiento:</strong> {player.birthdate}</li>}
              {player.preferredFoot && <li><strong>Pierna habil:</strong> {player.preferredFoot}</li>}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-2">Stats</h3>
            <ul className="space-y-1 text-gray-700">
              <li><strong>Partidos:</strong> {stats.matches}</li>
              <li><strong>Goles:</strong> {stats.goals}</li>
              <li><strong>Asistencias:</strong> {stats.assists}</li>
              <li><strong>Amarillas:</strong> {stats.yellowCards || 0}</li>
              <li><strong>Rojas:</strong> {stats.redCards || 0}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Posiciones Jugadas</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left font-semibold">Posicion</th>
                <th className="p-4 text-left font-semibold">Minutos Jugados</th>
                <th className="p-4 text-left font-semibold">Goles</th>
                <th className="p-4 text-left font-semibold">Asistencias</th>
                <th className="p-4 text-left font-semibold">Amarillas</th>
                <th className="p-4 text-left font-semibold">Rojas</th>
              </tr>
            </thead>
            <tbody>
  {positionsPlayed.length > 0 ? (
    positionsPlayed.map((pos, index) => (
      <tr key={index} className="hover:bg-gray-100">
        <td className="p-4 text-gray-700">{pos.position}</td>
        <td className="p-4 text-gray-700">{pos.minutes}</td>
        <td className="p-4 text-gray-700">{pos.goals}</td>
        <td className="p-4 text-gray-700">{pos.assists}</td>
        <td className="p-4 text-gray-700">{pos.yellowCards}</td>
        <td className="p-4 text-gray-700">{pos.redCards}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="p-4 text-center text-gray-500">
        No hay información disponible.
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Como Suplente</h3>
  {player.stats?.positions?.["Suplente"] ? (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
        <thead className="bg-black text-white">
          <tr>
            <th className="p-4 text-left font-semibold">Posicion</th>
            <th className="p-4 text-left font-semibold">Minutos Jugados</th>
            <th className="p-4 text-left font-semibold">Goles</th>
            <th className="p-4 text-left font-semibold">Asistencias</th>
            <th className="p-4 text-left font-semibold">Amarillas</th>
            <th className="p-4 text-left font-semibold">Rojas</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100">
            <td className="p-4 text-gray-700">Suplente</td>
            <td className="p-4 text-gray-700">{player.stats.positions["Suplente"].minutesPlayed || 0}</td>
            <td className="p-4 text-gray-700">{player.stats.positions["Suplente"].goals || 0}</td>
            <td className="p-4 text-gray-700">{player.stats.positions["Suplente"].assists || 0}</td>
            <td className="p-4 text-gray-700">{player.stats.positions["Suplente"].yellowCards || 0}</td>
            <td className="p-4 text-gray-700">{player.stats.positions["Suplente"].redCards || 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-gray-500">No hay estadísticas como suplente disponibles.</p>
  )}
</div>



<div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento del equipo</h3>
  <ul className="space-y-2 text-gray-700">
    <li>
      <strong>Como titular:</strong> {performance.asStarter.matches} partidos, {performance.asStarter.wins} victorias, {performance.asStarter.draws} empates, {performance.asStarter.losses} derrotas, {performance.asStarter.goalsFor} goles a favor, {performance.asStarter.goalsAgainst} goles en contra.
    </li>
    <li>
      <strong>Como suplente:</strong> {performance.asSubstitute.matches} partidos, {performance.asSubstitute.wins} victorias, {performance.asSubstitute.draws} empates, {performance.asSubstitute.losses} derrotas, {performance.asSubstitute.goalsFor} goles a favor, {performance.asSubstitute.goalsAgainst} goles en contra.
    </li>
    <li>
      <strong>Sin Jugar:</strong> {performance.notPlayed.matches} partidos, {performance.notPlayed.wins} victorias, {performance.notPlayed.draws} empates, {performance.notPlayed.losses} derrotas, {performance.notPlayed.goalsFor} goles a favor, {performance.notPlayed.goalsAgainst} goles en contra.
    </li>
  </ul>
</div>

    </div>
  );
}
