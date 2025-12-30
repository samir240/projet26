'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Patient {
  id_patient: number;
  nom: string;
  prenom: string;
  email: string | null;
  numero_tel: string | null;
  langue: string | null;
  pays: string | null;
  age: number | null;
  sexe: 'M' | 'F' | null;
  poids: number | null;
  taille: number | null;
  smoker: number | null;
  imc: number | null;
  created_at: string;
  updated_at: string;
}

interface OldRequest {
  id_request: number;
  procedure_nom: string | null;
  created_at: string;
  status: string;
}

interface CurrentRequest {
  id_request: number;
  id_patient: number;
  procedure_nom: string | null;
  status: string;
  message_patient: string | null;
  commercial_nom: string | null;
  commercial_prenom: string | null;
  id_procedure: number | null;
  id_commercial: number | null;
  id_galerie: number | null;
  langue: string | null;
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

}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [oldRequests, setOldRequests] = useState<OldRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<CurrentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [mainTab, setMainTab] = useState<'Request' | 'Quotations' | 'Appointments'>('Request');
  const [subTab, setSubTab] = useState<'Patient infos' | 'Documents' | 'Treatments' | 'Hopitaux' | 'Relances'>('Patient infos');
  const [message, setMessage] = useState('');

  // Hospitals state
  const [availableHospitals, setAvailableHospitals] = useState<any[]>([]);
  const [assignedHospitals, setAssignedHospitals] = useState<any[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    // Fetch patient details
    fetch(`https://lepetitchaletoran.com/api/ia/patients.php?id=${patientId}`)
      .then(res => res.json())
      .then((data: Patient) => {
        setPatient(data);
      })
      .catch(err => console.error('Error fetching patient:', err));

    // Fetch all requests for this patient
    fetch('https://lepetitchaletoran.com/api/ia/requests.php')
      .then(res => res.json())
      .then((data: any[]) => {
        const patientRequests = data.filter(r => r.patient_id === Number(patientId));
        
        // Get the most recent request as current
        if (patientRequests.length > 0) {
          const latest = patientRequests[0];
          setCurrentRequest({
            id_request: latest.id_request,
            id_patient: latest.patient_id,
            procedure_nom: latest.procedure_nom,
            status: latest.status,
            message_patient: latest.message_patient,
            commercial_nom: latest.commercial_nom,
            commercial_prenom: latest.commercial_prenom,
            id_procedure: latest.id_procedure,
            id_commercial: latest.id_commercial,
            id_galerie: latest.id_galerie,
            langue: latest.langue,
            text_maladies: latest.text_maladies,
            text_allergies: latest.text_allergies,
            text_chirurgies: latest.text_chirurgies,
            text_medicaments: latest.text_medicaments,
            id_coordi: latest.id_coordi,
            source: latest.source,
            utm_source: latest.utm_source,
            utm_medium: latest.utm_medium,
            utm_campaign: latest.utm_campaign,
            created_at: latest.created_at,
            updated_at: latest.updated_at,
          });
          setMessage(latest.message_patient || '');
        }

        // Set old requests (all except the first one, or all if we want to show all)
        const oldReqs: OldRequest[] = patientRequests.map(r => ({
          id_request: r.id_request,
          procedure_nom: r.procedure_nom,
          created_at: r.created_at,
          status: r.status,
        }));
        setOldRequests(oldReqs);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching requests:', err);
        setLoading(false);
      });
  }, [patientId]);

  // Load hospitals when Hopitaux tab is selected
  useEffect(() => {
    if (subTab === 'Hopitaux' && currentRequest?.id_procedure) {
      loadHospitals();
    }
  }, [subTab, currentRequest?.id_procedure]);

  const loadHospitals = async () => {
    if (!currentRequest?.id_procedure || !currentRequest?.id_request) return;
    
    setHospitalsLoading(true);
    try {
      // Load hospitals that offer the requested procedure
      const procedureHospitalsRes = await fetch('https://lepetitchaletoran.com/api/ia/procedure_hospital.php');
      if (!procedureHospitalsRes.ok) {
        throw new Error(`HTTP error! status: ${procedureHospitalsRes.status}`);
      }
      const procedureHospitalsText = await procedureHospitalsRes.text();
      const procedureHospitals: any[] = procedureHospitalsText ? JSON.parse(procedureHospitalsText) : [];
      
      const hospitalsWithProcedure = procedureHospitals.filter(
        ph => ph.id_procedure === currentRequest.id_procedure && ph.is_active === 1
      );

      // Get hospital details
      const hospitalsRes = await fetch('https://lepetitchaletoran.com/api/ia/get_all_hospitals.php');
      if (!hospitalsRes.ok) {
        throw new Error(`HTTP error! status: ${hospitalsRes.status}`);
      }
      const hospitalsText = await hospitalsRes.text();
      const hospitalsData: any = hospitalsText ? JSON.parse(hospitalsText) : {};
      const allHospitals = hospitalsData.data || [];

      // Combine procedure_hospital data with hospital details
      const available = hospitalsWithProcedure.map(ph => {
        const hospital = allHospitals.find((h: any) => h.id_hospital === ph.id_hospital);
        return {
          ...ph,
          ...hospital,
          prix_base: ph.prix_base,
          devise: ph.devise,
          duree_sejour: ph.duree_sejour,
        };
      });

      setAvailableHospitals(available);

      // Load assigned hospitals from request_hospital table
      const assignedRes = await fetch(`/api/request_hospital?id_request=${currentRequest.id_request}`);
      if (!assignedRes.ok) {
        // If 404 or error, assume no hospitals assigned yet
        setAssignedHospitals([]);
        return;
      }
      const assignedData: any[] = await assignedRes.json();
      
      const assigned = assignedData.map(relation => {
        const hospital = allHospitals.find((h: any) => h.id_hospital === relation.id_hospital);
        return {
          ...relation,
          ...hospital,
          id_relation: relation.id_relation,
          is_active: relation.is_active,
          hospital_nom: relation.hospital_nom || hospital?.nom,
          hospital_ville: relation.hospital_ville || hospital?.ville,
          hospital_pays: relation.hospital_pays || hospital?.pays,
        };
      });

      setAssignedHospitals(assigned);
    } catch (err) {
      console.error('Error loading hospitals:', err);
      // Set empty arrays on error
      setAvailableHospitals([]);
      setAssignedHospitals([]);
    } finally {
      setHospitalsLoading(false);
    }
  };

  const addHospital = async () => {
    if (!selectedHospitalId || !currentRequest) return;

    try {
      const response = await fetch('/api/request_hospital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_request: currentRequest.id_request,
          id_hospital: selectedHospitalId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setSelectedHospitalId(null);
        loadHospitals();
      } else {
        alert(result.error || 'Erreur lors de l\'ajout de l\'hôpital');
      }
    } catch (err) {
      console.error('Error adding hospital:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'ajout de l\'hôpital');
    }
  };

  const removeHospital = async (idRelation: number) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer cet hôpital ?')) return;

    try {
      const response = await fetch('/api/request_hospital', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_relation: idRelation,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        loadHospitals();
      } else {
        alert(result.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Error removing hospital:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const toggleHospitalStatus = async (idRelation: number, currentStatus: number) => {
    try {
      const response = await fetch('/api/request_hospital', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_relation: idRelation,
          is_active: currentStatus === 1 ? 0 : 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        loadHospitals();
      } else {
        alert(result.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      console.error('Error toggling hospital status:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la modification');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Qualified': return 'bg-purple-500';
      case 'Converted': return 'bg-green-500';
      case 'Awaiting': return 'bg-red-600';
      default: return 'bg-red-600'; // Default to red for "Awaiting"
    }
  };

  const getCountryFlag = (countryCode: string | null) => {
    if (!countryCode) return '🇬🇧';
  
    const flags: Record<string, string> = {
      FR: '🇫🇷',
      GB: '🇬🇧',
      US: '🇺🇸',
      CA: '🇨🇦',
    };
  
    return flags[countryCode.toUpperCase()] || '🇬🇧';
  };
  

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-10 text-center text-red-500">
        Patient non trouvé
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Patient</h1>
            <div className="text-lg font-semibold text-gray-800 mb-2">
              {patient.prenom} {patient.nom}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="text-lg">{getCountryFlag(patient.pays)}</span>
              <span className="font-medium">{patient.pays || 'United Kingdom'}</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {currentRequest?.procedure_nom && (
                <div>
                  <span className="font-semibold">Procedure:</span> {currentRequest.procedure_nom}
                </div>
              )}
              {currentRequest?.commercial_nom && (
                <div>
                  <span className="font-semibold">Recept:</span> {currentRequest.commercial_nom} {currentRequest.commercial_prenom}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              className={`px-6 py-2 rounded text-white font-semibold ${currentRequest ? getStatusColor(currentRequest.status) : 'bg-red-600'}`}
            >
              {currentRequest?.status || 'Awaiting'}
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm">
              M'affecter ce dossier
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION TABS */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setMainTab('Request')}
            className={`px-6 py-3 font-medium ${
              mainTab === 'Request'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Request
          </button>
          <button
            onClick={() => setMainTab('Quotations')}
            className={`px-6 py-3 font-medium ${
              mainTab === 'Quotations'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quotations
          </button>
          <button
            onClick={() => setMainTab('Appointments')}
            className={`px-6 py-3 font-medium ${
              mainTab === 'Appointments'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Appointments
          </button>
        </div>

        {/* SUB-NAVIGATION TABS (only shown when Request tab is active) */}
        {mainTab === 'Request' && (
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setSubTab('Patient infos')}
              className={`px-6 py-2 text-sm font-medium ${
                subTab === 'Patient infos'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Patient infos
            </button>
            <button
              onClick={() => setSubTab('Documents')}
              className={`px-6 py-2 text-sm font-medium ${
                subTab === 'Documents'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setSubTab('Treatments')}
              className={`px-6 py-2 text-sm font-medium ${
                subTab === 'Treatments'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Treatments
            </button>
            <button
              onClick={() => setSubTab('Hopitaux')}
              className={`px-6 py-2 text-sm font-medium ${
                subTab === 'Hopitaux'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hopitaux
            </button>
            <button
              onClick={() => setSubTab('Relances')}
              className={`px-6 py-2 text-sm font-medium ${
                subTab === 'Relances'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Relances
            </button>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="p-6">
          {mainTab === 'Request' && subTab === 'Hopitaux' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Hôpitaux / destination demandées</h2>
              
              {/* Add Hospital Section */}
              <div className="flex gap-3 items-center">
                <select
                  value={selectedHospitalId || ''}
                  onChange={(e) => setSelectedHospitalId(Number(e.target.value) || null)}
                  className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
                >
                  <option value="">Sélectionner un hôpital</option>
                  {availableHospitals
                    .filter(h => !assignedHospitals.some(ah => ah.id_hospital === h.id_hospital))
                    .map(h => (
                      <option key={h.id_hospital} value={h.id_hospital}>
                        {h.nom} - {h.ville} ({h.pays}) - {h.prix_base} {h.devise}
                      </option>
                    ))}
                </select>
                <button
                  onClick={addHospital}
                  disabled={!selectedHospitalId || hospitalsLoading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter un hopital
                </button>
              </div>

              {/* Hospitals Lists */}
              {hospitalsLoading ? (
                <div className="text-center py-8 text-gray-500">Chargement...</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Available Hospitals List */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Hôpitaux disponibles</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {availableHospitals.length === 0 ? (
                        <p className="text-gray-500 text-sm">Aucun hôpital disponible</p>
                      ) : (
                        availableHospitals
                          .filter(h => !assignedHospitals.some(ah => ah.id_hospital === h.id_hospital))
                          .map(hospital => (
                            <label
                              key={hospital.id_hospital}
                              className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedHospitalId === hospital.id_hospital}
                                onChange={() => setSelectedHospitalId(
                                  selectedHospitalId === hospital.id_hospital ? null : hospital.id_hospital
                                )}
                                className="w-4 h-4"
                              />
                              <div className="flex-1">
                                <div className="font-medium">{hospital.nom}</div>
                                <div className="text-sm text-gray-600">
                                  {hospital.ville}, {hospital.pays}
                                </div>
                                {hospital.prix_base && (
                                  <div className="text-sm text-gray-500">
                                    {hospital.prix_base} {hospital.devise || 'EUR'}
                                  </div>
                                )}
                              </div>
                            </label>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Assigned Hospitals List */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Hôpitaux assignés</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {assignedHospitals.length === 0 ? (
                        <p className="text-gray-500 text-sm">Aucun hôpital assigné</p>
                      ) : (
                        assignedHospitals.map(relation => (
                          <div
                            key={relation.id_relation}
                            className="p-3 border rounded hover:bg-gray-50"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1">
                                <div className="text-sm">
                                  <span className="font-semibold text-gray-700">InProc:</span>{' '}
                                  <span className={`text-gray-900 ${relation.is_active === 0 ? 'line-through text-gray-400' : ''}`}>
                                    {relation.hospital_nom || relation.nom}
                                  </span>
                                  {relation.prix_base && (
                                    <span className="text-gray-600 ml-2">
                                      {relation.prix_base} {relation.devise || '€'}
                                    </span>
                                  )}
                                </div>
                                {relation.hospital_ville && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {relation.hospital_ville}, {relation.hospital_pays || relation.pays}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleHospitalStatus(relation.id_relation, relation.is_active)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    relation.is_active === 1
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                  title={relation.is_active === 1 ? 'Désactiver' : 'Activer'}
                                >
                                  {relation.is_active === 1 ? '✓' : '✗'}
                                </button>
                                <button
                                  onClick={() => removeHospital(relation.id_relation)}
                                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                  title="Retirer"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {mainTab === 'Request' && subTab !== 'Hopitaux' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT SIDE - Old Files & Message */}
              <div className="lg:col-span-2 space-y-6">
                {/* Old Files Table */}
                <div>
                  <div className="bg-gray-200 px-4 py-2 font-semibold text-gray-700 rounded-t">
                    Anciens dossiers de ce patient
                  </div>
                  <div className="bg-white border border-t-0 rounded-b overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left">Procédures</th>
                          <th className="p-3 text-left">Date de soumission</th>
                          <th className="p-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {oldRequests.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-gray-500">
                              Aucun dossier précédent
                            </td>
                          </tr>
                        ) : (
                          oldRequests.map((req) => (
                            <tr key={req.id_request} className="border-t hover:bg-gray-50">
                              <td className="p-3">{req.procedure_nom || 'N/A'}</td>
                              <td className="p-3">{new Date(req.created_at).toLocaleDateString('fr-FR')}</td>
                              <td className="p-3">
                                <Link
                                  href={`/dashboard1/requests?requestId=${req.id_request}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  Voir
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Message :</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded p-3 h-32 resize-y"
                    placeholder="Ajouter un message..."
                  />
                </div>
                {/* Patient Infos */}
<div className="mt-6 bg-white border rounded-lg p-4">
  {/* Patient & Request Infos */}
<div className="mt-6 bg-white border rounded-lg p-4">
  <h3 className="text-lg font-semibold mb-4 border-b-2 border-orange-500 pb-2 inline-block">
    Infos du patient
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

    {/* Patient Infos */}
    <div>
      <span className="font-semibold">Nom :</span> {patient.nom || 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Prénom :</span> {patient.prenom || 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Sexe :</span> {patient.sexe || 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Âge :</span> {patient.age ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Téléphone :</span> {patient.numero_tel || 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Email :</span> {patient.email || 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Langue :</span> {patient.langue || 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Pays :</span> {patient.pays || 'N/A'}
    </div>

    {/* Request Infos */}
    <div>
      <span className="font-semibold">ID Request :</span> {currentRequest?.id_request ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Procedure :</span> {currentRequest?.procedure_nom ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">ID Procedure :</span> {currentRequest?.id_procedure ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">ID Commercial :</span> {currentRequest?.id_commercial ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">ID Galerie :</span> {currentRequest?.id_galerie ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Langue Request :</span> {currentRequest?.langue ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Message Patient :</span> {currentRequest?.message_patient ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Status :</span> {currentRequest?.status ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Maladies :</span> {currentRequest?.text_maladies ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Allergies :</span> {currentRequest?.text_allergies ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Chirurgies :</span> {currentRequest?.text_chirurgies ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Médicaments :</span> {currentRequest?.text_medicaments ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">ID Coordinateur :</span> {currentRequest?.id_coordi ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Source :</span> {currentRequest?.source ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">UTM Source :</span> {currentRequest?.utm_source ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">UTM Medium :</span> {currentRequest?.utm_medium ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">UTM Campaign :</span> {currentRequest?.utm_campaign ?? 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Créé le :</span> {currentRequest?.created_at ? new Date(currentRequest.created_at).toLocaleString('fr-FR') : 'N/A'}
    </div>
    <div>
      <span className="font-semibold">Mis à jour le :</span> {currentRequest?.updated_at ? new Date(currentRequest.updated_at).toLocaleString('fr-FR') : 'N/A'}
    </div>
    <div>
  <span className="font-semibold">Poids :</span>{' '}
  {patient.poids !== null ? `${patient.poids} kg` : 'N/A'}
</div>

<div>
  <span className="font-semibold">Taille :</span>{' '}
  {patient.taille !== null ? `${patient.taille} cm` : 'N/A'}
</div>


  </div>
</div>

</div>

              </div>

              {/* RIGHT SIDE - Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 border-b-2 border-orange-500 pb-2 inline-block">
                    Respond / Set Quick Actions
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-3">Tjr interessé ?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Oui
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Set Not available
                      </button>
                      <button className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm col-span-2">
                        Req. Additional info
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Source RS
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Stop Sale
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Prop. consultation
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Imp. de vs joindre
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mainTab === 'Quotations' && (
            <div className="text-center py-10 text-gray-500">
              Section Quotations - À implémenter
            </div>
          )}

          {mainTab === 'Appointments' && (
            <div className="text-center py-10 text-gray-500">
              Section Appointments - À implémenter
            </div>
          )}
        </div>
      </div>

      {/* BACK BUTTON */}
      <div className="mt-6">
        <Link
          href="/dashboard1/requests"
          className="inline-flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Retour à la liste
        </Link>
      </div>
    </div>
  );
}

