import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

const InsightsPlus = () => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allMatches, setAllMatches] = useState([]);
  const [savedInsights, setSavedInsights] = useState<string[]>([]);

  // Load match data and saved insights from localStorage
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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "developer",
            content:
              "Eres un asistente de análisis futbolístico encargado de generar conclusiones estratégicas basadas exclusivamente en los datos proporcionados sobre los partidos jugados por el equipo. Tu tarea es identificar patrones y tendencias únicamente con base en la información objetiva suministrada. No hagas recomendaciones genéricas o subjetivas, ni especules.",
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
Estructura tus conclusiones en formato de lista con análisis claros y específicos. Ejemplo de las respuestas esperadas:

Combinaciones Defensivas Efectivas: En los partidos donde Franco Iossini jugó como defensor central y Juan Wagmister como lateral derecho, el equipo recibió un promedio de 1 tiro en contra por partido, comparado con 3 tiros en contra cuando esta combinación no se utilizó.
Rendimiento de Giuliano Lucca: El equipo ganó el 100% de los partidos en los que Giuliano Lucca fue titular como mediocampista ofensivo.
Impacto de Localía: El equipo anotó un promedio de 2 goles por partido jugando como local, mientras que como visitante anotó 1 gol por partido.
Formación y Resultados: La formación "Prueba 1" se utilizó en 5 partidos, obteniendo un promedio de 2 goles a favor y 0.8 goles en contra, con una tasa de victoria del 60%.
Es fundamental que todas las conclusiones estén basadas únicamente en los datos proporcionados y no incluyan recomendaciones o especulaciones. Si los datos no son suficientes para realizar cierto tipo de análisis, indica claramente que no hay suficiente información. Ultimo requisito: trata siempre de entregar la informacion de la mejor manera posible en terminos visuales para que sea mas facil de leer`,
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

  const saveInsights = () => {
    if (insights) {
      const updatedInsights = [...savedInsights, insights];
      setSavedInsights(updatedInsights);
      localStorage.setItem("savedInsights", JSON.stringify(updatedInsights));
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Insights +</h1>
      <p className="mb-6 text-gray-600">
        Genera conclusiones basadas en todos los partidos jugados para ayudar al DT a tomar decisiones estratégicas.
      </p>
      <button
        onClick={generateInsights}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
        disabled={loading}
      >
        {loading ? "Generando..." : "Generar Insights"}
      </button>
      <button
        onClick={saveInsights}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={!insights}
      >
        Guardar Insights
      </button>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Conclusiones Generadas</h2>
        {error && <p className="text-red-500">{error}</p>}
        {insights ? (
          <div className="mt-4 prose prose-lg">
            <ReactMarkdown>{insights}</ReactMarkdown>
          </div>
        ) : (
          <p>No hay conclusiones aún.</p>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Insights Guardados</h2>
        {savedInsights.length > 0 ? (
          <ul className="list-disc pl-6">
            {savedInsights.map((insight, index) => (
              <li key={index} className="text-gray-800 mb-2">
                <ReactMarkdown>{insight}</ReactMarkdown>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay insights guardados aún.</p>
        )}
      </div>
    </div>
  );
};

export default InsightsPlus;




