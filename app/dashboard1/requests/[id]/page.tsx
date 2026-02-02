'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Bell } from 'lucide-react';

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
  const [editingPatient, setEditingPatient] = useState<Partial<Patient>>({});
  const [oldRequests, setOldRequests] = useState<OldRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<CurrentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [relances, setRelances] = useState<any[]>([]);
  
  const [mainTab, setMainTab] = useState<'Request' | 'Quotations' | 'Appointments'>('Request');
  const [subTab, setSubTab] = useState<'Patient infos' | 'Documents' | 'Treatments' | 'Hopitaux' | 'Relances'>('Patient infos');
  const [message, setMessage] = useState('');

  // Email modals state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailModalType, setEmailModalType] = useState<'interest' | 'notAvailable' | 'additionalInfo' | 'consultation' | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Hospitals state
  const [availableHospitals, setAvailableHospitals] = useState<any[]>([]);
  const [assignedHospitals, setAssignedHospitals] = useState<any[]>([]);
  const [selectedHospitalIds, setSelectedHospitalIds] = useState<number[]>([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    // Fetch patient details
    fetch(`https://pro.medotra.com/app/http/api/patients.php?id=${patientId}`)
      .then(res => res.json())
      .then((data: Patient) => {
        setPatient(data);
        setEditingPatient(data);
      })
      .catch(err => console.error('Error fetching patient:', err));

    // Fetch all requests for this patient
    fetch('https://pro.medotra.com/app/http/api/requests.php')
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

  // Load relances when Relances tab is selected
  useEffect(() => {
    if (subTab === 'Relances' && currentRequest?.id_request) {
      loadRelances();
    }
  }, [subTab, currentRequest?.id_request]);

  const loadRelances = async () => {
    if (!currentRequest?.id_request) return;
    
    try {
      const res = await fetch('/api/relances');
      const data = await res.json();
      if (data && Array.isArray(data)) {
        // Filtrer les relances pour cette requête
        const filtered = data.filter((r: any) => r.id_request === currentRequest.id_request);
        setRelances(filtered);
      } else {
        setRelances([]);
      }
    } catch (error) {
      console.error("Erreur de chargement des relances:", error);
      setRelances([]);
    }
  };

  const loadHospitals = async () => {
    if (!currentRequest?.id_procedure || !currentRequest?.id_request) return;
    
    setHospitalsLoading(true);
    try {
      // Load hospitals that offer the requested procedure
      const procedureHospitalsRes = await fetch('https://pro.medotra.com/app/http/api/procedure_hospital.php');
      if (!procedureHospitalsRes.ok) {
        throw new Error(`HTTP error! status: ${procedureHospitalsRes.status}`);
      }
      const procedureHospitalsText = await procedureHospitalsRes.text();
      const procedureHospitals: any[] = procedureHospitalsText ? JSON.parse(procedureHospitalsText) : [];
      
      const hospitalsWithProcedure = procedureHospitals.filter(
        ph => ph.id_procedure === currentRequest.id_procedure && ph.is_active === 1
      );

      // Get hospital details
      const hospitalsRes = await fetch('https://pro.medotra.com/app/http/api/get_all_hospitals.php');
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

  const assignSelectedHospitals = async () => {
    if (selectedHospitalIds.length === 0 || !currentRequest) return;

    setHospitalsLoading(true);
    try {
      const promises = selectedHospitalIds.map(id =>
        fetch('/api/request_hospital', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_request: currentRequest.id_request,
            id_hospital: id,
          }),
        })
      );

      const responses = await Promise.all(promises);

      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
      }

      const results = await Promise.all(responses.map(r => r.json().catch(() => ({}))));
      const failed = results.find(r => r && r.success === false);
      if (failed) {
        throw new Error(failed.error || 'Erreur lors de l\'assignation des hôpitaux');
      }

      // Mettre à jour le statut de la requête à "dispatched"
      if (currentRequest.status !== 'dispatched') {
        try {
          const statusRes = await fetch('/api/update-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update',
              id_request: currentRequest.id_request,
              id_patient: currentRequest.id_patient,
              status: 'dispatched'
            }),
          });

          const statusResult = await statusRes.json();
          if (statusResult.success) {
            setCurrentRequest({ ...currentRequest, status: 'dispatched' });
          }
        } catch (statusErr) {
          console.error('Error updating status:', statusErr);
          // On continue même si la mise à jour du statut échoue
        }
      }

      setSelectedHospitalIds([]);
      await loadHospitals();
    } catch (err) {
      console.error('Error assigning hospitals:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'assignation des hôpitaux');
    } finally {
      setHospitalsLoading(false);
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
      case 'affected': return 'bg-purple-500';
      case 'dispatched': return 'bg-indigo-500';
      case 'info request': return 'bg-yellow-500';
      case 'NI': return 'bg-orange-500';
      case 'NA': return 'bg-red-500';
      case 'converted': return 'bg-green-500';
      case 'Awaiting': return 'bg-red-600';
      default: return 'bg-gray-500';
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

  const handleSavePatient = async () => {
    if (!patient || !editingPatient) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/update-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id_request: currentRequest?.id_request,
          id_patient: patient.id_patient,
          patient: {
            nom: editingPatient.nom,
            prenom: editingPatient.prenom,
            email: editingPatient.email,
            numero_tel: editingPatient.numero_tel,
            langue: editingPatient.langue,
            pays: editingPatient.pays,
            age: editingPatient.age,
            sexe: editingPatient.sexe,
            poids: editingPatient.poids,
            taille: editingPatient.taille,
            smoker: editingPatient.smoker,
            imc: editingPatient.imc,
          }
        }),
      });

      const result = await res.json();
      if (result.success) {
        setPatient({ ...patient, ...editingPatient } as Patient);
        alert("Informations patient mises à jour avec succès !");
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMessage = async () => {
    if (!currentRequest) return;
    
    try {
      const res = await fetch('/api/update-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id_request: currentRequest.id_request,
          id_patient: currentRequest.id_patient,
          message_patient: message
        }),
      });

      const result = await res.json();
      if (result.success) {
        setCurrentRequest({ ...currentRequest, message_patient: message });
        alert("Message sauvegardé avec succès !");
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (err) {
      alert("Erreur lors de la sauvegarde du message");
    }
  };

  const openEmailModal = (type: 'interest' | 'notAvailable' | 'additionalInfo' | 'consultation') => {
    setEmailModalType(type);
    setShowEmailModal(true);
    
    // Pré-remplir le sujet et le corps selon le type
    const patientName = patient ? `${patient.prenom} ${patient.nom}` : 'Client';
    const patientEmail = patient?.email || '';
    
    switch (type) {
      case 'interest':
        setEmailSubject(`Êtes-vous toujours intéressé(e) ?`);
        setEmailBody(`Bonjour ${patientName},\n\nNous souhaitons savoir si vous êtes toujours intéressé(e) par notre service.\n\nN'hésitez pas à nous contacter si vous avez des questions.\n\nCordialement,\nL'équipe`);
        break;
      case 'notAvailable':
        setEmailSubject(`Service non disponible`);
        setEmailBody(`Bonjour ${patientName},\n\nNous vous informons que le service demandé n'est actuellement pas disponible.\n\nNous vous contacterons dès que ce service sera à nouveau disponible.\n\nCordialement,\nL'équipe`);
        break;
      case 'additionalInfo':
        setEmailSubject(`Demande d'informations supplémentaires`);
        setEmailBody(`Bonjour ${patientName},\n\nNous avons besoin d'informations supplémentaires pour traiter votre demande.\n\nPourriez-vous nous fournir les détails suivants :\n\n- [À compléter]\n\nMerci pour votre collaboration.\n\nCordialement,\nL'équipe`);
        break;
      case 'consultation':
        setEmailSubject(`Proposition de consultation`);
        setEmailBody(`Bonjour ${patientName},\n\nNous vous proposons une consultation pour discuter de votre demande.\n\nSouhaitez-vous planifier cette consultation ?\n\nCordialement,\nL'équipe`);
        break;
    }
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailModalType(null);
    setEmailSubject('');
    setEmailBody('');
  };

  const handleSendEmailAndUpdateStatus = async () => {
    if (!currentRequest || !patient || !emailModalType) return;
    
    setSendingEmail(true);
    try {
      // Déterminer le nouveau statut selon le type
      let newStatus: string | null = null;
    
      if (emailModalType === 'notAvailable') {
        newStatus = 'NA';
      } else if (emailModalType === 'consultation') {
        newStatus = 'NI'; // Corrigé : consultation devient NI
      } else if (emailModalType === 'additionalInfo') {
        newStatus = 'info request';
      }

      // Envoyer l'email (à implémenter selon votre API email)
      // Pour l'instant, on simule l'envoi
      console.log('Envoi email à:', patient.email);
      console.log('Sujet:', emailSubject);
      console.log('Corps:', emailBody);

      // Mettre à jour le statut si nécessaire
      if (newStatus) {
        const res = await fetch('/api/update-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            id_request: currentRequest.id_request,
            id_patient: currentRequest.id_patient,
            status: newStatus
          }),
        });

        const result = await res.json();
        if (result.success) {
          setCurrentRequest({ ...currentRequest, status: newStatus });
          alert("Email envoyé et statut mis à jour avec succès !");
          closeEmailModal();
        } else {
          alert("Erreur lors de la mise à jour du statut: " + (result.error || 'Erreur inconnue'));
        }
      } else {
        // Pour "interest", on envoie juste l'email sans changer le statut
        alert("Email envoyé avec succès !");
        closeEmailModal();
      }
    } catch (err) {
      alert("Erreur lors de l'envoi de l'email");
    } finally {
      setSendingEmail(false);
    }
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
              
              {/* Add / Assign Hospital Section */}
              <div className="flex gap-3 items-center">
                <div className="flex-1 text-sm text-gray-600">
                  Sélectionnez un ou plusieurs hôpitaux dans la liste <strong>Hôpitaux disponibles</strong> (cases à cocher), puis cliquez <strong>Assigner la sélection</strong>.
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm"
                  title="Désactivé pour le moment"
                >
                  Ajouter un hôpital
                </button>
                <button
                  onClick={assignSelectedHospitals}
                  disabled={selectedHospitalIds.length === 0 || hospitalsLoading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Assigner la sélection
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
                                checked={selectedHospitalIds.includes(hospital.id_hospital)}
                                onChange={() =>
                                  setSelectedHospitalIds(prev =>
                                    prev.includes(hospital.id_hospital)
                                      ? prev.filter(id => id !== hospital.id_hospital)
                                      : [...prev, hospital.id_hospital]
                                  )
                                }
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
                                  {relation.is_active === 1 ? 'sent' : '✗'}
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

          {/* Patient infos Tab */}
          {mainTab === 'Request' && subTab === 'Patient infos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT SIDE - Patient Infos Only */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border rounded-lg p-4">
                  
                  
                    {/* Message */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold">Message :</label>
                  
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded p-3 h-32 resize-y"
                    
                  />
                </div>
              </div>


                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold border-b-2 border-orange-500 pb-2 inline-block">
                      Infos du patient
                    </h3>
                    <button
                      onClick={handleSavePatient}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                    >
                      {saving ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Nom *</label>
                      <input
                        type="text"
                        value={editingPatient.nom || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, nom: e.target.value })}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Prénom *</label>
                      <input
                        type="text"
                        value={editingPatient.prenom || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, prenom: e.target.value })}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Sexe</label>
                      <select
                        value={editingPatient.sexe || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, sexe: e.target.value as 'M' | 'F' | null })}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Sélectionner</option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Âge</label>
                      <input
                        type="number"
                        value={editingPatient.age ?? ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, age: e.target.value ? Number(e.target.value) : null })}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Téléphone</label>
                      <input
                        type="tel"
                        value={editingPatient.numero_tel || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, numero_tel: e.target.value })}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Email</label>
                      <input
                        type="email"
                        value={editingPatient.email || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Langue</label>
                      <input
                        type="text"
                        value={editingPatient.langue || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, langue: e.target.value })}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Pays</label>
                      <input
                        type="text"
                        value={editingPatient.pays || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, pays: e.target.value })}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Poids (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingPatient.poids ?? ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, poids: e.target.value ? Number(e.target.value) : null })}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Taille (cm)</label>
                      <input
                        type="number"
                        value={editingPatient.taille ?? ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, taille: e.target.value ? Number(e.target.value) : null })}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Fumeur</label>
                      <select
                        value={editingPatient.smoker ?? ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, smoker: e.target.value ? Number(e.target.value) : null })}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Non spécifié</option>
                        <option value="0">Non</option>
                        <option value="1">Oui</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">IMC</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingPatient.imc ?? ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, imc: e.target.value ? Number(e.target.value) : null })}
                        className="w-full border p-2 rounded"
                      />
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
                      <button 
                        onClick={() => openEmailModal('interest')}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
                        Oui
                      </button>
                      <button 
                        onClick={() => openEmailModal('notAvailable')}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
                        Set Not available
                      </button>
                      <button 
                        onClick={() => openEmailModal('additionalInfo')}
                        className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm col-span-2"
                      >
                        Req. Additional info
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Source RS
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Stop Sale
                      </button>
                      <button 
                        onClick={() => openEmailModal('consultation')}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
                        Not Interested
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

          {/* Documents Tab */}
          {mainTab === 'Request' && subTab === 'Documents' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div>
                  <label className="block text-sm font-semibold mb-2">Message :</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded p-3 h-32 resize-y"
                    placeholder="Ajouter un message..."
                  />
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 border-b-2 border-orange-500 pb-2 inline-block">
                    Respond / Set Quick Actions
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-3">Tjr interessé ?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => openEmailModal('interest')}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
                        Oui
                      </button>
                      <button 
                        onClick={() => openEmailModal('notAvailable')}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
                        Set Not available
                      </button>
                      <button 
                        onClick={() => openEmailModal('additionalInfo')}
                        className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm col-span-2"
                      >
                        Req. Additional info
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Source RS
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Stop Sale
                      </button>
                      <button 
                        onClick={() => openEmailModal('consultation')}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
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

          {/* Treatments Tab - Anciens dossiers */}
          {mainTab === 'Request' && subTab === 'Treatments' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT SIDE - Old Files Table */}
              <div className="lg:col-span-2">
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
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {oldRequests.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500">
                              Aucun dossier précédent
                            </td>
                          </tr>
                        ) : (
                          oldRequests.map((req) => (
                            <tr key={req.id_request} className="border-t hover:bg-gray-50">
                              <td className="p-3">{req.procedure_nom || 'N/A'}</td>
                              <td className="p-3">{new Date(req.created_at).toLocaleDateString('fr-FR')}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(req.status)} text-white`}>
                                  {req.status}
                                </span>
                              </td>
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
                      <button 
                        onClick={() => openEmailModal('interest')}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
                        Oui
                      </button>
                      <button 
                        onClick={() => openEmailModal('notAvailable')}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
                        Set Not available
                      </button>
                      <button 
                        onClick={() => openEmailModal('additionalInfo')}
                        className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm col-span-2"
                      >
                        Req. Additional info
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Source RS
                      </button>
                      <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                        Stop Sale
                      </button>
                      <button 
                        onClick={() => openEmailModal('consultation')}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
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

         {/* Relances Tab */}
{mainTab === 'Request' && subTab === 'Relances' && (
  <div className="space-y-6">
    {/* FORMULAIRE RAPIDE POUR AJOUTER UNE RELANCE */}
    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
      <h3 className="text-sm font-black text-orange-800 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Bell size={16} /> Programmer un nouveau rappel
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-orange-700 uppercase mb-1">Date</label>
          <input 
            type="date" 
            id="relance_date"
            className="w-full border-none rounded-lg p-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-orange-500"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
  <label className="block text-[10px] font-bold text-orange-700 uppercase mb-1">Note / Détail</label>
  <input 
    type="text" 
    id="relance_notes" 
    placeholder="Ex: Appeler après 14h"
    className="w-full border-none rounded-lg p-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-orange-500"
  />
</div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-orange-700 uppercase mb-1">Motif du rappel</label>
          <input 
            type="text" 
            id="relance_motif"
            placeholder="Ex: Attente confirmation vol..."
            className="w-full border-none rounded-lg p-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-end">
          <button 
            onClick={async () => {
              const date = (document.getElementById('relance_date') as HTMLInputElement).value;
              const motif = (document.getElementById('relance_motif') as HTMLInputElement).value;
              const prio = (document.getElementById('relance_notes') as HTMLSelectElement).value;

              if(!motif) return alert("Veuillez saisir un motif");
              
              if (!currentRequest) {
                alert("Erreur: Requête non trouvée");
                return;
              }

              // Convertir la date en format datetime si nécessaire
              const dateRelance = date ? `${date} 00:00:00` : new Date().toISOString().slice(0, 19).replace('T', ' ');

              const payload = {
                action: 'create',
                id_request: currentRequest.id_request,
                id_commercial: currentRequest.id_commercial || null,
                date_relance: dateRelance,
                objet: motif,
                notes: prio,
                type_relance: 'manual',
                status: 'new'
              };

              try {
                const res = await fetch('/api/relances', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(payload)
                });

                const result = await res.json();
                
                if(res.ok && result.success) {
                  alert("Rappel enregistré avec succès !");
                  // Réinitialiser le formulaire
                  (document.getElementById('relance_motif') as HTMLInputElement).value = '';
                  (document.getElementById('relance_date') as HTMLInputElement).value = new Date().toISOString().split('T')[0];
                  // Recharger les relances
                  loadRelances();
                } else {
                  alert("Erreur: " + (result.error || 'Erreur lors de l\'enregistrement'));
                  console.error('API Response:', result);
                }
              } catch (err) {
                console.error('Error creating relance:', err);
                alert("Erreur lors de l'enregistrement du rappel");
              }
            }}
            className="w-full bg-orange-600 text-white font-black py-2 rounded-lg hover:bg-orange-700 transition-all text-xs uppercase tracking-widest"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    {/* LISTE DES RELANCES LIÉES À CETTE REQUEST */}
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="p-4 border-b bg-gray-50/50">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Historique des relances pour cette demande</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Objet</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {relances.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-20 text-gray-400 font-medium italic">
                  Aucune relance programmée
                </td>
              </tr>
            ) : (
              relances.map((rel) => (
                <tr key={rel.id_relance} className={`hover:bg-gray-50/80 transition-colors ${rel.status === 'done' ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-gray-700">
                      {new Date(rel.date_relance).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-gray-700 font-bold">{rel.objet || 'Sans objet'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase">
                      {rel.type_relance || 'autre'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                      rel.status === 'done' ? 'bg-green-100 text-green-700' : 
                      rel.status === 'new' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {rel.status === 'done' ? 'done' : rel.status === 'new' ? 'new' : 'canceled'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

      {/* EMAIL MODAL */}
      {showEmailModal && emailModalType && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative shadow-xl">
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={closeEmailModal}
            />
            <h2 className="text-xl font-bold mb-4">
              {emailModalType === 'interest' && 'Demander si le client est toujours intéressé'}
              {emailModalType === 'notAvailable' && 'Service non disponible'}
              {emailModalType === 'additionalInfo' && 'Demander des informations supplémentaires'}
              {emailModalType === 'consultation' && 'Proposer une consultation'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Destinataire</label>
                <input
                  type="email"
                  value={patient?.email || ''}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Sujet *</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Message *</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full border p-2 rounded h-48 resize-y"
                  required
                />
              </div>

              {emailModalType === 'notAvailable' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                  <strong>Note:</strong> Le statut de la requête sera changé en <strong>NA</strong> après l'envoi de l'email.
                </div>
              )}

              {emailModalType === 'additionalInfo' && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                  <strong>Note:</strong> Le statut de la requête sera changé en <strong>info request</strong> après l'envoi de l'email.
                </div>
              )}

              {emailModalType === 'consultation' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                  <strong>Note:</strong> Le statut de la requête sera changé en <strong>NA</strong> après l'envoi de l'email.
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={closeEmailModal}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                  disabled={sendingEmail}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendEmailAndUpdateStatus}
                  disabled={sendingEmail || !emailSubject || !emailBody || !patient?.email}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingEmail ? 'Envoi...' : 'Envoyer et valider'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

