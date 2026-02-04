"use client";

import React, { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return alert("Sélectionnez un fichier !");

    setLoading(true);
    setResult(null);

    // Préparation des données
    const formData = new FormData();
    formData.append('type', 'casemanager_photo'); // Le type attendu par ton switch PHP
    formData.append('entity_id', '1');       // ID du manager à tester (ex: 1)
    formData.append('file', file);           // Le fichier lui-même

    try {
      // APPEL À LA ROUTE NEXT.JS (Proxy)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: "Erreur lors de l'appel API" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-xl font-bold mb-4">Tester l'Upload via Route.ts</h1>
        
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Téléchargement...' : 'Envoyer pour le Manager ID: 1'}
        </button>

        {result && (
          <div className={`mt-6 p-4 rounded text-sm ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.success && result.path && (
              <div className="mt-2">
                <p className="font-bold">Aperçu du chemin :</p>
                <code className="text-xs text-blue-600">https://pro.medotra.com/{result.path}</code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}