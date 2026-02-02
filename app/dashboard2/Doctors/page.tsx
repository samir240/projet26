'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, X, Plus, User, Upload } from 'lucide-react';

interface Doctor {
  id_medecin: number;
  id_hospital: number;
  nom_medecin: string;
  photo: string | null;
  cv: string | null;
  specialite: string | null;
  langues: string | null;
  description: string | null;
  note: number;
  reviews: number;
  sexe: string | null;
  nationalite: string | null;
  email: string | null;
  telephone: string | null;
  is_active: number;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    nom_medecin: '',
    specialite: '',
    langues: '',
    description: '',
    note: 0,
    reviews: 0,
    sexe: '',
    nationalite: '',
    email: '',
    telephone: '',
    is_active: 1,
    photo: null
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [editCvFile, setEditCvFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [editSelectedLanguages, setEditSelectedLanguages] = useState<string[]>([]);

  const PHOTO_BASE_URL = 'https://pro.medotra.com/';
  const availableLanguages = ['fr', 'en', 'ar', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja'];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.id_hospital) {
        loadDoctors(parsed.id_hospital);
      }
    }
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch('https://pro.medotra.com/app/http/api/medical_procedures.php');
      const data = await res.json();
      if (Array.isArray(data)) {
        // Récupérer les catégories distinctes
        const uniqueCategories = [...new Set(data.map((p: any) => p.categorie).filter(Boolean))];
        setCategories(uniqueCategories.sort());
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadDoctors = async (idHospital: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors?id_hospital=${idHospital}`);
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("L'image est trop grande (max 5MB)");
      return;
    }

    // Créer une URL de prévisualisation
    const previewUrl = URL.createObjectURL(file);
    if (isEdit) {
      setEditPhotoPreview(previewUrl);
      setEditPhotoFile(file);
    } else {
      setPhotoPreview(previewUrl);
      setPhotoFile(file);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("Veuillez sélectionner un fichier PDF");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Le fichier est trop grand (max 10MB)");
      return;
    }

    if (isEdit) {
      setEditCvFile(file);
    } else {
      setCvFile(file);
    }
  };

  const getPhotoUrl = (photo: string | null) => {
    if (!photo) return null;
    // Si c'est déjà une URL complète ou data URL, retourner directement
    if (photo.startsWith('http') || photo.startsWith('data:')) return photo;
    // Si le chemin commence par "uploads/", ajouter le préfixe "app/http/api/"
    if (photo.startsWith('uploads/')) {
      return `${PHOTO_BASE_URL}app/http/api/${photo}`;
    }
    // Si le chemin commence déjà par "app/http/api/", utiliser tel quel
    if (photo.startsWith('app/http/api/')) {
      return `${PHOTO_BASE_URL}${photo}`;
    }
    // Sinon, construire l'URL complète
    return `${PHOTO_BASE_URL}${photo}`;
  };

  const handleSave = async () => {
    if (!user?.id_hospital) {
      alert("Erreur: Hôpital non trouvé");
      return;
    }

    try {
      // Préparer les langues comme une chaîne séparée par des virgules
      const languesString = selectedLanguages.join(', ');

      const payload = {
        ...newDoctor,
        id_hospital: user.id_hospital,
        langues: languesString || null,
        photo: null // Ne pas envoyer la photo dans le JSON, on l'enverra via FormData
      };

      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        const doctorId = result.id;
        
        // Upload photo et CV si des fichiers ont été sélectionnés
        if ((photoFile || cvFile) && doctorId) {
          const formData = new FormData();
          formData.append('id_medecin', doctorId.toString());
          formData.append('id_hospital', user.id_hospital.toString());
          if (photoFile) formData.append('photo', photoFile);
          if (cvFile) formData.append('cv', cvFile);

          await fetch('/api/doctors', {
            method: 'POST',
            body: formData
          });
        }

        alert("Docteur ajouté avec succès !");
        setShowAddModal(false);
        setPhotoPreview(null);
        setPhotoFile(null);
        setCvFile(null);
        setSelectedLanguages([]);
        setNewDoctor({
          nom_medecin: '',
          specialite: '',
          langues: '',
          description: '',
          note: 0,
          reviews: 0,
          sexe: '',
          nationalite: '',
          email: '',
          telephone: '',
          is_active: 1,
          photo: null
        });
        loadDoctors(user.id_hospital);
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleUpdate = async () => {
    if (!editDoctor) return;

    try {
      // Préparer les langues comme une chaîne séparée par des virgules
      const languesString = editSelectedLanguages.join(', ');

      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          ...editDoctor,
          langues: languesString || editDoctor.langues,
          photo: null // Ne pas envoyer la photo dans le JSON, on l'enverra via FormData
        })
      });

      const result = await res.json();
      if (result.success) {
        // Upload photo et/ou CV si des fichiers ont été sélectionnés
        if ((editPhotoFile || editCvFile) && editDoctor.id_medecin && user?.id_hospital) {
          const formData = new FormData();
          formData.append('id_medecin', editDoctor.id_medecin.toString());
          formData.append('id_hospital', user.id_hospital.toString());
          if (editPhotoFile) formData.append('photo', editPhotoFile);
          if (editCvFile) formData.append('cv', editCvFile);

          await fetch('/api/doctors', {
            method: 'POST',
            body: formData
          });
        }

        alert("Docteur modifié avec succès !");
        setShowEditModal(false);
        setEditDoctor(null);
        setEditPhotoPreview(null);
        setEditPhotoFile(null);
        setEditCvFile(null);
        setEditSelectedLanguages([]);
        if (user?.id_hospital) loadDoctors(user.id_hospital);
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce docteur ?")) return;

    try {
      const res = await fetch(`/api/doctors?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        alert("Docteur supprimé avec succès !");
        if (user?.id_hospital) loadDoctors(user.id_hospital);
      } else {
        alert("Erreur: " + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
        <button
          onClick={() => {
            setShowAddModal(true);
            setPhotoPreview(null);
            setPhotoFile(null);
            setCvFile(null);
            setSelectedLanguages([]);
            setNewDoctor({
              nom_medecin: '',
              specialite: '',
              langues: '',
              description: '',
              note: 0,
              reviews: 0,
              sexe: '',
              nationalite: '',
              email: '',
              telephone: '',
              is_active: 1,
              photo: null
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Ajouter un docteur
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Spécialité</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Téléphone</th>
              <th className="p-3 text-left">Note</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Aucun docteur trouvé
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => {
                const photoUrl = getPhotoUrl(doctor.photo);
                return (
                  <tr key={doctor.id_medecin} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {photoUrl ? (
                        <img 
                          src={photoUrl} 
                          alt={doctor.nom_medecin}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-semibold">{doctor.nom_medecin}</td>
                    <td className="p-3">{doctor.specialite || '-'}</td>
                    <td className="p-3">{doctor.email || '-'}</td>
                    <td className="p-3">{doctor.telephone || '-'}</td>
                    <td className="p-3">{doctor.note || 0} ⭐</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        doctor.is_active === 1 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {doctor.is_active === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-right flex justify-end gap-3">
                      <Eye
                        className="cursor-pointer text-blue-600"
                        onClick={() => { setSelectedDoctor(doctor); setShowViewModal(true); }}
                      />
                      <Pencil
                        className="cursor-pointer text-yellow-600"
                        onClick={() => { 
                          setEditDoctor({...doctor}); 
                          setEditPhotoPreview(getPhotoUrl(doctor.photo));
                          setEditPhotoFile(null);
                          setEditCvFile(null);
                          // Initialiser les langues sélectionnées depuis la chaîne existante
                          if (doctor.langues) {
                            const langs = doctor.langues.split(',').map(l => l.trim().toLowerCase());
                            setEditSelectedLanguages(langs.filter(l => availableLanguages.includes(l)));
                          } else {
                            setEditSelectedLanguages([]);
                          }
                          setShowEditModal(true); 
                        }}
                      />
                      <Trash2
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDelete(doctor.id_medecin)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowViewModal(false)} />
            <h2 className="text-xl font-bold mb-4">Docteur #{selectedDoctor.id_medecin}</h2>
            {getPhotoUrl(selectedDoctor.photo) && (
              <div className="flex justify-center mb-4">
                <img 
                  src={getPhotoUrl(selectedDoctor.photo)!} 
                  alt={selectedDoctor.nom_medecin}
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}
            <div className="space-y-3">
              <div><strong>Nom:</strong> {selectedDoctor.nom_medecin}</div>
              <div><strong>Spécialité:</strong> {selectedDoctor.specialite || '-'}</div>
              <div><strong>Langues:</strong> {selectedDoctor.langues || '-'}</div>
              {selectedDoctor.cv && (
                <div>
                  <strong>CV:</strong>{' '}
                  <a 
                    href={`${PHOTO_BASE_URL}${selectedDoctor.cv}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Télécharger le CV
                  </a>
                </div>
              )}
              <div><strong>Email:</strong> {selectedDoctor.email || '-'}</div>
              <div><strong>Téléphone:</strong> {selectedDoctor.telephone || '-'}</div>
              <div><strong>Sexe:</strong> {selectedDoctor.sexe || '-'}</div>
              <div><strong>Nationalité:</strong> {selectedDoctor.nationalite || '-'}</div>
              <div><strong>Note:</strong> {selectedDoctor.note || 0} ⭐ ({selectedDoctor.reviews || 0} avis)</div>
              <div><strong>Description:</strong> {selectedDoctor.description || '-'}</div>
              <div><strong>Status:</strong> {selectedDoctor.is_active === 1 ? 'Active' : 'Inactive'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowAddModal(false)} />
            <h2 className="text-xl font-bold mb-4">Ajouter un nouveau docteur</h2>

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
                          setPhotoFile(null);
                          if (photoPreview) URL.revokeObjectURL(photoPreview);
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
                    <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
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
                  value={newDoctor.nom_medecin || ''}
                  onChange={(e) => setNewDoctor({ ...newDoctor, nom_medecin: e.target.value })}
                  required
                />
              </div>

              {/* CV UPLOAD */}
              <div>
                <label className="block text-sm font-semibold mb-2">CV (PDF)</label>
                <div className="flex items-center gap-4">
                  {cvFile ? (
                    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                      <span className="text-sm text-gray-700">{cvFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setCvFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Aucun fichier sélectionné</span>
                  )}
                  <label className="cursor-pointer">
                    <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>Choisir un CV</span>
                    </div>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleCvChange(e, false)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Spécialité</label>
                <select
                  className="w-full border p-2 rounded"
                  value={newDoctor.specialite || ''}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialite: e.target.value })}
                >
                  <option value="">Sélectionner une spécialité</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Langues</label>
                <div className="border p-2 rounded max-h-32 overflow-y-auto">
                  {availableLanguages.map((lang) => (
                    <label key={lang} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(lang)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLanguages([...selectedLanguages, lang]);
                          } else {
                            setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{lang.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
                {selectedLanguages.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Sélectionnées: {selectedLanguages.join(', ')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border p-2 rounded"
                  value={newDoctor.email || ''}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Téléphone</label>
                <input
                  className="w-full border p-2 rounded"
                  value={newDoctor.telephone || ''}
                  onChange={(e) => setNewDoctor({ ...newDoctor, telephone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Sexe</label>
                <select
                  className="w-full border p-2 rounded"
                  value={newDoctor.sexe || ''}
                  onChange={(e) => setNewDoctor({ ...newDoctor, sexe: e.target.value })}
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nationalité</label>
                <input
                  className="w-full border p-2 rounded"
                  value={newDoctor.nationalite || ''}
                  onChange={(e) => setNewDoctor({ ...newDoctor, nationalite: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  value={newDoctor.description || ''}
                  onChange={(e) => setNewDoctor({ ...newDoctor, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={newDoctor.is_active || 1}
                  onChange={(e) => setNewDoctor({ ...newDoctor, is_active: parseInt(e.target.value) })}
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
      {showEditModal && editDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl max-h-[90vh] overflow-y-auto">
            <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowEditModal(false)} />
            <h2 className="text-xl font-bold mb-4">Modifier le docteur</h2>

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
                          setEditPhotoFile(null);
                          if (editPhotoPreview) URL.revokeObjectURL(editPhotoPreview);
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
                    <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>Choisir une photo</span>
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
                  value={editDoctor.nom_medecin || ''}
                  onChange={(e) => setEditDoctor({ ...editDoctor, nom_medecin: e.target.value })}
                  required
                />
              </div>

              {/* CV UPLOAD */}
              <div>
                <label className="block text-sm font-semibold mb-2">CV (PDF)</label>
                <div className="flex items-center gap-4">
                  {editCvFile ? (
                    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                      <span className="text-sm text-gray-700">{editCvFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setEditCvFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ) : editDoctor.cv ? (
                    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                      <span className="text-sm text-gray-700">CV existant</span>
                      <a 
                        href={`${PHOTO_BASE_URL}${editDoctor.cv}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Voir
                      </a>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Aucun fichier sélectionné</span>
                  )}
                  <label className="cursor-pointer">
                    <div className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>{editDoctor.cv ? 'Remplacer le CV' : 'Choisir un CV'}</span>
                    </div>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleCvChange(e, true)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Spécialité</label>
                <select
                  className="w-full border p-2 rounded"
                  value={editDoctor.specialite || ''}
                  onChange={(e) => setEditDoctor({ ...editDoctor, specialite: e.target.value })}
                >
                  <option value="">Sélectionner une spécialité</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Langues</label>
                <div className="border p-2 rounded max-h-32 overflow-y-auto">
                  {availableLanguages.map((lang) => (
                    <label key={lang} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editSelectedLanguages.includes(lang)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditSelectedLanguages([...editSelectedLanguages, lang]);
                          } else {
                            setEditSelectedLanguages(editSelectedLanguages.filter(l => l !== lang));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{lang.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
                {editSelectedLanguages.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Sélectionnées: {editSelectedLanguages.join(', ')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border p-2 rounded"
                  value={editDoctor.email || ''}
                  onChange={(e) => setEditDoctor({ ...editDoctor, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Téléphone</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editDoctor.telephone || ''}
                  onChange={(e) => setEditDoctor({ ...editDoctor, telephone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Sexe</label>
                <select
                  className="w-full border p-2 rounded"
                  value={editDoctor.sexe || ''}
                  onChange={(e) => setEditDoctor({ ...editDoctor, sexe: e.target.value })}
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nationalité</label>
                <input
                  className="w-full border p-2 rounded"
                  value={editDoctor.nationalite || ''}
                  onChange={(e) => setEditDoctor({ ...editDoctor, nationalite: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  value={editDoctor.description || ''}
                  onChange={(e) => setEditDoctor({ ...editDoctor, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={editDoctor.is_active || 1}
                  onChange={(e) => setEditDoctor({ ...editDoctor, is_active: parseInt(e.target.value) })}
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
