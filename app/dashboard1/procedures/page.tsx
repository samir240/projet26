'use client';

import React, { useState, useEffect, useMemo } from 'react';
// Import du fichier JSON (chemin relatif)
import specialtiesData from './data/specialties.json';

interface Procedure {
  id_procedure: number;
  nom_procedure: string;
  slug?: string;
  category_key?: string;
  categorie: string;
  sous_categorie: string;
  description: string;
  short_description?: string;
  img_procedure: string;
  duree_moyenne: string;
  is_active: number;
  is_featured: number;
  language: string;
  seo_title?: string;
  seo_description?: string;
}

export default function ProceduresPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- ÉTATS POUR LES FILTRES DU TABLEAU ---
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterCat, setFilterCat] = useState<string>('all');

  const emptyForm: Partial<Procedure> = {
    nom_procedure: '',
    categorie: '',
    sous_categorie: '',
    description: '',
    short_description: '',
    duree_moyenne: '',
    is_active: 1,
    is_featured: 0,
    language: 'fr',
    slug: ''
  };

  const [formData, setFormData] = useState<Partial<Procedure>>(emptyForm);

  useEffect(() => {
    loadProcedures();
  }, []);

  const loadProcedures = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/procedures');
      const data = await res.json();
      setProcedures(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE DE FILTRAGE DU TABLEAU ---
  const filteredProcedures = useMemo(() => {
    return procedures.filter(p => {
      const matchLang = filterLang === 'all' || p.language === filterLang;
      const matchCat = filterCat === 'all' || p.categorie === filterCat;
      return matchLang && matchCat;
    });
  }, [procedures, filterLang, filterCat]);

  // Extraction des catégories uniques du JSON pour les filtres et le formulaire
  const getCategoriesByLang = (lang: string) => {
    return Object.values(specialtiesData).map(s => s.title[lang as keyof typeof s.title] || s.title.en);
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

  const toggleStatus = async (proc: Procedure, field: 'is_active' | 'is_featured') => {
    const newValue = proc[field] === 1 ? 0 : 1;
    await fetch('/api/procedures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id_procedure: proc.id_procedure, [field]: newValue }),
    });
    loadProcedures();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette procédure ?")) return;
    await fetch('/api/procedures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id_procedure: id }),
    });
    loadProcedures();
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">PROCÉDURES</h1>
          <p className="text-gray-500 font-medium text-sm">Gestion du catalogue multilingue</p>
        </div>
        <button 
          onClick={() => { setFormData(emptyForm); setIsModalOpen(true); }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
        >
          <span>+</span> Ajouter une Procedure
        </button>
      </div>

      {/* --- BARRE DE FILTRES --- */}
      <div className="flex gap-4 mb-6">
        <select 
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
          value={filterLang}
          onChange={(e) => { setFilterLang(e.target.value); setFilterCat('all'); }}
        >
    
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>

        <select 
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="all">Toutes les catégories</option>
          {filterLang !== 'all' && getCategoriesByLang(filterLang).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* TABLEAU */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Désignation</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Langue</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Featured</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Statut</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-20 text-gray-400">Chargement...</td></tr>
            ) : filteredProcedures.map((proc) => (
              <tr key={proc.id_procedure} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{proc.nom_procedure}</div>
                  <div className="text-[11px] text-gray-400">{proc.categorie}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="uppercase text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    {proc.language}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => toggleStatus(proc, 'is_featured')}
                    className={`w-10 h-5 rounded-full transition-all relative ${proc.is_featured ? 'bg-orange-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${proc.is_featured ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${proc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {proc.is_active ? 'ACTIF' : 'INACTIF'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 text-sm font-bold">
                    <button onClick={() => { setFormData(proc); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-600">Modifier</button>
                    <button onClick={() => handleDelete(proc.id_procedure)} className="text-gray-400 hover:text-red-500">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                {formData.id_procedure ? 'Modifier Procedure' : 'Nouvelle Procedure'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-5 max-h-[70vh] overflow-y-auto">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Langue</label>
                <select 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.language || 'fr'}
                  onChange={e => setFormData({...formData, language: e.target.value, categorie: ''})}
                >
                  <option value="fr">Français (FR)</option>
                  <option value="en">English (EN)</option>
                  <option value="ar">Arabic (AR)</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Catégorie ({formData.language})</label>
                <select 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.categorie || ''}
                  onChange={e => setFormData({...formData, categorie: e.target.value})}
                >
                  <option value="">Sélectionner...</option>
                  {getCategoriesByLang(formData.language || 'fr').sort().map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Nom de la procédure</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  value={formData.nom_procedure || ''}
                  onChange={e => setFormData({...formData, nom_procedure: e.target.value})}
                />
              </div>

              {/* ... Reste des champs (Actif, Featured, Description) identiques à ton code original ... */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-500 uppercase">Actif</span>
                  <button onClick={() => setFormData({...formData, is_active: formData.is_active === 1 ? 0 : 1})} className={`w-10 h-5 rounded-full transition-all relative ${formData.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.is_active ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-500 uppercase">Featured</span>
                  <button onClick={() => setFormData({...formData, is_featured: formData.is_featured === 1 ? 0 : 1})} className={`w-10 h-5 rounded-full transition-all relative ${formData.is_featured ? 'bg-orange-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.is_featured ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Short Description</label>
                <textarea className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-medium h-24 outline-none focus:ring-2 focus:ring-orange-500" value={formData.short_description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-400 hover:text-gray-600">ANNULER</button>
              <button onClick={handleSave} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-gray-200">ENREGISTRER</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}