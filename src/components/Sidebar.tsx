import React from 'react';
import { Users, Layout, Shield, LineChart, Medal, Notebook } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LineChart, label: 'Dashboard', path: '/' },
  { icon: Notebook, label: 'Planificación', path: '/match-plans' },
  { icon: Users, label: 'Jugadores', path: '/players' },
  { icon: Layout, label: 'Formaciones', path: '/formations' },
  { icon: Shield, label: 'Rivales', path: '/rivals' },
  { icon: Medal, label: 'Partidos', path: '/matchs' },

];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-black shadow-lg h-[calc(100vh)] overflow-y-auto sticky top-0">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-black-600'
                      : 'text-[#218b21] hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
