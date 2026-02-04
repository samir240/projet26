'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Mail, Trash2, X, User, Archive } from 'lucide-react';
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
  archived: string | null;

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
const [patientMediaFiles, setPatientMediaFiles] = useState<File[]>([]);

// Hospitals assigned by request ID
const [hospitalsByRequest, setHospitalsByRequest] = useState<Record<number, any[]>>({});
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
  source: 'Website',
  text_maladies: '',
  text_allergies: '',
  text_chirurgies: '',
  text_medicaments: ''
});


  /* -------------------------------------------------------------
    FETCH API
  ------------------------------------------------------------- */
 useEffect(() => {
  fetch("https://pro.medotra.com/app/http/api/requests.php")
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
        archived: r.archived,

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
      
      // Charger les hôpitaux assignés pour chaque requête
      loadAssignedHospitals(mapped);
    })
    .catch(() => setLoading(false));

    fetch("https://pro.medotra.com/app/http/api/get_all_agents.php")
    .then(res => res.json())
    .then(data => {
      if (data.success) setAgents(data.data);
    });
}, []);

// Fonction pour charger les hôpitaux assignés
const loadAssignedHospitals = async (requestsList: Request[]) => {
  try {
    const hospitalsMap: Record<number, any[]> = {};
    
    // Charger les hôpitaux pour chaque requête
    const promises = requestsList.map(async (req) => {
      try {
        const res = await fetch(`/api/request_hospital?id_request=${req.id_request}`);
        if (res.ok) {
          const hospitals = await res.json();
          // Filtrer seulement les hôpitaux actifs (is_active = 1)
          const activeHospitals = hospitals.filter((h: any) => h.is_active === 1);
          
          // Charger les détails des hôpitaux avec les prix
          const hospitalsWithDetails = await Promise.all(
            activeHospitals.map(async (h: any) => {
              try {
                // Charger les détails de l'hôpital
                const hospitalRes = await fetch(`https://pro.medotra.com/app/http/api/hospitals.php?id=${h.id_hospital}`);
                if (hospitalRes.ok) {
                  const hospitalData = await hospitalRes.json();
                  
                  // Charger le prix de la procédure depuis procedure_hospital
                  let prix = null;
                  let devise = null;
                  if (req.id_procedure) {
                    try {
                      const priceRes = await fetch('https://pro.medotra.com/app/http/api/procedure_hospital.php');
                      if (priceRes.ok) {
                        const priceText = await priceRes.text();
                        const priceData = priceText ? JSON.parse(priceText) : [];
                        const procedureHospital = priceData.find(
                          (ph: any) => ph.id_hospital === h.id_hospital && ph.id_procedure === req.id_procedure && ph.is_active === 1
                        );
                        if (procedureHospital) {
                          prix = procedureHospital.prix_base;
                          devise = procedureHospital.devise;
                        }
                      }
                    } catch (err) {
                      console.error('Error loading price:', err);
                    }
                  }
                  
                  return {
                    ...h,
                    hospital_nom: hospitalData.nom || h.hospital_nom,
                    hospital_ville: hospitalData.ville || h.hospital_ville,
                    hospital_pays: hospitalData.pays || h.hospital_pays,
                    prix_base: prix,
                    devise: devise || 'EUR'
                  };
                }
                return h;
              } catch (err) {
                console.error('Error loading hospital details:', err);
                return h;
              }
            })
          );
          
          if (hospitalsWithDetails.length > 0) {
            hospitalsMap[req.id_request] = hospitalsWithDetails;
          }
        }
      } catch (err) {
        console.error(`Error loading hospitals for request ${req.id_request}:`, err);
      }
    });
    
    await Promise.all(promises);
    setHospitalsByRequest(hospitalsMap);
  } catch (err) {
    console.error('Error loading assigned hospitals:', err);
  }
};

