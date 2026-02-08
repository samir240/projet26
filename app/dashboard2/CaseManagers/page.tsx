'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, X, Plus } from 'lucide-react';

interface CaseManager {
  id_coordi: number;
  id_hospital: number;
  nom_coordi: string;
  email: string | null;
  fonction: string | null;
  telephone: string | null;
  langue: string;
  is_active: number;
}

export default function CaseManagersPage() {
  const [managers, setManagers] = useState<CaseManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState<CaseManager | null>(null);
  const [editManager, setEditManager] = useState<CaseManager | null>(null);
  
  const [newManager, setNewManager] = useState<Partial<CaseManager>>({
    nom_coordi: '',
    email: '',
    fonction: '',
    telephone: '',
    langue: 'fr',
    is_active: 1
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.id_hospital) {
        loadManagers(parsed.id_hospital);
      }
    }
  }, []);

  const loadManagers = async (idHospital: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/case-managers?id_hospital=${idHospital}`);
      const data = await res.json();
      setManagers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading case managers:', error);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id_hospital) {
      alert("Erreur: Hôpital non trouvé");
      return;
    }

    try {
      const payload = {
        ...newManager,
        id_hospital: user.id_hospital
      };

      const res = await fetch('/api/case-managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        alert("Case Manager ajouté avec succès !");
        setShowAddModal(false);
        setNewManager({
          nom_coordi: '',
          email: '',
          fonction: '',
          telephone: '',
          langue: 'fr',
          is_active: 1
        });
        loadManagers(user.id_hospital);
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error saving case manager:', error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleUpdate = async () => {
    if (!editManager) return;

    try {
      const res = await fetch('/api/case-managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id_coordi: editManager.id_coordi,
          ...editManager
        })
      });

      const result = await res.json();
      if (result.success) {
        alert("Case Manager modifié avec succès !");
        setShowEditModal(false);
        setEditManager(null);
        if (user?.id_hospital) loadManagers(user.id_hospital);
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error updating case manager:', error);
      alert("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce Case Manager ?")) return;

    try {
      const res = await fetch(`/api/case-managers?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        alert("Case Manager supprimé avec succès !");
        if (user?.id_hospital) loadManagers(user.id_hospital);
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error deleting case manager:', error);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Case Managers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Ajouter un Case Manager
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Fonction</th>
              <th className="p-3 text-left">Téléphone</th>
              <th className="p-3 text-left">Langue</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Aucun Case Manager trouvé
                </td>
              </tr>
            ) : (
              managers.map((manager) => (
                <tr key={manager.id_coordi} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-semibold">{manager.nom_coordi}</td>
                  <td className="p-3">{manager.email || '-'}</td>
                  <td className="p-3">{manager.fonction || '-'}</td>
                  <td className="p-3">{manager.telephone || '-'}</td>
                  <td className="p-3">{manager.langue || '-'}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      manager.is_active === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {manager.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right flex justify-end gap-3">
                    <Eye
                      className="cursor-pointer text-blue-600"
                      onClick={() => { setSelectedManager(manager); setShowViewModal(true); }}
                    />
                    <Pencil
                      className="cursor-pointer text-yellow-600"
                      onClick={() => { setEditManager({...manager}); setShowEditModal(true); }}
                    />
                    <Trash2
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDelete(manager.id_coordi)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedManager && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowViewModal(false)} />
            <h2 className="text-xl font-bold mb-4">Case Manager #{selectedManager.id_coordi}</h2>
            <div className="space-y-3">
              <div><strong>Nom:</strong> {selectedManager.nom_coordi}</div>
              <div><strong>Email:</strong> {selectedManager.email || '-'}</div>
              <div><strong>Fonction:</strong> {selectedManager.fonction || '-'}</div>
              <div><strong>Téléphone:</strong> {selectedManager.telephone || '-'}</div>
              <div><strong>Langue:</strong> {selectedManager.langue || '-'}</div>
              <div><strong>Status:</strong> {selectedManager.is_active === 1 ? 'Active' : 'Inactive'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowAddModal(false)} />
            <h2 className="text-xl font-bold mb-4">Ajouter un nouveau Case Manager</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nom *</label>
                <input
                  className="w-full border p-2 rounded"
                  value={newManager.nom_coordi || ''}
                  onChange={(e) => setNewManager({ ...newManager, nom_coordi: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border p-2 rounded"
                  value={newManager.email || ''}
                  onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Fonction</label>
                <input
                  className="w-full border p-2 rounded"
                  value={newManager.fonction || ''}
                  onChange={(e) => setNewManager({ ...newManager, fonction: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Téléphone</label>
                <input
                  className="w-full border p-2 rounded"
                  value={newManager.telephone || ''}
                  onChange={(e) => setNewManager({ ...newManager, telephone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Langue</label>
                <select
                  className="w-full border p-2 rounded"
                  value={newManager.langue || 'fr'}
                  onChange={(e) => setNewManager({ ...newManager, langue: e.target.value })}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={newManager.is_active || 1}
                  onChange={(e) => setNewManager({ ...newManager, is_active: parseInt(e.target.value) })}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setShowAddModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSave}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editManager && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowEditModal(false)} />
            <h2 className="text-xl font-bold mb-4">Modifier le Case Manager</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nom *</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editManager.nom_coordi || ''}
                  onChange={(e) => setEditManager({ ...editManager, nom_coordi: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border p-2 rounded"
                  value={editManager.email || ''}
                  onChange={(e) => setEditManager({ ...editManager, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Fonction</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editManager.fonction || ''}
                  onChange={(e) => setEditManager({ ...editManager, fonction: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Téléphone</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editManager.telephone || ''}
                  onChange={(e) => setEditManager({ ...editManager, telephone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Langue</label>
                <select
                  className="w-full border p-2 rounded"
                  value={editManager.langue || 'fr'}
                  onChange={(e) => setEditManager({ ...editManager, langue: e.target.value })}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={editManager.is_active || 1}
                  onChange={(e) => setEditManager({ ...editManager, is_active: parseInt(e.target.value) })}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleUpdate}
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
