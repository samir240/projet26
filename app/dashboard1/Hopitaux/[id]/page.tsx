'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Hospital {
  id_hospital: number;
  nom: string;
  pays: string;
  ville: string;
  adresse: string;
  latitude: string;
  longitude: string;
  telephone: string;
  email: string;
  website: string;
  description: string;
  logo: string;
  certifications: string;
  nom_gerant: string;
  reviews: number;
  note_google: number;
  is_active: number;
}

interface Treatment {
  id_relation: number;
  id_procedure: number;
  id_hospital: number;
  prix_base: string | number;
  devise: string;
  duree_sejour: number | null;
  description_specifique: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  nom_procedure: string;
}

type Tab = 'Profile' | 'Media' | 'Treatments' | 'Doctors' | 'Notifications' | 'Case Managers' | 'Hotels' | 'Reviews';

export default function HospitalEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [treatmentsLoading, setTreatmentsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [showOnline, setShowOnline] = useState(true);

  useEffect(() => {
    if (!id) return;
    setPageLoading(true);
    setError(null);
    
    fetch(`https://lepetitchaletoran.com/api/ia/hospitals.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setHospital(data);
        setShowOnline(data?.is_active === 1);
        setPageLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement de l\'hôpital');
        setPageLoading(false);
        console.error(err);
      });
  }, [id]);

  // Charger les traitements quand l'onglet Treatments est sélectionné
  useEffect(() => {
    if (activeTab === 'Treatments' && id) {
      loadTreatments();
    }
  }, [activeTab, id]);

  const loadTreatments = async () => {
    setTreatmentsLoading(true);
    try {
      const response = await fetch('https://lepetitchaletoran.com/api/ia/procedure_hospital.php');
      const data: Treatment[] = await response.json();
      // Filtrer par id_hospital
      const hospitalTreatments = data.filter(t => t.id_hospital === Number(id));
      setTreatments(hospitalTreatments);
    } catch (err) {
      console.error('Erreur lors du chargement des traitements:', err);
    } finally {
      setTreatmentsLoading(false);
    }
  };

  const updateHospital = async () => {
    if (!hospital) return;
    
    setLoading(true);
    setError(null);

    try {
      const { id_hospital, ...hospitalData } = hospital;
      const response = await fetch('https://lepetitchaletoran.com/api/ia/hospitals.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id_hospital: Number(id),
          ...hospitalData,
          is_active: showOnline ? 1 : 0
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Hôpital mis à jour avec succès');
        router.refresh();
      } else {
        setError(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !hospital) {
    return (
      <div className="p-6">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
        <Link href="/dashboard1/Hopitaux" className="text-blue-600 hover:underline">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="p-6">
        <p className="text-gray-600 mb-4">Aucun hôpital trouvé.</p>
        <Link href="/dashboard1/Hopitaux" className="text-blue-600 hover:underline">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  const tabs: Tab[] = ['Profile', 'Media', 'Treatments', 'Doctors', 'Notifications', 'Case Managers', 'Hotels', 'Reviews'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard1/Hopitaux" className="text-blue-600 hover:underline">
              ← Retour
            </Link>
            <h1 className="text-2xl font-bold">{hospital.nom || 'nom de l\'hopital'}</h1>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnline}
              onChange={(e) => setShowOnline(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Show online</span>
          </label>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'Profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Adress*" 
              value={hospital.adresse || ''}
              onChange={v => setHospital({ ...hospital, adresse: v })} 
              required
            />

            <Input 
              label="City*" 
              value={hospital.ville || ''}
              onChange={v => setHospital({ ...hospital, ville: v })} 
              required
            />

            <Input 
              label="Latitude" 
              value={hospital.latitude || ''}
              onChange={v => setHospital({ ...hospital, latitude: v })} 
              type="number"
            />

            <Input 
              label="Longitude" 
              value={hospital.longitude || ''}
              onChange={v => setHospital({ ...hospital, longitude: v })} 
              type="number"
            />

            <Input 
              label="Pays*" 
              value={hospital.pays || ''}
              onChange={v => setHospital({ ...hospital, pays: v })} 
              required
            />

            <Input 
              label="Nom du gérant" 
              value={hospital.nom_gerant || ''}
              onChange={v => setHospital({ ...hospital, nom_gerant: v })} 
            />

            <Input 
              label="Téléphone" 
              value={hospital.telephone || ''}
              onChange={v => setHospital({ ...hospital, telephone: v })} 
            />

            <Input 
              label="Email" 
              value={hospital.email || ''}
              onChange={v => setHospital({ ...hospital, email: v })} 
              type="email"
            />

            <Input 
              label="Site web" 
              value={hospital.website || ''}
              onChange={v => setHospital({ ...hospital, website: v })} 
              type="url"
            />

            <Input 
              label="Note Google" 
              value={hospital.note_google ? String(hospital.note_google) : ''}
              onChange={v => setHospital({ ...hospital, note_google: Number(v) || 0 })} 
              type="number"
              step="0.1"
              min="0"
              max="5"
            />

            <Input 
              label="Nombre de reviews" 
              value={hospital.reviews ? String(hospital.reviews) : ''}
              onChange={v => setHospital({ ...hospital, reviews: Number(v) || 0 })} 
              type="number"
            />

            <FileInput 
              label="Logo" 
              value={hospital.logo || ''}
              onChange={v => setHospital({ ...hospital, logo: v })} 
            />

            <FileInput 
              label="Direct Price Warranty certificate" 
              value={hospital.certifications || ''}
              onChange={v => setHospital({ ...hospital, certifications: v })} 
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Description de l'hôpital"
                value={hospital.description || ''}
                onChange={e => setHospital({ ...hospital, description: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard1/Hopitaux"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Link>
            <button
              onClick={updateHospital}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : '💾 Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* Treatments Tab */}
      {activeTab === 'Treatments' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Traitements disponibles</h2>
            <button
              onClick={loadTreatments}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              ↻ Actualiser
            </button>
          </div>

          {treatmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : treatments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun traitement disponible pour cet hôpital</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Procédure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée séjour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mis à jour
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {treatments.map((treatment) => (
                    <tr key={treatment.id_relation} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {treatment.nom_procedure || `Procédure #${treatment.id_procedure}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {treatment.prix_base} {treatment.devise || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {treatment.duree_sejour ? `${treatment.duree_sejour} jour(s)` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md">
                          {treatment.description_specifique || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          treatment.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {treatment.is_active ? '✅ Actif' : '⛔ Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {treatment.updated_at 
                            ? new Date(treatment.updated_at).toLocaleDateString('fr-FR')
                            : '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'Profile' && activeTab !== 'Treatments' && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          <p>Section "{activeTab}" à venir</p>
        </div>
      )}
    </div>
  );
}

/* --------- Component Input --------- */
function Input({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  required = false,
  step,
  min,
  max
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  step?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        step={step}
        min={min}
        max={max}
      />
    </div>
  );
}

/* --------- Component FileInput --------- */
function FileInput({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="URL du fichier"
        />
        <button
          type="button"
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm"
        >
          Select
        </button>
      </div>
      {value && (
        <div className="mt-2">
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Voir le fichier
          </a>
        </div>
      )}
    </div>
  );
}
