'use client';

import React, { useState, useEffect } from 'react';

// Structure de données identique à ta table SQL
interface Procedure {
  id_procedure: number;
  nom_procedure: string;
  categorie: string;
  sous_categorie: string;
  description: string;
  img_procedure: string;
  duree_moyenne: string;
  is_active: number;
}

export default function ProceduresPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Formulaire vide
  const emptyForm: Partial<Procedure> = {
    nom_procedure: '',
    categorie: '',
    sous_categorie: '',
    description: '',
    duree_moyenne: '',
    is_active: 1
  };

  const CATEGORIES_LIST = [
    "Chirurgie Esthétique",
    "Médecine Esthétique",
    "Dentaire",
    "Greffe de Cheveux",
    "Ophtalmologie",
    "Orthopédie",
    "Bilan de Santé"
  ];

  const [formData, setFormData] = useState<Partial<Procedure>>(emptyForm);

  useEffect(() => {
    loadProcedures();
  }, []);

  const loadProcedures = async () => {
    setLoading(true);
    const res = await fetch('/api/procedures');
    const data = await res.json();
    setProcedures(data);
    setLoading(false);
  };

  const handleSave = async () => {
    const isUpdate = !!formData.id_procedure;
    const payload = isUpdate ? { ...formData, action: 'update' } : formData;

    const res = await fetch('/api/procedures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setFormData(emptyForm);
      loadProcedures();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette procédure ?")) return;
    
    await fetch('/api/procedures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id_procedure: id }),
    });
    loadProcedures();
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">PROCÉDURES</h1>
          <p className="text-gray-500 font-medium">Catalogue des Procedures et interventions</p>
        </div>
        <button 
          onClick={() => { setFormData(emptyForm); setIsModalOpen(true); }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
        >
          <span>+</span> Ajouter une Procedure
        </button>
      </div>

      {/* TABLEAU */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Désignation</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Catégorie</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-20 text-gray-400 font-medium">Chargement du catalogue...</td></tr>
            ) : procedures.map((proc) => (
              <tr key={proc.id_procedure} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-5">
                  <div className="font-bold text-gray-800 text-base">{proc.nom_procedure}</div>
                  <div className="text-xs text-gray-400">{proc.duree_moyenne || 'Durée non spécifiée'}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {proc.categorie || 'Général'}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${proc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${proc.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {proc.is_active ? 'ACTIF' : 'INACTIF'}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => { setFormData(proc); setIsModalOpen(true); }}
                      className="text-gray-400 hover:text-blue-600 font-bold text-sm transition-colors"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(proc.id_procedure)}
                      className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE DE GESTION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                {formData.id_procedure ? 'Modifier la procedure' : 'Nouvelle procedure'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Nom de la procédure</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-800 font-semibold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  value={formData.nom_procedure || ''}
                  onChange={e => setFormData({...formData, nom_procedure: e.target.value})}
                  placeholder="ex: Rhinoplastie Ultrasonique"
                />
              </div>

           {/* Catégorie - Remplacé par un Select */}
<div>
  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
    Catégorie
  </label>
  <select 
    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none appearance-none cursor-pointer"
    value={formData.categorie || ''}
    onChange={e => setFormData({...formData, categorie: e.target.value})}
  >
    <option value="">Sélectionner une catégorie</option>
    {CATEGORIES_LIST.map((cat) => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>
</div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Durée Moyenne</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.duree_moyenne || ''}
                  onChange={e => setFormData({...formData, duree_moyenne: e.target.value})}
                  placeholder="ex: 3 jours"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Description courte</label>
                <textarea 
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-semibold h-28 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <span className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Disponible sur le site</span>
                <button 
                  onClick={() => setFormData({...formData, is_active: formData.is_active === 1 ? 0 : 1})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_active ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${formData.is_active ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                ANNULER
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black shadow-lg transition-all"
              >
                ENREGISTRER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}