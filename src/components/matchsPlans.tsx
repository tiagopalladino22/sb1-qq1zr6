import React, { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MatchPlan {
  id: string;
  rival: string;
  formation: string;
  lineup: { [position: string]: string };
}

export default function MatchPlansPage() {
  const navigate = useNavigate();
  const [matchPlans, setMatchPlans] = useState<MatchPlan[]>([]);

  useEffect(() => {
    // Cargar las planificaciones guardadas desde localStorage
    const storedPlans = JSON.parse(localStorage.getItem("matches") || "[]");
    setMatchPlans(storedPlans);
  }, []);

  const handleDeletePlan = (id: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta planificación?"
    );
    if (!confirmDelete) return;

    const updatedPlans = matchPlans.filter((plan) => plan.id !== id);
    setMatchPlans(updatedPlans);
    localStorage.setItem("matches", JSON.stringify(updatedPlans));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Planificaciones</h1>
        <button
          onClick={() => navigate("/match-planning")}
          className="bg-[#218b21] text-white px-4 py-2 rounded-lg hover:bg-[#196a19]"
        >
          Crear Nueva Planificación
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border-2 border-[#218b21] overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#000000]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Rival
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Formación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ffffff] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matchPlans.length > 0 ? (
              matchPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plan.rival}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.formation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-4">
                    <button
                      onClick={() => navigate(`/match-plan-details/${plan.id}`)}
                      className="text-[#218b21] hover:text-[#000000] flex items-center space-x-2"
                    >
                      <Eye className="h-5 w-5" />
                      <span>Ver Detalles</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-600 hover:text-red-800 flex items-center space-x-2"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Eliminar</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No hay planificaciones disponibles. Crea una nueva
                  planificación para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

