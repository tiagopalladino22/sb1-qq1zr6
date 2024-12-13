import React from 'react';
import { Sidebar } from './Sidebar'; // Asegúrate de que Sidebar esté correctamente importado

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar fija */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        {children}
      </div>
    </div>
  );
}
