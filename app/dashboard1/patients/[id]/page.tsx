'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Patient {
  patient_id: number;
  patient_nom: string;
  patient_prenom: string;
  patient_email: string;
  patient_tel: string;
  patient_age: number | null;
  patient_sexe: string | null;
  patient_pays: string | null;
  langue: string | null;
  status: string;
  procedure_nom: string | null;

  text_maladies: string | null;
  text_allergies: string | null;
  text_chirurgies: string | null;
  text_medicaments: string | null;
}

export default function PatientPage() {
  const params = useParams();
  const id = params?.id;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'infos' | 'medical' | 'relances'>('infos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`https://pro.medotra.com/app/http/api/patients.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.id_patient) {
          setLoading(false);
          return;
        }

        // 🔹 MAPPING API → FRONT
        const mapped: Patient = {
          patient_id: data.id_patient,
          patient_nom: data.nom,
          patient_prenom: data.prenom,
          patient_email: data.email,
          patient_tel: data.numero_tel,
          patient_age: data.age,
          patient_sexe: data.sexe,
          patient_pays: data.pays,
          langue: data.langue,
          status: data.status || 'New',
          procedure_nom: null,

          text_maladies: data.text_maladies,
          text_allergies: data.text_allergies,
          text_chirurgies: data.text_chirurgies,
          text_medicaments: data.text_medicaments,
        };

        setPatient(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-10 text-gray-500">Chargement...</div>;
  }

  if (!patient) {
    return <div className="p-10 text-red-500">Patient introuvable</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {patient.patient_nom} {patient.patient_prenom}
          </h1>
          <p className="text-gray-500">
            Langue : {patient.langue || '—'}
          </p>
        </div>

        <span className="px-4 py-2 rounded bg-orange-100 text-orange-700">
          {patient.status}
        </span>
      </div>

      {/* ================= TABS ================= */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="flex gap-6 px-6 pt-4 border-b">
          {[
            { key: 'infos', label: 'Infos patient' },
            { key: 'medical', label: 'Dossier médical' },
            { key: 'relances', label: 'Relances' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 ${
                activeTab === tab.key
                  ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-6 grid grid-cols-2 gap-6 text-sm">
          {activeTab === 'infos' && (
            <>
              <div><b>Email :</b> {patient.patient_email}</div>
              <div><b>Téléphone :</b> {patient.patient_tel}</div>
              <div><b>Âge :</b> {patient.patient_age ?? '—'}</div>
              <div><b>Sexe :</b> {patient.patient_sexe ?? '—'}</div>
              <div><b>Pays :</b> {patient.patient_pays ?? '—'}</div>
              <div><b>Langue :</b> {patient.langue ?? '—'}</div>
            </>
          )}

          {activeTab === 'medical' && (
            <>
              <div className="col-span-2">
                <b>Maladies</b>
                <p className="bg-gray-50 p-3 rounded mt-1">
                  {patient.text_maladies || '—'}
                </p>
              </div>

              <div className="col-span-2">
                <b>Allergies</b>
                <p className="bg-gray-50 p-3 rounded mt-1">
                  {patient.text_allergies || '—'}
                </p>
              </div>

              <div className="col-span-2">
                <b>Chirurgies</b>
                <p className="bg-gray-50 p-3 rounded mt-1">
                  {patient.text_chirurgies || '—'}
                </p>
              </div>

              <div className="col-span-2">
                <b>Médicaments</b>
                <p className="bg-gray-50 p-3 rounded mt-1">
                  {patient.text_medicaments || '—'}
                </p>
              </div>
            </>
          )}

          {activeTab === 'relances' && (
            <div className="col-span-2 text-gray-500">
              Module relances à venir…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
