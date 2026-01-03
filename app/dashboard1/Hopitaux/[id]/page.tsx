'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
  langues: string | null; // comma-separated languages
  description: string | null;
  note: number;
  reviews: number;
  sexe: string | null;
  nationalite: string | null;
  email: string | null;
  telephone: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

type Tab = 'Profile' | 'Media' | 'Treatments' | 'Doctors' | 'Notifications' | 'Case Managers' | 'Hotels' | 'Reviews';

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
  'Does not speak any foreign language'
];

export default function HospitalEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [treatmentsLoading, setTreatmentsLoading] = useState(false);
  const [media, setMedia] = useState<HospitalMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
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

  // États pour le formulaire de docteur
  const [doctorForm, setDoctorForm] = useState({
    nom_medecin: '',
    langues: [] as string[],
  });
  const [doctorPhoto, setDoctorPhoto] = useState<File | null>(null);
  const [doctorCV, setDoctorCV] = useState<File | null>(null);

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
    }
  }, [activeTab, id]);

  const loadTreatments = async () => {
    setTreatmentsLoading(true);
    try {
      const response = await fetch('https://lepetitchaletoran.com/api/ia/procedure_hospital.php');
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

  const loadMedia = async () => {
    if (!id) return;
    setMediaLoading(true);
    try {
      const response = await fetch(`/api/hospitals/media?id_hospital=${id}`);
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
    if (selectedFiles.length === 0 || !id) {
      alert('Veuillez sélectionner au moins un fichier');
      return;
    }

    console.log('Upload - Fichiers sélectionnés:', selectedFiles.length);
    console.log('Upload - ID hôpital:', id);

    setMediaLoading(true);
    try {
      const formData = new FormData();
      formData.append('id_hospital', String(id));
      formData.append('langue', mediaLangue);
      
      // Ajouter chaque fichier avec la clé "files" (sans crochets pour Next.js)
      selectedFiles.forEach((file, index) => {
        console.log(`Ajout fichier ${index}:`, file.name, file.type, file.size);
        formData.append('files', file);
      });

      // Vérifier les clés dans FormData
      console.log('Clés FormData:', Array.from(formData.keys()));

      const response = await fetch('/api/hospitals/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      const result = await response.json();
      if (result.success) {
        setSelectedFiles([]);
        loadMedia();
      } else {
        alert(result.error || 'Erreur lors de l\'upload');
      }
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setMediaLoading(false);
    }
  };

  const deleteMedia = async (idMedia: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return;

    try {
      const response = await fetch('/api/hospitals/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_media: idMedia }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      const result = await response.json();
      if (result.success) {
        loadMedia();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const updateMediaOrder = async (idMedia: number, newOrder: number) => {
    try {
      const response = await fetch('/api/hospitals/media', {
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
    setShowHotelModal(true);
  };

  const closeHotelModal = () => {
    setShowHotelModal(false);
    setEditingHotelId(null);
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
      if (result.success) {
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
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
        
        // Upload photo si sélectionnée
        if (caseManagerPhoto && newId) {
          const formData = new FormData();
          formData.append('id_case_manager', String(newId));
          formData.append('id_hospital', String(id));
          formData.append('profile_photo', caseManagerPhoto);

          const photoResponse = await fetch('/api/case-managers', {
            method: 'POST',
            body: formData,
          });

          if (!photoResponse.ok) {
            console.warn('Photo upload failed, but case manager was created');
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        // Upload photo si sélectionnée
        if (caseManagerPhoto && editingCaseManagerId) {
          const formData = new FormData();
          formData.append('id_case_manager', String(editingCaseManagerId));
          formData.append('id_hospital', String(id));
          formData.append('profile_photo', caseManagerPhoto);

          const photoResponse = await fetch('/api/case-managers', {
            method: 'POST',
            body: formData,
          });

          if (!photoResponse.ok) {
            console.warn('Photo upload failed');
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
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_case_manager: idCaseManager }),
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
    if (doctor) {
      setEditingDoctorId(doctor.id_medecin);
      setEditingDoctor(doctor);
      setDoctorForm({
        nom_medecin: doctor.nom_medecin || '',
        langues: doctor.langues 
          ? (doctor.langues.includes(',') 
              ? doctor.langues.split(',').map(l => l.trim())
              : [doctor.langues])
          : [],
      });
      // Ne pas réinitialiser les fichiers si on édite (pour garder les fichiers existants)
      setDoctorPhoto(null);
      setDoctorCV(null);
    } else {
      setEditingDoctorId(null);
      setEditingDoctor(null);
      setDoctorForm({
        nom_medecin: '',
        langues: [],
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
    setDoctorForm({
      nom_medecin: '',
      langues: [],
    });
    setDoctorPhoto(null);
    setDoctorCV(null);
  };

  const createDoctor = async () => {
    if (!id) return;
    
    if (!doctorForm.nom_medecin) {
      alert('Veuillez remplir le champ obligatoire (Full name)');
      return;
    }

    if (!doctorPhoto || !doctorCV) {
      alert('Veuillez sélectionner la photo et le CV (obligatoires pour la création)');
      return;
    }

    setDoctorsLoading(true);
    try {
      // Créer le docteur
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_hospital: Number(id),
          nom_medecin: doctorForm.nom_medecin,
          langues: doctorForm.langues.length > 0 
            ? doctorForm.langues.join(',')
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
        
        // Upload photo et CV
        if (newId && (doctorPhoto || doctorCV)) {
          const formData = new FormData();
          formData.append('id_medecin', String(newId));
          formData.append('id_hospital', String(id));
          if (doctorPhoto) formData.append('photo', doctorPhoto);
          if (doctorCV) formData.append('cv', doctorCV);

          const uploadResponse = await fetch('/api/doctors', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            console.warn('File upload failed, but doctor was created');
          }
        }

        alert('✅ Docteur créé avec succès');
        closeDoctorModal();
        loadDoctors();
      } else {
        alert(result.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error('Erreur lors de la création du docteur:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setDoctorsLoading(false);
    }
  };

  const updateDoctor = async () => {
    if (!editingDoctorId) return;
    
    if (!doctorForm.nom_medecin) {
      alert('Veuillez remplir le champ obligatoire (Full name)');
      return;
    }

    setDoctorsLoading(true);
    try {
      // Mettre à jour le docteur
      const response = await fetch('/api/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_medecin: editingDoctorId,
          nom_medecin: doctorForm.nom_medecin,
          langues: doctorForm.langues.length > 0 
            ? doctorForm.langues.join(',')
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Upload photo et/ou CV si sélectionnés
        if (doctorPhoto || doctorCV) {
          const formData = new FormData();
          formData.append('id_medecin', String(editingDoctorId));
          formData.append('id_hospital', String(id));
          if (doctorPhoto) formData.append('photo', doctorPhoto);
          if (doctorCV) formData.append('cv', doctorCV);

          const uploadResponse = await fetch('/api/doctors', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            console.warn('File upload failed');
          }
        }

        alert('✅ Docteur mis à jour avec succès');
        closeDoctorModal();
        loadDoctors();
      } else {
        alert(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du docteur:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur HTTP' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        alert('✅ Docteur supprimé avec succès');
        loadDoctors();
      } else {
        alert(result.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDoctorsLoading(false);
    }
  };

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const updateHospital = async () => {
    if (!hospital) return;
    
    setLoading(true);
    setError(null);

    try {
      // Si des fichiers sont sélectionnés, uploader d'abord les fichiers
      if (logoFile || certificateFile) {
        const formData = new FormData();
        formData.append('id_hospital', String(id));
        if (logoFile) formData.append('logo', logoFile);
        if (certificateFile) formData.append('certifications', certificateFile);

        const uploadResponse = await fetch('/api/hospitals', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json().catch(() => ({ error: 'Erreur upload' }));
          throw new Error(uploadError.error || 'Erreur lors de l\'upload des fichiers');
        }
      }

      // Ensuite, mettre à jour les autres données
      const { id_hospital, ...hospitalData } = hospital;
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
        setCertificateFile(null);
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

  const tabs: Tab[] = ['Profile', 'Media', 'Treatments', 'Doctors', 'Notifications', 'Case Managers', 'Hotels', 'Reviews'];

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

            <Input 
              label="Pays*" 
              value={hospital.pays || ''}
              onChange={v => setHospital({ ...hospital, pays: v })} 
              required
            />

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

            <Input 
              label="Nombre de reviews" 
              value={hospital.reviews ? String(hospital.reviews) : ''}
              onChange={v => setHospital({ ...hospital, reviews: Number(v) || 0 })} 
              type="number"
            />

            <FileInput 
              label="Logo" 
              value={hospital.logo || ''}
              onChange={v => setHospital({ ...hospital, logo: v })}
              onFileSelect={setLogoFile}
              currentFile={logoFile}
            />

            <FileInput 
              label="Direct Price Warranty certificate" 
              value={hospital.certifications || ''}
              onChange={v => setHospital({ ...hospital, certifications: v })}
              onFileSelect={setCertificateFile}
              currentFile={certificateFile}
            />

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

      {/* Treatments Tab */}
      {activeTab === 'Treatments' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Traitements disponibles</h2>
            <button
              onClick={loadTreatments}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              ↻ Actualiser
            </button>
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
                                src={item.path || 'https://via.placeholder.com/100'}
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
                              src={`https://lepetitchaletoran.com/${cm.profile_photo}`}
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
                            src={`https://lepetitchaletoran.com/${doctor.photo}`}
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
                <h2 className="text-2xl font-bold text-white">
                  {editingDoctorId ? '✏️ Edit a doctor' : '➕ Add a doctor'}
                </h2>
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
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    placeholder="Dr .."
                    value={doctorForm.nom_medecin}
                    onChange={(e) => setDoctorForm({ ...doctorForm, nom_medecin: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Photo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                        value={doctorPhoto ? doctorPhoto.name : 'No file selected'}
                        readOnly
                        placeholder="Select a photo"
                      />
                      <input
                        type="file"
                        id="doctor-photo"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDoctorPhoto(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="doctor-photo"
                        className="px-4 py-3 bg-gray-100 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-all cursor-pointer font-medium"
                      >
                        Browse
                      </label>
                    </div>
                    {/* Afficher la photo existante si on édite et qu'aucune nouvelle photo n'est sélectionnée */}
                    {!doctorPhoto && editingDoctor?.photo && (
                      <div className="mt-2 flex items-center gap-3">
                        <img
                          src={`https://lepetitchaletoran.com/${editingDoctor.photo}`}
                          alt="Current photo"
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="text-xs text-gray-600">
                          Photo actuelle
                        </div>
                      </div>
                    )}
                    {/* Afficher la nouvelle photo sélectionnée */}
                    {doctorPhoto && (
                      <div className="mt-2 flex items-center gap-3">
                        <img
                          src={URL.createObjectURL(doctorPhoto)}
                          alt="Preview"
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="text-xs text-green-600">
                          {doctorPhoto.name} ({(doctorPhoto.size / 1024).toFixed(2)} KB)
                        </div>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-gray-500">Minimum dimensions (300x300)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Doctor's CV & Experiences (PDF) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                        value={doctorCV ? doctorCV.name : 'No file selected'}
                        readOnly
                        placeholder="Select a PDF"
                      />
                      <input
                        type="file"
                        id="doctor-cv"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDoctorCV(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="doctor-cv"
                        className="px-4 py-3 bg-gray-100 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-all cursor-pointer font-medium"
                      >
                        Browse
                      </label>
                    </div>
                    {/* Afficher le CV existant si on édite et qu'aucun nouveau CV n'est sélectionné */}
                    {!doctorCV && editingDoctor?.cv && (
                      <div className="mt-2">
                        <a
                          href={`https://lepetitchaletoran.com/${editingDoctor.cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          📄 Voir le CV actuel
                        </a>
                      </div>
                    )}
                    {/* Afficher le nouveau CV sélectionné */}
                    {doctorCV && (
                      <div className="mt-2 text-xs text-green-600">
                        {doctorCV.name} ({(doctorCV.size / 1024).toFixed(2)} KB)
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Language Selection
                  </label>
                  <div className="border-2 border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto bg-gray-50">
                    {LANGUAGES.map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={doctorForm.langues.includes(lang)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDoctorForm({
                                ...doctorForm,
                                langues: [...doctorForm.langues, lang],
                              });
                            } else {
                              setDoctorForm({
                                ...doctorForm,
                                langues: doctorForm.langues.filter(l => l !== lang),
                              });
                            }
                          }}
                          className="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{lang}</span>
                        {doctorForm.langues.includes(lang) && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </label>
                    ))}
                  </div>
                  {doctorForm.langues.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doctorForm.langues.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {lang}
                          <button
                            onClick={() => {
                              setDoctorForm({
                                ...doctorForm,
                                langues: doctorForm.langues.filter(l => l !== lang),
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
              </div>
            </div>

            {/* Footer avec boutons modernes */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeDoctorModal}
                  className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={editingDoctorId ? updateDoctor : createDoctor}
                  disabled={doctorsLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  {doctorsLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </span>
                  ) : (
                    editingDoctorId ? '💾 Update' : '✨ Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'Profile' && activeTab !== 'Treatments' && activeTab !== 'Media' && activeTab !== 'Hotels' && activeTab !== 'Case Managers' && activeTab !== 'Doctors' && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          <p>Section "{activeTab}" à venir</p>
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
