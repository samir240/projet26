'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Mail, Trash2, X, User } from 'lucide-react';
import Link from 'next/link';
import Flag from 'react-world-flags';



interface Request {
  /* ======================
     REQUEST
  ====================== */
  id_request: number;
  id_patient: number;
  id_procedure: number | null;
  id_commercial: number | null;
  id_galerie: number | null;

  langue: string;
  message_patient: string | null;
  status: string;

  text_maladies: string | null;
  text_allergies: string | null;
  text_chirurgies: string | null;
  text_medicaments: string | null;

  id_coordi: number | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;

  created_at: string;
  updated_at: string;

  /* ======================
     PATIENT
  ====================== */
  patient_id: number;
  patient_tel: string | null;
  patient_email: string | null;
  patient_nom: string;
  patient_prenom: string;
  patient_langue: string | null;
  patient_age: number | null;
  patient_sexe: 'M' | 'F' | 'Autre' | null;
  patient_pays: string | null;

  /* ======================
     DISPLAY (déjà utilisés)
  ====================== */
  procedure_nom?: string;
  commercial_nom?: string;
  commercial_prenom?: string;
}


/* -------------------------------------------------------------
  PAGE
------------------------------------------------------------- */
export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterAgent, setFilterAgent] = useState('All');
  const [filterSource, setFilterSource] = useState('All');

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
const [agents, setAgents] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRequest, setEditRequest] = useState<Request | null>(null);
  const [activeTab, setActiveTab] = useState('general'); // Pour le modal Edit
  const [activeTabAdd, setActiveTabAdd] = useState('general'); // Pour le modal Add (séparé)
  const [showAgentModal, setShowAgentModal] = useState(false);
const [tempAgentRequest, setTempAgentRequest] = useState<Request | null>(null);

const [showAddModal, setShowAddModal] = useState(false);
const [procedures, setProcedures] = useState<any[]>([]);
// New Request State (Contrôlé pour ne pas perdre la saisie)
const [newRequest, setNewRequest] = useState<Partial<Request>>({
  status: 'New',
  langue: 'fr',
  patient_nom: '',
  patient_prenom: '',
  patient_email: '',
  patient_tel: '',
  patient_age: 0,
  patient_sexe: 'M',
  patient_pays: '',
  source: 'Manual',
  text_maladies: '',
  text_allergies: '',
  text_chirurgies: '',
  text_medicaments: ''
});


  /* -------------------------------------------------------------
    FETCH API
  ------------------------------------------------------------- */
 useEffect(() => {
  fetch("https://lepetitchaletoran.com/api/ia/requests.php")
    .then(res => res.json())
    .then((data: any[]) => {
      const mapped: Request[] = data.map(r => ({
        /* ======================
           REQUEST
        ====================== */
        id_request: r.id_request,
        id_patient: r.id_patient,
        id_procedure: r.id_procedure,
        id_commercial: r.id_commercial,
        id_galerie: r.id_galerie,
        langue: r.langue,
        message_patient: r.message_patient,
        status: r.status,
        text_maladies: r.text_maladies,
        text_allergies: r.text_allergies,
        text_chirurgies: r.text_chirurgies,
        text_medicaments: r.text_medicaments,
        id_coordi: r.id_coordi,
        source: r.source,
        utm_source: r.utm_source,
        utm_medium: r.utm_medium,
        utm_campaign: r.utm_campaign,
        created_at: r.created_at,
        updated_at: r.updated_at,

        /* ======================
           PATIENT
        ====================== */
        patient_id: r.patient_id,
        patient_tel: r.patient_tel,
        patient_email: r.patient_email,
        patient_nom: r.patient_nom,
        patient_prenom: r.patient_prenom,
        patient_langue: r.patient_langue,
        patient_age: r.patient_age,
        patient_sexe: r.patient_sexe,
        patient_pays: r.patient_pays,

        /* ======================
           DISPLAY
        ====================== */
        procedure_nom: r.procedure_nom || '',
        commercial_nom: r.commercial_nom || '',
        commercial_prenom: r.commercial_prenom || '',
        date: r.created_at
      }));
      setRequests(mapped);
      setFilteredRequests(mapped);
      setLoading(false);
    })
    .catch(() => setLoading(false));

    fetch("https://lepetitchaletoran.com/api/ia/get_all_agents.php")
    .then(res => res.json())
    .then(data => {
      if (data.success) setAgents(data.data);
    });
}, []);

