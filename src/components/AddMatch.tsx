import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';

interface PlayerStats {
  goals: number;
  assists: number;
  matches: number;
  minutesPlayed?: number; // Nuevo campo para los minutos jugados
  yellowCards?: number;
  redCards?: number;
  positions?: {
    [position: string]: {
      goals: number;
      assists: number;
      matches: number;
      yellowCards: number;
      redCards: number;
      minutesPlayed?: number; // Minutos jugados por posición
    };
  };
}


interface Player {
  id?: string; // ensure each player has an ID if possible
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
  players: { [position: string]: string }; // Mapeo de posiciones a nombres de jugadores
  roles: { [position: string]: string }; // Mapeo de posiciones a nombres personalizados
  gamesPlayed: number;
  goalsFor?: number;
  goalsAgainst?: number;
  shotsFor?: number;
  shotsAgainst?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  defenderLines: number[];
  midfielderLines: number[];
  forwardLines: number[];
  goalkeeper: string; // Rol del arquero
}



interface Rival {
  name: string;
  logo: string;
  homeGround: string;
  primaryColor: string;
  secondaryColor: string;
  notes: string;
  matchesPlayed: number; // Total matches played
  wins: number;          // Total wins
  draws: number;         // Total draws
  losses: number;        // Total losses
  matches: {             // Array of match details
    date: string;
    score: { home: number; away: number };
    formationUsed: string;
  }[];
}
interface Match {
  date: string;
  score: { home: number; away: number };
  formationUsed: string;
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

// ... Encabezado y otros imports se mantienen igual

export default function AddMatch() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [rivals, setRivals] = useState<Rival[]>([]);

  const [formationPlayers, setFormationPlayers] = useState<{ [position: string]: string }>({});
  // For substitutions
  const [subs, setSubs] = useState<Substitution[]>([]);


  const [formData, setFormData] = useState<{
    id: string;
    opponent: string;
    date: string;
    score: { home: number; away: number };
    scorers: string[];
    assists: string[];
    formation: string;
    rival: string;
    cards: CardInfo[];
    shotsFor: number;
    shotsAgainst: number;
    subs: Substitution[];
  }>({
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    opponent: '',
    date: '',
    score: { home: 0, away: 0 },
    scorers: [''],
    assists: [''],
    formation: '',
    rival: '',
    cards: [],
    shotsFor: 0,
    shotsAgainst: 0,
    subs: [],
  });

