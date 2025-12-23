'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/* =====================
   TYPES
===================== */
interface Request {
  id_request: number;
  status: string;

  patient_id: number;
  patient_nom: string;
  patient_prenom: string;
  patient_email: string;

  procedure_nom: string;

  commercial_nom: string;
  commercial_prenom: string;

  updated_at: string;
}

/* =====================
   PAGE
===================== */
export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteRequest, setQuoteRequest] = useState<Request | null>(null);

  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    fetch('https://lepetitchaletoran.com/api/ia/requests.php')
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /* =====================
     FILTER QUALIFIED
  ===================== */
  const qualifiedRequests = requests.filter(
    (r) => r.status === 'Qualified'
  );

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="p-6">

      {/* =====================
         TABLE QUALIFIED
      ===================== */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-green-700">
            Qualified Requests – Devis
          </h1>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Procédure</th>
              <th className="p-3 text-left">Commercial</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {qualifiedRequests.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Aucune demande qualifiée
                </td>
              </tr>
            )}

            {qualifiedRequests.map((r) => (
              <tr key={r.id_request} className="border-t hover:bg-gray-50">
                <td className="p-3">#{r.id_request}</td>

                <td className="p-3">
                  <div className="font-semibold">
                    {r.patient_nom} {r.patient_prenom}
                  </div>
                  <div className="text-xs text-gray-500">
                    {r.patient_email}
                  </div>
                </td>

                <td className="p-3">{r.procedure_nom}</td>

                <td className="p-3">
                  {r.commercial_nom} {r.commercial_prenom}
                </td>

                <td className="p-3">{r.updated_at}</td>

                <td className="p-3 text-right">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => {
                      setQuoteRequest(r);
                      setShowQuoteModal(true);
                    }}
                  >
                    Créer un devis
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================
         MODAL DEVIS
      ===================== */}
      {showQuoteModal && quoteRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg relative">
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setShowQuoteModal(false)}
            />

            <h2 className="text-xl font-bold mb-4 text-green-700">
              Créer un devis
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Patient :</strong>{' '}
                {quoteRequest.patient_nom} {quoteRequest.patient_prenom}
              </p>
              <p>
                <strong>Email :</strong> {quoteRequest.patient_email}
              </p>
              <p>
                <strong>Procédure :</strong> {quoteRequest.procedure_nom}
              </p>
              <p>
                <strong>Commercial :</strong>{' '}
                {quoteRequest.commercial_nom} {quoteRequest.commercial_prenom}
              </p>
            </div>

            <hr className="my-4" />

            <label className="block text-sm font-semibold mb-1">
              Commentaire devis
            </label>
            <textarea
              className="w-full border p-2 rounded mb-4"
              placeholder="Offre valable 30 jours..."
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setShowQuoteModal(false)}
              >
                Annuler
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  console.log('DEVIS →', quoteRequest);
                  alert('PDF devis généré (mock)');
                }}
              >
                Générer PDF Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
