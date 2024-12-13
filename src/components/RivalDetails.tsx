import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Match {
  id: string;
  date: string;
  score: { home: number; away: number };
  formationUsed: string;
}

interface Rival {
  name: string;
  logo: string;
  matches: Match[];
  notes: string[];
  wins: number;
  losses: number;
  draws: number;
}

export default function RivalDetails() {
  const { id } = useParams<{ id: string }>();
  const [rival, setRival] = useState<Rival | null>(null);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id !== undefined) {
      const storedRivals = JSON.parse(localStorage.getItem("rivals") || "[]");
      const selectedRival = storedRivals[parseInt(id, 10)];
      if (selectedRival) {
        // Ensure notes are an array
        if (!Array.isArray(selectedRival.notes)) {
          selectedRival.notes = [];
        }

        // Clean up invalid matches
        const storedMatches = JSON.parse(localStorage.getItem("matches") || "[]");
        const validMatches = Array.isArray(selectedRival.matches)
          ? selectedRival.matches.filter((match: Match) =>
              storedMatches.some((storedMatch: Match) => storedMatch.id === match.id)
            )
          : [];

        // Dynamically calculate wins, losses, and draws
        const wins = validMatches.filter((match: Match) => match.score.home > match.score.away).length;
        const losses = validMatches.filter((match: Match) => match.score.home < match.score.away).length;
        const draws = validMatches.filter((match: Match) => match.score.home === match.score.away).length;

        setRival({
          ...selectedRival,
          matches: validMatches,
          wins,
          losses,
          draws,
        });
      } else {
        console.error("Invalid rival ID or rival not found.");
        navigate("/rivals");
      }
    }
  }, [id, navigate]);

  const handleAddNote = () => {
    if (newNote.trim() !== "" && rival) {
      const updatedRival = {
        ...rival,
        notes: [...(rival.notes || []), newNote],
      };

      const storedRivals = JSON.parse(localStorage.getItem("rivals") || "[]");
      storedRivals[parseInt(id as string, 10)] = updatedRival;
      localStorage.setItem("rivals", JSON.stringify(storedRivals));

      setRival(updatedRival);
      setNewNote(""); // Clear input
    }
  };

  if (!rival) {
    return <div>Cargando detalles del rival...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detalles del Rival</h1>
        <button
          onClick={() => navigate("/rivals")}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19]"
        >
          Volver
        </button>
      </div>

      {/* Rival Information */}
      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Informacion del Rival</h2>
        {rival.logo && (
          <div className="mb-4">
            <img
              src={rival.logo}
              alt={rival.name}
              className="h-20 w-20 object-cover rounded-full"
            />
          </div>
        )}
        <p className="text-lg mb-2">
          <strong>Nombre:</strong> {rival.name}
        </p>
        <p className="text-lg mb-2">
          <strong>Partidos Jugados:</strong> {rival.matches?.length || 0}
        </p>
        <p className="text-lg mb-2">
          <strong>Record:</strong> {rival.wins}W - {rival.losses}L -{" "}
          {rival.draws}D
        </p>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Notas</h2>
        <ul className="space-y-2">
          {rival.notes && rival.notes.length > 0 ? (
            rival.notes.map((note, index) => (
              <li
                key={index}
                className="p-3 border rounded-lg shadow-sm bg-gray-50"
              >
                {note}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No hay notas disponibles.</p>
          )}
        </ul>
        <div className="mt-4 flex items-center space-x-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Agregar nota..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleAddNote}
            className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19]"
          >
            Agregar Nota
          </button>
        </div>
      </div>

      {/* Matches Section */}
      <div className="bg-white rounded-xl border-2 border-[#218b21] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Partidos Contra {rival.name}</h2>
        {rival.matches && rival.matches.length > 0 ? (
          <ul className="space-y-4">
            {rival.matches.map((match) => (
              <li
                key={match.id}
                className="border p-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Fecha:</strong> {match.date}
                  </p>
                  <p>
                    <strong>Resultado:</strong> {match.score.home} - {match.score.away}
                  </p>
                  <p>
                    <strong>Formacion Utilizada:</strong> {match.formationUsed}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/match-details/${match.id}`)}
                  className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19]"
                >
                  Ver Detalles
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay partidos contra este rival todavia.</p>
        )}
      </div>
    </div>
  );
}
