import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from "react-markdown";

const openai = new OpenAI({
  apiKey: "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", // Replace with your OpenAI API key
  dangerouslyAllowBrowser: true,
});

const InsightsPlus = () => {
  const [insights, setInsights] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allMatches, setAllMatches] = useState([]);
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const [savedInsights, setSavedInsights] = useState<string[]>([]);

  useEffect(() => {
    const storedMatches = JSON.parse(localStorage.getItem("matches") || "[]");
    setAllMatches(storedMatches);

    const storedInsights = JSON.parse(localStorage.getItem("savedInsights") || "[]");
    setSavedInsights(storedInsights);
  }, []);

  const generateInsights = async () => {
    if (!allMatches || allMatches.length === 0) {
      setInsights("No hay información suficiente para generar insights.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente de análisis futbolístico encargado de generar conclusiones estratégicas basadas exclusivamente en los datos proporcionados sobre los partidos jugados por el equipo. Tu tarea es identificar patrones y tendencias únicamente con base en la información objetiva suministrada. No hagas recomendaciones genéricas o subjetivas, ni especules.  Ultimo requisito: trata siempre de entregar la informacion de la forma mas bonita posible",
          },
          {
            role: "user",
            content: `Aquí tienes los datos de los partidos jugados hasta ahora: ${JSON.stringify(
              allMatches
            )}, A partir de estos datos, genera conclusiones basadas en patrones estadísticos y tendencias verificables. Ejemplos de los tipos de análisis que espero:
                Combinaciones de jugadores en ciertas posiciones y su impacto en el rendimiento (goles anotados, tiros en contra, etc.).
                Rendimiento del equipo cuando un jugador específico juega en ciertas posiciones.
                Comparaciones entre partidos de local y visitante.
                Relaciones entre formaciones utilizadas y resultados obtenidos.
                Impacto de ciertas alineaciones en métricas como tiros a puerta o goles recibidos.
                Estructura tus conclusiones en un formato lo mas lindo posible y con análisis claros y específicos.  Ultimo requisito: trata siempre de entregar la informacion de la forma mas bonita posible`,
          },
        ],
      });

      setInsights(completion.choices[0]?.message?.content || "No se generaron conclusiones.");
    } catch (err) {
      console.error("Error al generar insights:", err);
      setError("Ocurrió un error al generar los insights. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const askCustomQuestion = async () => {
    if (!customQuestion.trim()) {
      setError("Por favor, escribe una pregunta antes de enviarla.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
            "Eres un asistente de análisis futbolístico encargado de generar conclusiones estratégicas basadas exclusivamente en los datos proporcionados sobre los partidos jugados por el equipo. Tu tarea es identificar patrones y tendencias únicamente con base en la información objetiva suministrada. No hagas recomendaciones genéricas o subjetivas, ni especules. Recorda entregar los datos de la forma mas bonita posible en cuanto a formato para favorecer la facilidad de la lectura",
          },
          {
            role: "user",
            content: `Aquí tienes los datos de los partidos jugados hasta ahora: ${JSON.stringify(
              allMatches
            )}. Analisa la siguiente pregunta  ${customQuestion} y genera conclusiones basadas en patrones estadísticos y tendencias verificables. Ejemplos de los tipos de análisis que espero:
              Combinaciones de jugadores en ciertas posiciones y su impacto en el rendimiento (goles anotados, tiros en contra, etc.).
              Rendimiento del equipo cuando un jugador específico juega en ciertas posiciones.
              Comparaciones entre partidos de local y visitante.
              Relaciones entre formaciones utilizadas y resultados obtenidos.
              Impacto de ciertas alineaciones en métricas como tiros a puerta o goles recibidos. Ultimo requisito: trata siempre de entregar la informacion de la forma mas bonita posible`,
          },
        ],
      });

      setInsights(
        completion.choices[0]?.message?.content || "No se generaron respuestas."
      );
    } catch (err) {
      console.error("Error al responder la pregunta:", err);
      setError("Ocurrió un error al responder la pregunta. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const saveInsights = () => {
    if (insights) {
      const updatedInsights = [...savedInsights, insights];
      setSavedInsights(updatedInsights);
      localStorage.setItem("savedInsights", JSON.stringify(updatedInsights));
      navigate("/saved-insights");
    }
  };

  return (
  <div className="max-w-6xl mx-auto">
    {/* Botón Ver Insights Guardados */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Insights +</h1>
      <button
        onClick={() => navigate("/saved-insights")}
        className="bg-[#218b21] text-white px-6 py-2 rounded-lg hover:bg-[#196a19] shadow"
      >
        Ver Insights Guardados
      </button>
    </div>

    {/* Contenedor principal */}
    <div className="p-6 bg-white rounded-xl border-2 border-[#218b21] shadow">
      <div className="space-y-6">
        {/* Generar Insights */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Generar Insights</h2>
          <p className="text-sm text-gray-600 mb-4">
            Analiza automáticamente los datos de los partidos jugados para obtener conclusiones estratégicas.
          </p>
          <button
            onClick={generateInsights}
            className="w-full bg-[#218b21] text-white px-4 py-3 rounded-lg hover:[#196a19]"
            disabled={loading}
          >
            {loading ? "Generando Insights..." : "Generar Insights"}
          </button>
        </div>

        {/* Hacer una Pregunta */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Hacer una Pregunta</h2>
          <p className="text-sm text-gray-600 mb-4">
            Formula una pregunta personalizada basada en los datos disponibles de los partidos.
          </p>
          <textarea
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Escribe tu pregunta personalizada aquí..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            onClick={askCustomQuestion}
            className="w-full bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2"
            disabled={loading}
          >
            {loading ? "Consultando..." : "Enviar Pregunta"}
          </button>
        </div>
      </div>

      {/* Resultados */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Resultados</h2>
        {insights ? (
          <div className="p-4 bg-gray-100 rounded-lg">
            <ReactMarkdown>{insights}</ReactMarkdown>
            <button
              onClick={saveInsights}
              className="mt-4 w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Guardar Insights
            </button>
          </div>
        ) : (
          <p className="text-gray-600">No hay resultados aún.</p>
        )}
      </div>
    </div>
  </div>
);

};

export default InsightsPlus;




