import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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


export default function Formations() {
  const [formationName, setFormationName] = useState('');
  const [defenderLines, setDefenderLines] = useState([4]); // Default one line with 4 defenders
  const [midfielderLines, setMidfielderLines] = useState([4]); // Default one line with 4 midfielders
  const [forwardLines, setForwardLines] = useState([2]); // Default one line with 2 forwards
  const [roles, setRoles] = useState<string[]>([]); // Lista de roles asignados a posiciones
  const [savedFormations, setSavedFormations] = useState<Formation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFormations = JSON.parse(localStorage.getItem('formations') || '[]');
    setSavedFormations(storedFormations);
  }, []);

  const handleSaveFormation = () => {
    console.log('Roles definidos en AddFormation:', roles); // Aquí verificas los roles antes de guardar
    if (formationName.trim() === '') {
      alert('Por favor agregar un nombre a la formación');
      return;
    }

    const formationType = [
      1, // Always include the goalkeeper
      ...defenderLines,
      ...midfielderLines,
      ...forwardLines,
    ].join('-');

    const newFormation: Formation = {
      name: formationName,
      type: formationType,
      gamesPlayed: 0,
      defenderLines,
      midfielderLines,
      forwardLines,
      players: {}, // Mapeo vacío inicial
      roles: roles.reduce((acc, role, index) => {
        acc[`Posición ${index + 1}`] = role;
        return acc;
      }, {} as { [position: string]: string }),
      goalkeeper: roles[0] || 'Arquero', // Asignar el primer rol como arquero
    };
    

    const updatedFormations = [...savedFormations, newFormation];
    setSavedFormations(updatedFormations);
    localStorage.setItem('formations', JSON.stringify(updatedFormations));
    navigate('/formations');
  };

  const generateRoles = () => {
    const totalPositions = [
      1, // Goalkeeper
      ...defenderLines,
      ...midfielderLines,
      ...forwardLines,
    ].reduce((sum, line) => sum + line, 0);

    // Generar roles predeterminados
    const defaultRoles = ['Arquero'];
    defenderLines.forEach((count) => {
      for (let i = 1; i <= count; i++) defaultRoles.push(`Defensor ${i}`);
    });
    midfielderLines.forEach((count) => {
      for (let i = 1; i <= count; i++) defaultRoles.push(`Mediocampista ${i}`);
    });
    forwardLines.forEach((count) => {
      for (let i = 1; i <= count; i++) defaultRoles.push(`Delantero ${i}`);
    });

    // Ajustar el tamaño de los roles según las posiciones reales
    setRoles((prev) => {
      const newRoles = [...prev];
      for (let i = prev.length; i < totalPositions; i++) {
        newRoles[i] = defaultRoles[i] || `Jugador ${i + 1}`;
      }
      return newRoles.slice(0, totalPositions);
    });
  };

  useEffect(() => {
    generateRoles();
  }, [defenderLines, midfielderLines, forwardLines]);

  const renderFormationPreview = () => {
    let playerCount = 0;

    return (
      <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
        <div className="absolute inset-0 bg-green-100 rounded-lg">
          <div className="absolute inset-0 border-2 border-green-300 m-4 rounded-lg">
            <div className="absolute left-0 right-0 top-1/2 border-t-2 border-green-300 transform -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-green-300 transform -translate-x-1/2" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between p-8">
            {/* Goalkeeper */}
            <div className="flex justify-center mb-4">
              <div
                className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm"
                title={roles[playerCount]}
              >
                {++playerCount}
              </div>
            </div>

            {/* Defenders */}
            {defenderLines.map((count, lineIndex) => (
              <div key={`defender-line-${lineIndex}`} className="flex justify-around">
                {Array.from({ length: count }).map((_, index) => (
                  <div
                    key={`defender-${lineIndex}-${index}`}
                    className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm"
                    title={roles[playerCount]}
                  >
                    {++playerCount}
                  </div>
                ))}
              </div>
            ))}

            {/* Midfielders */}
            {midfielderLines.map((count, lineIndex) => (
              <div key={`midfielder-line-${lineIndex}`} className="flex justify-around mt-4">
                {Array.from({ length: count }).map((_, index) => (
                  <div
                    key={`midfielder-${lineIndex}-${index}`}
                    className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm"
                    title={roles[playerCount]}
                  >
                    {++playerCount}
                  </div>
                ))}
              </div>
            ))}

            {/* Forwards */}
            {forwardLines.map((count, lineIndex) => (
              <div key={`forward-line-${lineIndex}`} className="flex justify-around mt-4">
                {Array.from({ length: count }).map((_, index) => (
                  <div
                    key={`forward-${lineIndex}-${index}`}
                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm"
                    title={roles[playerCount]}
                  >
                    {++playerCount}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const editRole = (index: number, value: string) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = value;
    setRoles(updatedRoles);
  };

  const addDefenderLine = () => setDefenderLines([...defenderLines, 1]);
  const addMidfielderLine = () => setMidfielderLines([...midfielderLines, 1]);
  const addForwardLine = () => setForwardLines([...forwardLines, 1]);

  const removeDefenderLine = (index: number) => {
    setDefenderLines(defenderLines.filter((_, i) => i !== index));
  };

  const removeMidfielderLine = (index: number) => {
    setMidfielderLines(midfielderLines.filter((_, i) => i !== index));
  };

  const removeForwardLine = (index: number) => {
    setForwardLines(forwardLines.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Formaciones</h1>
        <button 
          onClick={handleSaveFormation}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19] flex items-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>Guardar Formación</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Detalles de la Formación</h2>

        <label className="block text-sm font-medium text-black mb-2">Nombre</label>
        <input
          type="text"
          value={formationName}
          onChange={(e) => setFormationName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
          placeholder="Ingresar nombre..."
          required
        />

        <h3 className="text-bg font-medium text-black mb-6">Dibujo Táctico</h3>

        {/* Defender Lines */}
        {defenderLines.map((count, index) => (
          <div key={`defender-line-${index}`} className="mb-4">
            <div className="flex items-center">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Defensores {index + 1}
              </label>
              {index > 0 && (
                <button
                  onClick={() => removeDefenderLine(index)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  title="Remove line"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) =>
                setDefenderLines(defenderLines.map((c, i) => (i === index ? parseInt(e.target.value) || 1 : c)))
              }
              className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}
        <button
          onClick={addDefenderLine}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
        >
          Agregar línea de defensores
        </button>

        {/* Midfielder Lines */}
        {midfielderLines.map((count, index) => (
          <div key={`midfielder-line-${index}`} className="mb-4">
            <div className="flex items-center">
              <label className="block text-sm font-medium text-green-700 mb-2">
                Mediocampistas {index + 1}
              </label>
              {index > 0 && (
                <button
                  onClick={() => removeMidfielderLine(index)}
                  className="ml-2 text-green-500 hover:text-green-700"
                  title="Remove line"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) =>
                setMidfielderLines(midfielderLines.map((c, i) => (i === index ? parseInt(e.target.value) || 1 : c)))
              }
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}
        <button
          onClick={addMidfielderLine}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 mb-6"
        >
          Agregar línea de mediocampistas
        </button>

        {/* Forward Lines */}
        {forwardLines.map((count, index) => (
          <div key={`forward-line-${index}`} className="mb-4">
            <div className="flex items-center">
              <label className="block text-sm font-medium text-red-700 mb-2">
                Delanteros {index + 1}
              </label>
              {index > 0 && (
                <button
                  onClick={() => removeForwardLine(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  title="Remove line"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) =>
                setForwardLines(forwardLines.map((c, i) => (i === index ? parseInt(e.target.value) || 1 : c)))
              }
              className="w-full p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}
        <button
          onClick={addForwardLine}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 mb-6"
        >
          Agregar línea de delanteros
        </button>
      </div>

      {/* Roles Editor */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Editar Roles</h2>
        {roles.map((role, index) => (
          <div key={index} className="flex items-center mb-2">
            <label className="text-sm font-medium w-24">{`Posición ${index + 1}:`}</label>
            <input
              type="text"
              value={role}
              onChange={(e) => editRole(index, e.target.value)}
              className="flex-1 p-2 border rounded-lg"
            />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">{renderFormationPreview()}</div>

      <button
        onClick={handleSaveFormation}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Guardar Formación
      </button>
    </div>
  );
}
