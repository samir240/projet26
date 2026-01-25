'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Pencil, CheckCircle2, X, Briefcase, MessageSquare, Tag } from 'lucide-react';

interface Relance {
  id_relance: number;
  id_request: number;
  id_commercial: number;
  commercial_nom?: string;
  commercial_prenom?: string;
  patient_nom: string;
  patient_prenom: string;
  date_relance: string;
  type_relance: 'auto' | 'manual' | 'autre' | '';
  objet: string;
  notes: string;
  status: 'new' | 'done' | 'canceled';
}

export default function RelancesPage() {
  const [relances, setRelances] = useState<Relance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emptyForm: Partial<Relance> = {
    date_relance: new Date().toISOString().split('T')[0],
    objet: '',
    notes: '',
    type_relance: 'manual',
    status: 'new'
  };

  const [formData, setFormData] = useState<Partial<Relance>>(emptyForm);

  useEffect(() => {
    loadRelances();
  }, []);

  const loadRelances = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/relances');
      const data = await res.json();
      if (data && Array.isArray(data)) {
        setRelances(data);
      } else {
        setRelances([]); 
      }
    } catch (error) {
      console.error("Erreur de chargement:", error);
      setRelances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const action = formData.id_relance ? 'update' : 'create';
    try {
      const res = await fetch('/api/relances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, action }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        loadRelances();
      }
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const markAsDone = async (rel: Relance) => {
    try {
      const res = await fetch('/api/relances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            action: 'update', 
            id_relance: rel.id_relance, 
            status: 'done' 
        }),
      });
      if (res.ok) loadRelances();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans text-gray-900">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 italic">
            <Bell className="text-orange-500" fill="currentColor" /> RELANCES
          </h1>
          <p className="text-gray-500 font-medium italic">Suivi simplifié des rappels</p>
        </div>
      </div>

      {/* TABLEAU */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Commercial</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Objet</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status & Notes</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-20 text-gray-400 font-medium italic">Chargement...</td></tr>
            ) : relances.map((rel) => (
              <tr key={rel.id_relance} className={`hover:bg-gray-50/80 transition-colors group ${rel.status === 'done' ? 'opacity-60' : ''}`}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                    <Briefcase size={14} className="text-blue-500" />
                    {rel.commercial_nom ? `${rel.commercial_nom} ${rel.commercial_prenom || ''}` : `ID: ${rel.id_commercial}`}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 text-sm uppercase">{rel.patient_nom}</span>
                    <span className="text-gray-500 font-medium text-xs italic">Req #{rel.id_request}</span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-1 text-orange-600 font-black text-[11px] mb-1">
                    <Calendar size={12} /> {new Date(rel.date_relance).toLocaleDateString('fr-FR')}
                  </div>
                  <p className="text-sm text-gray-700 font-bold italic line-clamp-1">{rel.objet}</p>
                </td>

                {/* NOUVELLE COLONNE TYPE */}
                <td className="px-6 py-5">
                  <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1 w-fit">
                    <Tag size={10} className="text-gray-400" /> {rel.type_relance || 'autre'}
                  </span>
                </td>

                <td className="px-6 py-5 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                      rel.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rel.status === 'done' ? 'Terminé' : rel.status === 'new' ? 'Nouveau' : 'Annulé'}
                    </span>
                    {rel.notes && (
                      <div className="text-[10px] text-gray-400 italic flex items-center gap-1 max-w-[150px] truncate">
                        <MessageSquare size={10} /> {rel.notes}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setFormData(rel); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 transition-all">
                      <Pencil size={18} />
                    </button>
                    {rel.status !== 'done' && (
                      <button onClick={() => markAsDone(rel)} className="p-2 text-gray-400 hover:text-green-600 transition-all">
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE SIMPLIFIÉE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h2 className="text-xl font-black text-gray-800 uppercase italic">
                {formData.id_relance ? 'Modifier Relance' : 'Nouveau Rappel'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-2 rounded-full shadow-md"><X size={20} /></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* DATE */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 px-1">Date prévue</label>
                  <input type="datetime-local" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold shadow-inner"
                    value={formData.date_relance ? formData.date_relance.replace(' ', 'T').substring(0, 16) : ''}
                    onChange={e => setFormData({...formData, date_relance: e.target.value})} />
                </div>

                {/* STATUS */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 px-1">Statut</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold shadow-inner"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="new">New</option>
                    <option value="done">Done</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>

              {/* OBJET */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 px-1">Objet du rappel</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold shadow-inner"
                  value={formData.objet || ''}
                  onChange={e => setFormData({...formData, objet: e.target.value})} />
              </div>

              {/* NOTES */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 px-1">Notes / Détails</label>
                <textarea className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold h-32 resize-none shadow-inner"
                  value={formData.notes || ''}
                  onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 bg-white border rounded-2xl font-black text-gray-400 uppercase text-[10px]">Annuler</button>
              <button onClick={handleSave} className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}