'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [log, setLog] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) {
      alert('Sélectionne un fichier');
      return;
    }

    const formData = new FormData();
    formData.append('type', 'patient_media');
    formData.append('entity_id', '123');     // FAKE patient ID
    formData.append('request_id', '456');    // FAKE request ID
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setLog(data);
      console.log('UPLOAD RESULT:', data);
    } catch (e) {
      console.error(e);
      alert('Erreur upload');
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Test Upload Media</h1>

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload test
      </button>

      {log && (
        <pre className="bg-gray-100 p-4 text-xs rounded">
          {JSON.stringify(log, null, 2)}
        </pre>
      )}
    </div>
  );
}