// Fetch des procédures au chargement
useEffect(() => {
  fetch("https://lepetitchaletoran.com/api/get_procedures.php")
    .then(res => res.json())
    .then(data => { if (data.success) setProcedures(data.data); });
}, []);

  /* -------------------------------------------------------------
    FILTER
  ------------------------------------------------------------- */
  useEffect(() => {
    let data = requests;
    if (filterStatus !== 'All') data = data.filter(r => r.status === filterStatus);
    if (filterAgent !== 'All') data = data.filter(r => r.commercial_nom === filterAgent);
    if (filterSource !== 'All') data = data.filter(r => r.source === filterSource);
    setFilteredRequests(data);
  }, [filterStatus, filterAgent, filterSource, requests]);

  /* -------------------------------------------------------------
    DELETE
  ------------------------------------------------------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette requête ?")) return;

    await fetch("https://lepetitchaletoran.com/api/ia/requests.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id_request: id })
    });

    setRequests(prev => prev.filter(r => r.id_request !== id));
  };

  /* -------------------------------------------------------------
    STATUS STYLE
  ------------------------------------------------------------- */
  const getStatusClass = (s: Request['status']) => {
    switch (s) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Qualified': return 'bg-purple-100 text-purple-700';
      case 'Converted': return 'bg-green-100 text-green-700';
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Chargement...</div>;
  }

  /* -------------------------------------------------------------
    RENDER
  ------------------------------------------------------------- */
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Requests</h1>
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold"></h1>
  <button 
    onClick={() => {
      setShowAddModal(true);
      // Réinitialiser l'onglet à 'general' à l'ouverture
      setActiveTabAdd('general');
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
  >
    <span className="text-lg font-bold">+</span> Add Request
  </button>
</div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-3 gap-4">
        <select className="border p-2 rounded" onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option>New</option>
          <option>In Progress</option>
          <option>Qualified</option>
          <option>Converted</option>
        </select>

        <select className="border p-2 rounded" onChange={e => setFilterAgent(e.target.value)}>
          <option value="All">All Agents</option>
          {[...new Set(requests.map(r => r.commercial_nom))].map(a => (
            <option key={a}>{a}</option>
          ))}
        </select>

        <select className="border p-2 rounded" onChange={e => setFilterSource(e.target.value)}>
          <option value="All">All Sources</option>
          {[...new Set(requests.map(r => r.source))].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Medical procedure</th>
              <th className="p-3 text-left">Coordinator</th>
              <th className="p-3 text-left">Hospitals Estimation</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Reception date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(r => (
              <tr key={r.id_request} className="border-t hover:bg-gray-50">
                <td className="p-3">#{r.id_request}</td>
                <td className="p-3">
  <div className="flex flex-col gap-1">
    {/* Ligne Nom + Prénom */}
    <Link
      href={`/dashboard1/requests/${r.patient_id}`}
      className="font-semibold text-blue-600 hover:underline"
    >
      {r.patient_nom} {r.patient_prenom}
    </Link>

    {/* Ligne Email */}
    <div className="text-xs text-gray-500 italic">
      {r.patient_email}
    </div>

    {/* Ligne Drapeaux et Langue */}
    <div className="flex items-center gap-2 mt-1">
      {/* Drapeau : On essaie de mapper le pays au code ISO */}
      <div className="w-5 shadow-sm border border-gray-100 flex items-center">
        <Flag 
          code={r.patient_pays === 'France' ? 'FR' : r.patient_pays === 'Algerie' ? 'DZ' : r.patient_pays} 
          fallback={<span className="text-[10px]">🏳️</span>}
        />
      </div>
      
      {/* Badge Langue */}
      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded uppercase font-medium text-gray-600">
        {r.patient_langue || r.langue || '??'}
      </span>
    </div>
  </div>
</td>
                <td className="p-3">{r.procedure_nom}</td>
                <td className="p-3">{r.commercial_prenom} {r.commercial_nom}</td>
                <td className="p-3">{r.source}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusClass(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3">{r.updated_at}</td>
                <td className="p-3 text-right flex justify-end gap-3">
                <User 
    className="cursor-pointer text-cyan-600 hover:text-cyan-800" 
    onClick={() => { 
      setTempAgentRequest(r); 
      setShowAgentModal(true); 
    }} 
  />
                  <Eye
                    className="cursor-pointer text-blue-600"
                    onClick={() => { setSelectedRequest(r); setShowViewModal(true); }}
                  />
                  <Pencil
                    className="cursor-pointer text-yellow-600"
                    onClick={() => { setEditRequest(r); setShowEditModal(true); }}
                  />
              
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowViewModal(false)} />
            <h2 className="text-xl font-bold mb-4">Request #{selectedRequest.id_request}</h2>
            <pre className="text-sm bg-gray-50 p-4 rounded">
{JSON.stringify(selectedRequest, null, 2)}
            </pre>
          </div>
        </div>
      )}
{showAddModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl">
      <X
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => {
          setShowAddModal(false);
          // Réinitialiser l'onglet à 'general' pour la prochaine ouverture
          setActiveTabAdd('general');
        }}
      />
      <h2 className="text-xl font-bold mb-4">Ajouter une nouvelle requête</h2>

      {/* TABS */}
      <div className="flex gap-2 mb-4">
        {['general', 'patient', 'medical'].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded capitalize ${activeTabAdd === tab ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTabAdd(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENU - ONGLET GENERAL */}
      {activeTabAdd === 'general' && (
        <>
          <label className="block text-sm font-semibold mb-1">Procédure souhaitée</label>
          <select
            className="w-full border p-2 mb-2"
            value={newRequest.id_procedure || ''}
            onChange={(e) => setNewRequest({ ...newRequest, id_procedure: Number(e.target.value) })}
          >
            <option value="">-- Sélectionner une procédure --</option>
            {procedures.map((p) => (
              <option key={p.id_procedure} value={p.id_procedure}>{p.nom_procedure}</option>
            ))}
          </select>

          <label className="block text-sm font-semibold mb-1">Status</label>
          <select
            className="w-full border p-2 mb-2"
            value={newRequest.status}
            onChange={(e) => setNewRequest({ ...newRequest, status: e.target.value })}
          >
            <option>New</option>
            <option>In Progress</option>
            <option>Qualified</option>
            <option>Converted</option>
          </select>

          <label className="block text-sm font-semibold mb-1">Agent</label>
          <select
            className="w-full border p-2 mb-2"
            value={newRequest.id_commercial || ''}
            onChange={(e) => setNewRequest({ ...newRequest, id_commercial: Number(e.target.value) })}
          >
            <option value="">-- Sélectionner un agent --</option>
            {agents.map((agent) => (
              <option key={agent.id_commercial} value={agent.id_commercial}>
                {agent.nom} {agent.prenom}
              </option>
            ))}
          </select>

          <label className="block text-sm font-semibold mb-1">Source</label>
          <input
            className="w-full border p-2 mb-2"
            value={newRequest.source || ''}
            onChange={(e) => setNewRequest({ ...newRequest, source: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Langue</label>
          <input
            className="w-full border p-2 mb-2"
            value={newRequest.langue || ''}
            onChange={(e) => setNewRequest({ ...newRequest, langue: e.target.value })}
          />
        </>
      )}

      {/* CONTENU - ONGLET PATIENT */}
      {activeTabAdd === 'patient' && (
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <label className="block text-sm font-semibold mb-1">Nom</label>
          <input
            className="w-full border p-2 mb-2"
            value={newRequest.patient_nom || ''}
            onChange={(e) => setNewRequest({ ...newRequest, patient_nom: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Prénom</label>
          <input
            className="w-full border p-2 mb-2"
            value={newRequest.patient_prenom || ''}
            onChange={(e) => setNewRequest({ ...newRequest, patient_prenom: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            className="w-full border p-2 mb-2"
            value={newRequest.patient_email || ''}
            onChange={(e) => setNewRequest({ ...newRequest, patient_email: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Téléphone</label>
          <input
            className="w-full border p-2 mb-2"
            value={newRequest.patient_tel || ''}
            onChange={(e) => setNewRequest({ ...newRequest, patient_tel: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Âge</label>
          <input
            type="number"
            className="w-full border p-2 mb-2"
            value={newRequest.patient_age || ''}
            onChange={(e) => setNewRequest({ ...newRequest, patient_age: Number(e.target.value) })}
          />

          <label className="block text-sm font-semibold mb-1">Sexe</label>
          <select
            className="w-full border p-2 mb-2"
            value={newRequest.patient_sexe || 'M'}
            onChange={(e) => setNewRequest({ ...newRequest, patient_sexe: e.target.value as any })}
          >
            <option value="M">M</option>
            <option value="F">F</option>
          </select>

          <label className="block text-sm font-semibold mb-1">Pays (Code ISO : FR, DZ...)</label>
          <input
            className="w-full border p-2 mb-2"
            value={newRequest.patient_pays || ''}
            onChange={(e) => setNewRequest({ ...newRequest, patient_pays: e.target.value })}
          />
        </div>
      )}

      {/* CONTENU - ONGLET MEDICAL */}
      {activeTabAdd === 'medical' && (
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <label className="block text-sm font-semibold mb-1">Maladies</label>
          <textarea
            className="w-full border p-2 mb-2 h-20"
            value={newRequest.text_maladies || ''}
            onChange={(e) => setNewRequest({ ...newRequest, text_maladies: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Allergies</label>
          <textarea
            className="w-full border p-2 mb-2 h-20"
            value={newRequest.text_allergies || ''}
            onChange={(e) => setNewRequest({ ...newRequest, text_allergies: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Chirurgies</label>
          <textarea
            className="w-full border p-2 mb-2 h-20"
            value={newRequest.text_chirurgies || ''}
            onChange={(e) => setNewRequest({ ...newRequest, text_chirurgies: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Médicaments</label>
          <textarea
            className="w-full border p-2 mb-2 h-20"
            value={newRequest.text_medicaments || ''}
            onChange={(e) => setNewRequest({ ...newRequest, text_medicaments: e.target.value })}
          />
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end gap-3 mt-4 border-t pt-4">
        <button
          className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
          onClick={() => {
            setShowAddModal(false);
            // Réinitialiser l'onglet à 'general' pour la prochaine ouverture
            setActiveTabAdd('general');
          }}
        >
          Annuler
        </button>
        <button
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-md"
  onClick={async () => {
    if (!newRequest.patient_nom || !newRequest.id_procedure) {
      alert("Le nom du patient et la procédure sont obligatoires.");
      return;
    }
    try {
      // ON APPELLE LA ROUTE NEXT.JS INTERNE
      const res = await fetch('/api/send_request', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create', 
          ...newRequest 
        }),
      });
      
      const result = await res.json();
      if (result.success) {
        alert("Requête créée avec succès !");
        // Réinitialiser le formulaire après succès
        setNewRequest({
          status: 'New',
          langue: 'fr',
          patient_nom: '',
          patient_prenom: '',
          patient_email: '',
          patient_tel: '',
          patient_age: 0,
          patient_sexe: 'M',
          patient_pays: '',
          source: 'Manual',
          text_maladies: '',
          text_allergies: '',
          text_chirurgies: '',
          text_medicaments: ''
        });
        setActiveTabAdd('general');
        setShowAddModal(false);
        window.location.reload();
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (err) {
      alert("Erreur de connexion à l'API interne");
    }
  }}
>
  Créer la requête
</button>
      </div>
    </div>
  </div>
)}

      {/* MODAL CHANGEMENT AGENT */}
{showAgentModal && tempAgentRequest && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
    <div className="bg-white p-6 rounded-xl w-full max-w-sm relative shadow-2xl">
      <X 
        className="absolute top-4 right-4 cursor-pointer text-gray-400" 
        onClick={() => setShowAgentModal(false)} 
      />
      
      <div className="flex items-center gap-2 mb-4">
        <User className="text-cyan-600" size={20} />
        <h2 className="text-lg font-bold">Assigner un agent</h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Patient: <span className="font-semibold">{tempAgentRequest.patient_nom}</span>
      </p>

      <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Choisir l'agent commercial</label>
      <select
        className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-cyan-500 outline-none"
        value={tempAgentRequest.id_commercial || ''}
        onChange={(e) => {
          const val = e.target.value;
          const selectedId = val ? Number(val) : null;
          const agentObj = agents.find(a => Number(a.id_commercial) === selectedId);
          
          setTempAgentRequest({ 
            ...tempAgentRequest, 
            id_commercial: selectedId,
            commercial_nom: agentObj ? agentObj.nom : '' 
          });
        }}
      >
        <option value="">-- Non assigné --</option>
        {agents.map((agent) => (
          <option key={agent.id_commercial} value={agent.id_commercial}>
            {agent.nom} {agent.prenom}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-2 mt-6">
        <button 
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
          onClick={() => setShowAgentModal(false)}
        >
          Annuler
        </button>
        <button 
          className="px-4 py-2 text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg shadow-sm"
          onClick={async () => {
            try {
              const res = await fetch('/api/update-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'update',
                  id_request: tempAgentRequest.id_request,
                  id_patient: tempAgentRequest.patient_id,
                  id_commercial: tempAgentRequest.id_commercial
                }),
              });
              const result = await res.json();
              if (result.success) {
                setRequests(prev => prev.map(r => r.id_request === tempAgentRequest.id_request ? tempAgentRequest : r));
                setShowAgentModal(false);
                alert("Agent mis à jour !");
              }
            } catch (err) {
              alert("Erreur lors de la mise à jour");
            }
          }}
        >
          Valider l'assignation
        </button>
      </div>
    </div>
  </div>
)}


{/* EDIT MODAL */}
{showEditModal && editRequest && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-xl relative">
      <X
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => setShowEditModal(false)}
      />
      <h2 className="text-xl font-bold mb-4">Modifier la requête #{editRequest.id_request}</h2>

      {/* TABS */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${activeTab === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`px-3 py-1 rounded ${activeTab === 'patient' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('patient')}
        >
          Patient
        </button>
        <button
          className={`px-3 py-1 rounded ${activeTab === 'medical' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('medical')}
        >
          Medical
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'general' && (
        <>
          <label className="block text-sm font-semibold mb-1">Status</label>
          <select
            className="w-full border p-2 mb-2"
            value={editRequest.status}
            onChange={(e) => setEditRequest({ ...editRequest, status: e.target.value })}
          >
            <option>New</option>
            <option>In Progress</option>
            <option>Qualified</option>
            <option>Converted</option>
          </select>

    <label className="block text-sm font-semibold mb-1">Agent</label>
<select
  className="w-full border p-2 mb-2"
  value={editRequest.id_commercial || ''}
  onChange={(e) => {
    const val = e.target.value;
    const selectedId = val ? Number(val) : null;
    const agentObj = agents.find(a => Number(a.id_commercial) === selectedId);
    
    setEditRequest({ 
      ...editRequest, 
      id_commercial: selectedId,
      commercial_nom: agentObj ? agentObj.nom : '' 
    });
  }}
>
  <option value="">-- Sélectionner un agent --</option>
  {agents.map((agent) => (
    <option key={agent.id_commercial} value={agent.id_commercial}>
      {agent.nom} {agent.prenom}
    </option>
  ))}
</select>

          <label className="block text-sm font-semibold mb-1">Source</label>
          <input
            className="w-full border p-2 mb-2"
            value={editRequest.source || ''}
            onChange={(e) => setEditRequest({ ...editRequest, source: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Langue</label>
          <input
            className="w-full border p-2 mb-2"
            value={editRequest.langue || ''}
            onChange={(e) => setEditRequest({ ...editRequest, langue: e.target.value })}
          />
        </>
      )}

      {activeTab === 'patient' && (
        <>
          <label className="block text-sm font-semibold mb-1">Nom</label>
          <input
            className="w-full border p-2 mb-2"
            value={editRequest.patient_nom}
            onChange={(e) => setEditRequest({ ...editRequest, patient_nom: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Prénom</label>
          <input
            className="w-full border p-2 mb-2"
            value={editRequest.patient_prenom}
            onChange={(e) => setEditRequest({ ...editRequest, patient_prenom: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            className="w-full border p-2 mb-2"
            value={editRequest.patient_email || ''}
            onChange={(e) => setEditRequest({ ...editRequest, patient_email: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Téléphone</label>
          <input
            className="w-full border p-2 mb-2"
            value={editRequest.patient_tel || ''}
            onChange={(e) => setEditRequest({ ...editRequest, patient_tel: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Âge</label>
          <input
            type="number"
            className="w-full border p-2 mb-2"
            value={editRequest.patient_age || ''}
            onChange={(e) => setEditRequest({ ...editRequest, patient_age: Number(e.target.value) })}
          />

          <label className="block text-sm font-semibold mb-1">Sexe</label>
          <select
            className="w-full border p-2 mb-2"
            value={editRequest.patient_sexe || ''}
            onChange={(e) => setEditRequest({ ...editRequest, patient_sexe: e.target.value as 'M' | 'F' | 'Autre' })}
          >
            <option value="">Sélectionner</option>
            <option value="M">M</option>
            <option value="F">F</option>
            
          </select>

          <label className="block text-sm font-semibold mb-1">Pays</label>
          <input
            className="w-full border p-2 mb-2"
            value={editRequest.patient_pays || ''}
            onChange={(e) => setEditRequest({ ...editRequest, patient_pays: e.target.value })}
          />
        </>
      )}

      {activeTab === 'medical' && (
        <>
          <label className="block text-sm font-semibold mb-1">Maladies</label>
          <textarea
            className="w-full border p-2 mb-2"
            value={editRequest.text_maladies || ''}
            onChange={(e) => setEditRequest({ ...editRequest, text_maladies: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Allergies</label>
          <textarea
            className="w-full border p-2 mb-2"
            value={editRequest.text_allergies || ''}
            onChange={(e) => setEditRequest({ ...editRequest, text_allergies: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Chirurgies</label>
          <textarea
            className="w-full border p-2 mb-2"
            value={editRequest.text_chirurgies || ''}
            onChange={(e) => setEditRequest({ ...editRequest, text_chirurgies: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Médicaments</label>
          <textarea
            className="w-full border p-2 mb-2"
            value={editRequest.text_medicaments || ''}
            onChange={(e) => setEditRequest({ ...editRequest, text_medicaments: e.target.value })}
          />
        </>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-4">
        
        <button
          className="px-4 py-2 border rounded"
          onClick={() => setShowEditModal(false)}
        >
          Annuler
        </button>
        
<button
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  onClick={async () => {
    if (!editRequest) return;
    

    try {
      // On prépare le payload structuré exactement comme le PHP l'attend
      const payload = {
        action: 'update',
        id_request: editRequest.id_request,
        id_patient: editRequest.patient_id, // L'ID nécessaire pour la clause WHERE en PHP
        
        // Champs pour la table 'requests'
        status: editRequest.status,
        id_commercial: editRequest.id_commercial,
        source: editRequest.source,
        langue: editRequest.langue,
        message_patient: editRequest.message_patient,
        text_maladies: editRequest.text_maladies,
        text_allergies: editRequest.text_allergies,
        text_chirurgies: editRequest.text_chirurgies,
        text_medicaments: editRequest.text_medicaments,

        // Champs pour la table 'patients' (Objet imbriqué pour le if(isset($data['patient'])) du PHP)
        patient: {
          nom: editRequest.patient_nom,
          prenom: editRequest.patient_prenom,
          email: editRequest.patient_email,
          numero_tel: editRequest.patient_tel,
          age: editRequest.patient_age,
          sexe: editRequest.patient_sexe,
          pays: editRequest.patient_pays,
          //poids: editRequest.patient_poids,
          //taille: editRequest.patient_taille,
          //smoker: editRequest.patient_smoker,
          //imc: editRequest.patient_imc
        }
      };

      console.log("Données envoyées au PHP :", payload);

      const res = await fetch('/api/update-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Réponse de l'API :", result);

      if (result.success) {
        // Mise à jour de la liste locale pour éviter de recharger la page
        setRequests((prev) =>
          prev.map((r) => (r.id_request === editRequest.id_request ? { ...r, ...editRequest } : r))
        );
        setShowEditModal(false);
        alert("Mise à jour effectuée avec succès !");
      } else {
        alert("Erreur API : " + result.error);
      }

    } catch (err) {
      console.error("Erreur réseau ou syntaxe :", err);
      alert("Impossible de contacter l'API.");
    }
  }}
>
  Enregistrer
</button>





      </div>
    </div>
  </div>
)}


    </div>
  );
}
