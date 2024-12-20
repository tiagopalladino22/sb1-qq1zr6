import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface Player {
  name: string;
  position: string;
  stats: {
    goals: number;
    assists: number;
    matches: number;
    yellowCards: number;
    redCards: number;
  };
  impact: number; // porcentaje de victorias como titular
}

interface Formation {
  name: string;
  type: string;
  players: { [position: string]: string };
  roles: { [position: string]: string };
  gamesPlayed: number;
  goalsFor?: number;
  goalsAgainst?: number;
  shotsFor?: number;
  shotsAgainst?: number;
  defenderLines: number[];
  midfielderLines: number[];
  forwardLines: number[];
}

interface Match {
  id: string;
  rival: string;
  formation: string;
  formationPlayers: { [position: string]: string };
  lineup: { [position: string]: string };
  score: {
    home: number;
    away: number;
  };
  shotsFor: number;
  shotsAgainst: number;
  scorers: string[];  // Lista de goleadores
  assists: string[];  // Lista de asistencias
  subs: { playerOut: string; playerIn: string; minute: number }[]; // Sustituciones
}

interface MatchPlan {
  id: string;
  rival: string;
  formation: string;
  lineup: { [position: string]: string }; // Posiciones y jugadores propuestos
}



interface Rival {
  name: string;
  notes: string[];
}

export default function MatchPlanning() {
const navigate = useNavigate(); // Para redirigir después de guardar
  const [formations, setFormations] = useState<Formation[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rivals, setRivals] = useState<Rival[]>([]);
  const [rival, setRival] = useState<Rival | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(
    null
  );
  const [formationPlayers, setFormationPlayers] = useState<{
    [position: string]: string;
  }>({});
  const [allMatches, setAllMatches] = useState<Match[]>([]);

  useEffect(() => {

    
    // Cargar datos iniciales de localStorage
    const storedMatches = JSON.parse(localStorage.getItem("matches") || "[]");
  setAllMatches(storedMatches);


    const storedFormations = JSON.parse(
      localStorage.getItem("formations") || "[]"
    );
    setFormations(storedFormations);

    const storedPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    setPlayers(storedPlayers);

    const storedRivals = JSON.parse(localStorage.getItem("rivals") || "[]");
    setRivals(storedRivals);
  }, []);

  const handleSavePlan = () => {
    if (!rival || !selectedFormation || Object.keys(formationPlayers).length < 11) {
      alert("Completa todos los campos antes de guardar la planificación.");
      return;
    }
  
    const newPlan: MatchPlan = {
      id: crypto.randomUUID(),
      rival: rival.name,
      formation: selectedFormation.name,
      lineup: formationPlayers,
    };
  
    // Guardar en localStorage bajo "matchPlans"
    const storedPlans = JSON.parse(localStorage.getItem("matchPlans") || "[]");
    const updatedPlans = [...storedPlans, newPlan];
    localStorage.setItem("matchPlans", JSON.stringify(updatedPlans));
  
    navigate('/match-plans');
    setRival(null);
    setSelectedFormation(null);
    setFormationPlayers({});
  };
  
  

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Planificación del Partido</h1>
      </div>

      <RivalSelector rivals={rivals} rival={rival} setRival={setRival} />
      <FormationSelector
        formations={formations}
        selectedFormation={selectedFormation}
        setSelectedFormation={setSelectedFormation}
        formationPlayers={formationPlayers}
        setFormationPlayers={setFormationPlayers}
      />
      <LineupRecommendations
        players={players}
        allMatches={allMatches}
        selectedFormation={selectedFormation}
        formationPlayers={formationPlayers}
        setFormationPlayers={setFormationPlayers}
      />
      <ChangeSuggestions players={players} formationPlayers={formationPlayers} />
      <div>
      <button
          onClick={handleSavePlan}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19]"
        >
          Guardar Planificación
        </button>
      </div>
    </div>
  );
}


