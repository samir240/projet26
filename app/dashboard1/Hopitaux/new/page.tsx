'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HospitalForm {
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

type Tab = 'Profile' | 'Media' | 'Treatments' | 'Doctors' | 'Notifications' | 'Case Managers' | 'Hotels' | 'Reviews';

export default function NewHospitalPage() {
  const router = useRouter();
  const [hospital, setHospital] = useState<HospitalForm>({
    nom: '',
    pays: '',
    ville: '',
    adresse: '',
    latitude: '',
    longitude: '',
    telephone: '',
    email: '',
    website: '',
    description: '',
    logo: '',
    certifications: '',
    nom_gerant: '',
    reviews: 0,
    note_google: 0,
    is_active: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [showOnline, setShowOnline] = useState(true);

  const createHospital = async () => {
    if (!hospital.nom || !hospital.ville || !hospital.pays) {
      setError('Veuillez remplir les champs obligatoires (Nom, Ville, Pays)');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://lepetitchaletoran.com/api/ia/hospitals.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...hospital,
          is_active: showOnline ? 1 : 0
        })
      });

      const result = await response.json();
      
      if (result.success && result.id) {
        alert('✅ Hôpital créé avec succès');
        router.push(`/dashboard1/Hopitaux/${result.id}`);
      } else {
        setError(result.error || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur lors de la création');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold">Nouvel hôpital</h1>
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
              label="Nom de l'hôpital*" 
              value={hospital.nom}
              onChange={v => setHospital({ ...hospital, nom: v })} 
              required
            />

            <Input 
              label="Adress*" 
              value={hospital.adresse}
              onChange={v => setHospital({ ...hospital, adresse: v })} 
              required
            />

            <Input 
              label="City*" 
              value={hospital.ville}
              onChange={v => setHospital({ ...hospital, ville: v })} 
              required
            />

            <Input 
              label="Pays*" 
              value={hospital.pays}
              onChange={v => setHospital({ ...hospital, pays: v })} 
              required
            />

            <Input 
              label="Latitude" 
              value={hospital.latitude}
              onChange={v => setHospital({ ...hospital, latitude: v })} 
              type="number"
            />

            <Input 
              label="Longitude" 
              value={hospital.longitude}
              onChange={v => setHospital({ ...hospital, longitude: v })} 
              type="number"
            />

            <Input 
              label="Nom du gérant" 
              value={hospital.nom_gerant}
              onChange={v => setHospital({ ...hospital, nom_gerant: v })} 
            />

            <Input 
              label="Téléphone" 
              value={hospital.telephone}
              onChange={v => setHospital({ ...hospital, telephone: v })} 
            />

            <Input 
              label="Email" 
              value={hospital.email}
              onChange={v => setHospital({ ...hospital, email: v })} 
              type="email"
            />

            <Input 
              label="Site web" 
              value={hospital.website}
              onChange={v => setHospital({ ...hospital, website: v })} 
              type="url"
            />

            <Input 
              label="Note Google" 
              value={hospital.note_google.toString()}
              onChange={v => setHospital({ ...hospital, note_google: Number(v) || 0 })} 
              type="number"
              step="0.1"
              min="0"
              max="5"
            />

            <Input 
              label="Nombre de reviews" 
              value={hospital.reviews.toString()}
              onChange={v => setHospital({ ...hospital, reviews: Number(v) || 0 })} 
              type="number"
            />

            <FileInput 
              label="Logo" 
              value={hospital.logo}
              onChange={v => setHospital({ ...hospital, logo: v })} 
            />

            <FileInput 
              label="Direct Price Warranty certificate" 
              value={hospital.certifications}
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
                value={hospital.description}
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
              onClick={createHospital}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : '💾 Créer l\'hôpital'}
            </button>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'Profile' && (
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
  required = false 
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
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

