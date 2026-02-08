'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, X, User, Upload } from 'lucide-react';
import languagesData from '@/app/json/languages.json';

interface SalesAgent {
  id_commercial: number;
  id_user: number | null;
  nom: string;
  prenom: string | null;
  photo: string | null;
  email: string;
  telephone: string | null;
  langue: string | null;
  note: string | null;
  is_active: number;
}

/* -------------------------------------------------------------
  PAGE
------------------------------------------------------------- */
export default function SalesAgentsPage() {
  const [agents, setAgents] = useState<SalesAgent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<SalesAgent[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterActive, setFilterActive] = useState('All');

  const [selectedAgent, setSelectedAgent] = useState<SalesAgent | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAgent, setEditAgent] = useState<SalesAgent | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [activeTabAdd, setActiveTabAdd] = useState('general');

  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Agent State
  const [newAgent, setNewAgent] = useState<Partial<SalesAgent>>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    langue: 'fr',
    note: '',
    is_active: 1,
    photo: null
  });

  // Photo preview states
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);

  const API_URL = '/api/sales-agents';
  const PHOTO_BASE_URL = 'https://pro.medotra.com/uploads/photos_agents/';

  /* -------------------------------------------------------------
    FETCH API
  ------------------------------------------------------------- */
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then((data: SalesAgent[]) => {
        setAgents(data);
        setFilteredAgents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* -------------------------------------------------------------
    FILTER
  ------------------------------------------------------------- */
  useEffect(() => {
    let data = agents;
    if (filterActive !== 'All') {
      const isActive = filterActive === 'Active';
      data = data.filter(a => (a.is_active === 1) === isActive);
    }
    setFilteredAgents(data);
  }, [filterActive, agents]);

  /* -------------------------------------------------------------
    DELETE
  ------------------------------------------------------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet agent commercial ?")) return;

    try {
      const res = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        setAgents(prev => prev.filter(a => a.id_commercial !== id));
        setFilteredAgents(prev => prev.filter(a => a.id_commercial !== id));
        alert("Agent supprimé avec succès !");
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  /* -------------------------------------------------------------
    PHOTO HANDLING
  ------------------------------------------------------------- */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert("Veuillez sélectionner une image");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image est trop grande (max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isEdit) {
        setEditPhotoPreview(base64String);
        setEditAgent(prev => prev ? { ...prev, photo: base64String } : null);
      } else {
        setPhotoPreview(base64String);
        setNewAgent(prev => ({ ...prev, photo: base64String }));
      }
    };
    reader.readAsDataURL(file);
  };

  const getPhotoUrl = (photo: string | null) => {
    if (!photo) return null;
    // Si c'est déjà une URL base64, retourner directement
    if (photo.startsWith('data:image/')) return photo;
    // Sinon, construire l'URL complète
    return `${PHOTO_BASE_URL}${photo}`;
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Chargement...</div>;
  }

  /* -------------------------------------------------------------
    RENDER
  ------------------------------------------------------------- */
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales Agents</h1>
        <button 
          onClick={() => {
            setShowAddModal(true);
            setActiveTabAdd('general');
            setPhotoPreview(null);
            setNewAgent({
              nom: '',
              prenom: '',
              email: '',
              telephone: '',
              langue: 'fr',
              note: '',
              is_active: 1,
              photo: null
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
        >
          <span className="text-lg font-bold">+</span> Add Agent
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <select 
          className="border p-2 rounded" 
          onChange={e => setFilterActive(e.target.value)}
          value={filterActive}
        >
          <option value="All">All Agents</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Téléphone</th>
              <th className="p-3 text-left">Langue</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map(agent => {
              const photoUrl = getPhotoUrl(agent.photo);
              return (
                <tr key={agent.id_commercial} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {photoUrl ? (
                      <img 
                        src={photoUrl} 
                        alt={`${agent.nom} ${agent.prenom}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-semibold">{agent.nom} {agent.prenom}</td>
                  <td className="p-3">{agent.email}</td>
                  <td className="p-3">{agent.telephone || '-'}</td>
                  <td className="p-3">{agent.langue || '-'}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      agent.is_active === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {agent.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right flex justify-end gap-3">
                    <Eye
                      className="cursor-pointer text-blue-600"
                      onClick={() => { setSelectedAgent(agent); setShowViewModal(true); }}
                    />
                    <Pencil
                      className="cursor-pointer text-yellow-600"
                      onClick={() => { 
                        setEditAgent(agent); 
                        setEditPhotoPreview(getPhotoUrl(agent.photo));
                        setShowEditModal(true); 
                        setActiveTab('general');
                      }}
                    />
                    <Trash2
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDelete(agent.id_commercial)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowViewModal(false)} />
            <h2 className="text-xl font-bold mb-4">Agent #{selectedAgent.id_commercial}</h2>
            <div className="space-y-3">
              {getPhotoUrl(selectedAgent.photo) && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={getPhotoUrl(selectedAgent.photo)!} 
                    alt={`${selectedAgent.nom} ${selectedAgent.prenom}`}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              )}
              <div><strong>Nom:</strong> {selectedAgent.nom}</div>
              <div><strong>Prénom:</strong> {selectedAgent.prenom || '-'}</div>
              <div><strong>Email:</strong> {selectedAgent.email}</div>
              <div><strong>Téléphone:</strong> {selectedAgent.telephone || '-'}</div>
              <div><strong>Langue:</strong> {selectedAgent.langue || '-'}</div>
              <div><strong>Note:</strong> {selectedAgent.note || '-'}</div>
              <div><strong>Status:</strong> {selectedAgent.is_active === 1 ? 'Active' : 'Inactive'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setShowAddModal(false);
                setActiveTabAdd('general');
                setPhotoPreview(null);
              }}
            />
            <h2 className="text-xl font-bold mb-4">Ajouter un nouvel agent</h2>

            {/* TABS */}
            <div className="flex gap-2 mb-4">
              {['general', 'contact'].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded capitalize ${activeTabAdd === tab ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  onClick={() => setActiveTabAdd(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* CONTENU - ONGLET GENERAL */}
            {activeTabAdd === 'general' && (
              <div className="space-y-4">
                {/* PHOTO UPLOAD */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Photo</label>
                  <div className="flex items-center gap-4">
                    {photoPreview ? (
                      <div className="relative">
                        <img 
                          src={photoPreview} 
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview(null);
                            setNewAgent(prev => ({ ...prev, photo: null }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>Choisir une photo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoChange(e, false)}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Nom *</label>
                  <input
                    className="w-full border p-2 rounded"
                    value={newAgent.nom || ''}
                    onChange={(e) => setNewAgent({ ...newAgent, nom: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Prénom</label>
                  <input
                    className="w-full border p-2 rounded"
                    value={newAgent.prenom || ''}
                    onChange={(e) => setNewAgent({ ...newAgent, prenom: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Langue</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={newAgent.langue || 'fr'}
                    onChange={(e) => setNewAgent({ ...newAgent, langue: e.target.value })}
                  >
                    {languagesData.languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.native_name} ({lang.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={newAgent.is_active || 1}
                    onChange={(e) => setNewAgent({ ...newAgent, is_active: Number(e.target.value) })}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Note</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    value={newAgent.note || ''}
                    onChange={(e) => setNewAgent({ ...newAgent, note: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* CONTENU - ONGLET CONTACT */}
            {activeTabAdd === 'contact' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    className="w-full border p-2 rounded"
                    value={newAgent.email || ''}
                    onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full border p-2 rounded"
                    value={newAgent.telephone || ''}
                    onChange={(e) => setNewAgent({ ...newAgent, telephone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* FOOTER ACTIONS */}
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowAddModal(false);
                  setActiveTabAdd('general');
                  setPhotoPreview(null);
                }}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-md"
                onClick={async () => {
                  if (!newAgent.nom || !newAgent.email) {
                    alert("Le nom et l'email sont obligatoires.");
                    return;
                  }
                  try {
                    const res = await fetch(API_URL, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newAgent),
                    });
                    
                    const result = await res.json();
                    if (result.success) {
                      alert("Agent créé avec succès !");
                      window.location.reload();
                    } else {
                      alert("Erreur: " + (result.error || 'Erreur inconnue'));
                    }
                  } catch (err) {
                    alert("Erreur de connexion à l'API");
                  }
                }}
              >
                Créer l'agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editAgent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setShowEditModal(false)}
            />
            <h2 className="text-xl font-bold mb-4">Modifier l'agent #{editAgent.id_commercial}</h2>

            {/* TABS */}
            <div className="flex gap-2 mb-4">
              {['general', 'contact'].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded capitalize ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                {/* PHOTO UPLOAD */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Photo</label>
                  <div className="flex items-center gap-4">
                    {editPhotoPreview ? (
                      <div className="relative">
                        <img 
                          src={editPhotoPreview} 
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditPhotoPreview(null);
                            setEditAgent(prev => prev ? { ...prev, photo: null } : null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>Changer la photo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoChange(e, true)}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Nom *</label>
                  <input
                    className="w-full border p-2 rounded"
                    value={editAgent.nom}
                    onChange={(e) => setEditAgent({ ...editAgent, nom: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Prénom</label>
                  <input
                    className="w-full border p-2 rounded"
                    value={editAgent.prenom || ''}
                    onChange={(e) => setEditAgent({ ...editAgent, prenom: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Langue</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={editAgent.langue || 'fr'}
                    onChange={(e) => setEditAgent({ ...editAgent, langue: e.target.value })}
                  >
                    {languagesData.languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.native_name} ({lang.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={editAgent.is_active}
                    onChange={(e) => setEditAgent({ ...editAgent, is_active: Number(e.target.value) })}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Note</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    value={editAgent.note || ''}
                    onChange={(e) => setEditAgent({ ...editAgent, note: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    className="w-full border p-2 rounded"
                    value={editAgent.email}
                    onChange={(e) => setEditAgent({ ...editAgent, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full border p-2 rounded"
                    value={editAgent.telephone || ''}
                    onChange={(e) => setEditAgent({ ...editAgent, telephone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                onClick={async () => {
                  if (!editAgent) return;
                  
                  try {
                    const res = await fetch(API_URL, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'update',
                        ...editAgent
                      }),
                    });

                    const result = await res.json();
                    if (result.success) {
                      setAgents(prev =>
                        prev.map(a => a.id_commercial === editAgent.id_commercial ? editAgent : a)
                      );
                      setShowEditModal(false);
                      alert("Mise à jour effectuée avec succès !");
                    } else {
                      alert("Erreur API : " + (result.error || 'Erreur inconnue'));
                    }
                  } catch (err) {
                    alert("Impossible de contacter l'API.");
                  }
                }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

