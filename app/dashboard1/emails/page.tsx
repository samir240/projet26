'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Save, X, Info } from 'lucide-react';
import Flag from 'react-world-flags';

interface EmailTemplate {
  id_template?: number;
  slug: string;
  langue: string;
  objet: string;
  message: string;
  description: string;
}

export default function EmailManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterLang, setFilterLang] = useState('All');

  // État initial du formulaire
  const initialFormState: EmailTemplate = {
    slug: '',
    langue: 'fr',
    objet: '',
    message: '',
    description: ''
  };

  const [formData, setFormData] = useState<EmailTemplate>(initialFormState);

  useEffect(() => {
    fetchTemplates();
  }, []);

  // RÉCUPÉRATION VIA ROUTE.TS (GET)
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email_templates');
      const data = await res.json();
      if (data.success) {
        setTemplates(data.data);
      } else {
        console.error("Erreur API:", data.error);
      }
    } catch (err) {
      console.error("Erreur chargement templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tpl: EmailTemplate) => {
    setFormData({ ...tpl });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setShowModal(true);
  };

  // ENREGISTREMENT VIA ROUTE.TS (POST)
  const handleSave = async () => {
    // Validation simple
    if (!formData.slug || !formData.objet || !formData.message) {
      alert("Veuillez remplir les champs obligatoires (Slug, Objet, Message)");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/email_templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      
      if (result.success) {
        setShowModal(false);
        fetchTemplates(); // Recharger la liste
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (err) {
      alert("Erreur de connexion avec l'API interne");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTemplates = filterLang === 'All' 
    ? templates 
    : templates.filter(t => t.langue === filterLang);

  // Helper pour les drapeaux
  const getFlagCode = (lang: string) => {
    switch(lang) {
        case 'en': return 'GB';
        case 'ar': return 'SA';
        default: return lang.toUpperCase();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Modèles d'Emails</h1>
            <p className="text-gray-500">Créez et modifiez vos réponses types multilingues</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200 font-semibold"
          >
            <Plus size={20} /> Nouveau modèle
          </button>
        </div>

        {/* FILTRES PAR LANGUE */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm w-fit border border-gray-100">
            {['All', 'fr', 'en', 'es', 'it', 'ar'].map(lang => (
                <button 
                    key={lang}
                    onClick={() => setFilterLang(lang)}
                    className={`px-5 py-1.5 rounded-xl text-sm font-bold transition-all ${filterLang === lang ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                    {lang === 'All' ? 'TOUS' : lang.toUpperCase()}
                </button>
            ))}
        </div>

        {/* GRILLE DE TEMPLATES */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-gray-400 gap-4">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             <p>Chargement des modèles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <div key={tpl.id_template} className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm border border-gray-100">
                        <Flag code={getFlagCode(tpl.langue)} />
                    </div>
                    <span className="font-black text-blue-600 uppercase text-[10px] tracking-tighter bg-blue-50 px-2 py-0.5 rounded">
                        {tpl.slug}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleEdit(tpl)} 
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 truncate group-hover:text-blue-700">{tpl.objet}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-6 min-h-[4.5rem] leading-relaxed">
                    {tpl.message}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Info size={14} className="text-blue-400" /> 
                  <span className="truncate">{tpl.description || 'Aucune description interne'}</span>
                </div>
              </div>
            ))}
            
            {filteredTemplates.length === 0 && (
                <div className="col-span-full bg-white border-2 border-dashed rounded-2xl p-20 text-center text-gray-400">
                    Aucun modèle trouvé pour cette sélection.
                </div>
            )}
          </div>
        )}

        {/* MODAL AJOUT / ÉDITION */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-black text-gray-800">{formData.id_template ? 'Éditer le modèle' : 'Créer un nouveau modèle'}</h2>
                    <p className="text-xs text-gray-500">Remplissez les informations ci-dessous</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                    <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Identifiant (Slug)</label>
                    <input 
                      className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 focus:ring-4 ring-blue-50 outline-none transition-all font-mono text-sm"
                      placeholder="ex: rappel_rdv"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Langue</label>
                    <select 
                      className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-blue-500 transition-all appearance-none bg-no-repeat bg-right pr-10"
                      value={formData.langue}
                      onChange={e => setFormData({...formData, langue: e.target.value})}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="it">Italiano</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Objet de l'email</label>
                  <input 
                    className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-4 ring-blue-50 transition-all"
                    placeholder="Sujet du mail tel que reçu par le client"
                    value={formData.objet}
                    onChange={e => setFormData({...formData, objet: e.target.value})}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Corps du message</label>
                    <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded">Tag dispo: {"{{nom}}"}, {"{{procedure}}"}</span>
                  </div>
                  <textarea 
                    className="w-full border-2 border-gray-100 rounded-2xl p-4 h-56 outline-none focus:border-blue-500 focus:ring-4 ring-blue-50 transition-all font-sans leading-relaxed text-gray-700"
                    placeholder="Tapez votre message ici..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Note interne (Optionnel)</label>
                  <input 
                    className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none text-sm italic text-gray-500"
                    placeholder="ex: Email envoyé après signature du devis"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-6 border-t flex justify-end gap-3 bg-gray-50/50">
                <button 
                    onClick={() => setShowModal(false)} 
                    className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                    Fermer
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  {isSaving ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                  ) : (
                    <>
                      <Save size={18} /> Enregistrer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}