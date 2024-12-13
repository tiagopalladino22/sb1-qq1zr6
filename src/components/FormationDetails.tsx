import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Formation {
  name: string;
  type: string; // e.g., "4-4-2", "4-3-3"
  gamesPlayed: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  shotsFor?: number;
  shotsAgainst?: number;
}

const ProgressBar = ({ label, value, max }: { label: string; value: number; max: number }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-lg h-4">
        <div
          className="bg-[#218b21] h-4 rounded-lg"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};



export default function FormationDetails() {
  const { id } = useParams<{ id: string }>();
  const [formation, setFormation] = useState<Formation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id !== undefined) {
      const parsedId = parseInt(id, 10);
  
      // Retrieve formations from localStorage
      const storedFormations = JSON.parse(localStorage.getItem('formations') || '[]');
  
      // Validate and set the selected formation
      if (!isNaN(parsedId) && storedFormations[parsedId]) {
        setFormation(storedFormations[parsedId]);
      } else {
        console.error("Invalid formation ID or formation not found.");
        navigate('/formations');
      }
    }
  }, [id, navigate]);
  

  const renderFormationPreview = (type: string) => {
    if (!type) {
      return <div className="text-center text-gray-500">No hay información disponible</div>;
    }
  
    const lines = type.split('-').map((line) => parseInt(line, 10));
    let playerCount = 2; // Start numbering players from 2 since the goalkeeper is already explicitly set
  
    return (
      <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
        <div className="absolute inset-0 bg-green-100 rounded-lg">
          <div className="absolute inset-0 border-2 border-green-300 m-4 rounded-lg">
            <div className="absolute left-0 right-0 top-1/2 border-t-2 border-green-300 transform -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-green-300 transform -translate-x-1/2" />
            <div className="absolute left-1/2 top-1/2 w-24 h-24 border-2 border-green-300 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>
  
          {/* Render players */}
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            {/* Goalkeeper */}
            <div className="flex justify-center mb-4">
              <div
                className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm"
                title="Goalkeeper"
              >
                1
              </div>
            </div>
  
            {/* Lines of players */}
            {lines.slice(1).map((count, lineIndex) => {
              // Assign colors based on the line's relative position:
              // - First line: defenders (blue).
              // - Middle lines: midfielders (green).
              // - Last line: forwards (red).
              const isLastLine = lineIndex === lines.slice(1).length - 1;
              const playerColor =
                isLastLine
                  ? 'bg-red-500' // Forwards
                  : lineIndex === 0
                  ? 'bg-blue-500' // Defenders
                  : 'bg-green-500'; // Midfielders
  
              return (
                <div key={`line-${lineIndex}`} className="flex justify-around mt-4">
                  {Array.from({ length: count }).map((_, index) => (
                    <div
                      key={`player-${lineIndex}-${index}`}
                      className={`w-8 h-8 ${playerColor} rounded-full flex items-center justify-center text-white text-sm`}
                      title={`Player ${playerCount}`}
                    >
                      {playerCount++}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  
  

  if (!formation) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Detalles de la Formacion</h1>

      <div className="bg-white rounded-xl shadow-sm p-6">
  <h2 className="text-lg font-semibold mb-4">Estadisticas de la Formacion</h2>
  {/* Basic stats */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div>
      <h3 className="text-sm font-medium text-gray-600">Partidos Jugados</h3>
      <p className="text-2xl font-bold text-gray-900">{formation.gamesPlayed}</p>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-600">Victorias</h3>
      <p className="text-2xl font-bold text-green-500">{formation.wins || 0}</p>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-600">Empates</h3>
      <p className="text-2xl font-bold text-gray-500">{formation.draws || 0}</p>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-600">Derrotas</h3>
      <p className="text-2xl font-bold text-red-500">{formation.losses || 0}</p>
    </div>
  </div>

  {/* Comparative stats */}
  <h3 className="text-sm font-medium text-gray-600 mb-2">Goles</h3>
  <ProgressBar
    label="Goals a Favor"
    value={formation.goalsFor || 0}
    max={Math.max(formation.goalsFor || 0, formation.goalsAgainst || 0, 1)}
  />
  <ProgressBar
    label="Goles en Contra"
    value={formation.goalsAgainst || 0}
    max={Math.max(formation.goalsFor || 0, formation.goalsAgainst || 0, 1)}
  />

  <h3 className="text-sm font-medium text-gray-600 mb-2 mt-4">Shots</h3>
  <ProgressBar
    label="Ocasiones Generadas"
    value={formation.shotsFor || 0}
    max={Math.max(formation.shotsFor || 0, formation.shotsAgainst || 0, 1)}
  />
  <ProgressBar
    label="Ocasiones Recibidas"
    value={formation.shotsAgainst || 0}
    max={Math.max(formation.shotsFor || 0, formation.shotsAgainst || 0, 1)}
  />
</div>



      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Formacion</h2>
        {renderFormationPreview(formation.type)}
      </div>

      <button
        onClick={() => navigate('/formations')}
        className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        Volver
      </button>
    </div>
  );
}




