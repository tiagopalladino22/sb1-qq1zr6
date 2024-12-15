import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Players from './components/Players';
import AddPlayer from './components/AddPlayer';
import Formations from './components/Formations';
import AddFormation from './components/AddFormation';
import FormationDetails from './components/FormationDetails';
import Rivals from './components/Rivals';
import AddRival from './components/AddRival';
import AddMatch from './components/AddMatch';
import Matchs from './components/Matchs';
import MatchDetails from './components/MatchDetails';
import PlayerDetails from './components/PlayerDetails';
import RivalDetails from './components/rivalDetails';
import MatchPlanning from './components/matchPlanning';
import MatchPlans from './components/matchsPlans';
import MatchPlanDetails from './components/matchPlanDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/players" element={<Players />} />
              <Route path="/add-player" element={<AddPlayer />} />
              <Route path="/formations" element={<Formations />} />
              <Route path="/rivals" element={<Rivals />} />
              <Route path="/add-rival" element={<AddRival />} />
              <Route path="/add-match" element={<AddMatch />} />
              <Route path="/add-formation" element={<AddFormation />} />
              <Route path="/match-plans" element={<MatchPlans />} />
              <Route path="/match-planning" element={<MatchPlanning />} />
              <Route path="/matchs" element={<Matchs />} />
              <Route path="/formation-details/:id" element={<FormationDetails />} />
              <Route path="/match-details/:id" element={<MatchDetails />} />
              <Route path="/match-plan-details/:id" element={<MatchPlanDetails />} />
              <Route path="/player/:id" element={<PlayerDetails />} />
              <Route path="/rival-details/:id" element={<RivalDetails />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;