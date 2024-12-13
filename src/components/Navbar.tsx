import React from 'react';
import { Bell, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';

export default function Navbar() {
  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Team Logo" className="h-80 w-80 object-contain" />
          </Link>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-800">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-800">
              <UserCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
