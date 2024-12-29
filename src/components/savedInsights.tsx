import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const SavedInsights = () => {
  const [savedInsights, setSavedInsights] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedInsights = JSON.parse(localStorage.getItem("savedInsights") || "[]");
    setSavedInsights(storedInsights);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Insights +</h1>
        <button
          onClick={() => navigate("/insights")}
          className="flex items-center space-x-2 bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19]"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Generar Insights</span>
        </button>
      </div>

      {savedInsights.length > 0 ? (
        <div className="space-y-6">
          {savedInsights.map((insight, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Insight #{index + 1}
              </h2>
              <ReactMarkdown className="text-gray-700">{insight}</ReactMarkdown>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No hay insights guardados aún.</p>
      )}
    </div>
  );
};

export default SavedInsights;

