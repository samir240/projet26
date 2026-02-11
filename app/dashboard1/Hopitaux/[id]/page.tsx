'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import countriesData from '@/app/json/countries.json';

interface Hospital {
  id_hospital: number;
  nom: string;
  pays: string;
  ville: string;
  adresse: string;
  latitude: string;
  longitude: string;
  telephone: string;
  email: string;
  website: string;
  description: string;
  logo: string;
  certifications: string;
  nom_gerant: string;
  reviews: number;
  note_google: number;
  is_active: number;
}

interface Treatment {
  id_relation: number;
  id_procedure: number;
  id_hospital: number;
  prix_base: string | number;
  devise: string;
  duree_sejour: number | null;
  description_specifique: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  nom_procedure: string;
}

interface Procedure {
  id_procedure: number;
  nom: string;
  nom_procedure: string;
  description: string;
  categorie: string;
  langue: string;
}

interface SelectedProcedure {
  id_procedure: number;
  nom: string;
  prix_base: string;
  devise: string;
  duree_sejour: string;
  description_specifique: string;
}

interface HospitalMedia {
  id_media: number;
  id_hospital: number;
  nom: string | null;
  path: string;
  langue: string;
  ordre: number;
  created_at: string;
}

interface Hotel {
  id_hotel: number;
  id_hospital: number;
  hotel_name: string;
  stars: number;
  adresse: string | null;
  hotel_website: string | null;
  single_room_price: number | null;
  double_room_price: number | null;
  photo: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CaseManager {
  id_case_manager: number;
  id_hospital: number;
  fullname: string;
  email: string | null;
  phone: string | null;
  profile_photo: string | null;
  countries_concerned: string | null; // JSON string ou comma-separated
  id_coordinator: number | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}


interface Doctor {
  id_medecin: number;
  id_hospital: number;
  nom_medecin: string;
  photo: string | null;
  cv: string | null;
  specialite: string | null;
  qualifications: string | null;
  experience_years: number;
  realisations: string | null;
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

type Tab = 'Profile' | 'Acces' | 'Media' | 'Treatments' | 'Doctors' | 'Notifications' | 'Case Managers' | 'Hotels' | 'Reviews';

// Liste des pays pour la sélection
const COUNTRIES = [
  'Algérie', 'Maroc', 'Tunisie', 'France', 'Belgique', 'Suisse', 'Canada', 'Espagne', 'Italie',
  'Allemagne', 'Royaume-Uni', 'États-Unis', 'Turquie', 'Égypte', 'Liban', 'Jordanie', 'Qatar',
  'Émirats arabes unis', 'Arabie saoudite', 'Koweït', 'Bahreïn', 'Oman', 'Autre'
];

// Liste des langues pour les docteurs
const LANGUAGES = [
  'English',
  'Arabic',
  'French',
  'Russian',
  'German',
  'Turkish'
];

export default function HospitalEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [treatmentsLoading, setTreatmentsLoading] = useState(false);
  const [showAddProcedureModal, setShowAddProcedureModal] = useState(false);
  const [allProcedures, setAllProcedures] = useState<Procedure[]>([]);
  const [proceduresLoading, setProceduresLoading] = useState(false);
  const [procedureLangue, setProcedureLangue] = useState<string>('all');
  const [procedureCategorie, setProcedureCategorie] = useState<string>('all');
  const [selectedProcedures, setSelectedProcedures] = useState<Map<number, SelectedProcedure>>(new Map());
  const [media, setMedia] = useState<HospitalMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
  const [hotelPhotoFile, setHotelPhotoFile] = useState<File | null>(null);
  const [caseManagers, setCaseManagers] = useState<CaseManager[]>([]);
  const [caseManagersLoading, setCaseManagersLoading] = useState(false);
  const [showCaseManagerModal, setShowCaseManagerModal] = useState(false);
  const [editingCaseManagerId, setEditingCaseManagerId] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [showOnline, setShowOnline] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mediaLangue, setMediaLangue] = useState<string>('all');
  
  // États pour le formulaire d'hôtel
  const [hotelForm, setHotelForm] = useState({
    hotel_name: '',
    stars: '',
    adresse: '',
    hotel_website: 'http://',
    single_room_price: '',
    double_room_price: '',
  });

  // États pour le formulaire de case manager
  const [caseManagerForm, setCaseManagerForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    countries_concerned: [] as string[],
  });
  const [caseManagerPhoto, setCaseManagerPhoto] = useState<File | null>(null);

  // États pour l'onglet Acces (Users)
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    is_active: 1
  });

 // États pour le formulaire de docteur
 const [doctorForm, setDoctorForm] = useState({
  nom_medecin: '',
  email: '',
  telephone: '',
  specialite: '',
  langues: [] as string[],
  description: '',
  note: 5,
  sexe: 'M',
  nationalite: '',
  qualifications: '',
  experience_years: 0,
  realisations: '',
  is_active: 1
});