  useEffect(() => {

    console.log('Formation Players:', formationPlayers); // Verifica cómo están las claves y valores

    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);

    const storedFormations = JSON.parse(localStorage.getItem('formations') || '[]');
    setFormations(storedFormations);

    const storedRivals = JSON.parse(localStorage.getItem('rivals') || '[]');
    setRivals(storedRivals);
  }, []);

  const handleFormationChange = (formationName: string) => {
    const selectedFormation = formations.find((f) => f.name === formationName);
    if (selectedFormation) {
      const updatedFormationPlayers: { [position: string]: string } = {};
      if (selectedFormation.roles) {
        // Usar los nombres personalizados de las posiciones
        Object.entries(selectedFormation.roles).forEach(([position, role]) => {
          updatedFormationPlayers[role] = ''; // Inicializar jugadores para cada posición personalizada
        });
      }
      setFormationPlayers(updatedFormationPlayers);
      setFormData((prev) => ({ ...prev, formation: formationName }));
    }
  };
  
  
  
  
  
  
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log('Formation Players:', formationPlayers);

    const matchId = formData.id;
    const existingMatches = JSON.parse(localStorage.getItem("matches") || "[]");
  
    const newMatchData = {
      ...formData,
      formationUsed: formData.formation, // Asegúrate de guardar el nombre de la formación
      formationPlayers, // Guardar los jugadores asignados a cada posición
    };

    console.log('Datos del nuevo partido:', newMatchData); // Diagnóstico completo antes de guardar
    
    const updatedMatches = [...existingMatches, newMatchData];
    localStorage.setItem("matches", JSON.stringify(updatedMatches));
  
    const updatedPlayers = players.map((player) => {
      // Filtrar goles, asistencias y tarjetas para el jugador
      const goals = formData.scorers.filter((scorer) => scorer === player.name).length;
      const assists = formData.assists.filter((assist) => assist === player.name).length;
      const playerCards = formData.cards.filter((card) => card.player === player.name);
    
      const yellowCount = playerCards.filter((c) => c.type === "yellow").length;
      const redCount = playerCards.filter((c) => c.type === "red").length;
    
      // Obtener estadísticas actuales o inicializarlas
      const currentStats = player.stats || {
        goals: 0,
        assists: 0,
        matches: 0,
        minutesPlayed: 0,
        yellowCards: 0,
        redCards: 0,
        positions: {},
      };
    
      let minutesPlayed = 90; // Por defecto juega todo el partido
      const updatedPositions = { ...currentStats.positions };
    
      let playedAsSubstitute = false;
    
      // Detectar si el jugador fue suplente
      const subIn = formData.subs.find((sub) => sub.playerIn === player.name);
      if (subIn) {
        playedAsSubstitute = true;
        minutesPlayed = 90 - subIn.minute;
    
        // Asignar estadísticas al rol "Suplente"
        if (!updatedPositions["Suplente"]) {
          updatedPositions["Suplente"] = {
            matches: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            minutesPlayed: 0,
          };
        }
    
        updatedPositions["Suplente"].matches += 1;
        updatedPositions["Suplente"].goals += goals;
        updatedPositions["Suplente"].assists += assists;
        updatedPositions["Suplente"].yellowCards += yellowCount;
        updatedPositions["Suplente"].redCards += redCount;
        updatedPositions["Suplente"].minutesPlayed = (updatedPositions["Suplente"].minutesPlayed ?? 0) + minutesPlayed;

      }
    
      // Si el jugador fue titular
      const positionsPlayed = Object.entries(formationPlayers)
        .filter(([, playerName]) => playerName === player.name)
        .map(([position]) => position);
    
      positionsPlayed.forEach((position) => {
        const roleName = formations.find((f) => f.name === formData.formation)?.roles?.[position] || position;
    
        if (!updatedPositions[roleName]) {
          updatedPositions[roleName] = {
            matches: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            minutesPlayed: 0,
          };
        }
    
        updatedPositions[roleName].matches += 1;
        updatedPositions[roleName].goals += goals;
        updatedPositions[roleName].assists += assists;
        updatedPositions[roleName].yellowCards += yellowCount;
        updatedPositions[roleName].redCards += redCount;
        updatedPositions[roleName].minutesPlayed = (updatedPositions[roleName].minutesPlayed ?? 0) + minutesPlayed;
      });
    
      return {
        ...player,
        stats: {
          ...currentStats,
          goals: currentStats.goals + goals,
          assists: currentStats.assists + assists,
          matches: currentStats.matches + 1,
          minutesPlayed: (currentStats.minutesPlayed ?? 0) + minutesPlayed,
          yellowCards: (currentStats.yellowCards ?? 0) + yellowCount,
          redCards: (currentStats.redCards ?? 0) + redCount,
          positions: updatedPositions,
        },
      };
      
    });
    
    localStorage.setItem("players", JSON.stringify(updatedPlayers));
    

