'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, X, Plus } from 'lucide-react';

interface Hotel {
  id_hotel: number;
  id_hospital: number;
  hotel_name: string;
  stars: number;
  adresse: string | null;
  hotel_website: string | null;
  single_room_price: number;
  double_room_price: number;
  photo: string | null;
  is_active: number;
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [editHotel, setEditHotel] = useState<Hotel | null>(null);
  
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    hotel_name: '',
    stars: 3,
    adresse: '',
    hotel_website: '',
    single_room_price: 0,
    double_room_price: 0,
    is_active: 1
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.id_hospital) {
        loadHotels(parsed.id_hospital);
      }
    }
  }, []);

  const loadHotels = async (idHospital: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels?id_hospital=${idHospital}`);
      const data = await res.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading hotels:', error);
      setHotels([]);
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
        ...newHotel,
        id_hospital: user.id_hospital
      };

      const res = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        alert("Hôtel ajouté avec succès !");
        setShowAddModal(false);
        setNewHotel({
          hotel_name: '',
          stars: 3,
          adresse: '',
          hotel_website: '',
          single_room_price: 0,
          double_room_price: 0,
          is_active: 1
        });
        loadHotels(user.id_hospital);
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleUpdate = async () => {
    if (!editHotel) return;

    try {
      const res = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id_hotel: editHotel.id_hotel,
          ...editHotel
        })
      });

      const result = await res.json();
      if (result.success) {
        alert("Hôtel modifié avec succès !");
        setShowEditModal(false);
        setEditHotel(null);
        if (user?.id_hospital) loadHotels(user.id_hospital);
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet hôtel ?")) return;

    try {
      const res = await fetch(`/api/hotels?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        alert("Hôtel supprimé avec succès !");
        if (user?.id_hospital) loadHotels(user.id_hospital);
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hotels</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Ajouter un hôtel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Étoiles</th>
              <th className="p-3 text-left">Adresse</th>
              <th className="p-3 text-left">Prix Simple</th>
              <th className="p-3 text-left">Prix Double</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Aucun hôtel trouvé
                </td>
              </tr>
            ) : (
              hotels.map((hotel) => (
                <tr key={hotel.id_hotel} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-semibold">{hotel.hotel_name}</td>
                  <td className="p-3">{'⭐'.repeat(hotel.stars)}</td>
                  <td className="p-3">{hotel.adresse || '-'}</td>
                  <td className="p-3">{hotel.single_room_price} €</td>
                  <td className="p-3">{hotel.double_room_price} €</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      hotel.is_active === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {hotel.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right flex justify-end gap-3">
                    <Eye
                      className="cursor-pointer text-blue-600"
                      onClick={() => { setSelectedHotel(hotel); setShowViewModal(true); }}
                    />
                    <Pencil
                      className="cursor-pointer text-yellow-600"
                      onClick={() => { setEditHotel({...hotel}); setShowEditModal(true); }}
                    />
                    <Trash2
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDelete(hotel.id_hotel)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedHotel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowViewModal(false)} />
            <h2 className="text-xl font-bold mb-4">Hôtel #{selectedHotel.id_hotel}</h2>
            <div className="space-y-3">
              <div><strong>Nom:</strong> {selectedHotel.hotel_name}</div>
              <div><strong>Étoiles:</strong> {'⭐'.repeat(selectedHotel.stars)}</div>
              <div><strong>Adresse:</strong> {selectedHotel.adresse || '-'}</div>
              <div><strong>Site web:</strong> {selectedHotel.hotel_website || '-'}</div>
              <div><strong>Prix chambre simple:</strong> {selectedHotel.single_room_price} €</div>
              <div><strong>Prix chambre double:</strong> {selectedHotel.double_room_price} €</div>
              <div><strong>Status:</strong> {selectedHotel.is_active === 1 ? 'Active' : 'Inactive'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowAddModal(false)} />
            <h2 className="text-xl font-bold mb-4">Ajouter un nouvel hôtel</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nom *</label>
                <input
                  className="w-full border p-2 rounded"
                  value={newHotel.hotel_name || ''}
                  onChange={(e) => setNewHotel({ ...newHotel, hotel_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Étoiles</label>
                <select
                  className="w-full border p-2 rounded"
                  value={newHotel.stars || 3}
                  onChange={(e) => setNewHotel({ ...newHotel, stars: parseInt(e.target.value) })}
                >
                  <option value={1}>1 ⭐</option>
                  <option value={2}>2 ⭐⭐</option>
                  <option value={3}>3 ⭐⭐⭐</option>
                  <option value={4}>4 ⭐⭐⭐⭐</option>
                  <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Adresse</label>
                <input
                  className="w-full border p-2 rounded"
                  value={newHotel.adresse || ''}
                  onChange={(e) => setNewHotel({ ...newHotel, adresse: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Site web</label>
                <input
                  className="w-full border p-2 rounded"
                  value={newHotel.hotel_website || ''}
                  onChange={(e) => setNewHotel({ ...newHotel, hotel_website: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Prix chambre simple (€)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={newHotel.single_room_price || 0}
                  onChange={(e) => setNewHotel({ ...newHotel, single_room_price: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Prix chambre double (€)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={newHotel.double_room_price || 0}
                  onChange={(e) => setNewHotel({ ...newHotel, double_room_price: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={newHotel.is_active || 1}
                  onChange={(e) => setNewHotel({ ...newHotel, is_active: parseInt(e.target.value) })}
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
      {showEditModal && editHotel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowEditModal(false)} />
            <h2 className="text-xl font-bold mb-4">Modifier l'hôtel</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nom *</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editHotel.hotel_name || ''}
                  onChange={(e) => setEditHotel({ ...editHotel, hotel_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Étoiles</label>
                <select
                  className="w-full border p-2 rounded"
                  value={editHotel.stars || 3}
                  onChange={(e) => setEditHotel({ ...editHotel, stars: parseInt(e.target.value) })}
                >
                  <option value={1}>1 ⭐</option>
                  <option value={2}>2 ⭐⭐</option>
                  <option value={3}>3 ⭐⭐⭐</option>
                  <option value={4}>4 ⭐⭐⭐⭐</option>
                  <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Adresse</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editHotel.adresse || ''}
                  onChange={(e) => setEditHotel({ ...editHotel, adresse: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Site web</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editHotel.hotel_website || ''}
                  onChange={(e) => setEditHotel({ ...editHotel, hotel_website: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Prix chambre simple (€)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={editHotel.single_room_price || 0}
                  onChange={(e) => setEditHotel({ ...editHotel, single_room_price: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Prix chambre double (€)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={editHotel.double_room_price || 0}
                  onChange={(e) => setEditHotel({ ...editHotel, double_room_price: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={editHotel.is_active || 1}
                  onChange={(e) => setEditHotel({ ...editHotel, is_active: parseInt(e.target.value) })}
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