const [doctorPhoto, setDoctorPhoto] = useState<File | null>(null);
const [doctorCV, setDoctorCV] = useState<File | null>(null);
const [doctorCategories, setDoctorCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    setPageLoading(true);
    setError(null);
    
    fetch(`/api/hospitals?id=${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setHospital(data);
        setShowOnline(data?.is_active === 1);
        setPageLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement de l\'hôpital');
        setPageLoading(false);
        console.error(err);
      });
  }, [id]);

  // Charger les traitements quand l'onglet Treatments est sélectionné
  useEffect(() => {
    if (activeTab === 'Treatments' && id) {
      loadTreatments();
    }
  }, [activeTab, id]);

  // Charger les médias quand l'onglet Media est sélectionné
  useEffect(() => {
    if (activeTab === 'Media' && id) {
      loadMedia();
    }
  }, [activeTab, id]);

  // Charger les hôtels quand l'onglet Hotels est sélectionné
  useEffect(() => {
    if (activeTab === 'Hotels' && id) {
      loadHotels();
    }
  }, [activeTab, id]);

  // Charger les case managers quand l'onglet Case Managers est sélectionné
  useEffect(() => {
    if (activeTab === 'Case Managers' && id) {
      loadCaseManagers();
    }
  }, [activeTab, id]);

  // Charger les docteurs quand l'onglet Doctors est sélectionné
  useEffect(() => {
    if (activeTab === 'Doctors' && id) {
      loadDoctors();
      loadDoctorCategories();
    }
  }, [activeTab, id]);

  // Charger les users quand l'onglet Acces est sélectionné
  useEffect(() => {
    if (activeTab === 'Acces' && id) {
      loadUsers();
    }
  }, [activeTab, id]);

  // Charger les catégories pour la spécialité
  const loadDoctorCategories = async () => {
    try {
      const res = await fetch('https://pro.medotra.com/app/http/api/medical_procedures.php');
      const data = await res.json();
      if (Array.isArray(data)) {
        const uniqueCategories = [...new Set(data.map((p: any) => p.categorie).filter(Boolean))];
        setDoctorCategories(uniqueCategories.sort());
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

// Helper pour construire l'URL correcte des photos/CV des docteurs et case managers
// Gère les chemins de functions.php: uploads/casemanagers/casemanager_3/xxx.png
const getDoctorMediaUrl = (path: string | null) => {
  if (!path) return null;

  // Si c'est déjà une URL complète, retourner tel quel
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Nettoyer le chemin : supprimer les "../" si présents
  const cleanPath = path.replace(/\.\.\//g, '');

  // Construire l'URL complète
  // Le chemin stocké en BDD est : uploads/casemanagers/casemanager_3/xxx.png
  return `https://pro.medotra.com/${cleanPath}`;
};

  const loadTreatments = async () => {
    setTreatmentsLoading(true);
    try {
      const response = await fetch('https://pro.medotra.com/app/http/api/procedure_hospital.php');
      const data: Treatment[] = await response.json();
      // Filtrer par id_hospital
      const hospitalTreatments = data.filter(t => t.id_hospital === Number(id));
      setTreatments(hospitalTreatments);
    } catch (err) {
      console.error('Erreur lors du chargement des traitements:', err);
    } finally {
      setTreatmentsLoading(false);
    }
  };

  const loadAllProcedures = async () => {
    setProceduresLoading(true);
    try {
      const response = await fetch('/api/procedures');
      const data: Procedure[] = await response.json();
      setAllProcedures(data);
    } catch (err) {
      console.error('Erreur lors du chargement des procédures:', err);
    } finally {
      setProceduresLoading(false);
    }
  };

  const openAddProcedureModal = () => {
    setShowAddProcedureModal(true);
    loadAllProcedures();
    setSelectedProcedures(new Map());
    setProcedureLangue('all');
    setProcedureCategorie('all');
  };

  const closeAddProcedureModal = () => {
    setShowAddProcedureModal(false);
    setSelectedProcedures(new Map());
  };

  const toggleProcedureSelection = (procedure: Procedure) => {
    const newSelected = new Map(selectedProcedures);
    if (newSelected.has(procedure.id_procedure)) {
      newSelected.delete(procedure.id_procedure);
    } else {
      newSelected.set(procedure.id_procedure, {
        id_procedure: procedure.id_procedure,
        nom: procedure.nom,
        prix_base: '',
        devise: 'EUR',
        duree_sejour: '',
        description_specifique: ''
      });
    }
    setSelectedProcedures(newSelected);
  };

  const updateProcedureDetails = (id_procedure: number, field: keyof SelectedProcedure, value: string) => {
    const newSelected = new Map(selectedProcedures);
    const proc = newSelected.get(id_procedure);
    if (proc) {
      newSelected.set(id_procedure, { ...proc, [field]: value });
      setSelectedProcedures(newSelected);
    }
  };

  const assignProceduresToHospital = async () => {
    if (selectedProcedures.size === 0) {
      alert('Veuillez sélectionner au moins une procédure');
      return;
    }

    // Valider que toutes les procédures ont un prix
    for (const [, proc] of selectedProcedures) {
      if (!proc.prix_base || parseFloat(proc.prix_base) <= 0) {
        alert(`Veuillez entrer un prix valide pour "${proc.nom}"`);
        return;
      }
    }

    try {
      const promises = Array.from(selectedProcedures.values()).map(async (proc) => {
        const response = await fetch('/api/treatments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            id_procedure: proc.id_procedure,
            id_hospital: Number(id),
            prix_base: parseFloat(proc.prix_base),
            devise: proc.devise,
            duree_sejour: proc.duree_sejour ? parseInt(proc.duree_sejour) : null,
            description_specifique: proc.description_specifique || null,
            is_active: 1
          })
        });
        return await response.json();
      });

      await Promise.all(promises);
      alert('✅ Procédures affectées avec succès');
      closeAddProcedureModal();
      loadTreatments();
    } catch (err) {
      console.error('Erreur lors de l\'affectation des procédures:', err);
      alert('❌ Erreur lors de l\'affectation des procédures');
    }
  };

  const loadMedia = async () => {
    if (!id) return;
    setMediaLoading(true);
    try {
      const response = await fetch(`/api/poto?id_hospital=${id}`);
      if (response.ok) {
        const data = await response.json();
        setMedia(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des médias:', err);
    } finally {
      setMediaLoading(false);
    }
  };

  const uploadMedia = async () => {
    const hospitalId = Number(id);
  
    if (!hospitalId || isNaN(hospitalId)) {
      console.error('ID hôpital invalide:', id);
      alert('ID hôpital invalide. Recharge la page.');
      return;
    }
  
    if (selectedFiles.length === 0) {
      alert('Veuillez sélectionner au moins un fichier');
      return;
    }
  
    setMediaLoading(true);
  
    try {
      // Upload chaque fichier individuellement via /api/upload
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('type', 'hospital_media');
        formData.append('entity_id', String(hospitalId));
        formData.append('file', file);
  
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        return await response.json();
      });
  
      const results = await Promise.all(uploadPromises);
      
      // Vérifier si tous les uploads ont réussi
      const failedUploads = results.filter(r => !r.success);
      
      if (failedUploads.length > 0) {
        console.error('Échecs d\'upload:', failedUploads);
        alert(`${failedUploads.length} fichier(s) n'ont pas pu être uploadés`);
      } else {
        alert('✅ Toutes les photos ont été ajoutées avec succès !');
      }
  
      // Recharger les médias et vider la sélection
      setSelectedFiles([]);
      loadMedia();
      
    } catch (err) {
      console.error('Erreur upload:', err);
      alert(`Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`);
    } finally {
      setMediaLoading(false);
    }
  };


  const deleteMedia = async (idMedia: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return;
  
    try {
      // On passe l'ID dans l'URL (?id=...) comme attendu par le PHP et le route.ts
      const response = await fetch(`/api/poto?id=${idMedia}`, {
        method: 'DELETE',
      });
  
      // On vérifie d'abord si la réponse est correcte
      const text = await response.text();
      let result;
      
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Retour serveur non JSON:", text);
        throw new Error("Le serveur n'a pas renvoyé de JSON valide");
      }
  
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la suppression');
      }
  
      // Si tout est ok, on recharge la liste
      alert('Média supprimé avec succès');
      loadMedia();
  
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const updateMediaOrder = async (idMedia: number, newOrder: number) => {
    try {
      const response = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_media: idMedia,
          ordre: newOrder,
        }),
      });

      if (response.ok) {
        loadMedia();
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'ordre:', err);
    }
  };

  const loadHotels = async () => {
    if (!id) return;
    setHotelsLoading(true);
    try {
      const response = await fetch(`/api/hotels?id_hospital=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Hotel[] = await response.json();
      setHotels(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des hôtels:', err);
      setError('Erreur lors du chargement des hôtels');
    } finally {
      setHotelsLoading(false);
    }
  };

  const openHotelModal = (hotel?: Hotel) => {
    if (hotel) {
      setEditingHotelId(hotel.id_hotel);
      setHotelForm({
        hotel_name: hotel.hotel_name || '',
        stars: String(hotel.stars || ''),
        adresse: hotel.adresse || '',
        hotel_website: hotel.hotel_website || 'http://',
        single_room_price: hotel.single_room_price ? String(hotel.single_room_price) : '',
        double_room_price: hotel.double_room_price ? String(hotel.double_room_price) : '',
      });
    } else {
      setEditingHotelId(null);
      setHotelForm({
        hotel_name: '',
        stars: '',
        adresse: '',
        hotel_website: 'http://',
        single_room_price: '',
        double_room_price: '',
      });
    }
    setHotelPhotoFile(null);
    setShowHotelModal(true);
  };

  const closeHotelModal = () => {
    setShowHotelModal(false);
    setEditingHotelId(null);
    setHotelPhotoFile(null);
    setHotelForm({
      hotel_name: '',
      stars: '',
      adresse: '',
      hotel_website: 'http://',
      single_room_price: '',
      double_room_price: '',
    });
  };

  const createHotel = async () => {
    if (!id) return;
    
    if (!hotelForm.hotel_name || !hotelForm.stars) {
      alert('Veuillez remplir les champs obligatoires (Hotel name, Stars)');
      return;
    }

    setHotelsLoading(true);
    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_hospital: Number(id),
          hotel_name: hotelForm.hotel_name,
          stars: Number(hotelForm.stars),
          adresse: hotelForm.adresse || null,
          hotel_website: hotelForm.hotel_website || null,
          single_room_price: hotelForm.single_room_price ? Number(hotelForm.single_room_price) : null,
          double_room_price: hotelForm.double_room_price ? Number(hotelForm.double_room_price) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🏨 CREATE HOTEL - Result:', result);
      alert(`📋 CREATE RESULT: ${JSON.stringify(result)}`);
      
      if (result.success) {
        const newHotelId = result.id || result.id_hotel; // L'API retourne "id" et non "id_hotel"
        alert(`🆔 New Hotel ID: ${newHotelId}`);
        
        // Upload photo si présente
        if (hotelPhotoFile && newHotelId) {
          alert(`📸 Uploading photo for hotel ID: ${newHotelId}, File: ${hotelPhotoFile.name}`);
          
          const photoFormData = new FormData();
          photoFormData.append('type', 'hotel_photo');
          photoFormData.append('entity_id', String(newHotelId));
          photoFormData.append('file', hotelPhotoFile);

          const photoResponse = await fetch('/api/upload', {
            method: 'POST',
            body: photoFormData,
          });

          const photoResult = await photoResponse.json();
          console.log('📸 PHOTO UPLOAD - Result:', photoResult);
          alert(`📸 UPLOAD RESULT: ${JSON.stringify(photoResult)}`);
          
          if (!photoResult.success) {
            console.warn('Photo upload failed:', photoResult);
            alert(`❌ Photo upload failed: ${photoResult.message || 'Unknown error'}`);
          } else {
            alert(`✅ Photo uploaded successfully!`);
          }
        } else {
          alert(`⚠️ No photo to upload. hotelPhotoFile: ${!!hotelPhotoFile}, newHotelId: ${newHotelId}`);
        }

        alert('✅ Hôtel créé avec succès');
        closeHotelModal();
        loadHotels();
      } else {
        alert(result.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'hôtel:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setHotelsLoading(false);
    }
  };

  const updateHotel = async () => {
    if (!editingHotelId) return;
    
    if (!hotelForm.hotel_name || !hotelForm.stars) {
      alert('Veuillez remplir les champs obligatoires (Hotel name, Stars)');
      return;
    }

    setHotelsLoading(true);
    try {
      // Upload photo si présente
      if (hotelPhotoFile) {
        alert(`📸 UPDATE: Uploading photo for hotel ID: ${editingHotelId}, File: ${hotelPhotoFile.name}`);
        
        const photoFormData = new FormData();
        photoFormData.append('type', 'hotel_photo');
        photoFormData.append('entity_id', String(editingHotelId));
        photoFormData.append('file', hotelPhotoFile);

        const photoResponse = await fetch('/api/upload', {
          method: 'POST',
          body: photoFormData,
        });

        const photoResult = await photoResponse.json();
        console.log('📸 UPDATE PHOTO - Result:', photoResult);
        alert(`📸 UPLOAD RESULT: ${JSON.stringify(photoResult)}`);
        
        if (!photoResult.success) {
          console.warn('Photo upload failed:', photoResult);
          alert(`❌ Photo upload failed: ${photoResult.message || 'Unknown error'}`);
        } else {
          alert(`✅ Photo uploaded successfully!`);
        }
      } else {
        alert(`⚠️ UPDATE: No photo to upload. hotelPhotoFile: ${!!hotelPhotoFile}`);
      }

      alert(`🔄 Updating hotel data for ID: ${editingHotelId}`);
      
      const response = await fetch('/api/hotels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_hotel: editingHotelId,
          hotel_name: hotelForm.hotel_name,
          stars: Number(hotelForm.stars),
          adresse: hotelForm.adresse || null,
          hotel_website: hotelForm.hotel_website || null,
          single_room_price: hotelForm.single_room_price ? Number(hotelForm.single_room_price) : null,
          double_room_price: hotelForm.double_room_price ? Number(hotelForm.double_room_price) : null,
        }),
      });

      console.log('🏨 UPDATE HOTEL - Response status:', response.status);
      alert(`📡 API Response Status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        console.error('🏨 UPDATE HOTEL - Error:', errorData);
        alert(`❌ API ERROR: ${JSON.stringify(errorData)}`);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🏨 UPDATE HOTEL - Result:', result);
      alert(`📋 UPDATE RESULT: ${JSON.stringify(result)}`);
      
      if (result.success) {
        alert('✅ Hôtel mis à jour avec succès');
        closeHotelModal();
        loadHotels();
      } else {
        alert(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'hôtel:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setHotelsLoading(false);
    }
  };

  const deleteHotel = async (idHotel: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) return;

    setHotelsLoading(true);
    try {
      const response = await fetch('/api/hotels', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_hotel: idHotel }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        alert('✅ Hôtel supprimé avec succès');
        loadHotels();
      } else {
        alert(result.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setHotelsLoading(false);
    }
  };

  // ========== CASE MANAGERS FUNCTIONS ==========
  const loadCaseManagers = async () => {
    if (!id) return;
    setCaseManagersLoading(true);
    try {
      const response = await fetch(`/api/case-managers?id_hospital=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CaseManager[] = await response.json();
      setCaseManagers(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des case managers:', err);
      setError('Erreur lors du chargement des case managers');
    } finally {
      setCaseManagersLoading(false);
    }
  };

  const openCaseManagerModal = (caseManager?: CaseManager) => {
    if (caseManager) {
      setEditingCaseManagerId(caseManager.id_case_manager);
      setCaseManagerForm({
        fullname: caseManager.fullname || '',
        email: caseManager.email || '',
        phone: caseManager.phone || '',
        countries_concerned: caseManager.countries_concerned 
          ? (typeof caseManager.countries_concerned === 'string' 
              ? caseManager.countries_concerned.includes(',') 
                ? caseManager.countries_concerned.split(',').map(c => c.trim())
                : [caseManager.countries_concerned]
              : [])
          : [],
      });
      setCaseManagerPhoto(null);
    } else {
      setEditingCaseManagerId(null);
      setCaseManagerForm({
        fullname: '',
        email: '',
        phone: '',
        countries_concerned: [],
      });
      setCaseManagerPhoto(null);
    }
    setShowCaseManagerModal(true);
  };

  const closeCaseManagerModal = () => {
    setShowCaseManagerModal(false);
    setEditingCaseManagerId(null);
    setCaseManagerForm({
      fullname: '',
      email: '',
      phone: '',
      countries_concerned: [],
    });
    setCaseManagerPhoto(null);
  };

  const createCaseManager = async () => {
    if (!id) return;
    
    if (!caseManagerForm.fullname || !caseManagerForm.email || !caseManagerForm.phone) {
      alert('Veuillez remplir les champs obligatoires (Fullname, Email, Phone)');
      return;
    }

    setCaseManagersLoading(true);
    try {
      // Créer le case manager
      const response = await fetch('/api/case-managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_hospital: Number(id),
          fullname: caseManagerForm.fullname,
          email: caseManagerForm.email,
          phone: caseManagerForm.phone,
          countries_concerned: caseManagerForm.countries_concerned.length > 0 
            ? caseManagerForm.countries_concerned.join(',')
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        const newId = result.id;
        
        // Upload photo si sélectionnée via /api/upload
        if (caseManagerPhoto && newId) {
          const formData = new FormData();
          formData.append('type', 'casemanager_photo');
          formData.append('entity_id', String(newId));
          formData.append('file', caseManagerPhoto);

          const photoResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const uploadResult = await photoResponse.json();
          if (!uploadResult.success) {
            console.warn('Photo upload failed:', uploadResult);
            alert(`⚠️ Case manager créé mais erreur lors de l'upload de la photo: ${uploadResult.message || 'Erreur inconnue'}`);
          }
        }

        alert('✅ Case manager créé avec succès');
        closeCaseManagerModal();
        loadCaseManagers();
      } else {
        alert(result.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error('Erreur lors de la création du case manager:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setCaseManagersLoading(false);
    }
  };

  const updateCaseManager = async () => {
    if (!editingCaseManagerId) return;
    
    if (!caseManagerForm.fullname || !caseManagerForm.email || !caseManagerForm.phone) {
      alert('Veuillez remplir les champs obligatoires (Fullname, Email, Phone)');
      return;
    }

    setCaseManagersLoading(true);
    try {
      // Mettre à jour le case manager
      const response = await fetch('/api/case-managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id_case_manager: editingCaseManagerId,
          fullname: caseManagerForm.fullname,
          email: caseManagerForm.email,
          phone: caseManagerForm.phone,
          countries_concerned: caseManagerForm.countries_concerned.length > 0 
            ? caseManagerForm.countries_concerned.join(',')
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Upload photo si sélectionnée via /api/upload
        if (caseManagerPhoto && editingCaseManagerId) {
          const formData = new FormData();
          formData.append('type', 'casemanager_photo');
          formData.append('entity_id', String(editingCaseManagerId));
          formData.append('file', caseManagerPhoto);

          const photoResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const uploadResult = await photoResponse.json();
          if (!uploadResult.success) {
            console.warn('Photo upload failed:', uploadResult);
            alert(`⚠️ Case manager mis à jour mais erreur lors de l'upload de la photo: ${uploadResult.message || 'Erreur inconnue'}`);
          }
        }

        alert('✅ Case manager mis à jour avec succès');
        closeCaseManagerModal();
        loadCaseManagers();
      } else {
        alert(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du case manager:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setCaseManagersLoading(false);
    }
  };

  const deleteCaseManager = async (idCaseManager: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce case manager ?')) return;

    setCaseManagersLoading(true);
    try {
      const response = await fetch('/api/case-managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id_case_manager: idCaseManager }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        alert('✅ Case manager supprimé avec succès');
        loadCaseManagers();
      } else {
        alert(result.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setCaseManagersLoading(false);
    }
  };

// ========== DOCTORS FUNCTIONS ==========
const loadDoctors = async () => {
  if (!id) return;
  setDoctorsLoading(true);
  try {
    const response = await fetch(`/api/doctors?id_hospital=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Doctor[] = await response.json();
    setDoctors(data || []);
  } catch (err) {
    console.error('Erreur lors du chargement des docteurs:', err);
    setError('Erreur lors du chargement des docteurs');
  } finally {
    setDoctorsLoading(false);
  }
};

const openDoctorModal = (doctor?: Doctor) => {
  // INFO DEBUG
  console.log("Opening Modal - Data received:", doctor);

  if (doctor) {
    setEditingDoctorId(doctor.id_medecin);
    setEditingDoctor(doctor);
    setDoctorForm({
      nom_medecin: doctor.nom_medecin || '',
      email: doctor.email || '',
      telephone: doctor.telephone || '',
      specialite: doctor.specialite || '',
      langues: doctor.langues 
        ? (doctor.langues.includes(',') 
            ? doctor.langues.split(',').map(l => l.trim())
            : [doctor.langues])
        : [],
      description: doctor.description || '',
      note: doctor.note || 5,
      sexe: doctor.sexe || 'M',
      nationalite: doctor.nationalite || '',
      qualifications: doctor.qualifications || '',
      experience_years: doctor.experience_years || 0,
      realisations: doctor.realisations || '',
      is_active: doctor.is_active ?? 1
    });
    setDoctorPhoto(null);
    setDoctorCV(null);
  } else {
    setEditingDoctorId(null);
    setEditingDoctor(null);
    setDoctorForm({
      nom_medecin: '',
      email: '',
      telephone: '',
      specialite: '',
      langues: [],
      description: '',
      note: 5,
      sexe: 'M',
      nationalite: '',
      qualifications: '',
      experience_years: 0,
      realisations: '',
      is_active: 1
    });
    setDoctorPhoto(null);
    setDoctorCV(null);
  }
  setShowDoctorModal(true);
};

const closeDoctorModal = () => {
  setShowDoctorModal(false);
  setEditingDoctorId(null);
  setEditingDoctor(null);
  setDoctorPhoto(null);
  setDoctorCV(null);
};

const createDoctor = async () => {
  if (!id) return;
  
  if (!doctorForm.nom_medecin) {
    alert('Veuillez remplir le champ obligatoire (Full name)');
    return;
  }

  setDoctorsLoading(true);
  try {
    // Créer le docteur avec TOUS les champs
    const response = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_hospital: Number(id),
        ...doctorForm,
        langues: doctorForm.langues.length > 0 ? doctorForm.langues.join(',') : null,
        note: Number(doctorForm.note),
        experience_years: Number(doctorForm.experience_years),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      const newId = result.id || result.id_medecin;
      
      // Upload photo et CV via /api/upload
      if (doctorPhoto) {
        const photoFormData = new FormData();
        photoFormData.append('type', 'doctor_photo');
        photoFormData.append('entity_id', String(newId));
        photoFormData.append('file', doctorPhoto);

        const photoResponse = await fetch('/api/upload', {
          method: 'POST',
          body: photoFormData,
        });

        const photoResult = await photoResponse.json();
        if (!photoResult.success) {
          console.warn('Photo upload failed:', photoResult);
        }
      }

      if (doctorCV) {
        const cvFormData = new FormData();
        cvFormData.append('type', 'doctor_cv');
        cvFormData.append('entity_id', String(newId));
        cvFormData.append('file', doctorCV);

        const cvResponse = await fetch('/api/upload', {
          method: 'POST',
          body: cvFormData,
        });

        const cvResult = await cvResponse.json();
        if (!cvResult.success) {
          console.warn('CV upload failed:', cvResult);
        }
      }

      alert('✅ Docteur créé avec succès');
      closeDoctorModal();
      loadDoctors();
    } else {
      alert(result.error || 'Erreur lors de la création');
    }
  } catch (err) {
    console.error('Erreur:', err);
    alert('Erreur lors de la création');
  } finally {
    setDoctorsLoading(false);
  }
};

const updateDoctor = async () => {
  if (!editingDoctorId || !id) return;
  
  // DEBUG INFO
  console.log("DEBUG UPDATE - IDs:", { hospital: id, doctor: editingDoctorId });

  if (!doctorForm.nom_medecin) {
    alert('Veuillez remplir le champ obligatoire (Full name)');
    return;
  }

  setDoctorsLoading(true);
  try {
    const response = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        id_medecin: editingDoctorId,
        id_hospital: Number(id),
        ...doctorForm,
        langues: doctorForm.langues.length > 0 ? doctorForm.langues.join(',') : null,
        note: Number(doctorForm.note),
        experience_years: Number(doctorForm.experience_years),
      }),
    });

    if (!response.ok) throw new Error('Erreur lors de la mise à jour');

    const result = await response.json();
    if (result.success) {
      // Upload photo et CV via /api/upload
      if (doctorPhoto) {
        const photoFormData = new FormData();
        photoFormData.append('type', 'doctor_photo');
        photoFormData.append('entity_id', String(editingDoctorId));
        photoFormData.append('file', doctorPhoto);

        const photoResponse = await fetch('/api/upload', {
          method: 'POST',
          body: photoFormData,
        });

        const photoResult = await photoResponse.json();
        if (!photoResult.success) {
          console.warn('Photo upload failed:', photoResult);
        }
      }

      if (doctorCV) {
        const cvFormData = new FormData();
        cvFormData.append('type', 'doctor_cv');
        cvFormData.append('entity_id', String(editingDoctorId));
        cvFormData.append('file', doctorCV);

        const cvResponse = await fetch('/api/upload', {
          method: 'POST',
          body: cvFormData,
        });

        const cvResult = await cvResponse.json();
        if (!cvResult.success) {
          console.warn('CV upload failed:', cvResult);
        }
      }

      alert('✅ Docteur mis à jour avec succès');
      closeDoctorModal();
      loadDoctors();
    } else {
      alert(result.error || 'Erreur lors de la mise à jour');
    }
  } catch (err) {
    console.error('Erreur update:', err);
    alert('Erreur lors de la mise à jour');
  } finally {
    setDoctorsLoading(false);
  }
};

const deleteDoctor = async (idDoctor: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce docteur ?')) return;

  setDoctorsLoading(true);
  try {
    const response = await fetch('/api/doctors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_medecin: idDoctor }),
    });

    if (response.ok) {
      alert('✅ Docteur supprimé avec succès');
      loadDoctors();
    }
  } catch (err) {
    console.error('Erreur suppression:', err);
  } finally {
    setDoctorsLoading(false);
  }
};






  const [logoFile, setLogoFile] = useState<File | null>(null);

  const updateHospital = async () => {
    if (!hospital) return;
    
    setLoading(true);
    setError(null);

    try {
      // Upload logo via /api/upload (met à jour automatiquement la DB)
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append('type', 'hospital_logo');
        logoFormData.append('entity_id', String(id));
        logoFormData.append('file', logoFile);

        const logoResponse = await fetch('/api/upload', {
          method: 'POST',
          body: logoFormData,
        });

        const logoResult = await logoResponse.json();
        if (!logoResult.success) {
          throw new Error(logoResult.message || "Erreur lors de l'upload du logo");
        }
        // ✅ L'API PHP met automatiquement à jour le champ 'logo' dans la DB
      }

      // Mettre à jour les autres données (sauf logo qui est géré par l'upload)
      const { id_hospital, logo, ...hospitalData } = hospital;
      const response = await fetch('/api/hospitals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_hospital: Number(id),
          ...hospitalData,
          is_active: showOnline ? 1 : 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Hôpital mis à jour avec succès');
        setLogoFile(null);
        router.refresh();
      } else {
        setError(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FONCTIONS CRUD POUR L'ONGLET ACCES (USERS)
  // ============================================

  const loadUsers = async () => {
    if (!id) return;
    setUsersLoading(true);
    try {
      const response = await fetch(`/api/users?id_hospital=${id}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (err) {
      console.error('Erreur chargement users:', err);
    } finally {
      setUsersLoading(false);
    }
  };


  const openAddUserModal = () => {
    setUserForm({
      username: '',
      email: '',
      password: '',
      nom: '',
      prenom: '',
      telephone: '',
      is_active: 1
    });
    setShowAddUserModal(true);
  };

  const openEditUserModal = (user: any) => {
    setEditingUser(user);
    setUserForm({
      username: user.username || '',
      email: user.email || '',
      password: '', // Ne pas pré-remplir le mot de passe
      nom: user.nom || '',
      prenom: user.prenom || '',
      telephone: user.telephone || '',
      is_active: user.is_active || 1
    });
    setShowEditUserModal(true);
  };

  const closeUserModals = () => {
    setShowAddUserModal(false);
    setShowEditUserModal(false);
    setEditingUser(null);
    setUserForm({
      username: '',
      email: '',
      password: '',
      nom: '',
      prenom: '',
      telephone: '',
      is_active: 1
    });
  };

  const createUser = async () => {
    if (!userForm.username || !userForm.email || !id) {
      alert('Username et Email sont obligatoires');
      return;
    }

    setUsersLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...userForm,
          id_role: 4,
          system: 'A',
          id_hospital: Number(id)
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('✅ Utilisateur créé avec succès');
        closeUserModals();
        loadUsers();
      } else {
        alert(result.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error('Erreur création user:', err);
      alert('Erreur lors de la création');
    } finally {
      setUsersLoading(false);
    }
  };

  const updateUser = async () => {
    if (!editingUser || !userForm.username || !userForm.email || !id) {
      alert('Username et Email sont obligatoires');
      return;
    }

    setUsersLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id_user: editingUser.id_user,
          ...userForm,
          id_role: 4,
          system: 'A',
          id_hospital: Number(id)
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('✅ Utilisateur mis à jour avec succès');
        closeUserModals();
        loadUsers();
      } else {
        alert(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur update user:', err);
      alert('Erreur lors de la mise à jour');
    } finally {
      setUsersLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    setUsersLoading(true);
    try {
      const response = await fetch(`/api/users?id=${userId}&id_hospital=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        alert('✅ Utilisateur supprimé avec succès');
        loadUsers();
      } else {
        alert(result.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur suppression user:', err);
      alert('Erreur lors de la suppression');
    } finally {
      setUsersLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !hospital) {
    return (
      <div className="p-6">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
        <Link href="/dashboard1/Hopitaux" className="text-blue-600 hover:underline">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="p-6">
        <p className="text-gray-600 mb-4">Aucun hôpital trouvé.</p>
        <Link href="/dashboard1/Hopitaux" className="text-blue-600 hover:underline">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  const tabs: Tab[] = ['Profile', 'Acces', 'Media', 'Treatments', 'Doctors', 'Notifications', 'Case Managers', 'Hotels', 'Reviews'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard1/Hopitaux" className="text-blue-600 hover:underline">
              ← Retour
            </Link>
            <h1 className="text-2xl font-bold">{hospital.nom || 'nom de l\'hopital'}</h1>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnline}
              onChange={(e) => setShowOnline(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Show online</span>
          </label>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'Profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Adress*" 
              value={hospital.adresse || ''}
              onChange={v => setHospital({ ...hospital, adresse: v })} 
              required
            />

            <Input 
              label="City*" 
              value={hospital.ville || ''}
              onChange={v => setHospital({ ...hospital, ville: v })} 
              required
            />

            <Input 
              label="Latitude" 
              value={hospital.latitude || ''}
              onChange={v => setHospital({ ...hospital, latitude: v })} 
              type="number"
            />

            <Input 
              label="Longitude" 
              value={hospital.longitude || ''}
              onChange={v => setHospital({ ...hospital, longitude: v })} 
              type="number"
            />

            <div>
              <label className="block text-sm font-semibold mb-1">Pays*</label>
              <select
                className="w-full border p-2 rounded"
                value={hospital.pays || ''}
                onChange={(e) => setHospital({ ...hospital, pays: e.target.value })}
                required
              >
                <option value="">-- Sélectionner un pays --</option>
                {countriesData.countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <Input 
              label="Nom du gérant" 
              value={hospital.nom_gerant || ''}
              onChange={v => setHospital({ ...hospital, nom_gerant: v })} 
            />

            <Input 
              label="Téléphone" 
              value={hospital.telephone || ''}
              onChange={v => setHospital({ ...hospital, telephone: v })} 
            />

            <Input 
              label="Email" 
              value={hospital.email || ''}
              onChange={v => setHospital({ ...hospital, email: v })} 
              type="email"
            />

            <Input 
              label="Site web" 
              value={hospital.website || ''}
              onChange={v => setHospital({ ...hospital, website: v })} 
              type="url"
            />

            <Input 
              label="Note Google" 
              value={hospital.note_google ? String(hospital.note_google) : ''}
              onChange={v => setHospital({ ...hospital, note_google: Number(v) || 0 })} 
              type="number"
              step="0.1"
              min="0"
              max="5"
            />


            <FileInput 
              label="Logo" 
              value={hospital.logo || ''}
              onChange={v => setHospital({ ...hospital, logo: v })}
              onFileSelect={setLogoFile}
              currentFile={logoFile}
            />

            <div>
              <label className="block text-sm font-semibold mb-1">Certifications</label>
              <input
                className="w-full border p-2 rounded"
                value={hospital.certifications || ''}
                onChange={(e) => setHospital({ ...hospital, certifications: e.target.value })}
                placeholder="Ex: ISO9001, ASM14001"
              />
              <p className="text-xs text-gray-500 mt-1">Entrez les certifications séparées par des virgules</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Description de l'hôpital"
                value={hospital.description || ''}
                onChange={e => setHospital({ ...hospital, description: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard1/Hopitaux"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Link>
            <button
              onClick={updateHospital}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : '💾 Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* Acces Tab - Gestion des Utilisateurs */}
      {activeTab === 'Acces' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Gestion des Accès Utilisateurs</h2>
            <button
              onClick={openAddUserModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
            >
              <span className="text-lg">+</span> Ajouter un utilisateur
            </button>
          </div>

          {usersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold">ID</th>
                    <th className="p-3 text-left text-sm font-semibold">Username</th>
                    <th className="p-3 text-left text-sm font-semibold">Email</th>
                    <th className="p-3 text-left text-sm font-semibold">Nom</th>
                    <th className="p-3 text-left text-sm font-semibold">Prénom</th>
                    <th className="p-3 text-left text-sm font-semibold">Téléphone</th>
                    <th className="p-3 text-left text-sm font-semibold">Status</th>
                    <th className="p-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        Aucun utilisateur trouvé pour cet hôpital
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id_user} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{user.id_user}</td>
                        <td className="p-3 text-sm font-medium">{user.username}</td>
                        <td className="p-3 text-sm">{user.email}</td>
                        <td className="p-3 text-sm">{user.nom || '-'}</td>
                        <td className="p-3 text-sm">{user.prenom || '-'}</td>
                        <td className="p-3 text-sm">{user.telephone || '-'}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.is_active === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active === 1 ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditUserModal(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteUser(user.id_user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Ajouter un utilisateur</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Username *</label>
                <input
                  className="w-full border p-2 rounded"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  className="w-full border p-2 rounded"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Mot de passe *</label>
                <input
                  type="password"
                  className="w-full border p-2 rounded"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nom</label>
                <input
                  className="w-full border p-2 rounded"
                  value={userForm.nom}
                  onChange={(e) => setUserForm({ ...userForm, nom: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Prénom</label>
                <input
                  className="w-full border p-2 rounded"
                  value={userForm.prenom}
                  onChange={(e) => setUserForm({ ...userForm, prenom: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Téléphone</label>
                <input
                  className="w-full border p-2 rounded"
                  value={userForm.telephone}
                  onChange={(e) => setUserForm({ ...userForm, telephone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={userForm.is_active}
                  onChange={(e) => setUserForm({ ...userForm, is_active: Number(e.target.value) })}
                >
                  <option value="1">Actif</option>
                  <option value="0">Inactif</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeUserModals}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={createUser}
                disabled={usersLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {usersLoading ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Modifier l'utilisateur</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Username *</label>
                <input
                  className="w-full border p-2 rounded"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  className="w-full border p-2 rounded"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                <input
                  type="password"
                  className="w-full border p-2 rounded"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="Laisser vide pour garder l'ancien"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nom</label>
                <input
                  className="w-full border p-2 rounded"
                  value={userForm.nom}
                  onChange={(e) => setUserForm({ ...userForm, nom: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Prénom</label>
                <input
                  className="w-full border p-2 rounded"
                  value={userForm.prenom}
                  onChange={(e) => setUserForm({ ...userForm, prenom: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Téléphone</label>
                <input
                  className="w-full border p-2 rounded"
                  value={userForm.telephone}
                  onChange={(e) => setUserForm({ ...userForm, telephone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={userForm.is_active}
                  onChange={(e) => setUserForm({ ...userForm, is_active: Number(e.target.value) })}
                >
                  <option value="1">Actif</option>
                  <option value="0">Inactif</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeUserModals}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={updateUser}
                disabled={usersLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {usersLoading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Treatments Tab */}
      {activeTab === 'Treatments' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Traitements disponibles</h2>
            <div className="flex gap-2">
              <button
                onClick={openAddProcedureModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                + Ajouter
              </button>
              <button
                onClick={loadTreatments}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                ↻ Actualiser
              </button>
            </div>
          </div>

          {treatmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : treatments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun traitement disponible pour cet hôpital</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Procédure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée séjour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mis à jour
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {treatments.map((treatment) => (
                    <tr key={treatment.id_relation} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {treatment.nom_procedure || `Procédure #${treatment.id_procedure}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {treatment.prix_base} {treatment.devise || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {treatment.duree_sejour ? `${treatment.duree_sejour} jour(s)` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md">
                          {treatment.description_specifique || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          treatment.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {treatment.is_active ? '✅ Actif' : '⛔ Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {treatment.updated_at 
                            ? new Date(treatment.updated_at).toLocaleDateString('fr-FR')
                            : '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'Media' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Existing Media */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Photos</h2>
              {mediaLoading ? (
                <div className="text-center py-8 text-gray-500">Chargement...</div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Media</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {media.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                            Aucune photo disponible
                          </td>
                        </tr>
                      ) : (
                        media.map((item, index) => (
                          <tr key={item.id_media} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <button
                                onClick={() => updateMediaOrder(item.id_media, index + 1)}
                                className="text-gray-400 hover:text-gray-600"
                                title="Réordonner"
                              >
                                +
                              </button>
                            </td>
                            <td className="px-4 py-3">
                          <img
  src={
    item.path 
      ? `https://pro.medotra.com/${item.path.replace(/^\//, '')}` 
      : 'https://via.placeholder.com/100'
  }
  alt={item.nom || 'Media'}
  className="w-20 h-20 object-cover rounded"
  onError={(e) => {
    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
  }}
/>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.langue === 'all' ? 'All' : item.langue || 'All'}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => deleteMedia(item.id_media)}
                                className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-700 rounded hover:bg-red-200"
                                title="Supprimer"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Panel - Upload */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Upload your media files</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setSelectedFiles(files);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={mediaLangue}
                    onChange={(e) => setMediaLangue(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="all">All</option>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <button
                  onClick={uploadMedia}
                  disabled={selectedFiles.length === 0 || mediaLoading}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add photos
                </button>
                {selectedFiles.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {selectedFiles.length} fichier(s) sélectionné(s)
                  </div>
                )}
                <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
                  <div>Minimum dimensions (800x600)</div>
                  <div>Supported format: jpg, jpeg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hotels Tab */}
      {activeTab === 'Hotels' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Hôtels</h2>
            <button
              onClick={() => openHotelModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-sm hover:shadow-md transition-shadow"
            >
              + Add a hotel
            </button>
          </div>

          {hotelsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun hôtel enregistré pour cet hôpital</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hotel name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stars
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Single Room / Night
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Double Room / Night
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.map((hotel) => (
                    <tr key={hotel.id_hotel} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{hotel.hotel_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {'⭐'.repeat(hotel.stars || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{hotel.adresse || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hotel.hotel_website ? (
                          <a
                            href={hotel.hotel_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {hotel.hotel_website}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {hotel.single_room_price ? `${hotel.single_room_price} EUR` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {hotel.double_room_price ? `${hotel.double_room_price} EUR` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openHotelModal(hotel)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium"
                          >
                            Éditer
                          </button>
                          <button
                            onClick={() => deleteHotel(hotel.id_hotel)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium"
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
          )}
        </div>
      )}

      {/* Hotel Modal - Modern Design */}
      {showHotelModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200"
          onClick={closeHotelModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 border-b border-blue-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingHotelId ? '✏️ Edit hotel' : '➕ Add a hotel'}
                </h2>
                <button
                  onClick={closeHotelModal}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body avec scroll */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hotel name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Enter hotel name"
                    value={hotelForm.hotel_name}
                    onChange={(e) => setHotelForm({ ...hotelForm, hotel_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stars <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="w-24 border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      value={hotelForm.stars}
                      onChange={(e) => setHotelForm({ ...hotelForm, stars: e.target.value })}
                      required
                    />
                    {hotelForm.stars && (
                      <div className="flex gap-1 text-yellow-400 text-xl">
                        {'⭐'.repeat(Number(hotelForm.stars) || 0)}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Enter hotel address"
                    value={hotelForm.adresse}
                    onChange={(e) => setHotelForm({ ...hotelForm, adresse: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hotel Website Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="http://"
                    value={hotelForm.hotel_website}
                    onChange={(e) => setHotelForm({ ...hotelForm, hotel_website: e.target.value })}
                    required
                  />
                </div>

                <div className="border-t-2 border-gray-100 pt-5">
                  <p className="text-sm font-semibold text-gray-700 mb-4">
                    💰 If Booking Hotel is not included in the quote, prices are:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Single Room Price / Night
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="flex-1 border-2 border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                          placeholder="0.00"
                          value={hotelForm.single_room_price}
                          onChange={(e) => setHotelForm({ ...hotelForm, single_room_price: e.target.value })}
                        />
                        <span className="text-sm font-medium text-gray-600 bg-white px-3 py-2.5 rounded-lg border-2 border-gray-200">EUR</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Double Room Price / Night
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="flex-1 border-2 border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                          placeholder="0.00"
                          value={hotelForm.double_room_price}
                          onChange={(e) => setHotelForm({ ...hotelForm, double_room_price: e.target.value })}
                        />
                        <span className="text-sm font-medium text-gray-600 bg-white px-3 py-2.5 rounded-lg border-2 border-gray-200">EUR</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="border-t-2 border-gray-100 pt-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">📷 Photo de l'hôtel</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setHotelPhotoFile(file);
                      }}
                      className="flex-1 border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
                    />
                    {hotelPhotoFile && (
                      <span className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                        ✓ {hotelPhotoFile.name}
                      </span>
                    )}
                  </div>
                  {hotelPhotoFile && (
                    <div className="mt-3">
                      <img
                        src={URL.createObjectURL(hotelPhotoFile)}
                        alt="Preview"
                        className="h-32 w-auto rounded-lg border-2 border-gray-200 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer avec boutons modernes */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeHotelModal}
                  className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={editingHotelId ? updateHotel : createHotel}
                  disabled={hotelsLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  {hotelsLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </span>
                  ) : (
                    editingHotelId ? '💾 Update' : '✨ Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Managers Tab */}
      {activeTab === 'Case Managers' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">List of case managers</h2>
            <button
              onClick={() => openCaseManagerModal()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm shadow-sm hover:shadow-md transition-shadow"
            >
              + Add a case manager
            </button>
          </div>

          {caseManagersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : caseManagers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun case manager enregistré pour cet hôpital</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="mb-4 text-sm text-gray-600">
                {caseManagers.length} Manager{caseManagers.length > 1 ? 's' : ''} found
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Countries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {caseManagers.map((cm) => (
                    <tr key={cm.id_case_manager} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {cm.profile_photo ? (
                            <img
                              src={`https://pro.medotra.com/${cm.profile_photo}`}
                              alt={cm.fullname}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(cm.fullname);
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                              {cm.fullname.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">{cm.fullname}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{cm.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{cm.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {cm.countries_concerned 
                            ? (cm.countries_concerned.includes(',') 
                                ? cm.countries_concerned.split(',').map(c => c.trim()).join(', ')
                                : cm.countries_concerned)
                            : 'All countries'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openCaseManagerModal(cm)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Éditer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteCaseManager(cm.id_case_manager)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Case Manager Modal - Modern Design */}
      {showCaseManagerModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200"
          onClick={closeCaseManagerModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec gradient vert */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 border-b border-green-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingCaseManagerId ? '✏️ Edit case manager' : '➕ Add a new case manager'}
                </h2>
                <button
                  onClick={closeCaseManagerModal}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body avec scroll */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Case Manager Fullname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    placeholder="Enter full name"
                    value={caseManagerForm.fullname}
                    onChange={(e) => setCaseManagerForm({ ...caseManagerForm, fullname: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    placeholder="Enter email address"
                    value={caseManagerForm.email}
                    onChange={(e) => setCaseManagerForm({ ...caseManagerForm, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    placeholder="Enter phone number"
                    value={caseManagerForm.phone}
                    onChange={(e) => setCaseManagerForm({ ...caseManagerForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile photo <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                      value={caseManagerPhoto ? caseManagerPhoto.name : 'No file selected'}
                      readOnly
                      placeholder="Select a photo"
                    />
                    <input
                      type="file"
                      id="case-manager-photo"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCaseManagerPhoto(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="case-manager-photo"
                      className="px-4 py-3 bg-gray-100 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-all cursor-pointer font-medium"
                    >
                      Browse
                    </label>
                  </div>
                  {caseManagerPhoto && (
                    <div className="mt-2 text-xs text-green-600">
                      Fichier sélectionné: {caseManagerPhoto.name} ({(caseManagerPhoto.size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500">Minimum dimensions (300x300)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    The countries concerned <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto">
                    {caseManagerForm.countries_concerned.length === 0 ? (
                      <p className="text-sm text-gray-400">Nothing selected</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {caseManagerForm.countries_concerned.map((country) => (
                          <span
                            key={country}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {country}
                            <button
                              onClick={() => {
                                setCaseManagerForm({
                                  ...caseManagerForm,
                                  countries_concerned: caseManagerForm.countries_concerned.filter(c => c !== country),
                                });
                              }}
                              className="hover:text-green-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <select
                    className="mt-2 w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    onChange={(e) => {
                      const selected = e.target.value;
                      if (selected && !caseManagerForm.countries_concerned.includes(selected)) {
                        setCaseManagerForm({
                          ...caseManagerForm,
                          countries_concerned: [...caseManagerForm.countries_concerned, selected],
                        });
                      }
                      e.target.value = ''; // Reset select
                    }}
                  >
                    <option value="">Select a country...</option>
                    {COUNTRIES.filter(c => !caseManagerForm.countries_concerned.includes(c)).map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer avec boutons modernes */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeCaseManagerModal}
                  className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={editingCaseManagerId ? updateCaseManager : createCaseManager}
                  disabled={caseManagersLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  {caseManagersLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </span>
                  ) : (
                    editingCaseManagerId ? '💾 Update' : '✨ Add'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Tab */}
      {activeTab === 'Doctors' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Doctors</h2>
            <button
              onClick={() => openDoctorModal()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm shadow-sm hover:shadow-md transition-shadow"
            >
              + Add a doctor
            </button>
          </div>

          {doctorsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun docteur enregistré pour cet hôpital</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Speciality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Languages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id_medecin} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doctor.nom_medecin}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.photo ? (
                          <img
                            src={getDoctorMediaUrl(doctor.photo) || ''}
                            alt={doctor.nom_medecin}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(doctor.nom_medecin);
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                            {doctor.nom_medecin.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{doctor.specialite || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {doctor.langues || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{doctor.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{doctor.telephone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDoctorModal(doctor)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Éditer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteDoctor(doctor.id_medecin)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

   {/* Doctor Modal - Modern Design */}
{showDoctorModal && (
  <div 
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200"
    onClick={closeDoctorModal}
  >
    <div 
      className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header avec gradient vert */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 border-b border-green-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editingDoctorId ? '✏️ Edit a doctor' : '➕ Add a doctor'}
            </h2>
            {/* Debug Info visible uniquement pour le développement */}
            <p className="text-green-200 text-xs mt-1 font-mono">
              Hosp ID: {id} | Doc ID: {editingDoctorId || 'New'}
            </p>
          </div>
          <button
            onClick={closeDoctorModal}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body avec scroll */}
      <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-white">
        
        {/* Section 1: Informations de base */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider border-b pb-1">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
              placeholder="Dr. John Doe"
              value={doctorForm.nom_medecin}
              onChange={(e) => setDoctorForm({ ...doctorForm, nom_medecin: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sexe</label>
              <select
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                value={doctorForm.sexe || 'M'}
                onChange={(e) => setDoctorForm({ ...doctorForm, sexe: e.target.value })}
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nationalité</label>
              <select
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                value={doctorForm.nationalite || ''}
                onChange={(e) => setDoctorForm({ ...doctorForm, nationalite: e.target.value })}
              >
                <option value="">-- Sélectionner un pays --</option>
                {countriesData.countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Spécialité */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider border-b pb-1">Professional Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="doctor@example.com"
                value={doctorForm.email}
                onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
              <input
                type="tel"
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="+33..."
                value={doctorForm.telephone}
                onChange={(e) => setDoctorForm({ ...doctorForm, telephone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Spécialité</label>
              <select
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                value={doctorForm.specialite}
                onChange={(e) => setDoctorForm({ ...doctorForm, specialite: e.target.value })}
              >
                <option value="">Sélectionner</option>
                {doctorCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
         
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Années d'expérience</label>
              <input
                type="number"
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                value={doctorForm.experience_years}
                onChange={(e) => setDoctorForm({ ...doctorForm, experience_years: Number(e.target.value) })}
              />
            </div>
          
          </div>
        </div>

        {/* Section 3: Biographie & Réalisations */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider border-b pb-1">Biography & Achievements</h3>
         
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Qualifications</label>
              <textarea
              rows={2}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Diplômes, Certificats..."
                 value={doctorForm.qualifications}
                onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
              />
            </div>
         <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description / Bio</label>
            <textarea
              rows={3}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Parlez-nous du parcours du docteur..."
              value={doctorForm.description}
              onChange={(e) => setDoctorForm({ ...doctorForm, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Réalisations majeures</label>
            <textarea
              rows={2}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Opérations réussies, prix, récompenses..."
              value={doctorForm.realisations}
              onChange={(e) => setDoctorForm({ ...doctorForm, realisations: e.target.value })}
            />
          </div>
      
        </div>

        {/* Section 4: Médias (Photo & CV) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider border-b pb-1">Media Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Photo</label>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  {doctorPhoto ? (
                    <img src={URL.createObjectURL(doctorPhoto)} className="h-full w-full object-cover rounded-xl" />
                  ) : editingDoctor?.photo ? (
                    <img src={getDoctorMediaUrl(editingDoctor.photo) || ''} className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <p className="text-xs text-gray-500">Click to upload</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && setDoctorPhoto(e.target.files[0])} />
                </label>
                {(doctorPhoto || editingDoctor?.photo) && <p className="text-[10px] text-center text-green-600">Photo active</p>}
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CV (PDF)</label>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-2">
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <p className="text-xs text-gray-500">{doctorCV ? doctorCV.name : (editingDoctor?.cv ? 'CV Existante' : 'Upload PDF')}</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files?.[0] && setDoctorCV(e.target.files[0])} />
                </label>
                {editingDoctor?.cv && !doctorCV && (
                   <a href={getDoctorMediaUrl(editingDoctor.cv) || ''} target="_blank" className="text-[10px] text-blue-600 text-center underline">Voir le CV actuel</a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Langues */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider border-b pb-1">Languages</h3>
          <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => (
              <label key={lang} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={doctorForm.langues.includes(lang)}
                  onChange={(e) => {
                    const updated = e.target.checked 
                      ? [...doctorForm.langues, lang]
                      : doctorForm.langues.filter(l => l !== lang);
                    setDoctorForm({ ...doctorForm, langues: updated });
                  }}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-xs text-gray-700">{lang}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer fixe */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-[11px] text-gray-500 italic">
          * Required fields. All data is securely stored.
        </p>
        <div className="flex gap-3">
          <button
            onClick={closeDoctorModal}
            className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={editingDoctorId ? updateDoctor : createDoctor}
            disabled={doctorsLoading}
            className="px-8 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg"
          >
            {doctorsLoading ? 'Saving...' : editingDoctorId ? '💾 Update Doctor' : '✨ Create Doctor'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Other tabs placeholder */}
      {activeTab !== 'Profile' && activeTab !== 'Acces' && activeTab !== 'Treatments' && activeTab !== 'Media' && activeTab !== 'Hotels' && activeTab !== 'Case Managers' && activeTab !== 'Doctors' && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          <p>Section "{activeTab}" à venir</p>
        </div>
      )}

      {/* Modal: Add Procedures */}
      {showAddProcedureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold">➕ Affecter des Procédures</h3>
              <button
                onClick={closeAddProcedureModal}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Langue</label>
                  <select
                    value={procedureLangue}
                    onChange={(e) => setProcedureLangue(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="all">Toutes les langues</option>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                    <option value="es">Español</option>
                    <option value="tr">Türkçe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Catégorie</label>
                  <select
                    value={procedureCategorie}
                    onChange={(e) => setProcedureCategorie(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="Dental">Dental</option>
                    <option value="Cosmetic">Cosmetic</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Procedures List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {proceduresLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement des procédures...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allProcedures
                    .filter(p => procedureLangue === 'all' || p.langue === procedureLangue)
                    .filter(p => procedureCategorie === 'all' || p.categorie === procedureCategorie)
                    .map((procedure) => {
                      const isSelected = selectedProcedures.has(procedure.id_procedure);
                      const selectedProc = selectedProcedures.get(procedure.id_procedure);

                      return (
                        <div
                          key={procedure.id_procedure}
                          className={`border rounded-lg p-4 transition-all ${
                            isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleProcedureSelection(procedure)}
                              className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                            />

                            {/* Procedure Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{procedure.nom}</h4>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {procedure.categorie}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {procedure.langue}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{procedure.nom_procedure}</p>

                              {/* Details (only if selected) */}
                              {isSelected && selectedProc && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t">
                                  <div>
                                    <label className="block text-xs font-semibold mb-1 text-gray-700">Prix*</label>
                                    <input
                                      type="number"
                                      placeholder="500.00"
                                      value={selectedProc.prix_base}
                                      onChange={(e) => updateProcedureDetails(procedure.id_procedure, 'prix_base', e.target.value)}
                                      className="w-full border rounded px-2 py-1 text-sm"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold mb-1 text-gray-700">Devise*</label>
                                    <select
                                      value={selectedProc.devise}
                                      onChange={(e) => updateProcedureDetails(procedure.id_procedure, 'devise', e.target.value)}
                                      className="w-full border rounded px-2 py-1 text-sm"
                                    >
                                      <option value="EUR">EUR</option>
                                      <option value="USD">USD</option>
                                      <option value="GBP">GBP</option>
                                      <option value="TRY">TRY</option>
                                      <option value="MAD">MAD</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold mb-1 text-gray-700">Durée (jours)</label>
                                    <input
                                      type="number"
                                      placeholder="3"
                                      value={selectedProc.duree_sejour}
                                      onChange={(e) => updateProcedureDetails(procedure.id_procedure, 'duree_sejour', e.target.value)}
                                      className="w-full border rounded px-2 py-1 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold mb-1 text-gray-700">Description</label>
                                    <input
                                      type="text"
                                      placeholder="Optionnel"
                                      value={selectedProc.description_specifique}
                                      onChange={(e) => updateProcedureDetails(procedure.id_procedure, 'description_specifique', e.target.value)}
                                      className="w-full border rounded px-2 py-1 text-sm"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{selectedProcedures.size}</span> procédure(s) sélectionnée(s)
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeAddProcedureModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={assignProceduresToHospital}
                  disabled={selectedProcedures.size === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  ✅ Affecter ({selectedProcedures.size})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------- Component Input --------- */
function Input({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  required = false,
  step,
  min,
  max
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  step?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        step={step}
        min={min}
        max={max}
      />
    </div>
  );
}

/* --------- Component FileInput --------- */
function FileInput({ 
  label, 
  value, 
  onChange,
  onFileSelect,
  currentFile
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  onFileSelect?: (file: File | null) => void;
  currentFile?: File | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
      onChange(file.name); // Afficher le nom du fichier
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={currentFile ? currentFile.name : value}
          onChange={e => onChange(e.target.value)}
          placeholder="URL du fichier ou sélectionner un fichier"
          readOnly={!!currentFile}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm"
        >
          Select
        </button>
        {currentFile && (
          <button
            type="button"
            onClick={() => {
              if (onFileSelect) onFileSelect(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
          >
            ×
          </button>
        )}
      </div>
      {value && !currentFile && (
        <div className="mt-2">
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Voir le fichier actuel
          </a>
        </div>
      )}
      {currentFile && (
        <div className="mt-2 text-xs text-green-600">
          Fichier sélectionné: {currentFile.name} ({(currentFile.size / 1024).toFixed(2)} KB)
        </div>
      )}
    </div>
  );
}
