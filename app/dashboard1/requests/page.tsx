// app/dashboard/requests/page.tsx
'use client'; 

import React, { useState } from 'react';

// -------------------------------------------------------------
// 1. Types & Données Statiques
// -------------------------------------------------------------

interface Request {
  id: number;
  patientName: string;
  patientEmail: string;
  procedure: string;
  country: string;
  agent: string;
  source: string;
  status: 'New' | 'In Progress' | 'Qualified' | 'Converted';
  date: string;
}

const initialRequests: Request[] = [
  { id: 1, patientName: 'Sophie Martin', patientEmail: 'sophie.martin@email.com', procedure: 'Rhinoplasty', country: 'France', agent: 'Jean Dupont', source: 'Website', status: 'New', date: '2024-02-10' },
  { id: 2, patientName: 'Michael Johnson', patientEmail: 'michael.j@email.com', procedure: 'Hair Transplant', country: 'USA', agent: 'Marie Claire', source: 'Google Ads', status: 'In Progress', date: '2024-02-09' },
  { id: 3, patientName: 'Anna Schmidt', patientEmail: 'anna.s@email.com', procedure: 'Liposuction', country: 'Germany', agent: 'Jean Dupont', source: 'Referral', status: 'Qualified', date: '2024-02-08' },
  { id: 4, patientName: 'Juan Perez', patientEmail: 'juan.p@email.com', procedure: 'Breast Augmentation', country: 'Spain', agent: 'Marie Claire', source: 'Facebook', status: 'New', date: '2024-02-07' },
  { id: 5, patientName: 'Kenji Tanaka', patientEmail: 'kenji.t@email.com', procedure: 'Facelift', country: 'Japan', agent: 'Lucie Dubois', source: 'Website', status: 'Qualified', date: '2024-02-06' },
  { id: 6, patientName: 'Fátima Silva', patientEmail: 'fatima.s@email.com', procedure: 'Hair Transplant', country: 'Portugal', agent: 'Lucie Dubois', source: 'Google Ads', status: 'In Progress', date: '2024-02-05' },
  { id: 7, patientName: 'Elsa Müller', patientEmail: 'elsa.m@email.com', procedure: 'Rhinoplasty', country: 'Switzerland', agent: 'Jean Dupont', source: 'Referral', status: 'Converted', date: '2024-02-04' },
  { id: 8, patientName: 'George King', patientEmail: 'george.k@email.com', procedure: 'Liposuction', country: 'UK', agent: 'Marie Claire', source: 'Website', status: 'Qualified', date: '2024-02-03' },
];

// Mappage des statuts pour les couleurs et les libellés des KPI
const statusMap = {
  All: { color: 'bg-white border-gray-300', count: initialRequests.length },
  New: { color: 'bg-blue-100 text-blue-700 border-blue-300', count: initialRequests.filter(r => r.status === 'New').length },
  'In Progress': { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', count: initialRequests.filter(r => r.status === 'In Progress').length },
  Qualified: { color: 'bg-purple-100 text-purple-700 border-purple-300', count: initialRequests.filter(r => r.status === 'Qualified').length },
  Converted: { color: 'bg-green-100 text-green-700 border-green-300', count: initialRequests.filter(r => r.status === 'Converted').length },
};

// -------------------------------------------------------------
// 2. Composants de Style (pour la lisibilité)
// -------------------------------------------------------------

// Fonction pour déterminer la couleur du statut dans le tableau
const getStatusClasses = (status: Request['status']) => {
  switch (status) {
    case 'New': return 'bg-blue-50 text-blue-600 border border-blue-300';
    case 'In Progress': return 'bg-yellow-50 text-yellow-600 border border-yellow-300';
    case 'Qualified': return 'bg-purple-50 text-purple-600 border border-purple-300';
    case 'Converted': return 'bg-green-50 text-green-600 border border-green-300';
    default: return 'bg-gray-50 text-gray-600 border border-gray-300';
  }
};


// -------------------------------------------------------------
// 3. Composant de Page Principal
// -------------------------------------------------------------

export default function RequestsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filteredRequests, setFilteredRequests] = useState(initialRequests);
  // Simuler d'autres états de filtre (Agents, Sources, Date)
  const [filterAgent, setFilterAgent] = useState<string>('All');
  const [filterSource, setFilterSource] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<string>(''); // jj/mm/aaaa

  // Simuler la logique de filtrage (basique)
  React.useEffect(() => {
    let requests = initialRequests;

    if (filterStatus !== 'All') {
      requests = requests.filter(r => r.status === filterStatus);
    }
    if (filterAgent !== 'All') {
        requests = requests.filter(r => r.agent === filterAgent);
    }
    if (filterSource !== 'All') {
        requests = requests.filter(r => r.source === filterSource);
    }
    // La date n'est pas implémentée ici mais le filtre UI est présent

    setFilteredRequests(requests);
  }, [filterStatus, filterAgent, filterSource, filterDate]);


  return (
    <div className="min-h-full">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
            <p className="text-gray-500 mt-1">Manage patient inquiries and leads</p>
        </div>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
          + New Request
        </button>
      </div>

      {/* FILTER & ACTIONS SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        
        {/* FILTERS ROW */}
        <div className="flex items-center mb-6 border-b pb-4">
            <h3 className="text-lg font-medium text-gray-700 mr-4">▼ Filter:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                {/* Filter Status */}
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="All">All Status</option>
                    {Object.keys(statusMap).filter(k => k !== 'All').map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                {/* Filter Agents */}
                <select 
                    value={filterAgent}
                    onChange={(e) => setFilterAgent(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="All">All Agents</option>
                    <option value="Jean Dupont">Jean Dupont</option>
                    <option value="Marie Claire">Marie Claire</option>
                    <option value="Lucie Dubois">Lucie Dubois</option>
                </select>

                {/* Filter Sources */}
                <select 
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="All">All Sources</option>
                    <option value="Website">Website</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Referral">Referral</option>
                    <option value="Facebook">Facebook</option>
                </select>
                
                {/* Date Picker (Simulé) */}
                <input 
                    type="text" 
                    placeholder="jj/mm/aaaa"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>

        {/* EXPORT ACTION */}
        <div className="flex justify-end">
            <button className="flex items-center text-gray-600 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m1-7h-3m-4 0H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z"/></svg>
                Export
            </button>
        </div>
      </div>


      {/* KPI CARDS (Status Overview) */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {Object.entries(statusMap).map(([status, data]) => (
          <div 
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`
                p-5 rounded-xl text-center cursor-pointer transition transform hover:scale-[1.02]
                border-2 ${data.color}
                ${filterStatus === status ? 'shadow-xl ring-2 ring-blue-500' : 'shadow'}
            `}
          >
            <div className={`text-4xl font-extrabold ${status === 'All' ? 'text-gray-900' : data.color.split(' ')[1]}`}>
              {data.count}
            </div>
            <div className="text-lg font-semibold mt-1 text-gray-700">
              {status}
            </div>
          </div>
        ))}
      </div>


      {/* REQUESTS TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PATIENT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROCEDURE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COUNTRY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AGENT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SOURCE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{request.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{request.patientName}</div>
                  <div className="text-xs text-gray-500">{request.patientEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.procedure}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.country}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.agent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.source}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
                 <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-500 text-lg">
                        Aucune requête trouvée pour les filtres sélectionnés.
                    </td>
                 </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}