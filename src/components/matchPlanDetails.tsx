import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface MatchPlan {
  id: string;
  rival: string;
  formation: string;
  lineup: { [position: string]: string };
}

interface Formation {
  name: string;
  roles: { [position: string]: string };
  defenderLines: number[];
  midfielderLines: number[];
  forwardLines: number[];
}

interface Player {
  name: string;
  position: string;
  number: number; // Número de camiseta
}

interface Rival {
  name: string;
  notes: string[];
}

export default function MatchPlanDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [matchPlan, setMatchPlan] = useState<MatchPlan | null>(null);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rivalNotes, setRivalNotes] = useState<string[]>([]);

  useEffect(() => {
    const storedPlans: MatchPlan[] = JSON.parse(localStorage.getItem("matchPlans") || "[]");
    const storedFormations: Formation[] = JSON.parse(localStorage.getItem("formations") || "[]");
    const storedPlayers: Player[] = JSON.parse(localStorage.getItem("players") || "[]");
    const storedRivals: Rival[] = JSON.parse(localStorage.getItem("rivals") || "[]");

    const plan = storedPlans.find((p) => p.id === id);
    if (plan) {
      setMatchPlan(plan);
      const currentFormation = storedFormations.find((f) => f.name === plan.formation);
      if (currentFormation) setFormation(currentFormation);

      const rivalData = storedRivals.find((r) => r.name === plan.rival);
      if (rivalData) setRivalNotes(rivalData.notes);
    } else {
      alert("Planificación no encontrada.");
      navigate("/match-plans");
    }

    setPlayers(storedPlayers);
  }, [id, navigate]);

  const renderFormationPreview = () => {
    if (!formation) return <p className="text-gray-500">Formación no disponible.</p>;

    let playerIndex = 2; // Comienza después del arquero (posición 1)

    const renderLine = (count: number, type: string) => (
      <div key={`${type}-${playerIndex}`} className="flex justify-center space-x-4 mb-4">
        {Array.from({ length: count }).map((_, i) => {
          const positionKey = `Posición ${playerIndex}`;
          const playerName = matchPlan?.lineup?.[positionKey] || "Vacante";
          const player = players.find((p) => p.name === playerName);
          const jerseyNumber = player?.number || playerIndex;
    
          playerIndex++;
    
          return (
            <div key={`${type}-${playerIndex}-${i}`} className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {jerseyNumber}
              </div>
              <span className="text-xs text-gray-700">{playerName || "Vacante"}</span>
            </div>
          );
        })}
      </div>
    );
    

    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Dibujo Táctico</h3>

        {/* Renderizar el arquero (posición 1) */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="text-xs text-gray-700">
              {matchPlan?.lineup?.["Posición 1"] || "Arquero"}
            </span>
          </div>
        </div>

        {/* Renderizar las demás líneas */}
        {formation.defenderLines.map((count, index) => renderLine(count, "Defensa"))}
        {formation.midfielderLines.map((count, index) => renderLine(count, "Mediocampo"))}
        {formation.forwardLines.map((count, index) => renderLine(count, "Delantero"))}
      </div>
    );
  };

  const renderChangeSuggestions = () => {
    if (!players || !matchPlan) return null;

    const starters = Object.values(matchPlan.lineup);
    const substitutes = players.filter((player) => !starters.includes(player.name));

    const topSubstitutes = substitutes
      .sort((a, b) => b.number - a.number) // Ordenar según algún criterio
      .slice(0, 5); // Mostrar las 5 mejores sugerencias

    return (
      <div className="bg-gray-100 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-4">Sugerencias de Cambios</h3>
        {topSubstitutes.length > 0 ? (
          <ul className="space-y-2">
            {topSubstitutes.map((sub) => (
              <li key={sub.name} className="flex justify-between items-center">
                <span>{sub.name} ({sub.position})</span>
                <span className="text-gray-600">N° {sub.number}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay jugadores disponibles para sugerir cambios.</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-sm border-2 border-[#218b21] rounded-xl">
      <button
        onClick={() => navigate("/match-plans")}
        className="flex items-center space-x-2 text-[#218b21] hover:text-[#196a19]"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver a Planificaciones</span>
      </button>

      <h1 className="text-2xl font-bold text-gray-900">Detalles de la Planificación</h1>

      <div className="space-y-4">
        <p>
          <strong className="text-black">Rival:</strong> {matchPlan?.rival}
        </p>
        {rivalNotes.length > 0 && (
          <div>
            <h3 className="font-semibold text-black">Anotaciones del Rival</h3>
            <ul className="space-y-1 list-disc list-inside">
              {rivalNotes.map((note, index) => (
                <li key={index} className="text-gray-700">{note}</li>
              ))}
            </ul>
          </div>
        )}
        <p>
          <strong className="text-black">Formación:</strong> {matchPlan?.formation}
        </p>
      </div>

      {renderFormationPreview()}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Alineación</h2>
        <ul className="space-y-2">
          {Object.entries(matchPlan?.lineup || {}).map(([role, playerName]) => {
            const player = players.find((p) => p.name === playerName);
            return (
              <li key={role} className="flex justify-between">
                <span className="text-gray-600">{role}</span>
                <span className="font-medium">
                  {playerName} {player ? `(#${player.number})` : ""}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sugerencias de Cambios */}
      {renderChangeSuggestions()}
    </div>
  );
}