function RivalSelector({
    rivals,
    rival,
    setRival,
  }: {
    rivals: Rival[];
    rival: Rival | null;
    setRival: (rival: Rival | null) => void;
  }) {
    const [newNote, setNewNote] = useState<string>(''); // Estado para la nueva nota
  
    const handleAddNote = () => {
      if (rival && newNote.trim() !== '') {
        const updatedRival = {
          ...rival,
          notes: [...(rival.notes || []), newNote], // Agregar la nueva nota
        };
  
        // Actualizar localStorage
        const updatedRivals = rivals.map((r) =>
          r.name === rival.name ? updatedRival : r
        );
        localStorage.setItem('rivals', JSON.stringify(updatedRivals));
  
        // Actualizar el estado
        setRival(updatedRival);
        setNewNote(''); // Limpiar el input
      }
    };
  
    return (
      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Seleccionar Rival</h2>
        <select
          value={rival?.name || ''}
          onChange={(e) => {
            const selectedRival = rivals.find((r) => r.name === e.target.value);
            setRival(selectedRival || null);
          }}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Seleccionar Rival</option>
          {rivals.map((rival) => (
            <option key={rival.name} value={rival.name}>
              {rival.name}
            </option>
          ))}
        </select>
        {rival && (
          <div className="mt-4">
            {/* Notas del Rival */}
            <h3 className="font-semibold text-black mb-2">Notas</h3>
            {rival.notes && rival.notes.length > 0 ? (
              <ul className="space-y-2">
                {rival.notes.map((note, index) => (
                  <li
                    key={index}
                    className="p-3 border rounded-lg border-2 border-[#218b21] shadow-sm bg-white"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay notas disponibles para este rival.</p>
            )}
  
            {/* Agregar Nueva Nota */}
            <div className="mt-4 flex items-center space-x-4">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Agregar nueva nota..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleAddNote}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Agregar Nota
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  

  function FormationSelector({
    formations,
    selectedFormation,
    setSelectedFormation,
    formationPlayers,
    setFormationPlayers,
  }: {
    formations: Formation[];
    selectedFormation: Formation | null;
    setSelectedFormation: (formation: Formation | null) => void;
    formationPlayers: { [position: string]: string }; // Incluye esta propiedad
    setFormationPlayers: (players: { [position: string]: string }) => void; // Incluye esta propiedad
  }) {
    const renderFormationPreview = (formation: Formation | null) => {
        if (!formation) {
          return (
            <p className="text-gray-500">
              Selecciona una formación para ver el dibujo táctico.
            </p>
          );
        }
      
        const { defenderLines, midfielderLines, forwardLines, roles } = formation;
      
        let playerIndex = 2; // Comenzamos en 2, ya que el portero ocupa la posición 1
      
        const renderLine = (count: number, lineIndex: number, type: string) => (
          <div key={lineIndex} className="flex justify-center space-x-4 mb-4">
            {Array.from({ length: count }).map((_, i) => {
              const positionKey = `Posición ${playerIndex}`;
              const role = roles[positionKey] || "Sin asignar";
              const displayIndex = playerIndex++;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-2"
                  style={{ width: "80px" }}
                >
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-medium">
                    {displayIndex}
                  </div>
                  <span className="text-xs text-center text-gray-600">{role}</span>
                </div>
              );
            })}
          </div>
        );
      
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Dibujo Táctico</h3>
            {/* Portero */}
            <div className="flex justify-center mb-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-medium">
                  1
                </div>
                <span className="text-xs text-gray-600">{roles["Posición 1"] || "Arquero"}</span>
              </div>
            </div>
      
            {/* Defensores */}
            {defenderLines.map((count, index) => renderLine(count, index, "Defensor"))}
      
            {/* Mediocampistas */}
            {midfielderLines.map((count, index) =>
              renderLine(count, index, "Mediocampista")
            )}
      
            {/* Delanteros */}
            {forwardLines.map((count, index) => renderLine(count, index, "Delantero"))}
          </div>
        );
      };
      
      
  
    const renderFormationStats = (formation: Formation | null) => {
      if (!formation) return null;
  
      return (
        <div className="mt-6 mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            Estadísticas de la Formación
          </h3>
          <ul className="space-y-2">
            <li className="text-black">
              <strong>Partidos Jugados:</strong> {formation.gamesPlayed}
            </li>
            <li className="text-black">
              <strong>Goles a Favor:</strong> {formation.goalsFor || 0}
            </li>
            <li className="text-black">
              <strong>Goles en Contra:</strong> {formation.goalsAgainst || 0}
            </li>
            <li className="text-black">
              <strong>Tiros a Favor:</strong> {formation.shotsFor || 0}
            </li>
            <li className="text-black">
              <strong>Tiros en Contra:</strong> {formation.shotsAgainst || 0}
            </li>
          </ul>
        </div>
      );
    };
  
    return (
      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Seleccionar Formación</h2>
        <select
          value={selectedFormation?.name || ''}
          onChange={(e) => {
            const formation = formations.find((f) => f.name === e.target.value);
            setSelectedFormation(formation || null);
          }}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Seleccionar Formación</option>
          {formations.map((formation) => (
            <option key={formation.name} value={formation.name}>
              {formation.name} ({formation.type})
            </option>
          ))}
        </select>
  
        {selectedFormation && (
          <>
            {renderFormationStats(selectedFormation)}
            {renderFormationPreview(selectedFormation)}
          </>
        )}
      </div>
    );
  }
  

  function LineupRecommendations({
    players,
    allMatches,
    selectedFormation,
    formationPlayers,
    setFormationPlayers,
  }: {
    players: Player[];
    allMatches: Match[];
    selectedFormation: Formation | null;
    formationPlayers: { [position: string]: string };
    setFormationPlayers: (players: { [position: string]: string }) => void;
  }) {
    const [comparisonPlayer, setComparisonPlayer] = useState<{ [position: string]: string }>({});
    const [performanceStats, setPerformanceStats] = useState({
      asStarter: { matches: 0, wins: 0, goalsFor: 0, goalsAgainst: 0 },
      notPlayed: { matches: 0, wins: 0, goalsFor: 0, goalsAgainst: 0 },
    });
    
  
    // Función para calcular rendimiento
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
    
      return performanceStats;
    };
    
    
    
    
    
    
      
      
  
    const handlePlayerChange = (position: string, playerName: string) => {
      const updatedFormationPlayers = { ...formationPlayers, [position]: playerName };
      setFormationPlayers(updatedFormationPlayers);
    };
  
    const handleComparisonChange = (position: string, playerName: string) => {
      setComparisonPlayer((prev) => ({
        ...prev,
        [position]: playerName,
      }));
    };
  
    if (!selectedFormation) {
      return <p className="text-gray-500">Selecciona una formación para ver recomendaciones.</p>;
    }
  
    return (
      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Jugadores Titulares Recomendados</h2>
        {Object.entries(selectedFormation.roles).map(([position, role], index) => {
          const selectedPlayer = formationPlayers[position] || ""; // Jugador asignado a esta posición
          const playerStats = players.find((p) => p.name === selectedPlayer);
  
          const comparedPlayer = comparisonPlayer[position]
            ? players.find((p) => p.name === comparisonPlayer[position])
            : null;
  
            const performanceStats = selectedPlayer
            ? calculatePerformance(allMatches, selectedPlayer)
            : null;
          
  
          return (
            <div key={index} className="mb-6">
              {/* Selector principal de jugador */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-600 capitalize">{role}</label>
                <select
                  value={selectedPlayer}
                  onChange={(e) => handlePlayerChange(position, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccionar Jugador</option>
                  {players.map((player) => (
                    <option key={player.name} value={player.name}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
  
              {/* Contenedor de estadísticas y comparación */}
              <div className="mt-4 bg-gray-100 rounded-lg p-4">
  {selectedPlayer && playerStats ? (
    <div className="flex flex-wrap md:flex-nowrap md:space-x-8">
      {/* Estadísticas del jugador */}
      <div className="flex-1">
        <h4 className="text-lg font-bold text-black mb-2">
          Estadísticas de {playerStats.name}
        </h4>
        <ul className="space-y-2">
          <li>
            <strong>Goles:</strong> {playerStats.stats.goals}
          </li>
          <li>
            <strong>Asistencias:</strong> {playerStats.stats.assists}
          </li>
          <li>
            <strong>Partidos Jugados:</strong> {playerStats.stats.matches}
          </li>
          <li>
            <strong>Tarjetas Amarillas:</strong> {playerStats.stats.yellowCards}
          </li>
          <li>
            <strong>Tarjetas Rojas:</strong> {playerStats.stats.redCards}
          </li>
        </ul>
      </div>

      {/* Rendimiento del equipo con el jugador */}
      {performanceStats && (
        <div className="flex-1">
        <h4 className="text-lg font-bold text-black mb-2">
          Rendimiento del equipo con {playerStats.name}
        </h4>
        {performanceStats ? (
          <ul className="space-y-2">
            <li>
              <strong>Partidos como titular:</strong> {performanceStats.asStarter.matches}
            </li>
            <li>
              <strong>Victorias:</strong> {performanceStats.asStarter.wins}
            </li>
            <li>
              <strong>Empates:</strong> {performanceStats.asStarter.draws}
            </li>
            <li>
              <strong>Derrotas:</strong> {performanceStats.asStarter.losses}
            </li>
            <li>
              <strong>Goles a Favor:</strong> {performanceStats.asStarter.goalsFor}
            </li>
            <li>
              <strong>Goles en Contra:</strong> {performanceStats.asStarter.goalsAgainst}
            </li>
          </ul>
        ) : (
          <p className="text-gray-500 italic">No hay datos de rendimiento disponibles</p>
        )}
      </div>
      
      )}
    </div>
  ) : (
    <p className="text-gray-500 italic">Seleccionar jugador para ver estadisticas disponibles</p>
  )}

  {/* Selector de comparación */}
  <div className="mt-4">
    <label className="text-sm font-medium text-gray-600">Comparar con:</label>
    <select
      value={comparisonPlayer[position] || ""}
      onChange={(e) => handleComparisonChange(position, e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mt-2"
    >
      <option value="">Seleccionar Jugador para Comparar</option>
      {players
        .filter((player) => player.name !== selectedPlayer) // Excluir jugador ya seleccionado
        .map((player) => (
          <option key={player.name} value={player.name}>
            {player.name}
          </option>
        ))}
    </select>
  </div>

  {/* Estadísticas del jugador comparado */}
  {comparedPlayer && (
    <div className="mt-4 bg-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        Estadísticas de {comparedPlayer.name}
      </h4>
      <ul className="space-y-2">
        <li>
          <strong>Goles:</strong> {comparedPlayer.stats.goals}
        </li>
        <li>
          <strong>Asistencias:</strong> {comparedPlayer.stats.assists}
        </li>
        <li>
          <strong>Partidos Jugados:</strong> {comparedPlayer.stats.matches}
        </li>
        <li>
          <strong>Tarjetas Amarillas:</strong> {comparedPlayer.stats.yellowCards}
        </li>
        <li>
          <strong>Tarjetas Rojas:</strong> {comparedPlayer.stats.redCards}
        </li>
      </ul>
    </div>
  )}
  
</div>

            </div>
          );
        })}
      </div>
    );
  }
  
  
  
  
  
  

  function ChangeSuggestions({
    players,
    formationPlayers,
  }: {
    players: Player[];
    formationPlayers: { [position: string]: string };
  }) {
    // Verificar si todos los titulares han sido seleccionados
    const allPositionsFilled = Object.values(formationPlayers).length > 0 &&
      Object.values(formationPlayers).every(
        (playerName) => playerName && playerName.trim() !== ""
      );
  
    // Mostrar un mensaje si no se han seleccionado todos los titulares
    if (!allPositionsFilled) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Sugerencias de Cambios</h2>
          <p className="text-gray-500">
            Completa la selección de los 11 titulares para ver sugerencias de
            cambios.
          </p>
        </div>
      );
    }
  
    // Filtrar jugadores que no están en la formación actual
    const substitutes = players.filter(
      (player) => !Object.values(formationPlayers).includes(player.name)
    );
  
    // Clasificar suplentes por posición y rendimiento
    const defenders = substitutes
      .filter((sub) => sub.position.toLowerCase().includes("defender"))
      .sort(
        (a, b) =>
          b.stats.goals + b.stats.assists - (a.stats.goals + a.stats.assists)
      )
      .slice(0, 2);
  
    const midfielders = substitutes
      .filter((sub) => sub.position.toLowerCase().includes("midfielder"))
      .sort(
        (a, b) =>
          b.stats.goals + b.stats.assists - (a.stats.goals + a.stats.assists)
      )
      .slice(0, 2);
  
    const forwards = substitutes
      .filter((sub) => sub.position.toLowerCase().includes("forward"))
      .sort(
        (a, b) =>
          b.stats.goals + b.stats.assists - (a.stats.goals + a.stats.assists)
      )
      .slice(0, 2);
  
    const topSubstitutes = [...defenders, ...midfielders, ...forwards];
  
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Sugerencias de Cambios</h2>
        {topSubstitutes.length > 0 ? (
          <ul className="space-y-2">
            {topSubstitutes.map((sub) => (
              <li key={sub.name} className="text-gray-700">
                Considera <strong>{sub.name}</strong> ({sub.position}) por su rendimiento reciente:
                <ul className="ml-4 text-sm text-gray-600">
                  <li>
                    <strong>Goles:</strong> {sub.stats.goals || 0}
                  </li>
                  <li>
                    <strong>Asistencias:</strong> {sub.stats.assists || 0}
                  </li>
                  <li>
                    <strong>Partidos Jugados:</strong> {sub.stats.matches || 0}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No hay suplentes disponibles con estadísticas relevantes.
          </p>
        )}
      </div>
    );
  }
  