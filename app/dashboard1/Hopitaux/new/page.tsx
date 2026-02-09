'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import countriesData from '@/app/json/countries.json';

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
    is_active: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [showOnline, setShowOnline] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const createHospital = async () => {
    if (!hospital.nom || !hospital.ville || !hospital.pays) {
      setError('Veuillez remplir les champs obligatoires (Nom, Ville, Pays)');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Créer l'hôpital d'abord
      const createResponse = await fetch('/api/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...hospital,
          is_active: showOnline ? 1 : 0
        })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${createResponse.status}`);
      }

      const createResult = await createResponse.json();
      
      if (!createResult.success || !createResult.id) {
        throw new Error(createResult.error || 'Erreur lors de la création');
      }

      const newHospitalId = createResult.id;

      // Upload logo via /api/upload
      if (logoFile) {
        const formData = new FormData();
        formData.append('type', 'hospital_logo');
        formData.append('entity_id', String(newHospitalId));
        formData.append('file', logoFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          console.warn('Erreur lors de l\'upload du logo:', uploadResult);
          // On continue quand même, l'hôpital est créé
        }
      }

      alert('✅ Hôpital créé avec succès');
      router.push(`/dashboard1/Hopitaux/${newHospitalId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
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

            <div>
              <label className="block text-sm font-semibold mb-1">Pays*</label>
              <select
                className="w-full border p-2 rounded"
                value={hospital.pays}
                onChange={(e) => setHospital({ ...hospital, pays: e.target.value })}
                required
              >
                <option value="">-- Sélectionner un pays --</option>
                {countriesData.countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

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



            <FileInput 
              label="Logo" 
              value={hospital.logo}
              onChange={v => setHospital({ ...hospital, logo: v })}
              onFileSelect={setLogoFile}
              currentFile={logoFile}
            />

            <div>
              <label className="block text-sm font-semibold mb-1">Certifications</label>
              <input
                className="w-full border p-2 rounded"
                value={hospital.certifications}
                onChange={(e) => setHospital({ ...hospital, certifications: e.target.value })}
                placeholder="Ex: ISO9001, ASM14001"
              />
              <p className="text-xs text-gray-500 mt-1">Entrez les certifications séparées par des virgules</p>
            </div>

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
  onChange,
  onFileSelect,
  currentFile
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  onFileSelect?: (file: File | null) => void;
  currentFile?: File | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
      onChange(file.name); // Afficher le nom du fichier
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={currentFile ? currentFile.name : value}
          onChange={e => onChange(e.target.value)}
          placeholder="URL du fichier ou sélectionner un fichier"
          readOnly={!!currentFile}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm"
        >
          Select
        </button>
        {currentFile && (
          <button
            type="button"
            onClick={() => {
              if (onFileSelect) onFileSelect(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
          >
            ×
          </button>
        )}
      </div>
      {value && !currentFile && (
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
      {currentFile && (
        <div className="mt-2 text-xs text-green-600">
          Fichier sélectionné: {currentFile.name} ({(currentFile.size / 1024).toFixed(2)} KB)
        </div>
      )}
    </div>
  );
}

