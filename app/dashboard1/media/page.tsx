"use client";
import React, { useState } from 'react';

export default function MultiUploadBase64Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fonction pour transformer un fichier en texte (Base64)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);

    try {
      // 1. On transforme toutes les images en tableau de texte
      const base64Images = await Promise.all(files.map(file => fileToBase64(file)));

      // 2. On prépare l'objet JSON (comme pour tes agents commerciaux)
      const payload = {
        id_hospital: 2, // ID de test
        langue: 'all',
        images: base64Images 
      };

      // 3. Envoi en JSON pur
      const res = await fetch('/api/poto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert("Upload Base64 terminé !");
      console.log(data);
    } catch (err) {
      console.error("Erreur upload:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚀 Upload Hospital (Mode Base64)</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="block w-full text-sm border border-gray-300 rounded-lg p-2"
        />
        <button 
          type="submit" 
          disabled={uploading || files.length === 0}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {uploading ? "Conversion & Envoi..." : `Envoyer ${files.length} image(s)`}
        </button>
      </form>
    </div>
  );
}