localStorage.setItem("players", JSON.stringify(updatedPlayers));

  
    const updatedFormations = formations.map((formation) => {
      if (formation.name === formData.formation) {
        return {
          ...formation,
          gamesPlayed: formation.gamesPlayed + 1,
          goalsFor: (formation.goalsFor || 0) + formData.score.home,
          goalsAgainst: (formation.goalsAgainst || 0) + formData.score.away,
          shotsFor: (formation.shotsFor || 0) + formData.shotsFor,
          shotsAgainst: (formation.shotsAgainst || 0) + formData.shotsAgainst,
          wins:
            formData.score.home > formData.score.away
              ? (formation.wins || 0) + 1
              : formation.wins || 0,
          draws:
            formData.score.home === formData.score.away
              ? (formation.draws || 0) + 1
              : formation.draws || 0,
          losses:
            formData.score.home < formData.score.away
              ? (formation.losses || 0) + 1
              : formation.losses || 0,
        };
      }
      return formation;
    });
  
    localStorage.setItem("formations", JSON.stringify(updatedFormations));
    setFormations(updatedFormations);
  
    const updatedRivals = rivals.map((rival) => {
      if (rival.name === formData.rival) {
        const matchResult =
          formData.score.home > formData.score.away
            ? "win"
            : formData.score.home === formData.score.away
            ? "draw"
            : "loss";
  
        const currentMatches = Array.isArray(rival.matches) ? rival.matches : [];
  
        return {
          ...rival,
          matches: [
            ...currentMatches,
            {
              id: matchId,
              date: formData.date,
              score: formData.score,
              formationUsed: formData.formation,
            },
          ],
          wins: matchResult === "win" ? (rival.wins || 0) + 1 : rival.wins || 0,
          draws: matchResult === "draw" ? (rival.draws || 0) + 1 : rival.draws || 0,
          losses: matchResult === "loss" ? (rival.losses || 0) + 1 : rival.losses || 0,
          matchesPlayed: (rival.matchesPlayed || 0) + 1,
        };
      }
      return rival;
    });
  
    localStorage.setItem("rivals", JSON.stringify(updatedRivals));
    setRivals(updatedRivals);
  
    navigate("/");
  };
  
  

  

  const addField = (field: 'scorers' | 'assists') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeField = (field: 'scorers' | 'assists', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateField = (field: 'scorers' | 'assists', index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };
  const addCardField = () => {
    setFormData(prev => ({
      ...prev,
      cards: [...prev.cards, { player: '', type: 'yellow' }]
    }));
  };

  const removeCardField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
  };

  const updateCardField = (index: number, player: string | undefined, cardType: 'yellow' | 'red' | undefined) => {
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.map((c, i) => {
        if (i === index) {
          return {
            player: player !== undefined ? player : c.player,
            type: cardType !== undefined ? cardType : c.type
          };
        }
        return c;
      })
    }));
  };
  // Substitutions
  const addSubstitution = () => {
    setSubs(prev => [...prev, { playerOut: '', playerIn: '', minute: 0 }]);
  };

  const removeSubstitution = (index: number) => {
    setSubs(prev => prev.filter((_, i) => i !== index));
  };

  const updateSubstitution = (
    index: number,
    field: 'playerOut' | 'playerIn' | 'minute',
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedSubs = [...prev.subs];
      updatedSubs[index] = {
        ...updatedSubs[index],
        [field]: value,
      };
      return {
        ...prev,
        subs: updatedSubs,
      };
    });
  };
  

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Match Result</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opponent</label>
            <select
              value={formData.rival}
              onChange={(e) => setFormData((prev) => ({ ...prev, rival: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Rival</option>
              {rivals.map((rival, i) => (
                <option key={i} value={rival.name}>
                  {rival.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Formation</label>
          <select
            value={formData.formation}
            onChange={(e) => handleFormationChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select Formation</option>
            {formations.map((formation, i) => (
              <option key={i} value={formation.name}>
                {formation.name} - {formation.type}
              </option>
            ))}
          </select>
        </div>
        {/*Match Score*/}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Our Score</label>
            <input
              type="number"
              min="0"
              value={formData.score.home}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, score: { ...prev.score, home: parseInt(e.target.value) } }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opponent Score</label>
            <input
              type="number"
              min="0"
              value={formData.score.away}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, score: { ...prev.score, away: parseInt(e.target.value) } }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Shots Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shots For</label>
            <input
              type="number"
              min="0"
              value={formData.shotsFor}
              onChange={(e) => setFormData((prev) => ({ ...prev, shotsFor: parseInt(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shots Against</label>
            <input
              type="number"
              min="0"
              value={formData.shotsAgainst}
              onChange={(e) => setFormData((prev) => ({ ...prev, shotsAgainst: parseInt(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

{/* Asignación de jugadores y secciones agrupadas correctamente */}
{Object.keys(formationPlayers).length > 0 && (
  <div>
    <h3 className="font-semibold text-gray-700 mt-4">Asignar Jugadores a Posiciones</h3>
    {Object.entries(formationPlayers).map(([position, player], index) => {
  const roleName = formations.find(f => f.name === formData.formation)?.roles[position] || position;
  return (
    <div key={index} className="flex items-center space-x-4 my-2">
      <label className="text-sm font-medium text-gray-600 capitalize">
        {roleName} {/* Mostrar el nombre del rol */}
      </label>
      <select
        value={player}
        onChange={(e) =>
          setFormationPlayers((prev) => ({ ...prev, [position]: e.target.value }))
        }
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select Player</option>
        {players.map((player) => (
          <option key={player.id} value={player.name}>
            {player.number} - {player.name}
          </option>
        ))}
      </select>
    </div>
  );
})}

  </div>
)}







        
        {/* Goal Scorers Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Goles</label>
          {formData.scorers.map((scorer, index) => (
            <div key={index} className="flex items-center space-x-2 my-2">
              <select
                value={scorer}
                onChange={(e) => updateField('scorers', index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar Jugador</option>
                {players.map((player) => (
                  <option key={player.id} value={player.name}>
                    {player.number} - {player.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => removeField('scorers', index)}>
                <X className="h-5 w-5 text-red-500" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField('scorers')}
            className="text-indigo-500 hover:underline text-sm"
          >
            + Agregar Goleadores
          </button>
        </div>

        {/* Assists Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Asistencias</label>
          {formData.assists.map((assist, index) => (
            <div key={index} className="flex items-center space-x-2 my-2">
              <select
                value={assist}
                onChange={(e) => updateField('assists', index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar Jugador</option>
                {players.map((player) => (
                  <option key={player.id} value={player.name}>
                    {player.number} - {player.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => removeField('assists', index)}>
                <X className="h-5 w-5 text-red-500" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField('assists')}
            className="text-indigo-500 hover:underline text-sm"
          >
            + Agregar Asistencia
          </button>
        </div>

 {/* Substitutions Section */}
<div>
  <label className="block text-sm font-medium text-gray-700">Cambios</label>
  {formData.subs.map((sub, index) => (
    <div key={index} className="flex items-center space-x-2 my-2">
      <select
        value={sub.playerOut || ''}
        onChange={(e) => updateSubstitution(index, 'playerOut', e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Salio</option>
        {players.map((player) => (
          <option key={player.id} value={player.name}>
            {player.number} - {player.name}
          </option>
        ))}
      </select>
      <select
        value={sub.playerIn || ''}
        onChange={(e) => updateSubstitution(index, 'playerIn', e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Entro</option>
        {players.map((player) => (
          <option key={player.id} value={player.name}>
            {player.number} - {player.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        value={sub.minute || ''}
        onChange={(e) => updateSubstitution(index, 'minute', parseInt(e.target.value) || 0)}
        className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Min"
      />
      <button
        type="button"
        onClick={() => removeSubstitution(index)}
        className="text-red-500 hover:text-red-700"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() => {
      // Añadir una nueva substitución al array de `formData.subs`
      setFormData((prev) => ({
        ...prev,
        subs: [...prev.subs, { playerOut: '', playerIn: '', minute: 0 }],
      }));
    }}
    className="text-indigo-500 hover:underline text-sm"
  >
    + Agregar Sustitucion
  </button>
</div>


          {/* Cards Section */}
<div>
  <label className="block text-sm font-medium text-gray-700">Tarjetas</label>
  {formData.cards.map((card, index) => (
    <div key={index} className="flex items-center space-x-2 my-2">
      <select
        value={card.player}
        onChange={(e) => updateCardField(index, e.target.value, undefined)}
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Seleccionar Jugador</option>
        {players.map((player) => (
          <option key={player.id} value={player.name}>
            {player.number} - {player.name}
          </option>
        ))}
      </select>
      <select
        value={card.type}
        onChange={(e) => updateCardField(index, undefined, e.target.value as 'yellow' | 'red')}
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="yellow">Amarilla</option>
        <option value="red">Roja</option>
      </select>
      <button
        type="button"
        onClick={() => removeCardField(index)}
        className="text-red-500 hover:text-red-700"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={addCardField}
    className="text-indigo-500 hover:underline text-sm"
  >
    + Agregar Tarjeta
  </button>
</div>


        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>Guardar Partido</span>
        </button>
      </form>
    </div>
  );
}