// Fetch des procédures au chargement
useEffect(() => {
  fetch("https://pro.medotra.com/app/http/api/get_procedures.php")
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

    await fetch("https://pro.medotra.com/app/http/api/requests.php", {
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
      case 'affected': return 'bg-purple-100 text-purple-700';
      case 'dispatched': return 'bg-indigo-100 text-indigo-700';
      case 'info request': return 'bg-yellow-100 text-yellow-700';
      case 'NI': return 'bg-orange-100 text-orange-700';
      case 'NA': return 'bg-red-100 text-red-700';
      case 'converted': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
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
    <span className="text-lg font-bold">+</span> Add Request (Popup)
  </button>
  
  <button
    onClick={() => window.location.href = '/dashboard1/requests/new'}
    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 shadow-lg transition-all"
  >
    <span className="text-lg font-bold">+</span> New Request Page
  </button>
</div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-3 gap-4">
        <select className="border p-2 rounded" onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option>New</option>
          <option>affected</option>
          <option>dispatched</option>
          <option>info request</option>
          <option>NI</option>
          <option>NA</option>
          <option>converted</option>
        </select>
        <select className="border p-2 rounded" onChange={e => setFilterAgent(e.target.value)}>
  <option value="All">All Agents</option>
  {[...new Set(requests.map(r => `${r.commercial_prenom} ${r.commercial_nom}`))].map(agentName => (
    <option key={agentName} value={agentName}>
      {agentName}
    </option>
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
              <th className="p-3 text-left">Agent</th>
              <th className="p-3 text-left">Hospitals Estimation</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Reception date</th>
              <th className="p-3 text-left">Answered date</th>
              
              <th className="p-3 text-left">Coordinator</th>
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
                <td className="p-3">
                  {hospitalsByRequest[r.id_request] && hospitalsByRequest[r.id_request].length > 0 ? (
                    <div className="space-y-1">
                      {hospitalsByRequest[r.id_request].map((h: any, idx: number) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium">{h.hospital_nom || h.nom || 'N/A'}</span>
                          {h.prix_base && (
                            <span className="text-gray-600 ml-2">
                              {h.prix_base} {h.devise || 'EUR'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">Aucun hôpital assigné</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusClass(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3">{r.created_at}</td>
                <td className="p-3">{r.updated_at} (update_quote)</td>
                <td className="p-3">John doe</td>
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
                  <Archive
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
          setPatientMediaFiles([]);
          setActiveTabAdd('general');
        }}
      />
      <h2 className="text-xl font-bold mb-4">Ajouter une nouvelle requête</h2>

      {/* TABS */}
      <div className="flex gap-2 mb-4">
        {['general', 'patient', 'medical', 'media'].map((tab) => (
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
            <option>affected</option>
            <option>dispatched</option>
            <option>info request</option>
            <option>NI</option>
            <option>NA</option>
            <option>converted</option>
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

          <label className="block text-sm font-semibold mb-1">Langue préférée</label>
          <select
            className="w-full border p-2 mb-2"
            value={newRequest.langue || ''}
            onChange={(e) => setNewRequest({ ...newRequest, langue: e.target.value })}
          >
            <option value="">-- Sélectionner une langue --</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="ar">العربية</option>
            <option value="tr">Türkçe</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
            <option value="nl">Nederlands</option>
            <option value="ru">Русский</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
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

      {/* CONTENU - ONGLET MEDIA */}
      {activeTabAdd === 'media' && (
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <label className="block text-sm font-semibold mb-2">Photos du patient</label>
          <p className="text-sm text-gray-600 mb-3">
            Sélectionnez une ou plusieurs photos à uploader (documents médicaux, radios, etc.)
          </p>
          
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => {
              if (e.target.files) {
                setPatientMediaFiles(Array.from(e.target.files));
              }
            }}
            className="w-full border p-2 mb-3"
          />

          {patientMediaFiles.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-semibold mb-2">
                {patientMediaFiles.length} fichier(s) sélectionné(s) :
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {patientMediaFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
              <button
                onClick={() => setPatientMediaFiles([])}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Effacer la sélection
              </button>
            </div>
          )}

          {patientMediaFiles.length === 0 && (
            <p className="text-sm text-gray-500 italic">Aucun fichier sélectionné</p>
          )}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end gap-3 mt-4 border-t pt-4">
        <button
          className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
          onClick={() => {
            setShowAddModal(false);
            setPatientMediaFiles([]);
            setActiveTabAdd('general');
          }}
        >
          Annuler
        </button>
        <button
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-md"
  onClick={async () => {
    if (!newRequest.patient_email || !newRequest.id_procedure) {
      alert("L'email du patient et la procédure sont obligatoires.");
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
      console.log('📋 Résultat création request:', result);
      console.log('📋 result.data:', result.data);
      console.log('📋 result.data.success:', result.data?.success);
      
      // AFFICHER LE JSON COMPLET DANS UNE ALERTE
      alert('🔍 JSON RETOURNÉ PAR LE PHP:\n\n' + JSON.stringify(result, null, 2));
      
      // Vérifier si le PHP a vraiment réussi
      if (result.success && result.data?.success) {
        const idRequest = result.data?.id_request || result.data?.id;
        const idPatient = result.data?.id_patient;
        
        console.log('🆔 IDs récupérés:', { idRequest, idPatient, filesCount: patientMediaFiles.length });

        // Upload photos patient si des fichiers ont été sélectionnés
        if (patientMediaFiles.length > 0 && idRequest && idPatient) {
          console.log('📤 Début upload de', patientMediaFiles.length, 'fichier(s)...');
          const uploadPromises = patientMediaFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('type', 'patient_media');
            formData.append('entity_id', String(idPatient));
            formData.append('request_id', String(idRequest));
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            return await uploadRes.json();
          });

          const uploadResults = await Promise.all(uploadPromises);
          console.log('📊 Résultats uploads:', uploadResults);
          
          const failedUploads = uploadResults.filter(r => !r.success);
          
          if (failedUploads.length > 0) {
            console.warn('❌ Certaines photos n\'ont pas pu être uploadées:', failedUploads);
            alert(`⚠️ Requête créée avec succès !\n\n` +
                  `ID Patient: ${idPatient}\n` +
                  `ID Request: ${idRequest}\n\n` +
                  `⚠️ ${failedUploads.length} fichier(s) non uploadé(s).\n` +
                  `Voir console pour détails.`);
          } else if (uploadResults.length > 0) {
            console.log('✅ Tous les fichiers ont été uploadés avec succès!');
            alert(`✅ Requête créée avec succès !\n\n` +
                  `ID Patient: ${idPatient}\n` +
                  `ID Request: ${idRequest}\n\n` +
                  `📤 ${uploadResults.length} fichier(s) uploadé(s) avec succès!`);
          }
        } else {
          console.log('⚠️ Upload ignoré:', { 
            hasFiles: patientMediaFiles.length > 0,
            idRequest, 
            idPatient 
          });
          alert(`✅ Requête créée avec succès !\n\n` +
                `ID Patient: ${idPatient || 'N/A'}\n` +
                `ID Request: ${idRequest || 'N/A'}\n\n` +
                `Aucun fichier à uploader.`);
        }
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
        setPatientMediaFiles([]);
        setActiveTabAdd('general');
        setShowAddModal(false);
        window.location.reload();
      } else {
        // Afficher l'erreur détaillée
        const errorMsg = result.data?.message || result.error || 'Erreur inconnue';
        alert(`❌ Erreur lors de la création:\n\n${errorMsg}\n\nVoir console pour détails.`);
        console.error('📋 Réponse complète:', result);
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
  Patient: <span className="font-semibold">{`${tempAgentRequest.patient_prenom} ${tempAgentRequest.patient_nom}`}</span>
</p>

      <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Choisir l'agent commercial</label>
      <select
  className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-cyan-500 outline-none"
  value={tempAgentRequest.id_commercial || ''}
  onChange={(e) => {
    const selectedId = e.target.value ? Number(e.target.value) : null;
    const agentObj = agents.find(a => Number(a.id_commercial) === selectedId);
    
    // On prépare l'objet complet pour que le tableau se mette à jour instantanément
    setTempAgentRequest({ 
      ...tempAgentRequest, 
      id_commercial: selectedId,
      commercial_nom: agentObj ? agentObj.nom : '',
      commercial_prenom: agentObj ? agentObj.prenom : '' 
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
                  id_commercial: tempAgentRequest.id_commercial,
                  status: 'affected'
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

{/* ARCHIVE MODAL */}
{showEditModal && editRequest && (
  <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-yellow-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <Archive className="text-yellow-700" size={24} />
          </div>
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
            Archiver la requête
          </h2>
        </div>
        <X
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={() => setShowEditModal(false)}
        />
      </div>

      <div className="p-8">
        <p className="text-gray-600 mb-6 font-medium text-center">
          Voulez-vous archiver la demande de <br/>
          <span className="text-gray-900 font-bold text-lg">
            {editRequest.patient_nom} {editRequest.patient_prenom}
          </span>?
        </p>

        {/* Sélection du statut avant archivage */}
        <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100">
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-center">
            Statut de clôture
          </label>
          <select
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm appearance-none text-center cursor-pointer"
            value={editRequest.status}
            onChange={(e) => setEditRequest({ ...editRequest, status: e.target.value })}
          >
            <option value="NI">NI (Non Intéressé)</option>
            <option value="NA">NA (Non Abouti)</option>
            <option value="converted">Converted (Succès)</option>
            <option value="info request">Info Request</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          <button
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black shadow-lg transition-all uppercase tracking-widest text-sm"
            onClick={async () => {
              if (!editRequest.id_request || !editRequest.patient_id) {
                alert("Erreur: Données d'identification manquantes.");
                return;
              }

              try {
                // Envoi de l'état archivé à l'API
                const res = await fetch('/api/update-request', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'update',
                    id_request: editRequest.id_request,
                    id_patient: editRequest.patient_id,
                    archived: 1, // On passe à l'état archivé
                    status: editRequest.status
                  }),
                });

                const result = await res.json();

                if (result.success) {
                  // On filtre la liste locale pour faire disparaître la ligne
                  setRequests((prev) => prev.filter((r) => r.id_request !== editRequest.id_request));
                  setShowEditModal(false);
                } else {
                  alert("Erreur API : " + result.error);
                }
              } catch (err) {
                alert("Impossible de contacter l'API.");
              }
            }}
          >
            OUI, ARCHIVER
          </button>
          
          <button
            className="w-full py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
            onClick={() => setShowEditModal(false)}
          >
            NON, ANNULER
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
