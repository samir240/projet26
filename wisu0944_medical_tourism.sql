-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 31, 2026 at 10:17 AM
-- Server version: 11.4.9-MariaDB
-- PHP Version: 8.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wisu0944_medical_tourism`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id_appointment` int(11) NOT NULL,
  `id_quote` int(11) DEFAULT NULL,
  `id_request` int(11) NOT NULL,
  `id_patient` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `status` enum('planifie','confirme','en_cours','termine','annule','no_show') DEFAULT 'planifie',
  `date_arrivee` date DEFAULT NULL,
  `date_depart` date DEFAULT NULL,
  `passeport_doc` varchar(500) DEFAULT NULL,
  `fly_ticket_doc` varchar(500) DEFAULT NULL,
  `hotel_reservation` varchar(500) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_managers`
--

CREATE TABLE `case_managers` (
  `id_case_manager` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `countries_concerned` text DEFAULT NULL,
  `id_coordinator` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `case_managers`
--

INSERT INTO `case_managers` (`id_case_manager`, `id_hospital`, `fullname`, `email`, `phone`, `profile_photo`, `countries_concerned`, `id_coordinator`, `is_active`, `created_at`) VALUES
(1, 2, 'samir bensalah', 'samir@gmail.com', '054374745', NULL, 'Égypte', NULL, 1, '2026-01-03 10:18:35'),
(2, 2, 'totti andreas', 'test3@gmail.com', '045454545', NULL, 'Tunisie', NULL, 1, '2026-01-13 09:52:18');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id_medecin` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `nom_medecin` varchar(150) NOT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `cv` text DEFAULT NULL,
  `specialite` varchar(150) DEFAULT NULL,
  `qualifications` text DEFAULT NULL,
  `experience_years` int(11) DEFAULT 0,
  `realisations` text DEFAULT NULL,
  `langues` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `note` decimal(3,2) DEFAULT NULL,
  `reviews` text DEFAULT NULL,
  `sexe` enum('M','F','Autre') DEFAULT NULL,
  `nationalite` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id_medecin`, `id_hospital`, `nom_medecin`, `photo`, `cv`, `specialite`, `qualifications`, `experience_years`, `realisations`, `langues`, `description`, `note`, `reviews`, `sexe`, `nationalite`, `email`, `telephone`, `is_active`, `created_at`, `updated_at`) VALUES
(3, 3, 'mahboul', NULL, NULL, 'Dentisterie', NULL, 0, NULL, 'fr, en, ar, es', '', 0.00, '0', 'M', 'Algerie', 'mahboul@gmail.com', '054454545', 1, '2026-01-11 11:47:14', '2026-01-11 12:38:00'),
(4, 2, 'Dr. Selim Yilmaz', 'app/http/api/uploads/hospital_2/doctors/doc_4_pic_1768295446.webp', 'app/http/api/uploads/hospital_2/doctors/doc_4_cv_1768295446.pdf', 'Chirurgie Esthétique', NULL, 0, NULL, 'es, ar', '', 0.00, '0', 'M', 'Turquie', 'yilmaz@gmail.com', '054454545', 1, '2026-01-11 12:46:18', '2026-01-13 09:10:46'),
(5, 2, 'Dr. Carlos Garcia', 'app/http/api/uploads/hospital_2/doctors/doc_5_pic_1768295398.jpg', 'app/http/api/uploads/hospital_2/doctors/doc_5_cv_1768295398.pdf', 'Dentisterie', NULL, 0, NULL, 'fr, en', '', 0.00, '0', 'M', 'Argentina', 'carlo@gmail.com', '+34 91 445 00 03', 1, '2026-01-11 12:47:58', '2026-01-13 09:09:58'),
(6, 2, 'ozak buruk', 'uploads/hospital_2/doctors/doc_6_pic_1768296317.jpeg', 'uploads/hospital_2/doctors/doc_6_cv_1768296317.pdf', 'Dentisterie', 'test dip', 15, 'pub', 'fr, ar, ru', 'test description', 0.00, '0', 'M', 'Portugal', 'b@gmail.com', '', 1, '2026-01-13 08:54:02', '2026-01-20 10:03:50'),
(7, 2, 'test doctor', 'uploads/hospital_2/doctors/doc_7_pic_1769344419.jpeg', 'uploads/hospital_2/doctors/doc_7_cv_1769344419.pdf', NULL, NULL, 0, NULL, 'English,Arabic,French', NULL, 0.00, '0', NULL, NULL, NULL, NULL, 1, '2026-01-25 12:33:37', '2026-01-25 12:33:39'),
(8, 2, 'test 3 doctor', 'uploads/hospital_2/doctors/doc_8_pic_1769617759.jpeg', 'uploads/hospital_2/doctors/doc_8_cv_1769617759.pdf', NULL, NULL, 0, NULL, 'English', NULL, 0.00, '0', NULL, NULL, NULL, NULL, 1, '2026-01-28 16:29:18', '2026-01-28 16:29:19'),
(9, 2, 'samir bensalah', 'uploads/hospital_2/doctors/doc_9_pic_1769801779.jpg', 'uploads/hospital_2/doctors/doc_9_cv_1769801779.pdf', 'Dermatologie', NULL, 0, NULL, 'Arabic,French,English', NULL, 0.00, '0', NULL, NULL, 'samir.bensalah@gmail.com', '002135412154575', 1, '2026-01-30 19:36:17', '2026-01-30 19:36:19'),
(10, 2, 'test test', NULL, NULL, 'Cosmétologie', NULL, 0, NULL, 'Arabic', NULL, 0.00, '0', NULL, NULL, 'test@gmail.com', '+22315154212', 1, '2026-01-30 19:56:43', '2026-01-30 19:56:43');

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id_template` int(11) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `langue` char(2) NOT NULL,
  `objet` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_templates`
--

INSERT INTO `email_templates` (`id_template`, `slug`, `langue`, `objet`, `message`, `description`, `created_at`) VALUES
(1, 'test_fr', 'fr', 'test objet', 'bla bla bla', '', '2026-01-04 17:49:32');

-- --------------------------------------------------------

--
-- Table structure for table `galerie_patient`
--

CREATE TABLE `galerie_patient` (
  `id_galerie` int(11) NOT NULL,
  `id_image` int(11) DEFAULT NULL,
  `id_request` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `path` varchar(500) NOT NULL,
  `type_image` enum('avant','apres','document','autre') DEFAULT 'autre',
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `historique_email`
--

CREATE TABLE `historique_email` (
  `id` int(11) NOT NULL,
  `id_request` int(11) DEFAULT NULL,
  `id_patient` int(11) DEFAULT NULL,
  `id_commercial` int(11) DEFAULT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `text_email` text DEFAULT NULL,
  `email_destinataire` varchar(255) DEFAULT NULL,
  `email_type` enum('devis','relance','confirmation','information','autre') DEFAULT 'autre',
  `status` enum('envoye','echec','ouvert','clique') DEFAULT 'envoye',
  `date_envoi` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `id_hospital` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `nom_gerant` varchar(150) DEFAULT NULL,
  `reviews` text DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `certifications` text DEFAULT NULL,
  `note_google` decimal(3,2) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id_hospital`, `nom`, `pays`, `nom_gerant`, `reviews`, `adresse`, `ville`, `certifications`, `note_google`, `latitude`, `longitude`, `description`, `logo`, `website`, `email`, `telephone`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Hospital MA', 'Turquie', 'Burak Conoglu', NULL, '112 Rue 12', 'Ankara', NULL, 6.00, NULL, NULL, NULL, NULL, NULL, 'mahospital@gmail.com', '0021745589', 1, '2025-12-29 10:21:20', '2025-12-29 10:21:20'),
(2, 'Ankara Medical Center', 'Turquie', 'Burak Conoglu', NULL, '112 Atatürk Bulvari', 'Ankara', 'ISO 9001', 4.60, 39.93340000, 32.85970000, 'Centre médical moderne spécialisé en chirurgie et soins généraux.', NULL, 'https://ankaramedical.com', 'contact@ankaramedical.com', '+90 312 445 58 89', 1, '2025-12-29 12:32:31', '2025-12-29 12:32:31'),
(3, 'Istanbul Health Clinic', 'Turquie', 'Mehmet Yilmaz', NULL, '45 Taksim Caddesi', 'Istanbul', 'JCI', 4.80, 41.00820000, 28.97840000, 'Clinique internationale reconnue pour le tourisme médical.', NULL, 'https://istanbulhealthclinic.com', 'info@istanbulhealthclinic.com', '+90 212 334 22 11', 1, '2025-12-29 12:32:31', '2025-12-29 12:32:31'),
(4, 'Madrid Central Hospital', 'Espagne', 'Carlos Martinez', NULL, '120 Calle de Alcalá', 'Madrid', 'ISO 14001', 4.50, 40.41680000, -3.70380000, 'Hôpital public de référence avec services spécialisés.', NULL, 'https://madridcentralhospital.es', 'contact@madridcentralhospital.es', '+34 91 445 66 77', 1, '2025-12-29 12:32:31', '2025-12-29 12:32:31'),
(5, 'Barcelona Advanced Clinic', 'Espagne', 'Javier Lopez', NULL, '78 Avinguda Diagonal', 'Barcelona', 'JCI', 4.70, 41.38510000, 2.17340000, 'Clinique privée haut de gamme orientée patients internationaux.', NULL, 'https://barcelonaadvancedclinic.es', 'info@barcelonaadvancedclinic.es', '+34 93 778 99 00', 1, '2025-12-29 12:32:31', '2025-12-29 12:32:31'),
(6, 'test hospital add', 'uae', 'samiro', '0', '11 rue market', 'Dubai', 'uploads/hospital_6/certifications/cert_1767370902_structure_bdd.pdf', 0.00, 0.00000000, 0.00000000, '', 'uploads/hospital_6/logos/logo_1767370902_depositphotos_86833080-stock-illustration-white-plastic-bottle-for-pills.jpg', '', '', '', 1, '2026-01-02 16:21:41', '2026-01-02 16:33:15');

-- --------------------------------------------------------

--
-- Table structure for table `hospital_coordinators`
--

CREATE TABLE `hospital_coordinators` (
  `id_coordi` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `nom_coordi` varchar(150) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fonction` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `langue` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospital_coordinators`
--

INSERT INTO `hospital_coordinators` (`id_coordi`, `id_hospital`, `id_user`, `nom_coordi`, `email`, `fonction`, `telephone`, `langue`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2, 3, 'kayelan casey', 'casey@hospital2.com', NULL, '+33345162518', NULL, 1, '2026-01-20 14:44:38', '2026-01-20 14:44:38');

-- --------------------------------------------------------

--
-- Table structure for table `hospital_media`
--

CREATE TABLE `hospital_media` (
  `id_media` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `path` varchar(500) NOT NULL,
  `langue` varchar(10) DEFAULT 'all',
  `ordre` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospital_media`
--

INSERT INTO `hospital_media` (`id_media`, `id_hospital`, `nom`, `path`, `langue`, `ordre`, `created_at`) VALUES
(5, 2, NULL, '/app/http/api/uploads/hospital_2/media/img_1769347803_69761adb91c33.webp', 'fr', 3, '2026-01-25 13:30:03'),
(6, 2, NULL, '/app/http/api/uploads/hospital_2/media/img_1769347820_69761aeca32d4.webp', 'fr', 4, '2026-01-25 13:30:20'),
(8, 2, NULL, '/app/http/api/uploads/hospital_2/media/img_1769347875_69761b2356853.webp', 'fr', 5, '2026-01-25 13:31:15');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `id_hotel` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `hotel_name` varchar(255) NOT NULL,
  `stars` int(1) DEFAULT 3,
  `adresse` varchar(255) DEFAULT NULL,
  `hotel_website` varchar(255) DEFAULT NULL,
  `single_room_price` decimal(10,2) DEFAULT NULL,
  `double_room_price` decimal(10,2) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`id_hotel`, `id_hospital`, `hotel_name`, `stars`, `adresse`, `hotel_website`, `single_room_price`, `double_room_price`, `photo`, `is_active`, `created_at`) VALUES
(2, 2, 'ibis 2 Hotel', 4, 'rue ibis', 'http://', 100.00, 150.00, NULL, 1, '2026-01-03 10:05:30');

-- --------------------------------------------------------

--
-- Table structure for table `medical_procedures`
--

CREATE TABLE `medical_procedures` (
  `id_procedure` int(11) NOT NULL,
  `category_key` varchar(120) DEFAULT NULL,
  `nom_procedure` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `categorie` varchar(100) DEFAULT NULL,
  `sous_categorie` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `code_reference` varchar(64) DEFAULT NULL,
  `img_procedure` varchar(500) DEFAULT NULL,
  `duree_moyenne` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `language` char(2) NOT NULL DEFAULT 'fr',
  `sort_order` int(11) DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medical_procedures`
--

INSERT INTO `medical_procedures` (`id_procedure`, `category_key`, `nom_procedure`, `slug`, `short_description`, `categorie`, `sous_categorie`, `description`, `seo_title`, `seo_description`, `code_reference`, `img_procedure`, `duree_moyenne`, `is_active`, `is_featured`, `language`, `sort_order`, `meta`, `created_at`, `updated_at`) VALUES
(4, 'allergologie', 'Consultation en allergologie', NULL, 'Consultation spécialisée pour le diagnostic et le suivi des allergies.', 'Allergologie', NULL, NULL, 'Consultation en allergologie – Allergologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:01:40', '2026-01-29 15:01:40'),
(5, 'allergologie', 'Les tests allergologiques', NULL, 'Tests médicaux permettant d’identifier les allergies et leurs causes.', 'Allergologie', NULL, NULL, 'Tests allergologiques – Allergologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:01:40', '2026-01-29 15:01:40'),
(6, 'anesthesie-reanimation', 'Soins intensifs', NULL, 'Prise en charge des patients nécessitant une surveillance médicale continue.', 'Anesthésie – Réanimation', NULL, NULL, 'Soins intensifs – Anesthésie et Réanimation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:15:20', '2026-01-29 15:15:20'),
(7, 'cardiologie-cardio-vasculaire', 'Consultation en cardiologie', NULL, 'Consultation spécialisée pour l’évaluation et le suivi des maladies cardiaques.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Consultation en cardiologie – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(8, 'cardiologie-cardio-vasculaire', 'Cardiologie pédiatrique', NULL, 'Prise en charge des pathologies cardiaques chez l’enfant.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Cardiologie pédiatrique – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(9, 'cardiologie-cardio-vasculaire', 'Cardiomyopathie', NULL, 'Diagnostic et traitement des maladies du muscle cardiaque.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Cardiomyopathie – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(10, 'cardiologie-cardio-vasculaire', 'Cardiopathie congénitale', NULL, 'Prise en charge des malformations cardiaques présentes à la naissance.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Cardiopathie congénitale – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(11, 'cardiologie-cardio-vasculaire', 'Traitement de la valvulopathie cardiaque', NULL, 'Traitement médical ou chirurgical des maladies des valves cardiaques.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Valvulopathie cardiaque – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(12, 'cardiologie-cardio-vasculaire', 'Traitement de l’artériopathie oblitérante', NULL, 'Prise en charge des maladies obstructives des artères périphériques.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Artériopathie oblitérante – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(13, 'cardiologie-cardio-vasculaire', 'Électrocardiogramme (ECG)', NULL, 'Examen enregistrant l’activité électrique du cœur.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'ECG – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(14, 'cardiologie-cardio-vasculaire', 'Holter ECG 24h / 48h', NULL, 'Surveillance continue du rythme cardiaque sur 24 ou 48 heures.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Holter ECG – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(15, 'cardiologie-cardio-vasculaire', 'MAPA (Holter tensionnel 24h)', NULL, 'Mesure ambulatoire de la pression artérielle sur 24 heures.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'MAPA – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(16, 'cardiologie-cardio-vasculaire', 'Électrocardiographie d’effort', NULL, 'Analyse du fonctionnement cardiaque lors d’un effort physique.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'ECG d’effort – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(17, 'cardiologie-cardio-vasculaire', 'Test d’inclinaison', NULL, 'Examen diagnostique des syncopes et troubles du rythme.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Test d’inclinaison – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(18, 'cardiologie-cardio-vasculaire', 'Échocardiogramme', NULL, 'Exploration par ultrasons de la structure et de la fonction cardiaque.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Échocardiogramme – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(19, 'cardiologie-cardio-vasculaire', 'IRM cardiaque', NULL, 'Imagerie avancée pour l’analyse détaillée du cœur.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'IRM cardiaque – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(20, 'cardiologie-cardio-vasculaire', 'Scanner coronaire (Coroscanner)', NULL, 'Exploration des artères coronaires par imagerie scanner.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Scanner coronaire – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(21, 'cardiologie-cardio-vasculaire', 'Radiographie pulmonaire', NULL, 'Examen radiologique des poumons et de la cage thoracique.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Radiographie pulmonaire – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(22, 'cardiologie-cardio-vasculaire', 'Scintigraphie myocardique', NULL, 'Évaluation de la perfusion du muscle cardiaque.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Scintigraphie myocardique – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(23, 'cardiologie-cardio-vasculaire', 'Angiographie', NULL, 'Imagerie des vaisseaux sanguins à l’aide de produit de contraste.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Angiographie – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(24, 'cardiologie-cardio-vasculaire', 'Cathétérisme cardiaque droit', NULL, 'Exploration invasive des pressions et cavités cardiaques.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Cathétérisme cardiaque – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(25, 'cardiologie-cardio-vasculaire', 'Doppler artériel et veineux', NULL, 'Analyse du flux sanguin artériel et veineux.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Doppler vasculaire – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(26, 'cardiologie-cardio-vasculaire', 'Angioplastie coronaire', NULL, 'Traitement des rétrécissements des artères coronaires.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Angioplastie coronaire – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(27, 'cardiologie-cardio-vasculaire', 'Implantation de stent coronaire', NULL, 'Mise en place d’un stent pour maintenir une artère ouverte.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Stent coronaire – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(28, 'cardiologie-cardio-vasculaire', 'Cryoablation cardiaque', NULL, 'Traitement des troubles du rythme par le froid.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Cryoablation – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(29, 'cardiologie-cardio-vasculaire', 'Ablation par radiofréquence', NULL, 'Traitement des arythmies par énergie thermique ciblée.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Ablation par radiofréquence – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(30, 'cardiologie-cardio-vasculaire', 'Fermeture de CIA / CIV', NULL, 'Correction percutanée des communications intracardiaques.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Fermeture CIA / CIV – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(31, 'cardiologie-cardio-vasculaire', 'Fermeture de l’auricule gauche', NULL, 'Prévention des AVC chez les patients à risque.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Fermeture auricule gauche – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(32, 'cardiologie-cardio-vasculaire', 'Valvuloplastie mitrale percutanée', NULL, 'Traitement mini-invasif du rétrécissement mitral.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Valvuloplastie mitrale – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(33, 'cardiologie-cardio-vasculaire', 'Remplacement valvulaire aortique par voie transcathéter (TAVI)', NULL, 'Remplacement de la valve aortique sans chirurgie ouverte.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'TAVI – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(34, 'cardiologie-cardio-vasculaire', 'Thérapie de resynchronisation cardiaque (CRT)', NULL, 'Amélioration de la coordination du rythme cardiaque.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'CRT – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(35, 'cardiologie-cardio-vasculaire', 'Pacemaker (stimulateur cardiaque)', NULL, 'Dispositif implanté pour réguler le rythme cardiaque.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Pacemaker – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(36, 'cardiologie-cardio-vasculaire', 'DAI (Défibrillateur Automatique Implantable)', NULL, 'Dispositif implantable pour prévenir les morts subites.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'DAI – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(37, 'cardiologie-cardio-vasculaire', 'CRT-D', NULL, 'Dispositif combinant resynchronisation et défibrillation.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'CRT-D – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(38, 'cardiologie-cardio-vasculaire', 'Pontage aorto-coronarien (PAC)', NULL, 'Chirurgie de revascularisation des artères coronaires.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Pontage coronarien – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(39, 'cardiologie-cardio-vasculaire', 'Remplacement des valves cardiaques', NULL, 'Chirurgie de remplacement des valves cardiaques malades.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Remplacement valvulaire – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(40, 'cardiologie-cardio-vasculaire', 'Transplantation cardiaque', NULL, 'Greffe du cœur en cas d’insuffisance terminale.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Transplantation cardiaque – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(41, 'cardiologie-cardio-vasculaire', 'Endoprothèse aortique (EVAR / TEVAR)', NULL, 'Traitement endovasculaire des anévrismes aortiques.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Endoprothèse aortique – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(42, 'cardiologie-cardio-vasculaire', 'Chirurgie de l’aorte thoracique / abdominale', NULL, 'Intervention chirurgicale sur l’aorte.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Chirurgie de l’aorte – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(43, 'cardiologie-cardio-vasculaire', 'Endartériectomie carotidienne', NULL, 'Prévention des AVC par nettoyage de la carotide.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Endartériectomie carotidienne – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(44, 'cardiologie-cardio-vasculaire', 'Bypass artériel périphérique', NULL, 'Chirurgie de dérivation des artères périphériques.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Bypass artériel – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(45, 'cardiologie-cardio-vasculaire', 'Chirurgie des varices', NULL, 'Traitement chirurgical des varices des membres inférieurs.', 'Cardiologie et Cardio-vasculaire', NULL, NULL, 'Chirurgie des varices – Cardiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:18:28', '2026-01-29 15:18:28'),
(46, 'check-up-medical', 'Consultation de suivi', NULL, 'Consultation médicale destinée au suivi global de l’état de santé.', 'Check-up Médical', NULL, NULL, 'Consultation de suivi – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(47, 'check-up-medical', 'Consultation en médecine générale', NULL, 'Consultation médicale générale pour évaluation, orientation et suivi.', 'Check-up Médical', NULL, NULL, 'Consultation en médecine générale – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(48, 'check-up-medical', 'Examen abdominal', NULL, 'Examen clinique visant à évaluer les organes et symptômes abdominaux.', 'Check-up Médical', NULL, NULL, 'Examen abdominal – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(49, 'check-up-medical', 'Ponction lombaire', NULL, 'Acte médical permettant de prélever du liquide céphalo-rachidien.', 'Check-up Médical', NULL, NULL, 'Ponction lombaire – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(50, 'check-up-medical', 'Injection de plasma riche en plaquettes (PRP)', NULL, 'Injection de PRP pour favoriser la régénération et la réparation tissulaire.', 'Check-up Médical', NULL, NULL, 'Injection PRP – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(51, 'check-up-medical', 'Injection de cellules souches', NULL, 'Injection à visée régénérative selon indication médicale.', 'Check-up Médical', NULL, NULL, 'Injection de cellules souches – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(52, 'check-up-medical', 'Injection d’exosomes', NULL, 'Injection d’exosomes à visée régénérative selon protocole.', 'Check-up Médical', NULL, NULL, 'Injection d’exosomes – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(53, 'check-up-medical', 'Médecine hyperbare', NULL, 'Prise en charge par oxygénothérapie hyperbare selon indication.', 'Check-up Médical', NULL, NULL, 'Médecine hyperbare – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(54, 'check-up-medical', 'Thérapie extracorporelle par ondes de choc', NULL, 'Traitement non invasif par ondes de choc pour certaines indications.', 'Check-up Médical', NULL, NULL, 'Ondes de choc – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(55, 'check-up-medical', 'Traitement de la paraplégie spastique héréditaire', NULL, 'Prise en charge spécialisée visant à améliorer les symptômes et la qualité de vie.', 'Check-up Médical', NULL, NULL, 'Paraplégie spastique héréditaire – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(56, 'check-up-medical', 'Traitement du syndrome de Marfan', NULL, 'Suivi et prise en charge multidisciplinaire du syndrome de Marfan.', 'Check-up Médical', NULL, NULL, 'Syndrome de Marfan – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(57, 'check-up-medical', 'Vaccination', NULL, 'Administration de vaccins pour la prévention des maladies infectieuses.', 'Check-up Médical', NULL, NULL, 'Vaccination – Check-up Médical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(58, 'bariatrique', 'Consultation en bariatrie', NULL, 'Consultation spécialisée pour évaluer et orienter la prise en charge de l’obésité.', 'Bariatrique', NULL, NULL, 'Consultation en bariatrie – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(59, 'bariatrique', 'Ballon gastrique', NULL, 'Dispositif temporaire visant à réduire la capacité de l’estomac et l’appétit.', 'Bariatrique', NULL, NULL, 'Ballon gastrique – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(60, 'bariatrique', 'Ballon gastrique Elipse', NULL, 'Ballon gastrique ingérable, sans endoscopie, selon critères médicaux.', 'Bariatrique', NULL, NULL, 'Ballon gastrique Elipse – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(61, 'bariatrique', 'Botox gastrique', NULL, 'Injection visant à diminuer la motricité gastrique et l’appétit selon indication.', 'Bariatrique', NULL, NULL, 'Botox gastrique – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(62, 'bariatrique', 'Plicature gastrique endoscopique (Imbrication gastrique)', NULL, 'Technique endoscopique réduisant le volume gastrique par plicatures.', 'Bariatrique', NULL, NULL, 'Plicature gastrique endoscopique – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(63, 'bariatrique', 'Sleeve gastrectomie', NULL, 'Chirurgie bariatrique réduisant la taille de l’estomac (gastrectomie longitudinale).', 'Bariatrique', NULL, NULL, 'Sleeve gastrectomie – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(64, 'bariatrique', 'Bypass gastrique', NULL, 'Chirurgie bariatrique modifiant le circuit digestif pour perte de poids et métabolisme.', 'Bariatrique', NULL, NULL, 'Bypass gastrique – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(65, 'bariatrique', 'Chirurgie métabolique', NULL, 'Interventions visant à améliorer le métabolisme (diabète, syndrome métabolique) selon indication.', 'Bariatrique', NULL, NULL, 'Chirurgie métabolique – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(66, 'bariatrique', 'Dépose du ballon gastrique', NULL, 'Retrait du ballon gastrique après la période prévue ou selon nécessité.', 'Bariatrique', NULL, NULL, 'Dépose du ballon gastrique – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(67, 'bariatrique', 'Dérivation biliopancréatique avec switch duodénal', NULL, 'Chirurgie bariatrique avancée combinant restriction et malabsorption selon indication.', 'Bariatrique', NULL, NULL, 'Switch duodénal – Bariatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(68, 'chirurgie-generale', 'Consultation en chirurgie générale', NULL, 'Consultation spécialisée pour évaluer une indication chirurgicale et planifier la prise en charge.', 'Chirurgie Générale', NULL, NULL, 'Consultation – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(69, 'chirurgie-generale', 'Coelioscopie diagnostique', NULL, 'Exploration diagnostique mini-invasive de la cavité abdominale.', 'Chirurgie Générale', NULL, NULL, 'Coelioscopie diagnostique – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(70, 'chirurgie-generale', 'Laparoscopie', NULL, 'Technique chirurgicale mini-invasive réalisée par petites incisions.', 'Chirurgie Générale', NULL, NULL, 'Laparoscopie – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(71, 'chirurgie-generale', 'Laparotomie', NULL, 'Intervention chirurgicale par ouverture de l’abdomen.', 'Chirurgie Générale', NULL, NULL, 'Laparotomie – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(72, 'chirurgie-generale', 'Chirurgie stéréotaxique', NULL, 'Technique guidée avec précision pour interventions ciblées selon indication.', 'Chirurgie Générale', NULL, NULL, 'Chirurgie stéréotaxique – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(73, 'chirurgie-generale', 'Ablation d\'un kyste', NULL, 'Exérèse chirurgicale d’un kyste selon localisation et diagnostic.', 'Chirurgie Générale', NULL, NULL, 'Ablation d’un kyste – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(74, 'chirurgie-generale', 'Ablation d\'un lipome', NULL, 'Exérèse d’un lipome (tumeur graisseuse bénigne) sous anesthésie adaptée.', 'Chirurgie Générale', NULL, NULL, 'Ablation d’un lipome – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(75, 'chirurgie-generale', 'Biopsie du ganglion lymphatique', NULL, 'Prélèvement d’un ganglion pour analyse anatomopathologique.', 'Chirurgie Générale', NULL, NULL, 'Biopsie ganglion lymphatique – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(76, 'chirurgie-generale', 'Curage ganglionnaire lymphatique', NULL, 'Ablation de ganglions dans un but diagnostique ou thérapeutique.', 'Chirurgie Générale', NULL, NULL, 'Curage ganglionnaire – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(77, 'chirurgie-generale', 'Extraction de tumeur mammaire', NULL, 'Ablation chirurgicale d’une tumeur du sein selon bilan et indication.', 'Chirurgie Générale', NULL, NULL, 'Extraction tumeur mammaire – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(78, 'chirurgie-generale', 'Tumorectomie du sein', NULL, 'Ablation partielle ciblée d’une lésion mammaire (chirurgie conservatrice).', 'Chirurgie Générale', NULL, NULL, 'Tumorectomie du sein – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(79, 'chirurgie-generale', 'Adrenalectomie', NULL, 'Ablation chirurgicale d’une glande surrénale selon indication.', 'Chirurgie Générale', NULL, NULL, 'Adrenalectomie – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(80, 'chirurgie-generale', 'Thyroïdectomie', NULL, 'Ablation partielle ou totale de la thyroïde selon indication médicale.', 'Chirurgie Générale', NULL, NULL, 'Thyroïdectomie – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(81, 'chirurgie-generale', 'Gastrectomie', NULL, 'Ablation partielle ou totale de l’estomac selon indication.', 'Chirurgie Générale', NULL, NULL, 'Gastrectomie – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(82, 'chirurgie-generale', 'Hépatectomie', NULL, 'Résection d’une partie du foie selon pathologie.', 'Chirurgie Générale', NULL, NULL, 'Hépatectomie – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(83, 'chirurgie-generale', 'Chirurgie de la hernie hiatale', NULL, 'Intervention visant à corriger une hernie hiatale et/ou un reflux associé.', 'Chirurgie Générale', NULL, NULL, 'Hernie hiatale – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(84, 'chirurgie-generale', 'Chirurgie de la cholécystite', NULL, 'Traitement chirurgical de l’inflammation de la vésicule biliaire.', 'Chirurgie Générale', NULL, NULL, 'Cholécystite – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(85, 'chirurgie-generale', 'Chirurgie de la hernie abdominale', NULL, 'Réparation d’une hernie de la paroi abdominale.', 'Chirurgie Générale', NULL, NULL, 'Hernie abdominale – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(86, 'chirurgie-generale', 'Opération d\'une hernie ombilicale', NULL, 'Réparation chirurgicale d’une hernie ombilicale.', 'Chirurgie Générale', NULL, NULL, 'Hernie ombilicale – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(87, 'chirurgie-generale', 'Traitement de la hernie', NULL, 'Prise en charge chirurgicale des hernies selon type et localisation.', 'Chirurgie Générale', NULL, NULL, 'Traitement de la hernie – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(88, 'chirurgie-generale', 'Traitement de l\'abcès du sein', NULL, 'Drainage et prise en charge chirurgicale d’un abcès mammaire.', 'Chirurgie Générale', NULL, NULL, 'Abcès du sein – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(89, 'chirurgie-generale', 'Trachéostomie', NULL, 'Création d’un orifice trachéal pour assistance respiratoire selon indication.', 'Chirurgie Générale', NULL, NULL, 'Trachéostomie – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(90, 'chirurgie-generale', 'Chirurgie robotique', NULL, 'Intervention réalisée avec assistance robotique pour améliorer précision et contrôle.', 'Chirurgie Générale', NULL, NULL, 'Chirurgie robotique – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(91, 'chirurgie-generale', 'Soins post-opératoires', NULL, 'Suivi et soins après chirurgie pour optimiser la récupération et prévenir les complications.', 'Chirurgie Générale', NULL, NULL, 'Soins post-opératoires – Chirurgie Générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:21:09', '2026-01-29 15:21:09'),
(92, 'chirurgie-colorectale', 'Consultation en chirurgie colorectale', NULL, 'Consultation spécialisée pour les pathologies du côlon, rectum et anus.', 'Chirurgie Colorectale', NULL, NULL, 'Consultation – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(93, 'chirurgie-colorectale', 'Colectomie', NULL, 'Ablation partielle ou totale du côlon selon indication.', 'Chirurgie Colorectale', NULL, NULL, 'Colectomie – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(94, 'chirurgie-colorectale', 'Résection endoscopique pleine épaisseur', NULL, 'Exérèse endoscopique complète de lésions digestives.', 'Chirurgie Colorectale', NULL, NULL, 'Résection endoscopique – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(95, 'chirurgie-colorectale', 'Ablation des glandes anales', NULL, 'Ablation chirurgicale des glandes anales pathologiques.', 'Chirurgie Colorectale', NULL, NULL, 'Ablation glandes anales – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(96, 'chirurgie-colorectale', 'Extraction de kyste anal', NULL, 'Exérèse d’un kyste de la région anale.', 'Chirurgie Colorectale', NULL, NULL, 'Kyste anal – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(97, 'chirurgie-colorectale', 'Réparation du sphincter anal', NULL, 'Chirurgie visant à restaurer la continence anale.', 'Chirurgie Colorectale', NULL, NULL, 'Sphincter anal – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(98, 'chirurgie-colorectale', 'Chirurgie laser des hémorroïdes (Hémorroïdectomie)', NULL, 'Traitement chirurgical des hémorroïdes par laser.', 'Chirurgie Colorectale', NULL, NULL, 'Hémorroïdectomie laser – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(99, 'chirurgie-colorectale', 'Ligature élastique pour traitement des hémorroïdes', NULL, 'Traitement mini-invasif des hémorroïdes par ligature.', 'Chirurgie Colorectale', NULL, NULL, 'Ligature élastique – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(100, 'chirurgie-colorectale', 'Traitement des fissures anales', NULL, 'Prise en charge médicale ou chirurgicale des fissures anales.', 'Chirurgie Colorectale', NULL, NULL, 'Fissures anales – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(101, 'chirurgie-colorectale', 'Chirurgie des fistules anales', NULL, 'Traitement chirurgical des fistules anales.', 'Chirurgie Colorectale', NULL, NULL, 'Fistules anales – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(102, 'chirurgie-colorectale', 'Chirurgie des maladies inflammatoires de l’intestin', NULL, 'Interventions pour maladies inflammatoires intestinales.', 'Chirurgie Colorectale', NULL, NULL, 'MICI – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(103, 'chirurgie-colorectale', 'Traitement de la maladie de Crohn', NULL, 'Prise en charge chirurgicale des complications de la maladie de Crohn.', 'Chirurgie Colorectale', NULL, NULL, 'Maladie de Crohn – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(104, 'chirurgie-colorectale', 'Traitement de la colite ulcéreuse', NULL, 'Traitement chirurgical des formes sévères de colite ulcéreuse.', 'Chirurgie Colorectale', NULL, NULL, 'Colite ulcéreuse – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(105, 'chirurgie-colorectale', 'Chirurgie de la diverticulose', NULL, 'Intervention pour complications de la diverticulose.', 'Chirurgie Colorectale', NULL, NULL, 'Diverticulose – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(106, 'chirurgie-colorectale', 'Traitement de la diverticulose', NULL, 'Prise en charge médicale ou chirurgicale de la diverticulose.', 'Chirurgie Colorectale', NULL, NULL, 'Traitement diverticulose – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(107, 'chirurgie-colorectale', 'Chirurgie pour la constipation chronique', NULL, 'Traitement chirurgical de la constipation sévère résistante.', 'Chirurgie Colorectale', NULL, NULL, 'Constipation chronique – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(108, 'chirurgie-colorectale', 'Chirurgie pour rectocèle', NULL, 'Correction chirurgicale d’une rectocèle.', 'Chirurgie Colorectale', NULL, NULL, 'Rectocèle – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(109, 'chirurgie-colorectale', 'Traitement de l’incontinence fécale', NULL, 'Prise en charge chirurgicale de l’incontinence fécale.', 'Chirurgie Colorectale', NULL, NULL, 'Incontinence fécale – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(110, 'chirurgie-colorectale', 'Iléostomie', NULL, 'Création d’une dérivation de l’intestin grêle.', 'Chirurgie Colorectale', NULL, NULL, 'Iléostomie – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(111, 'chirurgie-colorectale', 'Colostomie', NULL, 'Création d’une dérivation du côlon.', 'Chirurgie Colorectale', NULL, NULL, 'Colostomie – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(112, 'chirurgie-colorectale', 'Proctoscopie', NULL, 'Examen endoscopique du rectum et de l’anus.', 'Chirurgie Colorectale', NULL, NULL, 'Proctoscopie – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(113, 'chirurgie-colorectale', 'Manométrie anorectale', NULL, 'Mesure des pressions anorectales pour troubles fonctionnels.', 'Chirurgie Colorectale', NULL, NULL, 'Manométrie anorectale – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(114, 'chirurgie-colorectale', 'Massage prostatique', NULL, 'Acte médical à visée diagnostique ou thérapeutique.', 'Chirurgie Colorectale', NULL, NULL, 'Massage prostatique – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(115, 'chirurgie-colorectale', 'Résection segmentaire du côlon', NULL, 'Ablation d’un segment du côlon.', 'Chirurgie Colorectale', NULL, NULL, 'Résection colique – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(116, 'chirurgie-colorectale', 'Chirurgie des polypes colorectaux', NULL, 'Exérèse chirurgicale des polypes du côlon ou rectum.', 'Chirurgie Colorectale', NULL, NULL, 'Polypes colorectaux – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(117, 'chirurgie-colorectale', 'Chirurgie des abcès péri-anaux', NULL, 'Drainage et traitement des abcès péri-anaux.', 'Chirurgie Colorectale', NULL, NULL, 'Abcès péri-anal – Chirurgie Colorectale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(118, 'chirurgie-spinale', 'Consultation pour la chirurgie de la colonne vertébrale', NULL, 'Consultation spécialisée pour pathologies vertébrales.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Consultation – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(119, 'chirurgie-spinale', 'Examen de la colonne vertébrale', NULL, 'Évaluation clinique et radiologique du rachis.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Examen colonne vertébrale – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(120, 'chirurgie-spinale', 'Ablation d\'une tumeur de la moelle osseuse', NULL, 'Exérèse chirurgicale d’une tumeur médullaire.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Tumeur médullaire – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(121, 'chirurgie-spinale', 'Traitement d\'un abcès de la moelle épinière', NULL, 'Prise en charge chirurgicale d’un abcès médullaire.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Abcès médullaire – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(122, 'chirurgie-spinale', 'Traitement d\'une malformation artérioveineuse de la moelle épinière', NULL, 'Traitement chirurgical des MAV médullaires.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'MAV médullaire – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(123, 'chirurgie-spinale', 'Traitement de la discopathie dégénérative', NULL, 'Prise en charge des disques intervertébraux dégénérés.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Discopathie dégénérative – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(124, 'chirurgie-spinale', 'Traitement de la discopathie des lombaires', NULL, 'Traitement des atteintes discales lombaires.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Discopathie lombaire – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(125, 'chirurgie-spinale', 'Traitement de la spondylose cervicale', NULL, 'Prise en charge des lésions dégénératives cervicales.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Spondylose cervicale – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(126, 'chirurgie-spinale', 'Traitement de la spondylose lombaire', NULL, 'Traitement des lésions dégénératives lombaires.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Spondylose lombaire – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(127, 'chirurgie-spinale', 'Traitement de la sténose rachidienne', NULL, 'Décompression chirurgicale du canal rachidien.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Sténose rachidienne – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(128, 'chirurgie-spinale', 'Traitement de la hernie discale', NULL, 'Traitement chirurgical des hernies discales.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Hernie discale – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(129, 'chirurgie-spinale', 'Nucleoplasty', NULL, 'Technique mini-invasive de réduction discale.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Nucleoplasty – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(130, 'chirurgie-spinale', 'Thérapie électrothermique intradiscale', NULL, 'Traitement thermique ciblé du disque intervertébral.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Thérapie intradiscale – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(131, 'chirurgie-spinale', 'Chirurgie de la scoliose', NULL, 'Correction chirurgicale des déformations scoliotiques.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Scoliose – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(132, 'chirurgie-spinale', 'Traitement d\'une cyphose', NULL, 'Correction chirurgicale des déformations cyphotiques.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Cyphose – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(133, 'chirurgie-spinale', 'Stabilisation de la colonne vertébrale', NULL, 'Stabilisation chirurgicale du rachis.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Stabilisation rachidienne – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(134, 'chirurgie-spinale', 'Stabilisation de la spondylolisthésis', NULL, 'Correction chirurgicale du glissement vertébral.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Spondylolisthésis – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(135, 'chirurgie-spinale', 'Chirurgie de fusion des vertèbres', NULL, 'Fusion vertébrale pour stabilisation.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Fusion vertébrale – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(136, 'chirurgie-spinale', 'Corpectomie', NULL, 'Ablation d’un corps vertébral pathologique.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Corpectomie – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(137, 'chirurgie-spinale', 'Arthroscopie de la colonne vertébrale', NULL, 'Exploration mini-invasive du rachis.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Arthroscopie rachidienne – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(138, 'chirurgie-spinale', 'Kyphoplastie', NULL, 'Stabilisation des fractures vertébrales par ciment.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Kyphoplastie – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(139, 'chirurgie-spinale', 'Vertébroplastie', NULL, 'Traitement des fractures vertébrales par injection de ciment.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Vertébroplastie – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(140, 'chirurgie-spinale', 'Prothèse discale lombaire ou cervicale', NULL, 'Remplacement d’un disque intervertébral.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Prothèse discale – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(141, 'chirurgie-spinale', 'Foraminotomie', NULL, 'Décompression des racines nerveuses.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Foraminotomie – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(142, 'chirurgie-spinale', 'Laminectomie', NULL, 'Ablation partielle des lames vertébrales pour décompression.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Laminectomie – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(143, 'chirurgie-spinale', 'Traitement de fractures vertébrales', NULL, 'Prise en charge chirurgicale des fractures du rachis.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Fractures vertébrales – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(144, 'chirurgie-spinale', 'Traitement des blessures de la moelle épinière', NULL, 'Traitement chirurgical des lésions médullaires.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Blessures médullaires – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(145, 'chirurgie-spinale', 'Chirurgie pour spondylodiscite (infection discale)', NULL, 'Traitement chirurgical des infections discales.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Spondylodiscite – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(146, 'chirurgie-spinale', 'Chirurgie pour kystes ou tumeurs intradurales', NULL, 'Exérèse de lésions intradurales.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Tumeurs intradurales – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(147, 'chirurgie-spinale', 'Décompression radiculaire cervicale / lombaire', NULL, 'Libération des racines nerveuses comprimées.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Décompression radiculaire – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(148, 'chirurgie-spinale', 'Chirurgie de la hernie foraminale', NULL, 'Traitement des hernies foraminales.', 'Chirurgie de la Colonne Vertébrale / Spinale', NULL, NULL, 'Hernie foraminale – Chirurgie Spinale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(149, 'chirurgie-maxillo-faciale', 'Consultation en chirurgie maxillo-faciale', NULL, 'Consultation spécialisée du visage et des mâchoires.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Consultation – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(150, 'chirurgie-maxillo-faciale', 'Réduction des fractures maxillaires et mandibulaires', NULL, 'Traitement chirurgical des fractures des mâchoires.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Fractures maxillaires – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(151, 'chirurgie-maxillo-faciale', 'Réduction des fractures orbitaires', NULL, 'Correction chirurgicale des fractures de l’orbite.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Fractures orbitaires – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(152, 'chirurgie-maxillo-faciale', 'Réduction des fractures zygomatiques', NULL, 'Traitement des fractures de l’os zygomatique.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Fractures zygomatiques – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(153, 'chirurgie-maxillo-faciale', 'Réduction des fractures nasales', NULL, 'Correction des fractures du nez.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Fractures nasales – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(154, 'chirurgie-maxillo-faciale', 'Ostéotomie maxillaire et mandibulaire', NULL, 'Chirurgie correctrice des mâchoires.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Ostéotomie maxillaire – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(155, 'chirurgie-maxillo-faciale', 'Chirurgie correctrice du prognathisme', NULL, 'Correction chirurgicale des anomalies de position des mâchoires.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Prognathisme – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(156, 'chirurgie-maxillo-faciale', 'Chirurgie reconstructive faciale', NULL, 'Reconstruction du visage après traumatisme ou pathologie.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Reconstruction faciale – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(157, 'chirurgie-maxillo-faciale', 'Ablation de tumeur maxillo-faciale', NULL, 'Exérèse chirurgicale de tumeurs faciales.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Tumeur maxillo-faciale – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(158, 'chirurgie-maxillo-faciale', 'Ablation de kyste maxillaire', NULL, 'Exérèse d’un kyste du maxillaire.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Kyste maxillaire – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(159, 'chirurgie-maxillo-faciale', 'Ablation de kyste mandibulaire', NULL, 'Exérèse d’un kyste de la mandibule.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Kyste mandibulaire – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(160, 'chirurgie-maxillo-faciale', 'Biopsie de tumeur faciale', NULL, 'Prélèvement d’une lésion faciale pour analyse.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Biopsie faciale – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(161, 'chirurgie-maxillo-faciale', 'Reconstruction après excision tumorale', NULL, 'Reconstruction après ablation de tumeur faciale.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Reconstruction post-tumorale – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(162, 'chirurgie-maxillo-faciale', 'Extraction de dents incluses / impactées', NULL, 'Extraction chirurgicale de dents incluses.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Dents incluses – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(163, 'chirurgie-maxillo-faciale', 'Chirurgie des kystes et tumeurs de la mâchoire', NULL, 'Traitement chirurgical des lésions des mâchoires.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Tumeurs de la mâchoire – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(164, 'chirurgie-maxillo-faciale', 'Ablation des glandes salivaires', NULL, 'Exérèse chirurgicale des glandes salivaires pathologiques.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Glandes salivaires – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46');
INSERT INTO `medical_procedures` (`id_procedure`, `category_key`, `nom_procedure`, `slug`, `short_description`, `categorie`, `sous_categorie`, `description`, `seo_title`, `seo_description`, `code_reference`, `img_procedure`, `duree_moyenne`, `is_active`, `is_featured`, `language`, `sort_order`, `meta`, `created_at`, `updated_at`) VALUES
(165, 'chirurgie-maxillo-faciale', 'Drainage d’abcès de la cavité buccale', NULL, 'Drainage chirurgical des abcès buccaux.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Abcès buccal – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(166, 'chirurgie-maxillo-faciale', 'Arthroplastie de l’ATM', NULL, 'Chirurgie de l’articulation temporo-mandibulaire.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Arthroplastie ATM – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(167, 'chirurgie-maxillo-faciale', 'Résection et reconstruction de l’ATM', NULL, 'Traitement chirurgical complexe de l’ATM.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'ATM – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(168, 'chirurgie-maxillo-faciale', 'Traitement des luxations mandibulaires', NULL, 'Correction des luxations de la mâchoire.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Luxation mandibulaire – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(169, 'chirurgie-maxillo-faciale', 'Greffe osseuse maxillaire / mandibulaire', NULL, 'Greffe osseuse pour reconstruction maxillo-faciale.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Greffe osseuse – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(170, 'chirurgie-maxillo-faciale', 'Reconstruction après traumatisme ou tumeur', NULL, 'Reconstruction du visage après traumatisme ou tumeur.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Reconstruction faciale – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(171, 'chirurgie-maxillo-faciale', 'Utilisation d’implants dento-faciaux', NULL, 'Implants pour restauration fonctionnelle et esthétique.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'Implants dento-faciaux – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(172, 'chirurgie-maxillo-faciale', 'Régénération osseuse guidée (GBR)', NULL, 'Technique favorisant la régénération osseuse contrôlée.', 'Chirurgie Maxillo-Faciale', NULL, NULL, 'GBR – Chirurgie Maxillo-Faciale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(173, 'chirurgie-pediatrique', 'Consultation en chirurgie pédiatrique', NULL, 'Consultation spécialisée pour pathologies chirurgicales de l’enfant.', 'Chirurgie Pédiatrique', NULL, NULL, 'Consultation – Chirurgie Pédiatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:25:46', '2026-01-29 15:25:46'),
(174, 'chirurgie-esthetique', 'Consultation en chirurgie esthétique', NULL, 'Consultation spécialisée pour évaluer les besoins et options en chirurgie esthétique.', 'Chirurgie Esthétique', NULL, NULL, 'Consultation – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(175, 'chirurgie-esthetique', 'J Plasma Renuvion', NULL, 'Traitement de raffermissement cutané par énergie plasma et radiofréquence.', 'Chirurgie Esthétique', NULL, NULL, 'J Plasma Renuvion – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(176, 'chirurgie-esthetique', 'Liposuccion', NULL, 'Technique chirurgicale visant à éliminer les excès de graisse localisés.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(177, 'chirurgie-esthetique', 'Liposuccion 360°', NULL, 'Liposuccion complète du tronc pour une silhouette harmonieuse.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion 360 – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(178, 'chirurgie-esthetique', 'Liposuccion abdominale', NULL, 'Élimination des amas graisseux au niveau de l’abdomen.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion abdominale – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(179, 'chirurgie-esthetique', 'Liposuccion du dos', NULL, 'Traitement des excès graisseux du dos.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion du dos – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(180, 'chirurgie-esthetique', 'Liposuccion des bras', NULL, 'Affinement des bras par aspiration de graisse.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion des bras – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(181, 'chirurgie-esthetique', 'Liposuccion des cuisses', NULL, 'Traitement des amas graisseux des cuisses.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion des cuisses – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(182, 'chirurgie-esthetique', 'Liposuccion des mollets', NULL, 'Affinement des mollets par liposuccion ciblée.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion des mollets – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(183, 'chirurgie-esthetique', 'Liposuccion des fesses / hanches', NULL, 'Redéfinition des fesses et hanches par liposuccion.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion fesses hanches – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(184, 'chirurgie-esthetique', 'Liposuccion du cou / double menton', NULL, 'Réduction du double menton et du cou par liposuccion.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion double menton – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(185, 'chirurgie-esthetique', 'Liposuccion des genoux', NULL, 'Affinement de la zone des genoux.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion des genoux – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(186, 'chirurgie-esthetique', 'Liposuccion pubienne', NULL, 'Correction des excès graisseux de la région pubienne.', 'Chirurgie Esthétique', NULL, NULL, 'Liposuccion pubienne – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(187, 'chirurgie-esthetique', 'Bichectomie (Liposuccion des joues)', NULL, 'Affinement du visage par retrait des boules de Bichat.', 'Chirurgie Esthétique', NULL, NULL, 'Bichectomie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(188, 'chirurgie-esthetique', 'Abdominal etching (Sculpture abdominale) Six-pack', NULL, 'Sculpture abdominale pour un effet six-pack.', 'Chirurgie Esthétique', NULL, NULL, 'Abdominal etching – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(189, 'chirurgie-esthetique', 'Lifting du corps complet', NULL, 'Remodelage global du corps après perte de poids massive.', 'Chirurgie Esthétique', NULL, NULL, 'Body contouring – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(190, 'chirurgie-esthetique', 'Rénovation post-grossesse (Mommy Makeover)', NULL, 'Association d’interventions pour restaurer la silhouette après grossesse.', 'Chirurgie Esthétique', NULL, NULL, 'Mommy Makeover – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(191, 'chirurgie-esthetique', 'Abdominoplastie', NULL, 'Remise en tension de la paroi abdominale et retrait de l’excès cutané.', 'Chirurgie Esthétique', NULL, NULL, 'Abdominoplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(192, 'chirurgie-esthetique', 'Traitement de la diastase abdominale', NULL, 'Correction chirurgicale de l’écartement des muscles abdominaux.', 'Chirurgie Esthétique', NULL, NULL, 'Diastase abdominale – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(193, 'chirurgie-esthetique', 'Lifting du visage complet', NULL, 'Rajeunissement global du visage par chirurgie.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting du visage – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(194, 'chirurgie-esthetique', 'Mini-lifting du visage', NULL, 'Rajeunissement ciblé du visage avec cicatrices réduites.', 'Chirurgie Esthétique', NULL, NULL, 'Mini-lifting – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(195, 'chirurgie-esthetique', 'Lifting médio-facial', NULL, 'Correction du relâchement de la partie centrale du visage.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting médio-facial – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(196, 'chirurgie-esthetique', 'Lifting endoscopique du visage', NULL, 'Technique mini-invasive pour rajeunissement facial.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting endoscopique – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(197, 'chirurgie-esthetique', 'Lipofilling du visage et corps', NULL, 'Injection de graisse autologue pour restauration des volumes.', 'Chirurgie Esthétique', NULL, NULL, 'Lipofilling – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(198, 'chirurgie-esthetique', 'Lifting du front', NULL, 'Correction des rides et du relâchement frontal.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting du front – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(199, 'chirurgie-esthetique', 'Lifting temporal', NULL, 'Remise en tension de la zone temporale et des sourcils.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting temporal – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(200, 'chirurgie-esthetique', 'Lifting des sourcils', NULL, 'Rehaussement chirurgical des sourcils.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting des sourcils – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(201, 'chirurgie-esthetique', 'Frontoplastie', NULL, 'Chirurgie esthétique du front.', 'Chirurgie Esthétique', NULL, NULL, 'Frontoplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(202, 'chirurgie-esthetique', 'Lifting du cou (platysmaplastie)', NULL, 'Correction du relâchement cutané et musculaire du cou.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting du cou – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(203, 'chirurgie-esthetique', 'Lifting Ponytail', NULL, 'Technique moderne de lifting avec effet naturel.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting Ponytail – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(204, 'chirurgie-esthetique', 'Traitement de bosse de bison', NULL, 'Correction esthétique de l’accumulation graisseuse cervicale.', 'Chirurgie Esthétique', NULL, NULL, 'Bosse de bison – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(205, 'chirurgie-esthetique', 'Produits de comblement Macrolane/HYAcorp', NULL, 'Injection de produits volumateurs pour remodelage corporel.', 'Chirurgie Esthétique', NULL, NULL, 'Produits de comblement – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(206, 'chirurgie-esthetique', 'Lifting sous-mentonnier', NULL, 'Correction du relâchement sous le menton.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting sous-mentonnier – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(207, 'chirurgie-esthetique', 'Lifting des bras (Brachioplastie)', NULL, 'Remodelage et raffermissement des bras.', 'Chirurgie Esthétique', NULL, NULL, 'Brachioplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(208, 'chirurgie-esthetique', 'Lifting des cuisses', NULL, 'Correction du relâchement cutané des cuisses.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting des cuisses – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(209, 'chirurgie-esthetique', 'Lifting des fesses', NULL, 'Remodelage et rehaussement des fesses.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting des fesses – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(210, 'chirurgie-esthetique', 'BBL (Brazilian Butt Lift)', NULL, 'Augmentation et galbe des fesses par lipofilling.', 'Chirurgie Esthétique', NULL, NULL, 'BBL – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(211, 'chirurgie-esthetique', 'Lifting du dos', NULL, 'Correction du relâchement cutané du dos.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting du dos – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(212, 'chirurgie-esthetique', 'Lifting post-bariatrique du visage / corps', NULL, 'Chirurgie reconstructrice après perte de poids massive.', 'Chirurgie Esthétique', NULL, NULL, 'Lifting post-bariatrique – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(213, 'chirurgie-esthetique', 'Blépharoplastie', NULL, 'Correction chirurgicale des paupières supérieures et/ou inférieures.', 'Chirurgie Esthétique', NULL, NULL, 'Blépharoplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(214, 'chirurgie-esthetique', 'Canthopexie (Canthoplastie latérale / cat eyes)', NULL, 'Chirurgie esthétique du regard pour effet cat eyes.', 'Chirurgie Esthétique', NULL, NULL, 'Canthopexie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(215, 'chirurgie-esthetique', 'Fox eyes', NULL, 'Rehaussement esthétique du regard.', 'Chirurgie Esthétique', NULL, NULL, 'Fox eyes – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(216, 'chirurgie-esthetique', 'Ablation des poches orbitales', NULL, 'Traitement des poches sous les yeux.', 'Chirurgie Esthétique', NULL, NULL, 'Poches orbitales – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(217, 'chirurgie-esthetique', 'Chirurgie des paupières pour yeux creux ou gonflés', NULL, 'Correction esthétique des paupières.', 'Chirurgie Esthétique', NULL, NULL, 'Chirurgie des paupières – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(218, 'chirurgie-esthetique', 'Chirurgie de la déformation nasale de la fente labiale', NULL, 'Correction chirurgicale des séquelles de fente labiale.', 'Chirurgie Esthétique', NULL, NULL, 'Fente labiale – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(219, 'chirurgie-esthetique', 'Chirurgie de la mâchoire', NULL, 'Chirurgie esthétique ou fonctionnelle des mâchoires.', 'Chirurgie Esthétique', NULL, NULL, 'Chirurgie de la mâchoire – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(220, 'chirurgie-esthetique', 'Chirurgie des oreilles décollées (Otoplastie)', NULL, 'Correction esthétique des oreilles décollées.', 'Chirurgie Esthétique', NULL, NULL, 'Otoplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(221, 'chirurgie-esthetique', 'Reconstruction de l’oreille', NULL, 'Reconstruction de l’oreille après traumatisme ou malformation.', 'Chirurgie Esthétique', NULL, NULL, 'Reconstruction de l’oreille – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(222, 'chirurgie-esthetique', 'Réparation de trou de boucle d\'oreille', NULL, 'Correction chirurgicale du lobe d’oreille fendu.', 'Chirurgie Esthétique', NULL, NULL, 'Lobe d’oreille – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(223, 'chirurgie-esthetique', 'Élimination des grains de beauté', NULL, 'Exérèse esthétique des nævus.', 'Chirurgie Esthétique', NULL, NULL, 'Grains de beauté – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(224, 'chirurgie-esthetique', 'Chirurgie de Fossettes', NULL, 'Création esthétique de fossettes.', 'Chirurgie Esthétique', NULL, NULL, 'Fossettes – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(225, 'chirurgie-esthetique', 'Rhinoplastie', NULL, 'Chirurgie esthétique du nez.', 'Chirurgie Esthétique', NULL, NULL, 'Rhinoplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(226, 'chirurgie-esthetique', 'Rhinoplastie ultrasonique / Piezo', NULL, 'Rhinoplastie de précision assistée par ultrasons.', 'Chirurgie Esthétique', NULL, NULL, 'Rhinoplastie Piezo – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(227, 'chirurgie-esthetique', 'Rhinoplastie ethnique', NULL, 'Chirurgie du nez respectant les traits ethniques.', 'Chirurgie Esthétique', NULL, NULL, 'Rhinoplastie ethnique – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(228, 'chirurgie-esthetique', 'Rhinoplastie secondaire / Révision', NULL, 'Correction d’une rhinoplastie antérieure.', 'Chirurgie Esthétique', NULL, NULL, 'Rhinoplastie secondaire – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(229, 'chirurgie-esthetique', 'Relevé de la pointe nasale', NULL, 'Correction esthétique de la pointe du nez.', 'Chirurgie Esthétique', NULL, NULL, 'Pointe nasale – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(230, 'chirurgie-esthetique', 'Alarplastie', NULL, 'Réduction ou correction des ailes du nez.', 'Chirurgie Esthétique', NULL, NULL, 'Alarplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(231, 'chirurgie-esthetique', 'Correction de la bosse nasale', NULL, 'Suppression chirurgicale de la bosse du nez.', 'Chirurgie Esthétique', NULL, NULL, 'Bosse nasale – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(232, 'chirurgie-esthetique', 'Septoplastie', NULL, 'Correction fonctionnelle de la cloison nasale.', 'Chirurgie Esthétique', NULL, NULL, 'Septoplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(233, 'chirurgie-esthetique', 'Septorhinoplastie', NULL, 'Correction esthétique et fonctionnelle du nez.', 'Chirurgie Esthétique', NULL, NULL, 'Septorhinoplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(234, 'chirurgie-esthetique', 'Cranioplastie', NULL, 'Reconstruction esthétique ou fonctionnelle du crâne.', 'Chirurgie Esthétique', NULL, NULL, 'Cranioplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(235, 'chirurgie-esthetique', 'Reduction des pommettes', NULL, 'Affinement du visage par réduction des pommettes.', 'Chirurgie Esthétique', NULL, NULL, 'Réduction des pommettes – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(236, 'chirurgie-esthetique', 'Augmentation des pommettes', NULL, 'Augmentation du volume des pommettes.', 'Chirurgie Esthétique', NULL, NULL, 'Augmentation des pommettes – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(237, 'chirurgie-esthetique', 'Génioplastie', NULL, 'Chirurgie esthétique du menton (augmentation ou réduction).', 'Chirurgie Esthétique', NULL, NULL, 'Génioplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(238, 'chirurgie-esthetique', 'Esthétique du mamelon', NULL, 'Correction esthétique du mamelon.', 'Chirurgie Esthétique', NULL, NULL, 'Esthétique du mamelon – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(239, 'chirurgie-esthetique', 'Implants mammaires', NULL, 'Augmentation mammaire par implants.', 'Chirurgie Esthétique', NULL, NULL, 'Implants mammaires – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(240, 'chirurgie-esthetique', 'Retrait des implants mammaires', NULL, 'Ablation d’implants mammaires.', 'Chirurgie Esthétique', NULL, NULL, 'Retrait implants mammaires – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(241, 'chirurgie-esthetique', 'Révision des implants mammaires', NULL, 'Correction ou remplacement des implants mammaires.', 'Chirurgie Esthétique', NULL, NULL, 'Révision implants mammaires – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(242, 'chirurgie-esthetique', 'Lifting des seins (Mastopexie)', NULL, 'Remise en tension des seins.', 'Chirurgie Esthétique', NULL, NULL, 'Mastopexie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(243, 'chirurgie-esthetique', 'Réduction mammaire', NULL, 'Réduction du volume des seins.', 'Chirurgie Esthétique', NULL, NULL, 'Réduction mammaire – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(244, 'chirurgie-esthetique', 'Gynecomastie chirurgicale', NULL, 'Correction chirurgicale de la gynécomastie chez l’homme.', 'Chirurgie Esthétique', NULL, NULL, 'Gynécomastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(245, 'chirurgie-esthetique', 'Pectusexcavatum', NULL, 'Correction esthétique ou fonctionnelle du thorax en entonnoir.', 'Chirurgie Esthétique', NULL, NULL, 'Pectus excavatum – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(246, 'chirurgie-esthetique', 'Chirurgie de syndrome de Pologne', NULL, 'Correction des malformations thoraciques congénitales.', 'Chirurgie Esthétique', NULL, NULL, 'Syndrome de Pologne – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(247, 'chirurgie-esthetique', 'Implant des mollets', NULL, 'Augmentation esthétique des mollets par implants.', 'Chirurgie Esthétique', NULL, NULL, 'Implants des mollets – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(248, 'chirurgie-esthetique', 'Implants pectoraux', NULL, 'Augmentation esthétique des muscles pectoraux.', 'Chirurgie Esthétique', NULL, NULL, 'Implants pectoraux – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(249, 'chirurgie-esthetique', 'Lipoedème', NULL, 'Prise en charge chirurgicale du lipoedème.', 'Chirurgie Esthétique', NULL, NULL, 'Lipoedème – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(250, 'chirurgie-esthetique', 'Esthétique de la toile d’araignée', NULL, 'Traitement esthétique des veinules superficielles.', 'Chirurgie Esthétique', NULL, NULL, 'Toile d’araignée – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(251, 'chirurgie-esthetique', 'Agrandissement du pénis', NULL, 'Intervention esthétique d’augmentation pénienne.', 'Chirurgie Esthétique', NULL, NULL, 'Agrandissement du pénis – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(252, 'chirurgie-esthetique', 'Scrotoplastie', NULL, 'Chirurgie esthétique du scrotum.', 'Chirurgie Esthétique', NULL, NULL, 'Scrotoplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(253, 'chirurgie-esthetique', 'Esthétique génitale', NULL, 'Chirurgie esthétique des organes génitaux.', 'Chirurgie Esthétique', NULL, NULL, 'Esthétique génitale – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(254, 'chirurgie-esthetique', 'Clitoroplastie', NULL, 'Chirurgie esthétique du clitoris.', 'Chirurgie Esthétique', NULL, NULL, 'Clitoroplastie – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(255, 'chirurgie-esthetique', 'Rajeunissement vaginal', NULL, 'Traitement visant à améliorer la tonicité vaginale.', 'Chirurgie Esthétique', NULL, NULL, 'Rajeunissement vaginal – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(256, 'chirurgie-esthetique', 'Réparation du périnée / Perineoplasty', NULL, 'Correction chirurgicale du périnée.', 'Chirurgie Esthétique', NULL, NULL, 'Perineoplasty – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(257, 'chirurgie-esthetique', 'Reconstruction génitale post-traumatique ou post-cancer', NULL, 'Reconstruction génitale après traumatisme ou cancer.', 'Chirurgie Esthétique', NULL, NULL, 'Reconstruction génitale – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(258, 'chirurgie-esthetique', 'Correction des sillons nasogéniens', NULL, 'Correction esthétique des sillons du visage.', 'Chirurgie Esthétique', NULL, NULL, 'Sillons nasogéniens – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(259, 'chirurgie-esthetique', 'V ligne (contour de la mâchoire / jawline)', NULL, 'Redéfinition esthétique de la ligne mandibulaire.', 'Chirurgie Esthétique', NULL, NULL, 'Jawline – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(260, 'chirurgie-esthetique', 'Esthétique des lèvres', NULL, 'Augmentation ou remodelage esthétique des lèvres.', 'Chirurgie Esthétique', NULL, NULL, 'Esthétique des lèvres – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(261, 'chirurgie-esthetique', 'Exérèse des nævus', NULL, 'Ablation chirurgicale des grains de beauté.', 'Chirurgie Esthétique', NULL, NULL, 'Exérèse nævus – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(262, 'chirurgie-esthetique', 'Révision des cicatrices', NULL, 'Amélioration esthétique des cicatrices.', 'Chirurgie Esthétique', NULL, NULL, 'Révision des cicatrices – Chirurgie Esthétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:30:13', '2026-01-29 15:30:13'),
(263, 'greffes-capillaires-visage', 'Greffe de cheveux FUT', NULL, 'Technique de greffe capillaire par bandelette folliculaire.', 'Greffes Capillaires et du Visage', NULL, NULL, 'Greffe de cheveux FUT – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(264, 'greffes-capillaires-visage', 'Greffe de cheveux FUE', NULL, 'Technique de greffe capillaire par extraction folliculaire.', 'Greffes Capillaires et du Visage', NULL, NULL, 'Greffe de cheveux FUE – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(265, 'greffes-capillaires-visage', 'Greffe de cheveux DHI', NULL, 'Implantation directe des follicules capillaires.', 'Greffes Capillaires et du Visage', NULL, NULL, 'Greffe de cheveux DHI – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(266, 'greffes-capillaires-visage', 'Greffe de cheveux sans rasage', NULL, 'Greffe capillaire conservant la longueur des cheveux existants.', 'Greffes Capillaires et du Visage', NULL, NULL, 'Greffe cheveux sans rasage – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(267, 'greffes-capillaires-visage', 'Greffe de cheveux organique', NULL, 'Méthode avancée de greffe capillaire personnalisée.', 'Greffes Capillaires et du Visage', NULL, NULL, 'Greffe cheveux organique – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(268, 'greffes-capillaires-visage', 'Greffe des sourcils', NULL, 'Restauration esthétique des sourcils par greffe.', 'Greffes Capillaires et du Visage', NULL, NULL, 'Greffe des sourcils – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(269, 'greffes-capillaires-visage', 'Greffe de barbe / moustache', NULL, 'Greffe capillaire faciale pour barbe ou moustache.', 'Greffes Capillaires et du Visage', NULL, NULL, 'Greffe barbe moustache – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(270, 'greffes-capillaires-visage', 'PRP cheveux', NULL, 'Injection de PRP pour stimuler la repousse capillaire.', 'Greffes Capillaires et du Visage', NULL, NULL, 'PRP cheveux – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(271, 'greffes-capillaires-visage', 'Exosome cheveux', NULL, 'Traitement capillaire par exosomes.', 'Greffes Capillaires et du Visage', NULL, NULL, 'Exosome cheveux – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(272, 'greffes-capillaires-visage', 'Cellules souches cheveux', NULL, 'Traitement capillaire par cellules souches.', 'Greffes Capillaires et du Visage', NULL, NULL, 'Cellules souches cheveux – Greffes Capillaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(273, 'cosmetologie', 'Injection de Botox pour le visage', NULL, 'Injection de toxine botulique pour lisser les rides.', 'Cosmétologie', NULL, NULL, 'Botox visage – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(274, 'cosmetologie', 'Injection de PRP pour le visage', NULL, 'Injection de plasma riche en plaquettes pour rajeunissement.', 'Cosmétologie', NULL, NULL, 'PRP visage – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(275, 'cosmetologie', 'Injection de Fillers pour le visage', NULL, 'Injection d’acide hyaluronique pour restaurer les volumes.', 'Cosmétologie', NULL, NULL, 'Fillers visage – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(276, 'cosmetologie', 'Injection de collagène pour le visage', NULL, 'Amélioration de la fermeté et de l’élasticité cutanée.', 'Cosmétologie', NULL, NULL, 'Collagène visage – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(277, 'cosmetologie', 'Microneedling', NULL, 'Stimulation cutanée pour régénération de la peau.', 'Cosmétologie', NULL, NULL, 'Microneedling – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(278, 'cosmetologie', 'Mésothérapie & Skinboosters', NULL, 'Hydratation profonde et revitalisation de la peau.', 'Cosmétologie', NULL, NULL, 'Skinboosters – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(279, 'cosmetologie', 'Peeling chimique', NULL, 'Exfoliation chimique pour améliorer la texture de la peau.', 'Cosmétologie', NULL, NULL, 'Peeling chimique – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(280, 'cosmetologie', 'Traitement au laser CO2', NULL, 'Rajeunissement cutané par laser fractionné.', 'Cosmétologie', NULL, NULL, 'Laser CO2 – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(281, 'cosmetologie', 'Traitement des rides', NULL, 'Prise en charge esthétique des rides du visage.', 'Cosmétologie', NULL, NULL, 'Traitement des rides – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(282, 'cosmetologie', 'Traitement des cernes', NULL, 'Correction esthétique des cernes.', 'Cosmétologie', NULL, NULL, 'Traitement des cernes – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(283, 'cosmetologie', 'Ultrasons HIFU', NULL, 'Raffermissement cutané par ultrasons focalisés.', 'Cosmétologie', NULL, NULL, 'HIFU – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(284, 'cosmetologie', 'Endolifting Laser', NULL, 'Raffermissement profond par laser endoluminal.', 'Cosmétologie', NULL, NULL, 'Endolifting – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(285, 'cosmetologie', 'Traitement des vergetures', NULL, 'Amélioration de l’aspect des vergetures.', 'Cosmétologie', NULL, NULL, 'Vergetures – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(286, 'cosmetologie', 'Traitement de l’acné', NULL, 'Traitement dermatologique et esthétique de l’acné.', 'Cosmétologie', NULL, NULL, 'Acné – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(287, 'cosmetologie', 'Lifting non chirurgical et fils tenseurs', NULL, 'Rajeunissement sans chirurgie par fils tenseurs.', 'Cosmétologie', NULL, NULL, 'Fils tenseurs – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(288, 'cosmetologie', 'Lèvres russes', NULL, 'Technique de remodelage esthétique des lèvres.', 'Cosmétologie', NULL, NULL, 'Lèvres russes – Cosmétologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(289, 'dermatologie', 'Consultation en dermatologie', NULL, 'Consultation spécialisée pour maladies de la peau.', 'Dermatologie', NULL, NULL, 'Consultation dermatologie – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(290, 'dermatologie', 'Acné vulgaire', NULL, 'Prise en charge dermatologique de l’acné.', 'Dermatologie', NULL, NULL, 'Acné vulgaire – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(291, 'dermatologie', 'Dermatites inflammatoires', NULL, 'Traitement des dermatites et eczémas.', 'Dermatologie', NULL, NULL, 'Dermatites inflammatoires – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(292, 'dermatologie', 'Psoriasis chronique', NULL, 'Suivi et traitement du psoriasis.', 'Dermatologie', NULL, NULL, 'Psoriasis – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(293, 'dermatologie', 'Mycoses cutanées et unguéales', NULL, 'Traitement des infections fongiques.', 'Dermatologie', NULL, NULL, 'Mycoses – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(294, 'dermatologie', 'Troubles pigmentaires', NULL, 'Traitement de l’hyperpigmentation et du mélasma.', 'Dermatologie', NULL, NULL, 'Troubles pigmentaires – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(295, 'dermatologie', 'Verrues virales cutanées', NULL, 'Traitement des verrues virales.', 'Dermatologie', NULL, NULL, 'Verrues – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(296, 'dermatologie', 'Alopécies et calvitie', NULL, 'Prise en charge des pertes de cheveux.', 'Dermatologie', NULL, NULL, 'Alopécie – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(297, 'dermatologie', 'Infections cutanées bactériennes', NULL, 'Traitement des infections bactériennes de la peau.', 'Dermatologie', NULL, NULL, 'Infections cutanées – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(298, 'dermatologie', 'Sclérothérapie des varices superficielles', NULL, 'Traitement des varices superficielles.', 'Dermatologie', NULL, NULL, 'Sclérothérapie – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(299, 'dermatologie', 'Prise en charge de la sclérodermie', NULL, 'Suivi et traitement de la sclérodermie.', 'Dermatologie', NULL, NULL, 'Sclérodermie – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(300, 'dermatologie', 'Traitement de callosités', NULL, 'Élimination médicale des callosités.', 'Dermatologie', NULL, NULL, 'Callosités – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(301, 'dermatologie', 'Traitement de l’hyperhidrose', NULL, 'Traitement de la transpiration excessive.', 'Dermatologie', NULL, NULL, 'Hyperhidrose – Dermatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(302, 'endocrinologie', 'Consultation en endocrinologie', NULL, 'Consultation spécialisée pour troubles hormonaux.', 'Endocrinologie', NULL, NULL, 'Consultation endocrinologie – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(303, 'endocrinologie', 'Diabète', NULL, 'Prise en charge et suivi du diabète.', 'Endocrinologie', NULL, NULL, 'Diabète – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(304, 'endocrinologie', 'Troubles de la thyroïde', NULL, 'Traitement de l’hypothyroïdie et de l’hyperthyroïdie.', 'Endocrinologie', NULL, NULL, 'Troubles thyroïdiens – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(305, 'endocrinologie', 'Pathologies des glandes surrénales', NULL, 'Prise en charge des troubles surrénaliens.', 'Endocrinologie', NULL, NULL, 'Glandes surrénales – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(306, 'endocrinologie', 'Troubles de l’hormone de croissance', NULL, 'Diagnostic et traitement des troubles de croissance.', 'Endocrinologie', NULL, NULL, 'Hormone de croissance – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(307, 'endocrinologie', 'Ostéoporose', NULL, 'Diagnostic et traitement de l’ostéoporose.', 'Endocrinologie', NULL, NULL, 'Ostéoporose – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(308, 'endocrinologie', 'Pathologies de l’hypophyse', NULL, 'Prise en charge des maladies hypophysaires.', 'Endocrinologie', NULL, NULL, 'Hypophyse – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(309, 'endocrinologie', 'Dyslipidémie', NULL, 'Traitement des troubles du cholestérol.', 'Endocrinologie', NULL, NULL, 'Dyslipidémie – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(310, 'endocrinologie', 'Bilan endocrinologique', NULL, 'Évaluation hormonale complète.', 'Endocrinologie', NULL, NULL, 'Bilan endocrinologique – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(311, 'endocrinologie', 'Biopsie thyroïdienne', NULL, 'Prélèvement diagnostique de la thyroïde.', 'Endocrinologie', NULL, NULL, 'Biopsie thyroïde – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(312, 'endocrinologie', 'Traitement de l’hyperthyroïdie', NULL, 'Traitement médical ou interventionnel de l’hyperthyroïdie.', 'Endocrinologie', NULL, NULL, 'Hyperthyroïdie – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(313, 'endocrinologie', 'Traitement des adénomes thyroïdiens', NULL, 'Prise en charge des nodules et adénomes.', 'Endocrinologie', NULL, NULL, 'Adénomes thyroïdiens – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(314, 'endocrinologie', 'Hyperplasie congénitale des surrénales', NULL, 'Suivi spécialisé des troubles congénitaux.', 'Endocrinologie', NULL, NULL, 'Hyperplasie surrénale – Endocrinologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(315, 'gastro-enterologie', 'Consultation en gastro-entérologie', NULL, 'Consultation spécialisée pour troubles digestifs.', 'Gastro-entérologie', NULL, NULL, 'Consultation gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(316, 'gastro-enterologie', 'Consultation en hépatologie', NULL, 'Consultation spécialisée pour maladies du foie.', 'Gastro-entérologie', NULL, NULL, 'Consultation hépatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(317, 'gastro-enterologie', 'Ulcère gastro-duodénal', NULL, 'Diagnostic et traitement des ulcères digestifs.', 'Gastro-entérologie', NULL, NULL, 'Ulcère gastro-duodénal – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(318, 'gastro-enterologie', 'Reflux gastro-œsophagien', NULL, 'Traitement du reflux gastro-œsophagien.', 'Gastro-entérologie', NULL, NULL, 'RGO – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(319, 'gastro-enterologie', 'Maladies inflammatoires de l’intestin', NULL, 'Prise en charge des MICI.', 'Gastro-entérologie', NULL, NULL, 'MICI – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(320, 'gastro-enterologie', 'Syndrome de l’intestin irritable', NULL, 'Traitement des troubles fonctionnels intestinaux.', 'Gastro-entérologie', NULL, NULL, 'SII – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(321, 'gastro-enterologie', 'Constipation', NULL, 'Prise en charge de la constipation chronique.', 'Gastro-entérologie', NULL, NULL, 'Constipation – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(322, 'gastro-enterologie', 'Diarrhée chronique', NULL, 'Diagnostic et traitement des diarrhées chroniques.', 'Gastro-entérologie', NULL, NULL, 'Diarrhée chronique – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(323, 'gastro-enterologie', 'Hépatite virale', NULL, 'Prise en charge des hépatites virales.', 'Gastro-entérologie', NULL, NULL, 'Hépatite virale – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(324, 'gastro-enterologie', 'Cirrhose', NULL, 'Suivi et traitement de la cirrhose.', 'Gastro-entérologie', NULL, NULL, 'Cirrhose – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:33:38', '2026-01-29 15:33:38'),
(325, 'gastro-enterologie', 'Calculs biliaires', NULL, 'Diagnostic et prise en charge des lithiases biliaires.', 'Gastro-entérologie', NULL, NULL, 'Calculs biliaires – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(326, 'gastro-enterologie', 'Pancréatite aiguë et chronique', NULL, 'Prise en charge des inflammations aiguës et chroniques du pancréas.', 'Gastro-entérologie', NULL, NULL, 'Pancréatite – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(327, 'gastro-enterologie', 'Kyste pancréatique', NULL, 'Diagnostic et suivi des kystes du pancréas.', 'Gastro-entérologie', NULL, NULL, 'Kyste pancréatique – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(328, 'gastro-enterologie', 'Chirurgie de la cholécystite', NULL, 'Traitement chirurgical de l’inflammation de la vésicule biliaire.', 'Gastro-entérologie', NULL, NULL, 'Cholécystite – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(329, 'gastro-enterologie', 'Chirurgie des diverticules œsophagiens', NULL, 'Prise en charge chirurgicale des diverticules de l’œsophage.', 'Gastro-entérologie', NULL, NULL, 'Diverticules œsophagiens – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(330, 'gastro-enterologie', 'Chirurgie des kystes hépatiques', NULL, 'Traitement chirurgical des kystes du foie.', 'Gastro-entérologie', NULL, NULL, 'Kystes hépatiques – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(331, 'gastro-enterologie', 'Chirurgie des tumeurs bénignes du foie', NULL, 'Ablation chirurgicale des tumeurs hépatiques bénignes.', 'Gastro-entérologie', NULL, NULL, 'Tumeurs bénignes du foie – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(332, 'gastro-enterologie', 'Chirurgie d’adhérences intra-abdominales', NULL, 'Libération chirurgicale des adhérences abdominales.', 'Gastro-entérologie', NULL, NULL, 'Adhérences abdominales – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(333, 'gastro-enterologie', 'Pancréatectomie totale', NULL, 'Ablation totale du pancréas selon indication médicale.', 'Gastro-entérologie', NULL, NULL, 'Pancréatectomie totale – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(334, 'gastro-enterologie', 'Cardio-myotomie extra-muqueuse de Heller', NULL, 'Traitement chirurgical de l’achalasie œsophagienne.', 'Gastro-entérologie', NULL, NULL, 'Myotomie de Heller – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(335, 'gastro-enterologie', 'Réparation de perforation gastro-intestinale', NULL, 'Réparation chirurgicale des perforations digestives.', 'Gastro-entérologie', NULL, NULL, 'Perforation digestive – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(336, 'gastro-enterologie', 'Gastrotomie', NULL, 'Ouverture chirurgicale de l’estomac selon indication.', 'Gastro-entérologie', NULL, NULL, 'Gastrotomie – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(337, 'gastro-enterologie', 'Cholédochotomie', NULL, 'Ouverture du canal cholédoque pour extraction ou exploration.', 'Gastro-entérologie', NULL, NULL, 'Cholédochotomie – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(338, 'gastro-enterologie', 'Greffe de foie', NULL, 'Transplantation hépatique pour insuffisance hépatique terminale.', 'Gastro-entérologie', NULL, NULL, 'Greffe de foie – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22');
INSERT INTO `medical_procedures` (`id_procedure`, `category_key`, `nom_procedure`, `slug`, `short_description`, `categorie`, `sous_categorie`, `description`, `seo_title`, `seo_description`, `code_reference`, `img_procedure`, `duree_moyenne`, `is_active`, `is_featured`, `language`, `sort_order`, `meta`, `created_at`, `updated_at`) VALUES
(339, 'gastro-enterologie', 'Chirurgie de l’hémangiome hépatique', NULL, 'Traitement chirurgical des hémangiomes du foie.', 'Gastro-entérologie', NULL, NULL, 'Hémangiome hépatique – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(340, 'gastro-enterologie', 'Chirurgie de Whipple', NULL, 'Intervention majeure pour pathologies pancréatiques.', 'Gastro-entérologie', NULL, NULL, 'Chirurgie de Whipple – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(341, 'gastro-enterologie', 'Traitement des calculs biliaires', NULL, 'Traitement médical ou chirurgical des lithiases biliaires.', 'Gastro-entérologie', NULL, NULL, 'Traitement des calculs biliaires – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(342, 'gastro-enterologie', 'Traitement de la pancréatite', NULL, 'Prise en charge médicale et spécialisée de la pancréatite.', 'Gastro-entérologie', NULL, NULL, 'Traitement pancréatite – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(343, 'gastro-enterologie', 'Traitement du reflux gastro-œsophagien', NULL, 'Traitement médical ou interventionnel du RGO.', 'Gastro-entérologie', NULL, NULL, 'Traitement RGO – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(344, 'gastro-enterologie', 'Traitement des kystes pancréatiques', NULL, 'Suivi et traitement des lésions kystiques pancréatiques.', 'Gastro-entérologie', NULL, NULL, 'Kystes pancréatiques – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(345, 'gastro-enterologie', 'Traitement du cancer du foie', NULL, 'Prise en charge multidisciplinaire du cancer hépatique.', 'Gastro-entérologie', NULL, NULL, 'Cancer du foie – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(346, 'gastro-enterologie', 'Traitement de l’intolérance au lactose', NULL, 'Diagnostic et gestion de l’intolérance au lactose.', 'Gastro-entérologie', NULL, NULL, 'Intolérance au lactose – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(347, 'gastro-enterologie', 'Endoscopie digestive', NULL, 'Exploration endoscopique du tube digestif.', 'Gastro-entérologie', NULL, NULL, 'Endoscopie digestive – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(348, 'gastro-enterologie', 'Colonoscopie / Sigmoïdoscopie', NULL, 'Exploration endoscopique du côlon et du rectum.', 'Gastro-entérologie', NULL, NULL, 'Colonoscopie – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(349, 'gastro-enterologie', 'Œsophagoscopie', NULL, 'Exploration endoscopique de l’œsophage.', 'Gastro-entérologie', NULL, NULL, 'Œsophagoscopie – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(350, 'gastro-enterologie', 'Échographie endoscopique', NULL, 'Examen combinant endoscopie et échographie.', 'Gastro-entérologie', NULL, NULL, 'Écho-endoscopie – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(351, 'gastro-enterologie', 'CPRE', NULL, 'Exploration et traitement endoscopique des voies biliaires et pancréatiques.', 'Gastro-entérologie', NULL, NULL, 'CPRE – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(352, 'gastro-enterologie', 'Manométrie de l’œsophage', NULL, 'Mesure de la motricité œsophagienne.', 'Gastro-entérologie', NULL, NULL, 'Manométrie œsophagienne – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(353, 'gastro-enterologie', 'Surveillance du pH œsophagien', NULL, 'Évaluation de l’acidité œsophagienne.', 'Gastro-entérologie', NULL, NULL, 'pH-métrie œsophagienne – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(354, 'gastro-enterologie', 'Test d’intolérance alimentaire', NULL, 'Tests diagnostiques des intolérances alimentaires.', 'Gastro-entérologie', NULL, NULL, 'Intolérances alimentaires – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(355, 'gastro-enterologie', 'Test respiratoire à l’urée', NULL, 'Test diagnostique de l’Helicobacter pylori.', 'Gastro-entérologie', NULL, NULL, 'Test respiratoire urée – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(356, 'gastro-enterologie', 'Biopsies gastriques et coliques', NULL, 'Prélèvements endoscopiques pour analyse histologique.', 'Gastro-entérologie', NULL, NULL, 'Biopsies digestives – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(357, 'gastro-enterologie', 'Évaluation de la maladie du foie', NULL, 'Bilan complet des pathologies hépatiques.', 'Gastro-entérologie', NULL, NULL, 'Maladie du foie – Gastro-entérologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:41:22', '2026-01-29 15:41:22'),
(358, 'genetique-medicale', 'Trisomie 21', NULL, 'Dépistage, diagnostic et accompagnement de la trisomie 21.', 'Génétique médicale', NULL, NULL, 'Trisomie 21 – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(359, 'genetique-medicale', 'Fibrose kystique', NULL, 'Diagnostic et suivi de la fibrose kystique.', 'Génétique médicale', NULL, NULL, 'Fibrose kystique – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(360, 'genetique-medicale', 'Dystrophies musculaires', NULL, 'Prise en charge des maladies musculaires héréditaires.', 'Génétique médicale', NULL, NULL, 'Dystrophies musculaires – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(361, 'genetique-medicale', 'Hémophilie', NULL, 'Suivi et traitement des troubles héréditaires de la coagulation.', 'Génétique médicale', NULL, NULL, 'Hémophilie – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(362, 'genetique-medicale', 'Thalassémie', NULL, 'Diagnostic et prise en charge de la thalassémie.', 'Génétique médicale', NULL, NULL, 'Thalassémie – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(363, 'genetique-medicale', 'Syndrome de Turner', NULL, 'Diagnostic et suivi du syndrome de Turner.', 'Génétique médicale', NULL, NULL, 'Syndrome de Turner – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(364, 'genetique-medicale', 'Syndrome de Klinefelter', NULL, 'Diagnostic et prise en charge du syndrome de Klinefelter.', 'Génétique médicale', NULL, NULL, 'Syndrome de Klinefelter – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(365, 'genetique-medicale', 'Maladies métaboliques héréditaires', NULL, 'Diagnostic des maladies métaboliques génétiques.', 'Génétique médicale', NULL, NULL, 'Maladies métaboliques – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(366, 'genetique-medicale', 'Analyse chromosomique (caryotype)', NULL, 'Analyse des chromosomes pour diagnostic génétique.', 'Génétique médicale', NULL, NULL, 'Caryotype – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(367, 'genetique-medicale', 'Séquençage génétique', NULL, 'Analyse avancée de l’ADN.', 'Génétique médicale', NULL, NULL, 'Séquençage génétique – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(368, 'genetique-medicale', 'Tests de porteur', NULL, 'Dépistage des porteurs de maladies génétiques.', 'Génétique médicale', NULL, NULL, 'Tests de porteur – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(369, 'genetique-medicale', 'Diagnostic prénatal', NULL, 'Diagnostic génétique avant la naissance.', 'Génétique médicale', NULL, NULL, 'Diagnostic prénatal – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(370, 'genetique-medicale', 'Conseil génétique', NULL, 'Accompagnement et information génétique des patients.', 'Génétique médicale', NULL, NULL, 'Conseil génétique – Génétique médicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(371, 'geriatrie', 'Démence', NULL, 'Prise en charge des troubles cognitifs chez la personne âgée.', 'Gériatrie', NULL, NULL, 'Démence – Gériatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(372, 'geriatrie', 'Maladie d’Alzheimer', NULL, 'Suivi et traitement de la maladie d’Alzheimer.', 'Gériatrie', NULL, NULL, 'Alzheimer – Gériatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(373, 'geriatrie', 'Maladie de Parkinson', NULL, 'Prise en charge des troubles moteurs liés à Parkinson.', 'Gériatrie', NULL, NULL, 'Parkinson – Gériatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(374, 'geriatrie', 'Soins palliatifs', NULL, 'Accompagnement global des patients en fin de vie.', 'Gériatrie', NULL, NULL, 'Soins palliatifs – Gériatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(375, 'geriatrie', 'Gestion de la douleur', NULL, 'Prise en charge de la douleur chronique chez le sujet âgé.', 'Gériatrie', NULL, NULL, 'Gestion de la douleur – Gériatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(376, 'geriatrie', 'Prévention des complications', NULL, 'Prévention des risques liés au vieillissement.', 'Gériatrie', NULL, NULL, 'Prévention complications – Gériatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(377, 'geriatrie', 'Assistance à l’autonomie', NULL, 'Aide médicale au maintien de l’autonomie.', 'Gériatrie', NULL, NULL, 'Autonomie – Gériatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(378, 'gynecologie-obstetrique', 'Consultation en gynécologie', NULL, 'Consultation spécialisée en santé gynécologique.', 'Gynécologie obstétrique', NULL, NULL, 'Consultation gynécologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(379, 'gynecologie-obstetrique', 'Infections vaginales', NULL, 'Traitement des infections vaginales courantes.', 'Gynécologie obstétrique', NULL, NULL, 'Infections vaginales', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(380, 'gynecologie-obstetrique', 'Fibromes utérins', NULL, 'Diagnostic et traitement des fibromes.', 'Gynécologie obstétrique', NULL, NULL, 'Fibromes utérins', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(381, 'gynecologie-obstetrique', 'Endométriose', NULL, 'Prise en charge de l’endométriose.', 'Gynécologie obstétrique', NULL, NULL, 'Endométriose', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(382, 'gynecologie-obstetrique', 'Kystes ovariens', NULL, 'Diagnostic et traitement des kystes ovariens.', 'Gynécologie obstétrique', NULL, NULL, 'Kystes ovariens', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(383, 'gynecologie-obstetrique', 'Syndrome des ovaires polykystiques', NULL, 'Prise en charge du SOPK.', 'Gynécologie obstétrique', NULL, NULL, 'SOPK', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(384, 'gynecologie-obstetrique', 'Troubles menstruels', NULL, 'Traitement des irrégularités du cycle menstruel.', 'Gynécologie obstétrique', NULL, NULL, 'Troubles menstruels', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(385, 'gynecologie-obstetrique', 'Cancer gynécologique', NULL, 'Prise en charge des cancers gynécologiques.', 'Gynécologie obstétrique', NULL, NULL, 'Cancer gynécologique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(386, 'gynecologie-obstetrique', 'Suivi de grossesse', NULL, 'Suivi médical de grossesse normale ou à risque.', 'Gynécologie obstétrique', NULL, NULL, 'Suivi grossesse', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(387, 'gynecologie-obstetrique', 'Accouchement naturel', NULL, 'Accompagnement de l’accouchement physiologique.', 'Gynécologie obstétrique', NULL, NULL, 'Accouchement naturel', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(388, 'gynecologie-obstetrique', 'Césarienne', NULL, 'Accouchement par voie chirurgicale.', 'Gynécologie obstétrique', NULL, NULL, 'Césarienne', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(389, 'gynecologie-obstetrique', 'Suivi ménopause', NULL, 'Accompagnement médical de la ménopause.', 'Gynécologie obstétrique', NULL, NULL, 'Ménopause', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(390, 'gynecologie-obstetrique', 'Dépistage du cancer du col', NULL, 'Prévention et dépistage du cancer du col utérin.', 'Gynécologie obstétrique', NULL, NULL, 'Dépistage col utérin', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(391, 'gynecologie-obstetrique', 'Échographie gynécologique et obstétricale', NULL, 'Imagerie gynécologique et fœtale.', 'Gynécologie obstétrique', NULL, NULL, 'Échographie gynécologique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(392, 'gynecologie-obstetrique', 'Biopsie du sein', NULL, 'Prélèvement diagnostique du tissu mammaire.', 'Gynécologie obstétrique', NULL, NULL, 'Biopsie du sein', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(393, 'gynecologie-obstetrique', 'Hystérectomie', NULL, 'Ablation chirurgicale de l’utérus.', 'Gynécologie obstétrique', NULL, NULL, 'Hystérectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(394, 'gynecologie-obstetrique', 'Myomectomie', NULL, 'Ablation chirurgicale des fibromes.', 'Gynécologie obstétrique', NULL, NULL, 'Myomectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(395, 'gynecologie-obstetrique', 'Fertilisation in vitro (FIV)', NULL, 'Technique de procréation médicalement assistée.', 'Gynécologie obstétrique', NULL, NULL, 'FIV', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(396, 'gynecologie-obstetrique', 'Injection intracytoplasmique (ICSI)', NULL, 'Fécondation assistée par micro-injection.', 'Gynécologie obstétrique', NULL, NULL, 'ICSI', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(397, 'gynecologie-obstetrique', 'Suivi prénatal', NULL, 'Suivi médical de la grossesse.', 'Gynécologie obstétrique', NULL, NULL, 'Suivi prénatal', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:48:35', '2026-01-29 15:48:35'),
(398, 'hematologie', 'Consultation en hématologie', NULL, 'Consultation spécialisée pour maladies du sang et de la coagulation.', 'Hématologie', NULL, NULL, 'Consultation hématologie – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(399, 'hematologie', 'Anémie', NULL, 'Diagnostic et prise en charge des différentes formes d’anémie.', 'Hématologie', NULL, NULL, 'Anémie – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(400, 'hematologie', 'Thalassémie', NULL, 'Suivi et prise en charge de la thalassémie.', 'Hématologie', NULL, NULL, 'Thalassémie – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(401, 'hematologie', 'Drépanocytose / Anémie falciforme', NULL, 'Prise en charge de la drépanocytose et prévention des complications.', 'Hématologie', NULL, NULL, 'Drépanocytose – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(402, 'hematologie', 'Leucémie', NULL, 'Diagnostic, suivi et traitement des leucémies aiguës et chroniques.', 'Hématologie', NULL, NULL, 'Leucémie – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(403, 'hematologie', 'Lymphome', NULL, 'Prise en charge des lymphomes hodgkiniens et non-hodgkiniens.', 'Hématologie', NULL, NULL, 'Lymphome – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(404, 'hematologie', 'Myélome multiple', NULL, 'Diagnostic et traitement du myélome multiple.', 'Hématologie', NULL, NULL, 'Myélome multiple – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(405, 'hematologie', 'Purpura et troubles de la coagulation', NULL, 'Évaluation et prise en charge des troubles hémorragiques.', 'Hématologie', NULL, NULL, 'Troubles de la coagulation – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(406, 'hematologie', 'Thrombopénie', NULL, 'Diagnostic et traitement de la diminution des plaquettes.', 'Hématologie', NULL, NULL, 'Thrombopénie – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(407, 'hematologie', 'Numération formule sanguine (NFS / CBC)', NULL, 'Analyse des cellules sanguines (globules, plaquettes, hémoglobine).', 'Hématologie', NULL, NULL, 'NFS – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(408, 'hematologie', 'Frottis sanguin', NULL, 'Examen microscopique du sang pour analyse morphologique.', 'Hématologie', NULL, NULL, 'Frottis sanguin – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(409, 'hematologie', 'Biopsie de moelle osseuse', NULL, 'Prélèvement médullaire pour diagnostic hématologique.', 'Hématologie', NULL, NULL, 'Biopsie de moelle – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(410, 'hematologie', 'Tests de coagulation (TP, TCA, INR)', NULL, 'Bilan de coagulation pour troubles hémorragiques/thrombotiques.', 'Hématologie', NULL, NULL, 'Tests de coagulation – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(411, 'hematologie', 'Immunophénotypage', NULL, 'Analyse des cellules sanguines par marqueurs immunologiques.', 'Hématologie', NULL, NULL, 'Immunophénotypage – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(412, 'hematologie', 'Cytogénétique et séquençage génétique', NULL, 'Analyses génétiques des hémopathies.', 'Hématologie', NULL, NULL, 'Cytogénétique – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(413, 'hematologie', 'Transfusion sanguine', NULL, 'Administration de produits sanguins selon indication.', 'Hématologie', NULL, NULL, 'Transfusion sanguine – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(414, 'hematologie', 'Chimiothérapie', NULL, 'Traitement médicamenteux des cancers du sang.', 'Hématologie', NULL, NULL, 'Chimiothérapie – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(415, 'hematologie', 'Immunothérapie', NULL, 'Traitement par stimulation/modulation immunitaire.', 'Hématologie', NULL, NULL, 'Immunothérapie – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(416, 'hematologie', 'Thérapie ciblée', NULL, 'Traitements ciblant des anomalies moléculaires spécifiques.', 'Hématologie', NULL, NULL, 'Thérapies ciblées – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(417, 'hematologie', 'Greffe de moelle osseuse', NULL, 'Greffe de cellules souches hématopoïétiques.', 'Hématologie', NULL, NULL, 'Greffe de moelle – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(418, 'hematologie', 'Traitement des carences (fer, B12, folates)', NULL, 'Correction des carences responsables d’anémies.', 'Hématologie', NULL, NULL, 'Carences – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(419, 'hematologie', 'Traitement des troubles de la coagulation', NULL, 'Prise en charge par facteurs, anticoagulants ou traitements adaptés.', 'Hématologie', NULL, NULL, 'Traitement coagulation – Hématologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(420, 'radiologie-imagerie', 'Radiographie thoracique', NULL, 'Imagerie par rayons X du thorax.', 'Radiologie et imagerie médicale', NULL, NULL, 'Radiographie thoracique – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(421, 'radiologie-imagerie', 'Radiographie abdominale', NULL, 'Imagerie par rayons X de l’abdomen.', 'Radiologie et imagerie médicale', NULL, NULL, 'Radiographie abdominale – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(422, 'radiologie-imagerie', 'Radiographie osseuse', NULL, 'Radiographie des os et articulations.', 'Radiologie et imagerie médicale', NULL, NULL, 'Radiographie osseuse – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(423, 'radiologie-imagerie', 'Radio diagnostique', NULL, 'Radiologie standard pour diagnostic médical.', 'Radiologie et imagerie médicale', NULL, NULL, 'Radio diagnostique – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(424, 'radiologie-imagerie', 'Échographie', NULL, 'Imagerie par ultrasons non irradiante.', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(425, 'radiologie-imagerie', 'Échographie abdominale', NULL, 'Évaluation par ultrasons des organes abdominaux.', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie abdominale – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(426, 'radiologie-imagerie', 'Échographie pelvienne', NULL, 'Échographie des organes pelviens.', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie pelvienne – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(427, 'radiologie-imagerie', 'Échographie obstétricale', NULL, 'Suivi échographique de la grossesse.', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie obstétricale – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(428, 'radiologie-imagerie', 'Échographie mammaire', NULL, 'Exploration échographique du sein.', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie mammaire – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(429, 'radiologie-imagerie', 'Échographie complète du corps', NULL, 'Bilan échographique multi-zones selon indication.', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie corps – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(430, 'radiologie-imagerie', 'Échographie de la tête', NULL, 'Échographie de la tête selon indication (ex: nourrisson).', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie tête – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(431, 'radiologie-imagerie', 'Échographie des testicules', NULL, 'Exploration échographique testiculaire.', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie testicules – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(432, 'radiologie-imagerie', 'Échographie endoscopique', NULL, 'Écho-endoscopie digestive (EUS).', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie endoscopique – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(433, 'radiologie-imagerie', 'Échographie thyroïdienne', NULL, 'Échographie de la thyroïde et des nodules.', 'Radiologie et imagerie médicale', NULL, NULL, 'Échographie thyroïde – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(434, 'radiologie-imagerie', 'Echodoppler vasculaire', NULL, 'Évaluation du flux sanguin artériel/veineux.', 'Radiologie et imagerie médicale', NULL, NULL, 'Échodoppler vasculaire – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(435, 'radiologie-imagerie', 'Doppler', NULL, 'Mesure des flux sanguins par ultrasons doppler.', 'Radiologie et imagerie médicale', NULL, NULL, 'Doppler – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(436, 'radiologie-imagerie', 'Scanner cérébral', NULL, 'Tomodensitométrie (CT) du cerveau.', 'Radiologie et imagerie médicale', NULL, NULL, 'Scanner cérébral – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(437, 'radiologie-imagerie', 'Scanner thoracique', NULL, 'Tomodensitométrie (CT) du thorax.', 'Radiologie et imagerie médicale', NULL, NULL, 'Scanner thoracique – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(438, 'radiologie-imagerie', 'Scanner abdominal', NULL, 'Tomodensitométrie (CT) de l’abdomen.', 'Radiologie et imagerie médicale', NULL, NULL, 'Scanner abdominal – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(439, 'radiologie-imagerie', 'CT scan du corps entier', NULL, 'CT corps entier selon indication.', 'Radiologie et imagerie médicale', NULL, NULL, 'CT corps entier – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(440, 'radiologie-imagerie', 'Scanner corporel PET-MRI', NULL, 'Imagerie hybride PET et IRM selon protocole.', 'Radiologie et imagerie médicale', NULL, NULL, 'PET-MRI – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(441, 'radiologie-imagerie', 'Scanner TEP', NULL, 'Imagerie TEP (PET) pour bilan métabolique.', 'Radiologie et imagerie médicale', NULL, NULL, 'Scanner TEP – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(442, 'radiologie-imagerie', 'IRM cérébrale', NULL, 'Imagerie par résonance magnétique du cerveau.', 'Radiologie et imagerie médicale', NULL, NULL, 'IRM cérébrale – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(443, 'radiologie-imagerie', 'IRM rachidienne', NULL, 'IRM de la colonne vertébrale.', 'Radiologie et imagerie médicale', NULL, NULL, 'IRM rachidienne – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(444, 'radiologie-imagerie', 'IRM abdominale', NULL, 'IRM des organes abdominaux.', 'Radiologie et imagerie médicale', NULL, NULL, 'IRM abdominale – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(445, 'radiologie-imagerie', 'IRM mammaire', NULL, 'IRM du sein pour exploration approfondie.', 'Radiologie et imagerie médicale', NULL, NULL, 'IRM mammaire – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(446, 'radiologie-imagerie', 'Cholangiopancréatographie par IRM', NULL, 'IRM des voies biliaires et pancréatiques (MRCP).', 'Radiologie et imagerie médicale', NULL, NULL, 'MRCP – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(447, 'radiologie-imagerie', 'MRA du corps entier', NULL, 'Angio-IRM (MRA) selon indication.', 'Radiologie et imagerie médicale', NULL, NULL, 'MRA – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(448, 'radiologie-imagerie', 'Mammographie / Imagerie mammaire', NULL, 'Imagerie de dépistage/diagnostic du sein.', 'Radiologie et imagerie médicale', NULL, NULL, 'Mammographie – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(449, 'radiologie-imagerie', 'Angiographie', NULL, 'Imagerie des vaisseaux par produit de contraste.', 'Radiologie et imagerie médicale', NULL, NULL, 'Angiographie – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(450, 'radiologie-imagerie', 'Angiographie cérébrale', NULL, 'Exploration des vaisseaux cérébraux.', 'Radiologie et imagerie médicale', NULL, NULL, 'Angiographie cérébrale – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(451, 'radiologie-imagerie', 'Angiographie rénale', NULL, 'Exploration des artères rénales.', 'Radiologie et imagerie médicale', NULL, NULL, 'Angiographie rénale – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(452, 'radiologie-imagerie', 'Angiographie par tomodensitométrie', NULL, 'Angio-scanner (CTA) des vaisseaux.', 'Radiologie et imagerie médicale', NULL, NULL, 'Angio-scanner – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(453, 'radiologie-imagerie', 'Biopsie stéréotaxique du sein', NULL, 'Biopsie mammaire guidée par imagerie.', 'Radiologie et imagerie médicale', NULL, NULL, 'Biopsie stéréotaxique – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(454, 'radiologie-imagerie', 'Biopsie sous imagerie', NULL, 'Prélèvement guidé par échographie/CT/IRM.', 'Radiologie et imagerie médicale', NULL, NULL, 'Biopsie guidée – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(455, 'radiologie-imagerie', 'Drainage guidé par imagerie', NULL, 'Drainage d’une collection sous guidage radiologique.', 'Radiologie et imagerie médicale', NULL, NULL, 'Drainage guidé – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(456, 'radiologie-imagerie', 'Infiltrations articulaires sous imagerie', NULL, 'Injection thérapeutique guidée dans une articulation.', 'Radiologie et imagerie médicale', NULL, NULL, 'Infiltration sous imagerie – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(457, 'radiologie-imagerie', 'Densitométrie osseuse', NULL, 'Mesure de la densité minérale osseuse (DXA).', 'Radiologie et imagerie médicale', NULL, NULL, 'Densitométrie osseuse – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(458, 'radiologie-imagerie', 'Fibroscan du foie', NULL, 'Évaluation non invasive de la fibrose hépatique.', 'Radiologie et imagerie médicale', NULL, NULL, 'Fibroscan – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(459, 'radiologie-imagerie', 'Fluoroscopie', NULL, 'Imagerie dynamique en temps réel par rayons X.', 'Radiologie et imagerie médicale', NULL, NULL, 'Fluoroscopie – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(460, 'radiologie-imagerie', 'Scintigraphie', NULL, 'Imagerie nucléaire fonctionnelle selon organe.', 'Radiologie et imagerie médicale', NULL, NULL, 'Scintigraphie – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(461, 'radiologie-imagerie', 'PET Scan', NULL, 'Tomographie par émission de positons (PET).', 'Radiologie et imagerie médicale', NULL, NULL, 'PET Scan – Radiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(462, 'radiologie-imagerie', 'Electroencéphalographie (EEG)', NULL, 'Enregistrement de l’activité électrique cérébrale.', 'Radiologie et imagerie médicale', NULL, NULL, 'EEG – Imagerie/Explorations', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(463, 'radiologie-imagerie', 'Electromyogramme (EMG)', NULL, 'Étude de l’activité électrique des muscles et nerfs.', 'Radiologie et imagerie médicale', NULL, NULL, 'EMG – Imagerie/Explorations', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(464, 'immunologie', 'Consultation en immunologie', NULL, 'Consultation spécialisée pour troubles du système immunitaire.', 'Immunologie', NULL, NULL, 'Consultation immunologie – Immunologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(465, 'immunologie', 'Évaluation du système immunitaire', NULL, 'Bilans pour mesurer l’activité et les défenses immunitaires.', 'Immunologie', NULL, NULL, 'Évaluation immunitaire – Immunologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(466, 'immunologie', 'Immunophénotypage', NULL, 'Analyse des populations cellulaires du système immunitaire.', 'Immunologie', NULL, NULL, 'Immunophénotypage – Immunologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(467, 'immunologie', 'Immunothérapie', NULL, 'Traitements modulant la réponse immunitaire.', 'Immunologie', NULL, NULL, 'Immunothérapie – Immunologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(468, 'immunologie', 'Traitement des maladies inflammatoires chroniques', NULL, 'Prise en charge des inflammations chroniques d’origine immune.', 'Immunologie', NULL, NULL, 'Maladies inflammatoires – Immunologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(469, 'immunologie', 'Traitement des maladies auto-immunes', NULL, 'Traitement des pathologies auto-immunes (lupus, etc.).', 'Immunologie', NULL, NULL, 'Maladies auto-immunes – Immunologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(470, 'immunologie', 'Traitement des allergies sévères', NULL, 'Prise en charge des allergies sévères et réactions majeures.', 'Immunologie', NULL, NULL, 'Allergies sévères – Immunologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(471, 'maladies-infectieuses', 'Consultation en Maladies Infectieuses', NULL, 'Consultation spécialisée pour infections aiguës ou chroniques.', 'Maladies infectieuses', NULL, NULL, 'Consultation maladies infectieuses', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(472, 'maladies-infectieuses', 'Dépistage du VIH', NULL, 'Tests et accompagnement pour dépistage du VIH.', 'Maladies infectieuses', NULL, NULL, 'Dépistage VIH – Maladies infectieuses', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(473, 'maladies-infectieuses', 'Maladie de Lyme', NULL, 'Diagnostic et traitement de la borréliose de Lyme.', 'Maladies infectieuses', NULL, NULL, 'Maladie de Lyme – Maladies infectieuses', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(474, 'maladies-infectieuses', 'Traitement de l’hépatite C', NULL, 'Prise en charge spécialisée de l’hépatite C.', 'Maladies infectieuses', NULL, NULL, 'Hépatite C – Maladies infectieuses', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(475, 'medecine-generale', 'Consultation d’un Docteur', NULL, 'Consultation de médecine générale pour diagnostic, orientation et suivi.', 'Médecine générale', NULL, NULL, 'Consultation médecin – Médecine générale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(476, 'medecine-reproduction', 'Consultation en fertilité', NULL, 'Consultation spécialisée en fertilité et projet parental.', 'Médecine de la reproduction', NULL, NULL, 'Consultation fertilité – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(477, 'medecine-reproduction', 'Infertilité féminine', NULL, 'Bilan et prise en charge de l’infertilité féminine.', 'Médecine de la reproduction', NULL, NULL, 'Infertilité féminine – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(478, 'medecine-reproduction', 'Infertilité masculine', NULL, 'Bilan et prise en charge de l’infertilité masculine.', 'Médecine de la reproduction', NULL, NULL, 'Infertilité masculine – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(479, 'medecine-reproduction', 'Bilan hormonal', NULL, 'Analyses hormonales liées à la fertilité.', 'Médecine de la reproduction', NULL, NULL, 'Bilan hormonal – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(480, 'medecine-reproduction', 'Analyse de sperme / Spermogramme', NULL, 'Analyse du sperme (concentration, mobilité, morphologie).', 'Médecine de la reproduction', NULL, NULL, 'Spermogramme – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(481, 'medecine-reproduction', 'Bilan de fertilité', NULL, 'Évaluation complète de la fertilité du couple.', 'Médecine de la reproduction', NULL, NULL, 'Bilan de fertilité – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(482, 'medecine-reproduction', 'Diagnostic génétique pré-implantatoire (DPI)', NULL, 'Analyse embryonnaire avant transfert lors de FIV.', 'Médecine de la reproduction', NULL, NULL, 'DPI – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(483, 'medecine-reproduction', 'Tests génétiques et infectieux', NULL, 'Bilans génétiques et infectieux dans le cadre PMA.', 'Médecine de la reproduction', NULL, NULL, 'Tests génétiques et infectieux – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(484, 'medecine-reproduction', 'Stimulation ovarienne', NULL, 'Stimulation hormonale pour induction/optimisation de l’ovulation.', 'Médecine de la reproduction', NULL, NULL, 'Stimulation ovarienne – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(485, 'medecine-reproduction', 'Insémination artificielle', NULL, 'Technique d’insémination intra-utérine selon indication.', 'Médecine de la reproduction', NULL, NULL, 'Insémination artificielle – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(486, 'medecine-reproduction', 'Fécondation in vitro (FIV)', NULL, 'Technique de PMA avec fécondation en laboratoire.', 'Médecine de la reproduction', NULL, NULL, 'FIV – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(487, 'medecine-reproduction', 'FIV ICSI', NULL, 'FIV avec micro-injection d’un spermatozoïde (ICSI).', 'Médecine de la reproduction', NULL, NULL, 'FIV ICSI – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(488, 'medecine-reproduction', 'Micro Tese', NULL, 'Extraction microchirurgicale de spermatozoïdes testiculaires.', 'Médecine de la reproduction', NULL, NULL, 'Micro TESE – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(489, 'medecine-reproduction', 'Congélation d’ovocytes et d’embryons', NULL, 'Préservation de fertilité par cryoconservation.', 'Médecine de la reproduction', NULL, NULL, 'Congélation ovocytes/embryons – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(490, 'medecine-reproduction', 'Rajeunissement ovarien par PRP', NULL, 'PRP ovarien selon protocole et indication.', 'Médecine de la reproduction', NULL, NULL, 'PRP ovarien – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(491, 'medecine-reproduction', 'Cellules souches pour traitement d’infertilité', NULL, 'Approche régénérative en contexte d’infertilité (selon protocole).', 'Médecine de la reproduction', NULL, NULL, 'Cellules souches – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(492, 'medecine-reproduction', 'Exosomes pour traitement de l’infertilité', NULL, 'Approche par exosomes en contexte d’infertilité (selon protocole).', 'Médecine de la reproduction', NULL, NULL, 'Exosomes infertilité – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(493, 'medecine-reproduction', 'Prise en charge de l’infertilité', NULL, 'Parcours complet de prise en charge de l’infertilité.', 'Médecine de la reproduction', NULL, NULL, 'Infertilité – Médecine de la reproduction', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 15:53:55', '2026-01-29 15:53:55'),
(494, 'pneumologie', 'Consultation en pneumologie', NULL, 'Consultation spécialisée des maladies respiratoires.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Consultation pneumologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(495, 'pneumologie', 'Asthme', NULL, 'Diagnostic et traitement de l’asthme.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Asthme – Pneumologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(496, 'pneumologie', 'Bronchite chronique', NULL, 'Prise en charge de la bronchite chronique.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Bronchite chronique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(497, 'pneumologie', 'BPCO', NULL, 'Traitement de la broncho-pneumopathie chronique obstructive.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'BPCO', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(498, 'pneumologie', 'Pneumonie', NULL, 'Diagnostic et traitement des infections pulmonaires.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Pneumonie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(499, 'pneumologie', 'Tuberculose', NULL, 'Prise en charge médicale de la tuberculose.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Tuberculose', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(500, 'pneumologie', 'Fibrose pulmonaire', NULL, 'Suivi et traitement de la fibrose pulmonaire.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Fibrose pulmonaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(501, 'pneumologie', 'Embolie pulmonaire', NULL, 'Diagnostic et prise en charge des embolies pulmonaires.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Embolie pulmonaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(502, 'pneumologie', 'Cancer du poumon', NULL, 'Suivi et traitement du cancer pulmonaire.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Cancer du poumon', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(503, 'pneumologie', 'Pneumothorax', NULL, 'Traitement de l’affaissement pulmonaire.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Pneumothorax', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(504, 'pneumologie', 'Fibrose kystique', NULL, 'Suivi respiratoire de la fibrose kystique.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Fibrose kystique pulmonaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(505, 'pneumologie', 'Radiographie thoracique', NULL, 'Imagerie diagnostique du thorax.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Radiographie thoracique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(506, 'pneumologie', 'Scanner thoracique', NULL, 'Exploration tomodensitométrique du thorax.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Scanner thoracique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(507, 'pneumologie', 'Spirométrie', NULL, 'Évaluation de la fonction respiratoire.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Spirométrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(508, 'pneumologie', 'Gaz du sang artériel', NULL, 'Analyse des échanges gazeux sanguins.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Gaz du sang artériel', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(509, 'pneumologie', 'Bronchoscopie', NULL, 'Exploration endoscopique des bronches.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Bronchoscopie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(510, 'pneumologie', 'Biopsie pulmonaire', NULL, 'Prélèvement tissulaire pulmonaire.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Biopsie pulmonaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(511, 'pneumologie', 'Test de provocation bronchique', NULL, 'Évaluation de l’hyperréactivité bronchique.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Test bronchique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(512, 'pneumologie', 'Échographie thoracique', NULL, 'Imagerie des structures thoraciques.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Échographie thoracique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(513, 'pneumologie', 'Kinésithérapie respiratoire', NULL, 'Rééducation respiratoire fonctionnelle.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Kinésithérapie respiratoire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(514, 'pneumologie', 'Traitement de l’apnée du sommeil', NULL, 'Prise en charge par ventilation CPAP.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Apnée du sommeil', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(515, 'pneumologie', 'Traitement de la fibrose kystique', NULL, 'Suivi thérapeutique spécialisé.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Traitement fibrose kystique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(516, 'pneumologie', 'Gestion de la BPCO', NULL, 'Suivi global de la BPCO.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Gestion BPCO', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(517, 'pneumologie', 'Chirurgie pulmonaire', NULL, 'Interventions chirurgicales pulmonaires.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Chirurgie pulmonaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(518, 'pneumologie', 'Chirurgie thoracique', NULL, 'Chirurgie du thorax et des poumons.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Chirurgie thoracique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23');
INSERT INTO `medical_procedures` (`id_procedure`, `category_key`, `nom_procedure`, `slug`, `short_description`, `categorie`, `sous_categorie`, `description`, `seo_title`, `seo_description`, `code_reference`, `img_procedure`, `duree_moyenne`, `is_active`, `is_featured`, `language`, `sort_order`, `meta`, `created_at`, `updated_at`) VALUES
(519, 'pneumologie', 'Pectus excavatum', NULL, 'Prise en charge du thorax en entonnoir.', 'Médecine respiratoire & Pneumologie', NULL, NULL, 'Pectus excavatum', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:23', '2026-01-29 16:03:23'),
(520, 'medecine-urgence', 'Médecine d’urgence', NULL, 'Prise en charge immédiate des urgences médicales et vitales.', 'Médecine d’urgence', NULL, NULL, 'Médecine d’urgence', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:03:33', '2026-01-29 16:03:33'),
(521, 'medecine-physique-readaptation', 'Consultation en physiothérapie', NULL, 'Consultation spécialisée en rééducation et réadaptation fonctionnelle.', 'Médecine physique et réadaptation', NULL, NULL, 'Physiothérapie – Médecine physique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(522, 'medecine-physique-readaptation', 'Consultation chiropratique', NULL, 'Évaluation et traitement manuel des troubles musculo-squelettiques.', 'Médecine physique et réadaptation', NULL, NULL, 'Chiropratique – Médecine physique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(523, 'medecine-physique-readaptation', 'Paralysie post-AVC', NULL, 'Rééducation des séquelles de paralysie après AVC.', 'Médecine physique et réadaptation', NULL, NULL, 'Paralysie post-AVC – Réadaptation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(524, 'medecine-physique-readaptation', 'Traumatismes musculo-squelettiques', NULL, 'Prise en charge des traumatismes de l’appareil locomoteur.', 'Médecine physique et réadaptation', NULL, NULL, 'Traumatismes musculo-squelettiques', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(525, 'medecine-physique-readaptation', 'Arthrose et douleurs articulaires', NULL, 'Traitement fonctionnel des douleurs articulaires chroniques.', 'Médecine physique et réadaptation', NULL, NULL, 'Arthrose – Réadaptation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(526, 'medecine-physique-readaptation', 'Maladies neurologiques', NULL, 'Rééducation des pathologies neurologiques chroniques.', 'Médecine physique et réadaptation', NULL, NULL, 'Maladies neurologiques – Réadaptation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(527, 'medecine-physique-readaptation', 'Déficits fonctionnels liés à l’âge', NULL, 'Programme de maintien et récupération fonctionnelle.', 'Médecine physique et réadaptation', NULL, NULL, 'Déficits fonctionnels – Réadaptation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(528, 'medecine-physique-readaptation', 'Rééducation après brûlures', NULL, 'Rééducation fonctionnelle post-brûlures.', 'Médecine physique et réadaptation', NULL, NULL, 'Rééducation brûlures', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(529, 'medecine-physique-readaptation', 'Rééducation gériatrique', NULL, 'Programme de réadaptation pour personnes âgées.', 'Médecine physique et réadaptation', NULL, NULL, 'Rééducation gériatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(530, 'medecine-physique-readaptation', 'Rééducation après amputation', NULL, 'Réadaptation fonctionnelle post-amputation.', 'Médecine physique et réadaptation', NULL, NULL, 'Réadaptation amputation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(531, 'medecine-physique-readaptation', 'Rééducation après lésion de la moelle épinière', NULL, 'Programme spécialisé de récupération fonctionnelle.', 'Médecine physique et réadaptation', NULL, NULL, 'Lésion moelle épinière – Réadaptation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(532, 'medecine-physique-readaptation', 'Troubles de l’ATM', NULL, 'Traitement fonctionnel de l’articulation temporo-mandibulaire.', 'Médecine physique et réadaptation', NULL, NULL, 'ATM – Réadaptation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(533, 'medecine-physique-readaptation', 'Rééducation orthopédique', NULL, 'Réadaptation après chirurgie ou pathologie orthopédique.', 'Médecine physique et réadaptation', NULL, NULL, 'Rééducation orthopédique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(534, 'medecine-physique-readaptation', 'Rééducation post-AVC', NULL, 'Programme complet de récupération après AVC.', 'Médecine physique et réadaptation', NULL, NULL, 'Rééducation AVC', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(535, 'medecine-physique-readaptation', 'Kinésithérapie', NULL, 'Soins de rééducation par le mouvement.', 'Médecine physique et réadaptation', NULL, NULL, 'Kinésithérapie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(536, 'medecine-physique-readaptation', 'Ergothérapie', NULL, 'Réadaptation de l’autonomie et des gestes quotidiens.', 'Médecine physique et réadaptation', NULL, NULL, 'Ergothérapie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(537, 'medecine-physique-readaptation', 'Hydrothérapie', NULL, 'Rééducation par l’eau.', 'Médecine physique et réadaptation', NULL, NULL, 'Hydrothérapie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(538, 'medecine-physique-readaptation', 'Drainage lymphatique', NULL, 'Technique manuelle de stimulation lymphatique.', 'Médecine physique et réadaptation', NULL, NULL, 'Drainage lymphatique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(539, 'medecine-physique-readaptation', 'Orthophonie', NULL, 'Rééducation des troubles de la parole et du langage.', 'Médecine physique et réadaptation', NULL, NULL, 'Orthophonie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(540, 'medecine-interne', 'Consultation en Médecine Interne', NULL, 'Consultation globale pour maladies systémiques complexes.', 'Médecine interne', NULL, NULL, 'Médecine interne – Consultation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(541, 'medecine-interne', 'Médecine nucléaire', NULL, 'Explorations et traitements par médecine nucléaire.', 'Médecine interne', NULL, NULL, 'Médecine nucléaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(542, 'medecine-interne', 'Médecine personnalisée', NULL, 'Approche thérapeutique basée sur les caractéristiques du patient.', 'Médecine interne', NULL, NULL, 'Médecine personnalisée', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(543, 'medecine-interne', 'Médecine préventive', NULL, 'Prévention et dépistage des maladies.', 'Médecine interne', NULL, NULL, 'Médecine préventive', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(544, 'medecine-interne', 'Médecine régénérative', NULL, 'Traitements par cellules souches et régénération tissulaire.', 'Médecine interne', NULL, NULL, 'Médecine régénérative', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(545, 'medecine-interne', 'Médecine du sommeil', NULL, 'Diagnostic et traitement des troubles du sommeil.', 'Médecine interne', NULL, NULL, 'Médecine du sommeil', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(546, 'medecine-interne', 'Médecine de la douleur', NULL, 'Prise en charge spécialisée de la douleur chronique.', 'Médecine interne', NULL, NULL, 'Médecine de la douleur', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(547, 'medecine-interne', 'Médecine fœto-maternelle', NULL, 'Suivi spécialisé mère–fœtus.', 'Médecine interne', NULL, NULL, 'Médecine fœto-maternelle', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(548, 'neonatalogie', 'Consultation en Néonatalogie', NULL, 'Consultation spécialisée du nouveau-né.', 'Néonatalogie', NULL, NULL, 'Néonatalogie – Consultation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(549, 'neonatalogie', 'Tests néonatals', NULL, 'Dépistage précoce des maladies néonatales.', 'Néonatalogie', NULL, NULL, 'Tests néonatals', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(550, 'nephrologie', 'Consultation en Néphrologie', NULL, 'Consultation spécialisée pour maladies rénales.', 'Néphrologie', NULL, NULL, 'Consultation néphrologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(551, 'nephrologie', 'Dialyse rénale', NULL, 'Traitement de suppléance de l’insuffisance rénale.', 'Néphrologie', NULL, NULL, 'Dialyse rénale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(552, 'nephrologie', 'Greffe de rein', NULL, 'Transplantation rénale pour insuffisance terminale.', 'Néphrologie', NULL, NULL, 'Greffe de rein', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(553, 'nephrologie', 'Traitement de l’hydronéphrose', NULL, 'Prise en charge de la dilatation des voies urinaires.', 'Néphrologie', NULL, NULL, 'Hydronéphrose', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(554, 'neurologie', 'Consultation en neurologie', NULL, 'Consultation spécialisée pour troubles neurologiques.', 'Neurologie', NULL, NULL, 'Consultation neurologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(555, 'neurologie', 'Sclérose latérale amyotrophique', NULL, 'Prise en charge de la SLA.', 'Neurologie', NULL, NULL, 'SLA – Neurologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(556, 'neurologie', 'Accident vasculaire cérébral', NULL, 'Diagnostic et suivi de l’AVC.', 'Neurologie', NULL, NULL, 'AVC – Neurologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(557, 'neurologie', 'Maladies neurodégénératives', NULL, 'Prise en charge Alzheimer, Parkinson et maladies associées.', 'Neurologie', NULL, NULL, 'Maladies neurodégénératives', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(558, 'neurologie', 'Migraine et céphalées chroniques', NULL, 'Traitement des migraines et céphalées.', 'Neurologie', NULL, NULL, 'Migraine – Neurologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(559, 'neurologie', 'Neuropathies périphériques', NULL, 'Diagnostic et traitement des atteintes nerveuses périphériques.', 'Neurologie', NULL, NULL, 'Neuropathies périphériques', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(560, 'neurologie', 'Troubles du sommeil', NULL, 'Prise en charge neurologique des troubles du sommeil.', 'Neurologie', NULL, NULL, 'Troubles du sommeil – Neurologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(561, 'neurologie', 'Paralysie cérébrale', NULL, 'Suivi et prise en charge de la paralysie cérébrale.', 'Neurologie', NULL, NULL, 'Paralysie cérébrale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(562, 'neurologie', 'Traumatismes crâniens', NULL, 'Prise en charge des lésions cérébrales traumatiques.', 'Neurologie', NULL, NULL, 'Traumatismes crâniens', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(563, 'neurologie', 'Tumeurs cérébrales', NULL, 'Diagnostic et suivi des tumeurs du système nerveux.', 'Neurologie', NULL, NULL, 'Tumeurs cérébrales', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(564, 'neurologie', 'Imagerie cérébrale', NULL, 'IRM et scanner cérébral.', 'Neurologie', NULL, NULL, 'Imagerie cérébrale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(565, 'neurologie', 'Électroencéphalogramme', NULL, 'Exploration de l’activité électrique cérébrale.', 'Neurologie', NULL, NULL, 'EEG – Neurologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(566, 'neurologie', 'Ponction lombaire', NULL, 'Prélèvement de LCR à visée diagnostique.', 'Neurologie', NULL, NULL, 'Ponction lombaire – Neurologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(567, 'neurologie', 'Traitement de l’épilepsie', NULL, 'Prise en charge spécialisée de l’épilepsie.', 'Neurologie', NULL, NULL, 'Épilepsie – Neurologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(568, 'neurologie', 'Traitement de la sclérose en plaques', NULL, 'Suivi et traitement de la SEP.', 'Neurologie', NULL, NULL, 'Sclérose en plaques', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:04:00', '2026-01-29 16:04:00'),
(569, 'neurochirurgie', 'Traumatisme crânien et lésions cérébrales', NULL, 'Prise en charge neurochirurgicale des traumatismes crâniens et lésions cérébrales.', 'Neurochirurgie', NULL, NULL, 'Traumatisme crânien – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(570, 'neurochirurgie', 'Hernie discale et compression nerveuse', NULL, 'Traitement neurochirurgical des hernies discales et compressions nerveuses.', 'Neurochirurgie', NULL, NULL, 'Hernie discale – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(571, 'neurochirurgie', 'Névralgie du trijumeau', NULL, 'Prise en charge neurochirurgicale de la douleur du trijumeau.', 'Neurochirurgie', NULL, NULL, 'Névralgie du trijumeau – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(572, 'neurochirurgie', 'Tumeurs cérébrales et médullaires', NULL, 'Diagnostic et chirurgie des tumeurs du cerveau et de la moelle.', 'Neurochirurgie', NULL, NULL, 'Tumeurs cérébrales – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(573, 'neurochirurgie', 'Malformations congénitales du système nerveux', NULL, 'Prise en charge des malformations neurologiques congénitales.', 'Neurochirurgie', NULL, NULL, 'Malformations congénitales – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(574, 'neurochirurgie', 'Anévrysmes cérébraux', NULL, 'Prise en charge des anévrysmes cérébraux.', 'Neurochirurgie', NULL, NULL, 'Anévrysmes cérébraux – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(575, 'neurochirurgie', 'Hydrocéphalie', NULL, 'Traitement de l’hydrocéphalie et dérivations.', 'Neurochirurgie', NULL, NULL, 'Hydrocéphalie – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(576, 'neurochirurgie', 'Pathologies de la colonne vertébrale', NULL, 'Prise en charge des pathologies rachidiennes.', 'Neurochirurgie', NULL, NULL, 'Colonne vertébrale – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(577, 'neurochirurgie', 'Chirurgie tumorale cérébrale et médullaire', NULL, 'Interventions de résection tumorale cérébrale/médullaire.', 'Neurochirurgie', NULL, NULL, 'Chirurgie tumorale – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(578, 'neurochirurgie', 'Neurochirurgie de la colonne vertébrale', NULL, 'Chirurgie du rachis et décompression.', 'Neurochirurgie', NULL, NULL, 'Neurochirurgie du rachis', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(579, 'neurochirurgie', 'Clipage ou embolisation des anévrysmes', NULL, 'Traitement endovasculaire ou chirurgical des anévrysmes.', 'Neurochirurgie', NULL, NULL, 'Clipage/Embolisation – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(580, 'neurochirurgie', 'Chirurgie des malformations congénitales', NULL, 'Correction chirurgicale des malformations neurologiques.', 'Neurochirurgie', NULL, NULL, 'Malformations – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(581, 'neurochirurgie', 'Drainage de l’hydrocéphalie', NULL, 'Pose de dérivation/valve selon indication.', 'Neurochirurgie', NULL, NULL, 'Drainage hydrocéphalie – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(582, 'neurochirurgie', 'Traitement de la craniosynostose', NULL, 'Prise en charge chirurgicale de la craniosynostose.', 'Neurochirurgie', NULL, NULL, 'Craniosynostose – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(583, 'neurochirurgie', 'Décompression nerveuse', NULL, 'Chirurgie de décompression des nerfs.', 'Neurochirurgie', NULL, NULL, 'Décompression nerveuse – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(584, 'neurochirurgie', 'Suivi post-opératoire et réhabilitation neurochirurgicale', NULL, 'Suivi spécialisé après intervention neurochirurgicale.', 'Neurochirurgie', NULL, NULL, 'Suivi post-op – Neurochirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(585, 'oncologie-cancerologie', 'Consultation en oncologie', NULL, 'Consultation spécialisée en cancérologie et parcours de soins.', 'Oncologie – Cancérologie', NULL, NULL, 'Consultation oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(586, 'oncologie-cancerologie', 'Traitement du cancer de l’estomac', NULL, 'Prise en charge multidisciplinaire du cancer gastrique.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer estomac – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(587, 'oncologie-cancerologie', 'Traitement du cancer du foie', NULL, 'Prise en charge du cancer hépatique.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer du foie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(588, 'oncologie-cancerologie', 'Traitement du cancer de l’ovaire', NULL, 'Prise en charge du cancer ovarien.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer ovaire – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(589, 'oncologie-cancerologie', 'Traitement du cancer du col de l’utérus', NULL, 'Traitement du cancer du col utérin.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer col utérus – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(590, 'oncologie-cancerologie', 'Traitement du cancer de la thyroïde', NULL, 'Prise en charge du cancer thyroïdien.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer thyroïde – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(591, 'oncologie-cancerologie', 'Traitement du cancer de la vessie', NULL, 'Prise en charge du cancer vésical.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer vessie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(592, 'oncologie-cancerologie', 'Traitement du cancer du cerveau', NULL, 'Prise en charge des tumeurs cérébrales malignes.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer cerveau – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(593, 'oncologie-cancerologie', 'Traitement du cancer du canal cholédoque', NULL, 'Prise en charge des cancers des voies biliaires.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer cholédoque – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(594, 'oncologie-cancerologie', 'Traitement du cancer œsophagien', NULL, 'Prise en charge du cancer de l’œsophage.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer œsophage – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(595, 'oncologie-cancerologie', 'Traitement de la leucémie', NULL, 'Prise en charge des leucémies.', 'Oncologie – Cancérologie', NULL, NULL, 'Leucémie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(596, 'oncologie-cancerologie', 'Traitement de la maladie de Hodgkin', NULL, 'Prise en charge du lymphome de Hodgkin.', 'Oncologie – Cancérologie', NULL, NULL, 'Hodgkin – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(597, 'oncologie-cancerologie', 'Traitement du cancer du sein', NULL, 'Prise en charge du cancer mammaire.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer sein – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(598, 'oncologie-cancerologie', 'Traitement du cancer du poumon', NULL, 'Prise en charge du cancer pulmonaire.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer poumon – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(599, 'oncologie-cancerologie', 'Traitement du cancer colorectal', NULL, 'Prise en charge des cancers du côlon et rectum.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer colorectal – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(600, 'oncologie-cancerologie', 'Traitement du cancer de la prostate', NULL, 'Prise en charge du cancer prostatique.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer prostate – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(601, 'oncologie-cancerologie', 'Traitement du cancer du pancréas', NULL, 'Prise en charge du cancer pancréatique.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer pancréas – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(602, 'oncologie-cancerologie', 'Traitement du cancer du rein', NULL, 'Prise en charge du cancer rénal.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer rein – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(603, 'oncologie-cancerologie', 'Traitement du cancer de la peau', NULL, 'Prise en charge des cancers cutanés.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer peau – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(604, 'oncologie-cancerologie', 'Traitement du cancer de la langue', NULL, 'Prise en charge des cancers ORL (langue).', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer langue – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(605, 'oncologie-cancerologie', 'Traitement du cancer des os', NULL, 'Prise en charge des tumeurs osseuses.', 'Oncologie – Cancérologie', NULL, NULL, 'Cancer os – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(606, 'oncologie-cancerologie', 'Traitement du mésothéliome pleural', NULL, 'Prise en charge du mésothéliome pleural.', 'Oncologie – Cancérologie', NULL, NULL, 'Mésothéliome pleural – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(607, 'oncologie-cancerologie', 'Traitement du méningiome', NULL, 'Prise en charge des méningiomes.', 'Oncologie – Cancérologie', NULL, NULL, 'Méningiome – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(608, 'oncologie-cancerologie', 'Traitement des lymphomes', NULL, 'Prise en charge des lymphomes.', 'Oncologie – Cancérologie', NULL, NULL, 'Lymphomes – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(609, 'oncologie-cancerologie', 'Traitement du myélome multiple', NULL, 'Prise en charge du myélome multiple.', 'Oncologie – Cancérologie', NULL, NULL, 'Myélome multiple – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(610, 'oncologie-cancerologie', 'Dépistage du cancer', NULL, 'Programmes de dépistage et prévention.', 'Oncologie – Cancérologie', NULL, NULL, 'Dépistage cancer – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(611, 'oncologie-cancerologie', 'Biopsie tumorale', NULL, 'Prélèvement tumoral pour analyse anatomopathologique.', 'Oncologie – Cancérologie', NULL, NULL, 'Biopsie tumorale – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(612, 'oncologie-cancerologie', 'Bilan d’extension (staging)', NULL, 'Évaluation de l’extension tumorale.', 'Oncologie – Cancérologie', NULL, NULL, 'Staging – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(613, 'oncologie-cancerologie', 'Tomodensitométrie (CT-Scan)', NULL, 'Imagerie de bilan et suivi oncologique.', 'Oncologie – Cancérologie', NULL, NULL, 'CT-Scan – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(614, 'oncologie-cancerologie', 'IRM', NULL, 'Imagerie IRM dans le cadre oncologique.', 'Oncologie – Cancérologie', NULL, NULL, 'IRM – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(615, 'oncologie-cancerologie', 'PET-Scan (PET-CT)', NULL, 'Imagerie métabolique pour bilan d’extension.', 'Oncologie – Cancérologie', NULL, NULL, 'PET-Scan – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(616, 'oncologie-cancerologie', 'Scanner TEP', NULL, 'Exploration TEP selon protocole oncologique.', 'Oncologie – Cancérologie', NULL, NULL, 'Scanner TEP – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(617, 'oncologie-cancerologie', 'Médecine nucléaire', NULL, 'Explorations/traitements par médecine nucléaire.', 'Oncologie – Cancérologie', NULL, NULL, 'Médecine nucléaire – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(618, 'oncologie-cancerologie', 'IRM-LINAC', NULL, 'Radiothérapie guidée par IRM (selon plateau).', 'Oncologie – Cancérologie', NULL, NULL, 'IRM-LINAC – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(619, 'oncologie-cancerologie', 'Chimiothérapie', NULL, 'Traitement anticancéreux par chimiothérapie.', 'Oncologie – Cancérologie', NULL, NULL, 'Chimiothérapie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(620, 'oncologie-cancerologie', 'Radiothérapie', NULL, 'Traitement par rayonnements.', 'Oncologie – Cancérologie', NULL, NULL, 'Radiothérapie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(621, 'oncologie-cancerologie', 'Brachythérapie', NULL, 'Radiothérapie interne localisée.', 'Oncologie – Cancérologie', NULL, NULL, 'Brachythérapie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(622, 'oncologie-cancerologie', 'Immunothérapie', NULL, 'Traitement oncologique par immunothérapie.', 'Oncologie – Cancérologie', NULL, NULL, 'Immunothérapie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(623, 'oncologie-cancerologie', 'Thérapies ciblées', NULL, 'Traitements ciblant des mutations spécifiques.', 'Oncologie – Cancérologie', NULL, NULL, 'Thérapies ciblées – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(624, 'oncologie-cancerologie', 'Hormonothérapie', NULL, 'Traitement hormonal de certains cancers.', 'Oncologie – Cancérologie', NULL, NULL, 'Hormonothérapie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(625, 'oncologie-cancerologie', 'Chirurgie oncologique', NULL, 'Interventions chirurgicales à visée oncologique.', 'Oncologie – Cancérologie', NULL, NULL, 'Chirurgie oncologique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(626, 'oncologie-cancerologie', 'Mastectomie', NULL, 'Ablation mammaire selon indication oncologique.', 'Oncologie – Cancérologie', NULL, NULL, 'Mastectomie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(627, 'oncologie-cancerologie', 'Cystectomie', NULL, 'Ablation de la vessie selon indication oncologique.', 'Oncologie – Cancérologie', NULL, NULL, 'Cystectomie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(628, 'oncologie-cancerologie', 'Chirurgie des tumeurs bénignes du foie', NULL, 'Ablation des tumeurs hépatiques bénignes.', 'Oncologie – Cancérologie', NULL, NULL, 'Tumeurs bénignes foie – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(629, 'oncologie-cancerologie', 'Chirurgie du cancer du canal cholédoque', NULL, 'Chirurgie des cancers des voies biliaires.', 'Oncologie – Cancérologie', NULL, NULL, 'Chirurgie cholédoque – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(630, 'oncologie-cancerologie', 'Chirurgie du cancer œsophagien', NULL, 'Chirurgie des cancers de l’œsophage.', 'Oncologie – Cancérologie', NULL, NULL, 'Chirurgie œsophage – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(631, 'oncologie-cancerologie', 'Greffe de moelle osseuse', NULL, 'Greffe de cellules souches hématopoïétiques.', 'Oncologie – Cancérologie', NULL, NULL, 'Greffe de moelle – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(632, 'oncologie-cancerologie', 'Oncologie pédiatrique', NULL, 'Prise en charge des cancers de l’enfant.', 'Oncologie – Cancérologie', NULL, NULL, 'Oncologie pédiatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(633, 'oncologie-cancerologie', 'Soins de support et soins palliatifs', NULL, 'Accompagnement, gestion des symptômes et qualité de vie.', 'Oncologie – Cancérologie', NULL, NULL, 'Soins de support – Oncologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(634, 'oncologie-cancerologie', 'Suivi oncologique', NULL, 'Surveillance et suivi après traitement.', 'Oncologie – Cancérologie', NULL, NULL, 'Suivi oncologique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:53', '2026-01-29 16:14:53'),
(635, 'ophtalmologie', 'Consultation en Ophtalmologie', NULL, 'Consultation spécialisée des pathologies oculaires.', 'Ophtalmologie', NULL, NULL, 'Consultation ophtalmologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(636, 'ophtalmologie', 'Examen des yeux', NULL, 'Bilan complet de la vision et de la santé oculaire.', 'Ophtalmologie', NULL, NULL, 'Examen des yeux – Ophtalmologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(637, 'ophtalmologie', 'Capsulotomie au laser YAG', NULL, 'Traitement au laser YAG d’une opacification capsulaire.', 'Ophtalmologie', NULL, NULL, 'Laser YAG – Ophtalmologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(638, 'ophtalmologie', 'Chirurgie de la cataracte', NULL, 'Intervention pour retirer la cataracte.', 'Ophtalmologie', NULL, NULL, 'Chirurgie cataracte', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(639, 'ophtalmologie', 'Implant de lentille intraoculaire', NULL, 'Pose d’implant après chirurgie du cristallin.', 'Ophtalmologie', NULL, NULL, 'Implant intraoculaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(640, 'ophtalmologie', 'Implant oculaire', NULL, 'Pose d’implant oculaire selon indication.', 'Ophtalmologie', NULL, NULL, 'Implant oculaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(641, 'ophtalmologie', 'Implants phakes ICL', NULL, 'Correction de la vision par implants ICL.', 'Ophtalmologie', NULL, NULL, 'Implants ICL', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(642, 'ophtalmologie', 'Chirurgie réfractive', NULL, 'Chirurgie de correction visuelle (myopie, astigmatisme…).', 'Ophtalmologie', NULL, NULL, 'Chirurgie réfractive', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(643, 'ophtalmologie', 'Lasik', NULL, 'Chirurgie LASIK de l’œil.', 'Ophtalmologie', NULL, NULL, 'LASIK – Ophtalmologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(644, 'ophtalmologie', 'Femto-LASIK', NULL, 'LASIK assisté par laser femtoseconde.', 'Ophtalmologie', NULL, NULL, 'Femto-LASIK', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(645, 'ophtalmologie', 'PRK – LASEK', NULL, 'Techniques de surface pour correction visuelle.', 'Ophtalmologie', NULL, NULL, 'PRK / LASEK', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(646, 'ophtalmologie', 'ReLEx SMILE', NULL, 'Correction visuelle par petite incision (SMILE).', 'Ophtalmologie', NULL, NULL, 'ReLEx SMILE', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(647, 'ophtalmologie', 'Laser Presbyond', NULL, 'Correction de la presbytie par laser (selon protocole).', 'Ophtalmologie', NULL, NULL, 'Presbyond', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(648, 'ophtalmologie', 'Traitement de la myopie par petite incision', NULL, 'Correction de la myopie par technique mini-invasive.', 'Ophtalmologie', NULL, NULL, 'Myopie – petite incision', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(649, 'ophtalmologie', 'Traitement de la presbytie', NULL, 'Prise en charge de la presbytie.', 'Ophtalmologie', NULL, NULL, 'Presbytie – Ophtalmologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(650, 'ophtalmologie', 'Correction de l’astigmatisme', NULL, 'Correction chirurgicale ou par implant.', 'Ophtalmologie', NULL, NULL, 'Astigmatisme – Ophtalmologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(651, 'ophtalmologie', 'Greffe de cornée', NULL, 'Transplantation cornéenne.', 'Ophtalmologie', NULL, NULL, 'Greffe de cornée', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(652, 'ophtalmologie', 'Kératoprothèse', NULL, 'Prothèse cornéenne selon indication.', 'Ophtalmologie', NULL, NULL, 'Kératoprothèse', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(653, 'ophtalmologie', 'Réticulation de la cornée', NULL, 'Cross-linking cornéen (kératocône).', 'Ophtalmologie', NULL, NULL, 'Cross-linking', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(654, 'ophtalmologie', 'Kératopathie en bandelette', NULL, 'Traitement de la kératopathie en bandelette.', 'Ophtalmologie', NULL, NULL, 'Kératopathie bandelette', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(655, 'ophtalmologie', 'Érosion cornéenne récurrente', NULL, 'Prise en charge des érosions cornéennes récidivantes.', 'Ophtalmologie', NULL, NULL, 'Érosion cornéenne', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(656, 'ophtalmologie', 'Chirurgie du ptérygium', NULL, 'Ablation chirurgicale du ptérygium.', 'Ophtalmologie', NULL, NULL, 'Ptérygium', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(657, 'ophtalmologie', 'Injection intravitréenne', NULL, 'Injection intraoculaire (selon indication).', 'Ophtalmologie', NULL, NULL, 'Injection intravitréenne', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(658, 'ophtalmologie', 'Thérapie anti-VEGF', NULL, 'Traitement anti-VEGF (DMLA, rétinopathie…).', 'Ophtalmologie', NULL, NULL, 'Anti-VEGF', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(659, 'ophtalmologie', 'Laser de photocoagulation', NULL, 'Laser rétinien thérapeutique.', 'Ophtalmologie', NULL, NULL, 'Photocoagulation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(660, 'ophtalmologie', 'Chirurgie du trou maculaire', NULL, 'Prise en charge chirurgicale du trou maculaire.', 'Ophtalmologie', NULL, NULL, 'Trou maculaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(661, 'ophtalmologie', 'Décollement de la rétine', NULL, 'Traitement du décollement rétinien.', 'Ophtalmologie', NULL, NULL, 'Décollement rétine', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(662, 'ophtalmologie', 'DMLA', NULL, 'Traitement de la dégénérescence maculaire liée à l’âge.', 'Ophtalmologie', NULL, NULL, 'DMLA', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(663, 'ophtalmologie', 'Rétinopathie diabétique', NULL, 'Diagnostic et traitement de la rétinopathie diabétique.', 'Ophtalmologie', NULL, NULL, 'Rétinopathie diabétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(664, 'ophtalmologie', 'ROP', NULL, 'Traitement de la rétinopathie des prématurés.', 'Ophtalmologie', NULL, NULL, 'ROP – Ophtalmologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(665, 'ophtalmologie', 'Rétinite pigmentaire', NULL, 'Suivi et prise en charge de la rétinite pigmentaire.', 'Ophtalmologie', NULL, NULL, 'Rétinite pigmentaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(666, 'ophtalmologie', 'Glaucome', NULL, 'Traitement médical et chirurgical du glaucome.', 'Ophtalmologie', NULL, NULL, 'Glaucome', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(667, 'ophtalmologie', 'Trabéculectomie', NULL, 'Chirurgie filtrante du glaucome.', 'Ophtalmologie', NULL, NULL, 'Trabéculectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(668, 'ophtalmologie', 'Iridectomie', NULL, 'Chirurgie de l’iris selon indication.', 'Ophtalmologie', NULL, NULL, 'Iridectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(669, 'ophtalmologie', 'Iridoplastie', NULL, 'Procédure sur l’iris (laser/technique).', 'Ophtalmologie', NULL, NULL, 'Iridoplastie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(670, 'ophtalmologie', 'Chirurgie des muscles des yeux', NULL, 'Correction des troubles musculaires oculaires.', 'Ophtalmologie', NULL, NULL, 'Chirurgie muscles yeux', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(671, 'ophtalmologie', 'Strabisme', NULL, 'Chirurgie et prise en charge du strabisme.', 'Ophtalmologie', NULL, NULL, 'Strabisme', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(672, 'ophtalmologie', 'Réparation de l’iris', NULL, 'Réparation chirurgicale des lésions de l’iris.', 'Ophtalmologie', NULL, NULL, 'Réparation iris', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(673, 'ophtalmologie', 'Iridodialyse', NULL, 'Traitement de l’iridodialyse.', 'Ophtalmologie', NULL, NULL, 'Iridodialyse', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(674, 'ophtalmologie', 'Cellules souches oculaires', NULL, 'Approches régénératives oculaires (selon protocole).', 'Ophtalmologie', NULL, NULL, 'Cellules souches oculaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(675, 'ophtalmologie', 'Chirurgie des conduits lacrymaux', NULL, 'Chirurgie des voies lacrymales.', 'Ophtalmologie', NULL, NULL, 'Conduits lacrymaux', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(676, 'ophtalmologie', 'Excision d’une glande lacrymale', NULL, 'Ablation d’une glande lacrymale selon indication.', 'Ophtalmologie', NULL, NULL, 'Glande lacrymale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(677, 'ophtalmologie', 'Entropion / ectropion', NULL, 'Traitement des malpositions palpébrales.', 'Ophtalmologie', NULL, NULL, 'Entropion ectropion', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(678, 'ophtalmologie', 'Exophtalmie', NULL, 'Prise en charge de l’exophtalmie.', 'Ophtalmologie', NULL, NULL, 'Exophtalmie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(679, 'ophtalmologie', 'Fractures blow-out', NULL, 'Traitement des fractures orbitaires blow-out.', 'Ophtalmologie', NULL, NULL, 'Fracture blow-out', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(680, 'ophtalmologie', 'Uvéite', NULL, 'Diagnostic et traitement des uvéites.', 'Ophtalmologie', NULL, NULL, 'Uvéite', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(681, 'ophtalmologie', 'Neuropathie optique', NULL, 'Prise en charge des atteintes du nerf optique.', 'Ophtalmologie', NULL, NULL, 'Neuropathie optique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(682, 'ophtalmologie', 'Énucléation de l’œil', NULL, 'Ablation du globe oculaire selon indication.', 'Ophtalmologie', NULL, NULL, 'Énucléation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(683, 'orthopedie', 'Consultation en orthopédie', NULL, 'Consultation spécialisée os, articulations et traumatologie.', 'Orthopédie', NULL, NULL, 'Consultation orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(684, 'orthopedie', 'Orthopédie pédiatrique', NULL, 'Prise en charge orthopédique de l’enfant.', 'Orthopédie', NULL, NULL, 'Orthopédie pédiatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(685, 'orthopedie', 'Médecine du sport', NULL, 'Prise en charge des blessures sportives.', 'Orthopédie', NULL, NULL, 'Médecine du sport', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(686, 'orthopedie', 'Fractures et traumatismes', NULL, 'Traitement des fractures et traumatismes osseux.', 'Orthopédie', NULL, NULL, 'Fractures – Orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(687, 'orthopedie', 'Déformations osseuses et rachidiennes', NULL, 'Prise en charge des déformations.', 'Orthopédie', NULL, NULL, 'Déformations – Orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(688, 'orthopedie', 'Scoliose', NULL, 'Diagnostic et traitement de la scoliose.', 'Orthopédie', NULL, NULL, 'Scoliose – Orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(689, 'orthopedie', 'Lésions ligamentaires', NULL, 'Traitement des lésions ligamentaires.', 'Orthopédie', NULL, NULL, 'Lésions ligamentaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(690, 'orthopedie', 'Syndrome du canal carpien', NULL, 'Prise en charge du canal carpien.', 'Orthopédie', NULL, NULL, 'Canal carpien', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(691, 'orthopedie', 'Polyarthrite rhumatoïde', NULL, 'Suivi orthopédique des complications articulaires.', 'Orthopédie', NULL, NULL, 'Polyarthrite – Orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(692, 'orthopedie', 'Arthrose', NULL, 'Prise en charge de l’arthrose.', 'Orthopédie', NULL, NULL, 'Arthrose – Orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(693, 'orthopedie', 'Traitement de l’arthrose', NULL, 'Protocoles médicaux et chirurgicaux selon stade.', 'Orthopédie', NULL, NULL, 'Traitement arthrose', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(694, 'orthopedie', 'Chirurgie orthopédique', NULL, 'Interventions orthopédiques diverses.', 'Orthopédie', NULL, NULL, 'Chirurgie orthopédique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(695, 'orthopedie', 'Chirurgie de la colonne vertébrale', NULL, 'Chirurgie rachidienne orthopédique.', 'Orthopédie', NULL, NULL, 'Chirurgie colonne – Orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(696, 'orthopedie', 'Traitement des hernies discales', NULL, 'Prise en charge des hernies discales.', 'Orthopédie', NULL, NULL, 'Hernie discale – Orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(697, 'orthopedie', 'Chirurgie de l’épaule', NULL, 'Traitement chirurgical des pathologies de l’épaule.', 'Orthopédie', NULL, NULL, 'Chirurgie épaule', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(698, 'orthopedie', 'Conflit sous-acromial', NULL, 'Traitement du conflit sous-acromial.', 'Orthopédie', NULL, NULL, 'Conflit sous-acromial', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(699, 'orthopedie', 'Chirurgie de la main', NULL, 'Chirurgie de la main et du poignet.', 'Orthopédie', NULL, NULL, 'Chirurgie main', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(700, 'orthopedie', 'Chirurgie du pied et cheville', NULL, 'Chirurgie du pied et de la cheville.', 'Orthopédie', NULL, NULL, 'Chirurgie pied cheville', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(701, 'orthopedie', 'Chirurgie de genou', NULL, 'Chirurgie du genou (lésions, arthrose…).', 'Orthopédie', NULL, NULL, 'Chirurgie genou', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(702, 'orthopedie', 'Chirurgie du ménisque', NULL, 'Réparation/ablation méniscale.', 'Orthopédie', NULL, NULL, 'Ménisque', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(703, 'orthopedie', 'Ligamentoplastie (LCA)', NULL, 'Reconstruction du ligament croisé antérieur.', 'Orthopédie', NULL, NULL, 'LCA – Ligamentoplastie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(704, 'orthopedie', 'Arthroscopie', NULL, 'Chirurgie mini-invasive par arthroscopie.', 'Orthopédie', NULL, NULL, 'Arthroscopie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(705, 'orthopedie', 'Allongement des jambes', NULL, 'Chirurgie d’allongement des membres inférieurs.', 'Orthopédie', NULL, NULL, 'Allongement des jambes', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(706, 'orthopedie', 'Hallux valgus', NULL, 'Chirurgie de l’hallux valgus.', 'Orthopédie', NULL, NULL, 'Hallux valgus', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(707, 'orthopedie', 'Prothèse de hanche', NULL, 'Arthroplastie totale de hanche.', 'Orthopédie', NULL, NULL, 'Prothèse de hanche', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(708, 'orthopedie', 'Prothèse de genou', NULL, 'Arthroplastie totale de genou.', 'Orthopédie', NULL, NULL, 'Prothèse de genou', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54');
INSERT INTO `medical_procedures` (`id_procedure`, `category_key`, `nom_procedure`, `slug`, `short_description`, `categorie`, `sous_categorie`, `description`, `seo_title`, `seo_description`, `code_reference`, `img_procedure`, `duree_moyenne`, `is_active`, `is_featured`, `language`, `sort_order`, `meta`, `created_at`, `updated_at`) VALUES
(709, 'orthopedie', 'Prothèse des épaules', NULL, 'Arthroplastie d’épaule.', 'Orthopédie', NULL, NULL, 'Prothèse épaule', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(710, 'orthopedie', 'Rééducation orthopédique', NULL, 'Programme de rééducation après chirurgie ou traumatisme.', 'Orthopédie', NULL, NULL, 'Rééducation orthopédique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(711, 'orthopedie', 'Traitement des tendinites', NULL, 'Prise en charge des tendinites.', 'Orthopédie', NULL, NULL, 'Tendinites – Orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(712, 'orthopedie', 'IRM (Imagerie par Résonance Magnétique)', NULL, 'Imagerie IRM pour bilan orthopédique.', 'Orthopédie', NULL, NULL, 'IRM – Orthopédie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(713, 'orl', 'Consultation en oto-rhino-laryngologie', NULL, 'Consultation ORL complète (nez, gorge, oreilles).', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Consultation ORL', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(714, 'orl', 'Ablation des polypes nasaux', NULL, 'Chirurgie des polypes et obstruction nasale.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Polypes nasaux', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(715, 'orl', 'Adénoïdectomie', NULL, 'Ablation des végétations adénoïdes.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Adénoïdectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(716, 'orl', 'Ajustement des aides auditives', NULL, 'Programmation et réglage des appareils auditifs.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Aides auditives', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(717, 'orl', 'Analyse de l’oreille moyenne', NULL, 'Évaluation de l’oreille moyenne.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Oreille moyenne', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(718, 'orl', 'Prothèses auditives', NULL, 'Appareillage et suivi auditif.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Prothèses auditives', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(719, 'orl', 'Audiométrie', NULL, 'Test d’audition et bilan auditif.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Audiométrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(720, 'orl', 'Chirurgie de l’apnée du sommeil', NULL, 'Chirurgie ORL pour apnée du sommeil.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Apnée du sommeil – ORL', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(721, 'orl', 'Parotidectomie', NULL, 'Chirurgie de la parotide.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Parotidectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(722, 'orl', 'Chirurgie de restauration de la voix', NULL, 'Procédures ORL pour troubles de la voix.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Restauration voix', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(723, 'orl', 'Chirurgie des sinus (endoscopique)', NULL, 'Chirurgie endoscopique des sinus.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Chirurgie sinus', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(724, 'orl', 'Chirurgie du larynx', NULL, 'Chirurgie laryngée selon indication.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Chirurgie larynx', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(725, 'orl', 'Dépistage auditif', NULL, 'Dépistage des troubles de l’audition.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Dépistage auditif', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(726, 'orl', 'Dissection du cou', NULL, 'Chirurgie ganglionnaire/cervicale selon indication.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Dissection du cou', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(727, 'orl', 'Endoscopie nasale et laryngée', NULL, 'Exploration endoscopique ORL.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Endoscopie ORL', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(728, 'orl', 'Implant cochléaire', NULL, 'Implantation cochléaire et suivi.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Implant cochléaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(729, 'orl', 'Laryngectomie', NULL, 'Ablation partielle/totale du larynx.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Laryngectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(730, 'orl', 'Mastoïdectomie', NULL, 'Chirurgie de la mastoïde.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Mastoïdectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(731, 'orl', 'Myringoplastie', NULL, 'Réparation du tympan.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Myringoplastie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(732, 'orl', 'Orthophonie (logopédie)', NULL, 'Rééducation des troubles ORL/voix.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Orthophonie ORL', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(733, 'orl', 'Reconstruction chaîne ossiculaire', NULL, 'Chirurgie des osselets.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Chaîne ossiculaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(734, 'orl', 'Rééducation vestibulaire', NULL, 'Rééducation de l’équilibre.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Vestibulaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(735, 'orl', 'Réhabilitation auditive', NULL, 'Programme de réhabilitation et stimulation auditive.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Réhabilitation auditive', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(736, 'orl', 'Scintigraphie thyroïdienne', NULL, 'Exploration thyroïdienne par imagerie nucléaire.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Scintigraphie thyroïde', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(737, 'orl', 'Septoplastie', NULL, 'Correction de la cloison nasale.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Septoplastie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(738, 'orl', 'Stapédectomie', NULL, 'Chirurgie de l’otospongiose (stapes).', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Stapédectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(739, 'orl', 'Thyroïdectomie', NULL, 'Chirurgie de la thyroïde.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Thyroïdectomie – ORL', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(740, 'orl', 'Tonsillectomie', NULL, 'Ablation des amygdales.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Tonsillectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(741, 'orl', 'Traitement des acouphènes', NULL, 'Prise en charge des acouphènes.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Acouphènes', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(742, 'orl', 'Traitement des infections ORL', NULL, 'Traitement des otites, angines, sinusites…', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Infections ORL', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(743, 'orl', 'Traitement des fractures du nez', NULL, 'Prise en charge des traumatismes nasaux.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Fracture du nez', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(744, 'orl', 'Obstruction nasale', NULL, 'Diagnostic et traitement de l’obstruction nasale.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Obstruction nasale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(745, 'orl', 'Lithiase salivaire', NULL, 'Traitement des calculs des glandes salivaires.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Lithiase salivaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(746, 'orl', 'Tympanoplastie', NULL, 'Chirurgie reconstructrice du tympan/oreille moyenne.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Tympanoplastie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(747, 'orl', 'Œdème des cordes vocales', NULL, 'Prise en charge des pathologies des cordes vocales.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Œdème cordes vocales', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(748, 'orl', 'Otites aiguës et chroniques', NULL, 'Traitement des otites.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Otites', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(749, 'orl', 'Surdité', NULL, 'Diagnostic et prise en charge de la surdité.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Surdité', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(750, 'orl', 'Sinusite aiguë et chronique', NULL, 'Traitement des sinusites.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Sinusite', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(751, 'orl', 'Rhinite allergique', NULL, 'Prise en charge de la rhinite allergique.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Rhinite allergique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(752, 'orl', 'Déviation cloison nasale', NULL, 'Bilan et correction de la déviation septale.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Déviation cloison', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(753, 'orl', 'Amygdalite et végétations', NULL, 'Prise en charge des amygdalites et végétations.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Amygdalite', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(754, 'orl', 'Vertiges et troubles de l’équilibre', NULL, 'Diagnostic et traitement des vertiges.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Vertiges', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(755, 'orl', 'Laryngite et dysphonie', NULL, 'Prise en charge des inflammations laryngées et dysphonies.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Laryngite dysphonie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(756, 'orl', 'Troubles de la déglutition', NULL, 'Bilan ORL des troubles de déglutition.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Dysphagie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(757, 'orl', 'Tumeurs ORL', NULL, 'Bilan et prise en charge des tumeurs ORL.', 'ORL (Oto-Rhino-Laryngologie)', NULL, NULL, 'Tumeurs ORL', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(758, 'pediatrie', 'Consultation pédiatrique', NULL, 'Consultation médicale dédiée à l’enfant.', 'Pédiatrie', NULL, NULL, 'Consultation pédiatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(759, 'angiologie-phlebologie', 'Consultation en Angiologie', NULL, 'Consultation spécialisée des maladies vasculaires.', 'Angiologie et Phlébologie', NULL, NULL, 'Consultation angiologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(760, 'angiologie-phlebologie', 'Varices des jambes', NULL, 'Prise en charge des varices.', 'Angiologie et Phlébologie', NULL, NULL, 'Varices', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(761, 'angiologie-phlebologie', 'Insuffisance veineuse chronique', NULL, 'Traitement de l’insuffisance veineuse.', 'Angiologie et Phlébologie', NULL, NULL, 'Insuffisance veineuse', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(762, 'angiologie-phlebologie', 'Thrombose veineuse', NULL, 'Diagnostic et prise en charge de la thrombose.', 'Angiologie et Phlébologie', NULL, NULL, 'Thrombose veineuse', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(763, 'angiologie-phlebologie', 'Thrombophlébite superficielle', NULL, 'Prise en charge des inflammations veineuses superficielles.', 'Angiologie et Phlébologie', NULL, NULL, 'Thrombophlébite', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(764, 'angiologie-phlebologie', 'Traitement des varices par laser/sclérothérapie', NULL, 'Traitements mini-invasifs des varices.', 'Angiologie et Phlébologie', NULL, NULL, 'Laser varices / sclérothérapie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(765, 'angiologie-phlebologie', 'Traitement conservateur par contention', NULL, 'Traitement par bas/chaussettes de contention.', 'Angiologie et Phlébologie', NULL, NULL, 'Contention veineuse', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(766, 'protheses-ortheses', 'Prothèses et orthèses', NULL, 'Conception, adaptation et suivi des prothèses et orthèses.', 'Prothèses et orthèses', NULL, NULL, 'Prothèses et orthèses', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(767, 'psycho-psychiatrie', 'Consultation en Psychologie', NULL, 'Consultation psychologique et accompagnement.', 'Psychologie et Psychiatrie', NULL, NULL, 'Consultation psychologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(768, 'psycho-psychiatrie', 'Consultation en Psychiatrie', NULL, 'Consultation psychiatrique et suivi médical.', 'Psychologie et Psychiatrie', NULL, NULL, 'Consultation psychiatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(769, 'psycho-psychiatrie', 'Traitement de l’anxiété', NULL, 'Prise en charge des troubles anxieux.', 'Psychologie et Psychiatrie', NULL, NULL, 'Anxiété – Psychiatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(770, 'psycho-psychiatrie', 'Traitement de la dépression', NULL, 'Prise en charge de la dépression.', 'Psychologie et Psychiatrie', NULL, NULL, 'Dépression – Psychiatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(771, 'psycho-psychiatrie', 'Troubles bipolaires', NULL, 'Suivi et traitement des troubles bipolaires.', 'Psychologie et Psychiatrie', NULL, NULL, 'Troubles bipolaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(772, 'psycho-psychiatrie', 'Schizophrénie', NULL, 'Suivi et traitement de la schizophrénie.', 'Psychologie et Psychiatrie', NULL, NULL, 'Schizophrénie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(773, 'psycho-psychiatrie', 'Paranoïa', NULL, 'Prise en charge des troubles paranoïaques.', 'Psychologie et Psychiatrie', NULL, NULL, 'Paranoïa', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(774, 'psycho-psychiatrie', 'Traitement du stress', NULL, 'Gestion du stress et troubles associés.', 'Psychologie et Psychiatrie', NULL, NULL, 'Stress – Psychologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(775, 'psycho-psychiatrie', 'Phobie sociale', NULL, 'Traitement de la phobie sociale.', 'Psychologie et Psychiatrie', NULL, NULL, 'Phobie sociale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(776, 'psycho-psychiatrie', 'TOC', NULL, 'Prise en charge du trouble obsessionnel compulsif.', 'Psychologie et Psychiatrie', NULL, NULL, 'TOC', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(777, 'psycho-psychiatrie', 'TCC', NULL, 'Thérapies cognitivo-comportementales.', 'Psychologie et Psychiatrie', NULL, NULL, 'TCC', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(778, 'psycho-psychiatrie', 'Trouble panique', NULL, 'Traitement du trouble panique.', 'Psychologie et Psychiatrie', NULL, NULL, 'Trouble panique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(779, 'psycho-psychiatrie', 'Dysfonction sexuelle', NULL, 'Prise en charge psycho-sexologique.', 'Psychologie et Psychiatrie', NULL, NULL, 'Dysfonction sexuelle', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(780, 'psycho-psychiatrie', 'Psychothérapie', NULL, 'Psychothérapie individuelle/selon approche.', 'Psychologie et Psychiatrie', NULL, NULL, 'Psychothérapie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(781, 'psycho-psychiatrie', 'Pédopsychiatrie', NULL, 'Consultation et suivi psychiatrique de l’enfant.', 'Psychologie et Psychiatrie', NULL, NULL, 'Pédopsychiatrie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(782, 'rhumatologie', 'Consultation en rhumatologie', NULL, 'Consultation des maladies des articulations et tissus conjonctifs.', 'Rhumatologie', NULL, NULL, 'Consultation rhumatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(783, 'rhumatologie', 'Consultation polyarthrite rhumatoïde', NULL, 'Consultation dédiée à la polyarthrite rhumatoïde.', 'Rhumatologie', NULL, NULL, 'Polyarthrite – Rhumatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(784, 'rhumatologie', 'Polyarthrite rhumatoïde', NULL, 'Prise en charge de la polyarthrite rhumatoïde.', 'Rhumatologie', NULL, NULL, 'Polyarthrite rhumatoïde', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(785, 'rhumatologie', 'Arthrose', NULL, 'Traitement de l’arthrose.', 'Rhumatologie', NULL, NULL, 'Arthrose – Rhumatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(786, 'rhumatologie', 'Fibromyalgie', NULL, 'Prise en charge de la fibromyalgie.', 'Rhumatologie', NULL, NULL, 'Fibromyalgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(787, 'rhumatologie', 'Goutte', NULL, 'Diagnostic et traitement de la goutte.', 'Rhumatologie', NULL, NULL, 'Goutte', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(788, 'rhumatologie', 'Ostéoporose', NULL, 'Prévention et traitement de l’ostéoporose.', 'Rhumatologie', NULL, NULL, 'Ostéoporose – Rhumatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(789, 'rhumatologie', 'Spondylarthrite ankylosante', NULL, 'Prise en charge de la spondylarthrite.', 'Rhumatologie', NULL, NULL, 'Spondylarthrite', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(790, 'rhumatologie', 'Lupus érythémateux', NULL, 'Suivi rhumatologique du lupus.', 'Rhumatologie', NULL, NULL, 'Lupus', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(791, 'rhumatologie', 'Syndrome de Gougerot-Sjögren', NULL, 'Prise en charge du syndrome de Sjögren.', 'Rhumatologie', NULL, NULL, 'Sjögren', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(792, 'rhumatologie', 'Tendinites', NULL, 'Traitement des tendinites.', 'Rhumatologie', NULL, NULL, 'Tendinites – Rhumatologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(793, 'rhumatologie', 'Myosites', NULL, 'Prise en charge des myosites.', 'Rhumatologie', NULL, NULL, 'Myosites', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(794, 'rhumatologie', 'Lombalgies et cervicalgies', NULL, 'Traitement des douleurs du dos et du cou.', 'Rhumatologie', NULL, NULL, 'Lombalgie cervicalgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(795, 'rhumatologie', 'Traitement arthrite rhumatoïde', NULL, 'Traitement et suivi des douleurs inflammatoires.', 'Rhumatologie', NULL, NULL, 'Traitement arthrite rhumatoïde', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(796, 'rhumatologie', 'Traitement douleurs articulaires', NULL, 'Prise en charge des douleurs articulaires.', 'Rhumatologie', NULL, NULL, 'Douleurs articulaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(797, 'rhumatologie', 'Infiltrations articulaires', NULL, 'Injections intra-articulaires thérapeutiques.', 'Rhumatologie', NULL, NULL, 'Infiltrations articulaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(798, 'rhumatologie', 'Rééducation rhumatologique', NULL, 'Rééducation fonctionnelle en rhumatologie.', 'Rhumatologie', NULL, NULL, 'Rééducation rhumatologique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(799, 'dentaire', 'Consultation dentaire', NULL, 'Consultation et diagnostic en santé bucco-dentaire.', 'Traitement dentaire', NULL, NULL, 'Consultation dentaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(800, 'dentaire', 'Soins dentaires', NULL, 'Soins courants et prévention.', 'Traitement dentaire', NULL, NULL, 'Soins dentaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(801, 'dentaire', 'Odontologie pédiatrique', NULL, 'Soins dentaires pour enfants.', 'Traitement dentaire', NULL, NULL, 'Odontologie pédiatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(802, 'dentaire', 'Détartrage et nettoyage', NULL, 'Nettoyage et détartrage dentaire.', 'Traitement dentaire', NULL, NULL, 'Détartrage', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(803, 'dentaire', 'Traitement des caries et canaux', NULL, 'Traitement des caries et endodontie.', 'Traitement dentaire', NULL, NULL, 'Caries et canaux', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(804, 'dentaire', 'Extraction dentaire', NULL, 'Extraction simple ou chirurgicale.', 'Traitement dentaire', NULL, NULL, 'Extraction dentaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(805, 'dentaire', 'Allongement coronaire', NULL, 'Chirurgie d’allongement coronaire.', 'Traitement dentaire', NULL, NULL, 'Allongement coronaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(806, 'dentaire', 'Gingivectomie', NULL, 'Chirurgie gingivale (gingivectomie).', 'Traitement dentaire', NULL, NULL, 'Gingivectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(807, 'dentaire', 'Greffe de gencive', NULL, 'Greffe gingivale.', 'Traitement dentaire', NULL, NULL, 'Greffe gencive', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(808, 'dentaire', 'Greffe osseuse dentaire', NULL, 'Augmentation osseuse pré-implantaire.', 'Traitement dentaire', NULL, NULL, 'Greffe osseuse dentaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(809, 'dentaire', 'Dentier / Prothèse dentaire', NULL, 'Conception et pose de prothèses amovibles.', 'Traitement dentaire', NULL, NULL, 'Prothèse dentaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(810, 'dentaire', 'Bridge dentaire', NULL, 'Prothèse fixe type bridge.', 'Traitement dentaire', NULL, NULL, 'Bridge dentaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(811, 'dentaire', 'Couronnes dentaires', NULL, 'Pose de couronnes dentaires.', 'Traitement dentaire', NULL, NULL, 'Couronnes dentaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(812, 'dentaire', 'Implant dentaire', NULL, 'Pose d’implants dentaires.', 'Traitement dentaire', NULL, NULL, 'Implant dentaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(813, 'dentaire', 'Implant à charge immédiate', NULL, 'Implantation avec restauration rapide.', 'Traitement dentaire', NULL, NULL, 'Implant charge immédiate', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(814, 'dentaire', 'Implant zygomatique', NULL, 'Implants zygomatiques pour maxillaire atrophié.', 'Traitement dentaire', NULL, NULL, 'Implant zygomatique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(815, 'dentaire', 'Implants sous-périostés', NULL, 'Implants sous-périostés selon indication.', 'Traitement dentaire', NULL, NULL, 'Implants sous-périostés', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(816, 'dentaire', 'All-on-4', NULL, 'Réhabilitation complète sur 4 implants.', 'Traitement dentaire', NULL, NULL, 'All-on-4', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(817, 'dentaire', 'All-on-6', NULL, 'Réhabilitation complète sur 6 implants.', 'Traitement dentaire', NULL, NULL, 'All-on-6', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(818, 'dentaire', 'All-on-8', NULL, 'Réhabilitation complète sur 8 implants.', 'Traitement dentaire', NULL, NULL, 'All-on-8', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(819, 'dentaire', 'Facette dentaire', NULL, 'Facettes esthétiques.', 'Traitement dentaire', NULL, NULL, 'Facette dentaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(820, 'dentaire', 'Facettes stratifiées', NULL, 'Facettes stratifiées esthétiques.', 'Traitement dentaire', NULL, NULL, 'Facettes stratifiées', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(821, 'dentaire', 'Facettes en zirconium', NULL, 'Facettes en zirconium.', 'Traitement dentaire', NULL, NULL, 'Facettes zirconium', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(822, 'dentaire', 'Blanchiment dentaire', NULL, 'Blanchiment des dents.', 'Traitement dentaire', NULL, NULL, 'Blanchiment dentaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(823, 'dentaire', 'Hollywood Smile', NULL, 'Sourire esthétique complet.', 'Traitement dentaire', NULL, NULL, 'Hollywood Smile', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(824, 'dentaire', 'Invisalign', NULL, 'Orthodontie par gouttières transparentes.', 'Traitement dentaire', NULL, NULL, 'Invisalign', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(825, 'dentaire', 'Appareil dentaire / Orthodontie', NULL, 'Traitement orthodontique par appareils.', 'Traitement dentaire', NULL, NULL, 'Orthodontie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(826, 'transplantologie', 'Greffe de rein', NULL, 'Transplantation rénale selon indication médicale.', 'Transplantologie', NULL, NULL, 'Greffe de rein – Transplantologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(827, 'transplantologie', 'Greffe de foie', NULL, 'Transplantation hépatique selon indication médicale.', 'Transplantologie', NULL, NULL, 'Greffe de foie – Transplantologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(828, 'urologie', 'Consultation en Urologie', NULL, 'Consultation spécialisée des voies urinaires et appareil génital.', 'Urologie', NULL, NULL, 'Consultation urologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(829, 'urologie', 'Analyse d’Urine', NULL, 'Analyse urinaire à visée diagnostique.', 'Urologie', NULL, NULL, 'Analyse urine – Urologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(830, 'urologie', 'Biopsie de la prostate', NULL, 'Prélèvement prostatique pour diagnostic.', 'Urologie', NULL, NULL, 'Biopsie prostate', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(831, 'urologie', 'Biopsie testiculaire', NULL, 'Prélèvement testiculaire à visée diagnostique.', 'Urologie', NULL, NULL, 'Biopsie testiculaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(832, 'urologie', 'Chirurgie de la prostate', NULL, 'Interventions chirurgicales de la prostate.', 'Urologie', NULL, NULL, 'Chirurgie prostate', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(833, 'urologie', 'Réimplantation urétérale', NULL, 'Chirurgie de réimplantation de l’uretère.', 'Urologie', NULL, NULL, 'Réimplantation urétérale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(834, 'urologie', 'Réparation de l’urètre', NULL, 'Chirurgie réparatrice urétrale.', 'Urologie', NULL, NULL, 'Réparation urètre', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(835, 'urologie', 'Circoncision', NULL, 'Intervention de circoncision.', 'Urologie', NULL, NULL, 'Circoncision', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(836, 'urologie', 'Cystoscopie', NULL, 'Exploration endoscopique de la vessie.', 'Urologie', NULL, NULL, 'Cystoscopie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(837, 'urologie', 'Diagnostic des troubles de l’érection', NULL, 'Bilan des troubles érectiles.', 'Urologie', NULL, NULL, 'Troubles érection', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(838, 'urologie', 'Diagnostics photodynamiques', NULL, 'Diagnostics photodynamiques en urologie.', 'Urologie', NULL, NULL, 'Diagnostics photodynamiques', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(839, 'urologie', 'Échographie d’urologie', NULL, 'Imagerie échographique urologique.', 'Urologie', NULL, NULL, 'Échographie urologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(840, 'urologie', 'Échographie de la prostate', NULL, 'Imagerie échographique prostatique.', 'Urologie', NULL, NULL, 'Échographie prostate', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(841, 'urologie', 'Enlèvement kyste épididymaire', NULL, 'Ablation d’un kyste de l’épididyme.', 'Urologie', NULL, NULL, 'Kyste épididymaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(842, 'urologie', 'Frénuloplastie', NULL, 'Chirurgie du frein (frein court).', 'Urologie', NULL, NULL, 'Frénuloplastie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(843, 'urologie', 'Hydronéphrose', NULL, 'Prise en charge de l’hydronéphrose.', 'Urologie', NULL, NULL, 'Hydronéphrose – Urologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(844, 'urologie', 'Incision du col de la vessie', NULL, 'Incision endoscopique du col vésical.', 'Urologie', NULL, NULL, 'Incision col vésical', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(845, 'urologie', 'Stent urétral', NULL, 'Mise en place d’un stent urétral.', 'Urologie', NULL, NULL, 'Stent urétral', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(846, 'urologie', 'Kystectomie', NULL, 'Ablation de la vessie selon indication.', 'Urologie', NULL, NULL, 'Kystectomie – Urologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(847, 'urologie', 'Lifting du scrotum', NULL, 'Chirurgie esthétique/scrotale (selon indication).', 'Urologie', NULL, NULL, 'Lifting scrotum', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(848, 'urologie', 'Opération des reins', NULL, 'Chirurgie rénale selon pathologie.', 'Urologie', NULL, NULL, 'Chirurgie reins', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(849, 'urologie', 'Orchidectomie', NULL, 'Ablation des testicules selon indication.', 'Urologie', NULL, NULL, 'Orchidectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(850, 'urologie', 'Plastie urétrale', NULL, 'Chirurgie reconstructrice de l’urètre.', 'Urologie', NULL, NULL, 'Plastie urétrale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(851, 'urologie', 'Prostatectomie', NULL, 'Ablation partielle/totale de la prostate.', 'Urologie', NULL, NULL, 'Prostatectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(852, 'urologie', 'Prothèse pénienne', NULL, 'Implant pénien pour dysfonction érectile sévère.', 'Urologie', NULL, NULL, 'Prothèse pénienne', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(853, 'urologie', 'Résection transurétrale de la prostate', NULL, 'RTUP pour hypertrophie bénigne.', 'Urologie', NULL, NULL, 'RTUP', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(854, 'urologie', 'Résection transurétrale tumeur vessie', NULL, 'Résection endoscopique des tumeurs vésicales.', 'Urologie', NULL, NULL, 'Tumeur vessie – résection', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(855, 'urologie', 'Retrait du cathéter sus-pubien', NULL, 'Ablation d’un cathéter sus-pubien.', 'Urologie', NULL, NULL, 'Cathéter sus-pubien', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(856, 'urologie', 'REZUM', NULL, 'Traitement mini-invasif de l’HBP par vapeur d’eau.', 'Urologie', NULL, NULL, 'REZUM – Urologie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(857, 'urologie', 'Laser HBP', NULL, 'Traitement au laser de l’hypertrophie bénigne.', 'Urologie', NULL, NULL, 'Laser HBP', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(858, 'urologie', 'Hypospadias', NULL, 'Prise en charge chirurgicale de l’hypospadias.', 'Urologie', NULL, NULL, 'Hypospadias', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(859, 'urologie', 'Kyste du rein', NULL, 'Traitement des kystes rénaux.', 'Urologie', NULL, NULL, 'Kyste rein', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(860, 'urologie', 'Hydrocèle', NULL, 'Traitement de l’hydrocèle.', 'Urologie', NULL, NULL, 'Hydrocèle', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(861, 'urologie', 'Incontinence urinaire', NULL, 'Bilan et traitement de l’incontinence.', 'Urologie', NULL, NULL, 'Incontinence urinaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(862, 'urologie', 'Maladie de Peyronie', NULL, 'Traitement de la maladie de Peyronie.', 'Urologie', NULL, NULL, 'Peyronie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(863, 'urologie', 'Calculs rénaux', NULL, 'Traitement des lithiases rénales.', 'Urologie', NULL, NULL, 'Calculs rénaux', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(864, 'urologie', 'Troubles de l’éjaculation', NULL, 'Diagnostic et prise en charge des troubles éjaculatoires.', 'Urologie', NULL, NULL, 'Troubles éjaculation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(865, 'urologie', 'Verrues génitales', NULL, 'Traitement des verrues génitales.', 'Urologie', NULL, NULL, 'Verrues génitales', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(866, 'urologie', 'Reflux vésico-urétéral', NULL, 'Prise en charge du reflux vésico-urétéral.', 'Urologie', NULL, NULL, 'Reflux vésico-urétéral', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(867, 'urologie', 'Urétéroscopie', NULL, 'Exploration/intervention endoscopique de l’uretère.', 'Urologie', NULL, NULL, 'Urétéroscopie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(868, 'urologie', 'Urographie intraveineuse', NULL, 'Imagerie des voies urinaires (UIV).', 'Urologie', NULL, NULL, 'UIV', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(869, 'urologie', 'Urologie pédiatrique', NULL, 'Prise en charge urologique de l’enfant.', 'Urologie', NULL, NULL, 'Urologie pédiatrique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(870, 'urologie', 'Varicocélectomie', NULL, 'Chirurgie de la varicocèle.', 'Urologie', NULL, NULL, 'Varicocélectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(871, 'urologie', 'Vasectomie', NULL, 'Stérilisation masculine chirurgicale.', 'Urologie', NULL, NULL, 'Vasectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(872, 'urologie', 'Vasovasostomie', NULL, 'Reperméabilisation des canaux déférents.', 'Urologie', NULL, NULL, 'Vasovasostomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(873, 'toxicomanie-dependance', 'Sevrage tabagique', NULL, 'Programme de sevrage et accompagnement du tabagisme.', 'Toxicomanie et Dépendance', NULL, NULL, 'Sevrage tabagique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(874, 'toxicomanie-dependance', 'Traitement de l’alcoolisme', NULL, 'Prise en charge médicale et psychologique de l’alcoolisme.', 'Toxicomanie et Dépendance', NULL, NULL, 'Alcoolisme', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(875, 'toxicomanie-dependance', 'Dépendance à l’amphétamine', NULL, 'Programme de prise en charge de la dépendance.', 'Toxicomanie et Dépendance', NULL, NULL, 'Dépendance amphétamine', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(876, 'toxicomanie-dependance', 'Dépendance à l’ecstasy', NULL, 'Programme de prise en charge de la dépendance.', 'Toxicomanie et Dépendance', NULL, NULL, 'Dépendance ecstasy', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(877, 'toxicomanie-dependance', 'Dépendance à l’héroïne', NULL, 'Programme de prise en charge de la dépendance.', 'Toxicomanie et Dépendance', NULL, NULL, 'Dépendance héroïne', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(878, 'toxicomanie-dependance', 'Dépendance à la cocaïne', NULL, 'Programme de prise en charge de la dépendance.', 'Toxicomanie et Dépendance', NULL, NULL, 'Dépendance cocaïne', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(879, 'toxicomanie-dependance', 'Dépendance au cannabis', NULL, 'Programme de prise en charge de la dépendance.', 'Toxicomanie et Dépendance', NULL, NULL, 'Dépendance cannabis', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(880, 'toxicomanie-dependance', 'Dépendance au jeu', NULL, 'Prise en charge de l’addiction au jeu et paris.', 'Toxicomanie et Dépendance', NULL, NULL, 'Addiction jeu', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(881, 'toxicomanie-dependance', 'Dépendance sexuelle', NULL, 'Prise en charge de l’addiction sexuelle.', 'Toxicomanie et Dépendance', NULL, NULL, 'Dépendance sexuelle', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(882, 'toxicomanie-dependance', 'Traitement de la nomophobie', NULL, 'Prise en charge de l’addiction au téléphone (nomophobie).', 'Toxicomanie et Dépendance', NULL, NULL, 'Nomophobie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:14:54', '2026-01-29 16:14:54'),
(883, 'gynecologie-obstetrique', 'Infections vaginales (candidose, vaginose bactérienne)', NULL, 'Diagnostic et traitement des infections vaginales.', 'Gynécologie obstétrique', NULL, NULL, 'Infections vaginales', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(884, 'gynecologie-obstetrique', 'Syndrome des ovaires polykystiques (SOPK)', NULL, 'Prise en charge du SOPK et troubles hormonaux associés.', 'Gynécologie obstétrique', NULL, NULL, 'SOPK', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(885, 'gynecologie-obstetrique', 'Cancer gynécologique (ovaire, utérus, col de l’utérus)', NULL, 'Parcours de soins et prise en charge oncologique gynécologique.', 'Gynécologie obstétrique', NULL, NULL, 'Cancer gynécologique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(886, 'gynecologie-obstetrique', 'Suivi de grossesse normale et à risques', NULL, 'Suivi obstétrical complet, grossesse normale ou à risque.', 'Gynécologie obstétrique', NULL, NULL, 'Suivi grossesse', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(887, 'gynecologie-obstetrique', 'Accouchement physiologique / Accouchement naturel', NULL, 'Accompagnement de l’accouchement physiologique.', 'Gynécologie obstétrique', NULL, NULL, 'Accouchement naturel', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(888, 'gynecologie-obstetrique', 'Dépistage de la Trisomie 21', NULL, 'Dépistage prénatal de la trisomie 21.', 'Gynécologie obstétrique', NULL, NULL, 'Dépistage trisomie 21', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(889, 'gynecologie-obstetrique', 'Détection du Papillomavirus humain', NULL, 'Dépistage et prise en charge du HPV.', 'Gynécologie obstétrique', NULL, NULL, 'HPV – dépistage', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(890, 'gynecologie-obstetrique', 'Échographie gynécologique et obstétricale (4D + écho fœtale)', NULL, 'Échographie gynécologique/obstétricale, y compris 4D et écho fœtale.', 'Gynécologie obstétrique', NULL, NULL, 'Échographie gynécologique obstétricale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(891, 'gynecologie-obstetrique', 'Examen des seins', NULL, 'Examen clinique et dépistage mammaire.', 'Gynécologie obstétrique', NULL, NULL, 'Examen des seins', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(892, 'gynecologie-obstetrique', 'Biopsie cervicale', NULL, 'Prélèvement du col utérin à visée diagnostique.', 'Gynécologie obstétrique', NULL, NULL, 'Biopsie cervicale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(893, 'gynecologie-obstetrique', 'Biopsie de l’endomètre', NULL, 'Prélèvement endométrial pour analyse.', 'Gynécologie obstétrique', NULL, NULL, 'Biopsie endomètre', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(894, 'gynecologie-obstetrique', 'Examen bactériologique vaginal', NULL, 'Analyse microbiologique des prélèvements vaginaux.', 'Gynécologie obstétrique', NULL, NULL, 'Examen bactériologique vaginal', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(895, 'gynecologie-obstetrique', 'Tests hormonaux', NULL, 'Bilans hormonaux féminins (fertilité, cycles…).', 'Gynécologie obstétrique', NULL, NULL, 'Tests hormonaux', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(896, 'gynecologie-obstetrique', 'Amniocentèse', NULL, 'Prélèvement de liquide amniotique pour diagnostic prénatal.', 'Gynécologie obstétrique', NULL, NULL, 'Amniocentèse', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(897, 'gynecologie-obstetrique', 'Ovariectomie', NULL, 'Ablation d’un ovaire selon indication.', 'Gynécologie obstétrique', NULL, NULL, 'Ovariectomie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(898, 'gynecologie-obstetrique', 'Ablation de l’endomètre', NULL, 'Ablation endométriale selon indication.', 'Gynécologie obstétrique', NULL, NULL, 'Ablation endomètre', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(899, 'gynecologie-obstetrique', 'Ablation des polypes cervicaux', NULL, 'Retrait des polypes du col utérin.', 'Gynécologie obstétrique', NULL, NULL, 'Polypes cervicaux', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(900, 'gynecologie-obstetrique', 'Ablation des tumeurs de l’ovaire', NULL, 'Chirurgie des tumeurs ovariennes selon diagnostic.', 'Gynécologie obstétrique', NULL, NULL, 'Tumeurs ovaire – chirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(901, 'gynecologie-obstetrique', 'Chirurgie du prolapsus utérin', NULL, 'Traitement chirurgical du prolapsus.', 'Gynécologie obstétrique', NULL, NULL, 'Prolapsus utérin', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(902, 'gynecologie-obstetrique', 'Chirurgie de transposition des ovaires', NULL, 'Déplacement ovarien selon indication thérapeutique.', 'Gynécologie obstétrique', NULL, NULL, 'Transposition ovaires', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(903, 'gynecologie-obstetrique', 'Dilatation et curetage', NULL, 'Geste de curetage utérin selon indication.', 'Gynécologie obstétrique', NULL, NULL, 'Curetage', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(904, 'gynecologie-obstetrique', 'Hystéroscopie', NULL, 'Exploration endoscopique de la cavité utérine.', 'Gynécologie obstétrique', NULL, NULL, 'Hystéroscopie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(905, 'gynecologie-obstetrique', 'Cerclage du col de l’utérus', NULL, 'Cerclage cervical en prévention de l’insuffisance cervicale.', 'Gynécologie obstétrique', NULL, NULL, 'Cerclage col utérus', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(906, 'gynecologie-obstetrique', 'Ligature des trompes', NULL, 'Stérilisation par ligature tubaire.', 'Gynécologie obstétrique', NULL, NULL, 'Ligature trompes', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(907, 'gynecologie-obstetrique', 'Stérilisation féminine', NULL, 'Procédure de contraception définitive.', 'Gynécologie obstétrique', NULL, NULL, 'Stérilisation féminine', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(908, 'gynecologie-obstetrique', 'Embolisation des artères utérines', NULL, 'Traitement endovasculaire (fibromes, saignements…).', 'Gynécologie obstétrique', NULL, NULL, 'Embolisation artères utérines', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(909, 'gynecologie-obstetrique', 'Rééducation du plancher pelvien', NULL, 'Rééducation périnéale (tonus, incontinence…).', 'Gynécologie obstétrique', NULL, NULL, 'Rééducation périnéale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31');
INSERT INTO `medical_procedures` (`id_procedure`, `category_key`, `nom_procedure`, `slug`, `short_description`, `categorie`, `sous_categorie`, `description`, `seo_title`, `seo_description`, `code_reference`, `img_procedure`, `duree_moyenne`, `is_active`, `is_featured`, `language`, `sort_order`, `meta`, `created_at`, `updated_at`) VALUES
(910, 'gynecologie-obstetrique', 'Retrait des kystes ovariens', NULL, 'Ablation chirurgicale de kystes ovariens.', 'Gynécologie obstétrique', NULL, NULL, 'Kystes ovariens – chirurgie', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(911, 'gynecologie-obstetrique', 'Traitement de la peau vulvaire', NULL, 'Prise en charge dermatologique de la vulve.', 'Gynécologie obstétrique', NULL, NULL, 'Peau vulvaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(912, 'gynecologie-obstetrique', 'Traitement du vaginisme', NULL, 'Prise en charge du vaginisme et douleurs associées.', 'Gynécologie obstétrique', NULL, NULL, 'Vaginisme', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(913, 'gynecologie-obstetrique', 'Stimulation ovarienne', NULL, 'Stimulation hormonale dans un parcours fertilité.', 'Gynécologie obstétrique', NULL, NULL, 'Stimulation ovarienne', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(914, 'gynecologie-obstetrique', 'Prise en charge de l’infertilité', NULL, 'Bilan et traitements de l’infertilité.', 'Gynécologie obstétrique', NULL, NULL, 'Infertilité – prise en charge', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(915, 'gynecologie-obstetrique', 'Cellules souches pour traitement d’infertilité', NULL, 'Approches régénératives (selon protocole) pour infertilité.', 'Gynécologie obstétrique', NULL, NULL, 'Cellules souches infertilité', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(916, 'gynecologie-obstetrique', 'Exosomes pour le traitement de l’infertilité', NULL, 'Approches par exosomes (selon protocole).', 'Gynécologie obstétrique', NULL, NULL, 'Exosomes infertilité', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(917, 'gynecologie-obstetrique', 'Rajeunissement ovarien par PRP', NULL, 'PRP ovarien dans certains protocoles fertilité.', 'Gynécologie obstétrique', NULL, NULL, 'PRP ovarien', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(918, 'gynecologie-obstetrique', 'Congélation d’ovocytes', NULL, 'Préservation de fertilité par cryoconservation.', 'Gynécologie obstétrique', NULL, NULL, 'Congélation ovocytes', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(919, 'gynecologie-obstetrique', 'FIV / IVF', NULL, 'Fécondation in vitro.', 'Gynécologie obstétrique', NULL, NULL, 'FIV', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(920, 'gynecologie-obstetrique', 'ICSI', NULL, 'Injection intracytoplasmique de spermatozoïde.', 'Gynécologie obstétrique', NULL, NULL, 'ICSI', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(921, 'gynecologie-obstetrique', 'Implant contraceptif', NULL, 'Méthode contraceptive par implant.', 'Gynécologie obstétrique', NULL, NULL, 'Implant contraceptif', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(922, 'gynecologie-obstetrique', 'Vaccin HPV', NULL, 'Vaccination contre le papillomavirus humain.', 'Gynécologie obstétrique', NULL, NULL, 'Vaccin HPV', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:46:31', '2026-01-29 16:46:31'),
(935, 'medecine-physique-readaptation', 'Dépistage ostéo-articulaire', NULL, 'Dépistage des troubles ostéo-articulaires et bilan fonctionnel.', 'Médecine physique et réadaptation', NULL, NULL, 'Dépistage ostéo-articulaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(936, 'medecine-physique-readaptation', 'Rééducation robotique post-AVC', NULL, 'Réadaptation assistée par robot après AVC.', 'Médecine physique et réadaptation', NULL, NULL, 'Rééducation robotique AVC', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(937, 'medecine-physique-readaptation', 'Rééducation motrice', NULL, 'Programme de récupération de la motricité.', 'Médecine physique et réadaptation', NULL, NULL, 'Rééducation motrice', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(938, 'medecine-physique-readaptation', 'Rééducation respiratoire', NULL, 'Rééducation des capacités respiratoires.', 'Médecine physique et réadaptation', NULL, NULL, 'Rééducation respiratoire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(939, 'medecine-physique-readaptation', 'Entraînement fonctionnel', NULL, 'Renforcement fonctionnel et réathlétisation.', 'Médecine physique et réadaptation', NULL, NULL, 'Entraînement fonctionnel', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(940, 'medecine-physique-readaptation', 'Attelle du genou', NULL, 'Appareillage et adaptation d’attelle du genou.', 'Médecine physique et réadaptation', NULL, NULL, 'Attelle genou', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(941, 'medecine-physique-readaptation', 'Stimulation électrique fonctionnelle', NULL, 'Stimulation électrique pour récupération fonctionnelle.', 'Médecine physique et réadaptation', NULL, NULL, 'Stimulation électrique fonctionnelle', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(942, 'medecine-physique-readaptation', 'Thérapie Bobath', NULL, 'Technique de rééducation neuro-fonctionnelle (Bobath).', 'Médecine physique et réadaptation', NULL, NULL, 'Thérapie Bobath', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(943, 'medecine-physique-readaptation', 'Thérapie ciblée au laser', NULL, 'Traitement par laser thérapeutique selon indication.', 'Médecine physique et réadaptation', NULL, NULL, 'Thérapie laser', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(944, 'medecine-physique-readaptation', 'Thérapie magnétique', NULL, 'Approches par champs magnétiques selon protocole.', 'Médecine physique et réadaptation', NULL, NULL, 'Thérapie magnétique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(945, 'medecine-physique-readaptation', 'Thérapie manuelle', NULL, 'Techniques manuelles de mobilisation et soulagement.', 'Médecine physique et réadaptation', NULL, NULL, 'Thérapie manuelle', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(946, 'medecine-physique-readaptation', 'Thérapie physique', NULL, 'Programme de thérapie physique et reconditionnement.', 'Médecine physique et réadaptation', NULL, NULL, 'Thérapie physique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(947, 'medecine-physique-readaptation', 'Rééducation de l’équilibre / vestibulaire', NULL, 'Rééducation des vertiges et troubles de l’équilibre.', 'Médecine physique et réadaptation', NULL, NULL, 'Rééducation vestibulaire', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(948, 'medecine-physique-readaptation', 'Thérapie vertébrale', NULL, 'Prise en charge fonctionnelle du rachis.', 'Médecine physique et réadaptation', NULL, NULL, 'Thérapie vertébrale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(949, 'medecine-physique-readaptation', 'Thérapie de décompression', NULL, 'Décompression rachidienne selon indication.', 'Médecine physique et réadaptation', NULL, NULL, 'Décompression rachidienne', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(950, 'medecine-physique-readaptation', 'Traitement chiropratique', NULL, 'Traitement chiropratique des troubles musculo-squelettiques.', 'Médecine physique et réadaptation', NULL, NULL, 'Traitement chiropratique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(951, 'medecine-physique-readaptation', 'Traitement par hormone de croissance humaine', NULL, 'Prise en charge thérapeutique selon indication spécialisée.', 'Médecine physique et réadaptation', NULL, NULL, 'Hormone de croissance – traitement', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(952, 'medecine-physique-readaptation', 'La polarimétrie à balayage laser', NULL, 'Examen/évaluation par polarimétrie à balayage laser.', 'Médecine physique et réadaptation', NULL, NULL, 'Polarimétrie laser', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:58:43', '2026-01-29 16:58:43'),
(953, 'neurologie', 'Syndrome de la queue de cheval', NULL, 'Prise en charge du syndrome de la queue de cheval.', 'Neurologie', NULL, NULL, 'Queue de cheval', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(954, 'neurologie', 'Torticolis', NULL, 'Diagnostic et traitement du torticolis.', 'Neurologie', NULL, NULL, 'Torticolis', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(955, 'neurologie', 'Potentiels évoqués', NULL, 'Exploration neurophysiologique par potentiels évoqués.', 'Neurologie', NULL, NULL, 'Potentiels évoqués', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(956, 'neurologie', 'Tests neuropsychologiques', NULL, 'Évaluation des fonctions cognitives et neuropsychologiques.', 'Neurologie', NULL, NULL, 'Tests neuropsychologiques', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(957, 'neurologie', 'Traitement de la migraine', NULL, 'Prise en charge spécialisée de la migraine.', 'Neurologie', NULL, NULL, 'Traitement migraine', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(958, 'neurologie', 'Traitement de Parkinson', NULL, 'Suivi et traitement de la maladie de Parkinson.', 'Neurologie', NULL, NULL, 'Parkinson – traitement', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(959, 'neurologie', 'Traitement du mal de crâne', NULL, 'Prise en charge des céphalées et douleurs crâniennes.', 'Neurologie', NULL, NULL, 'Céphalées – traitement', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(960, 'neurologie', 'Traitement de la paralysie de Bell', NULL, 'Prise en charge de la paralysie faciale périphérique.', 'Neurologie', NULL, NULL, 'Paralysie de Bell', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(961, 'neurologie', 'Traitement du spina bifida', NULL, 'Suivi et prise en charge neurologique du spina bifida.', 'Neurologie', NULL, NULL, 'Spina bifida', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(962, 'neurologie', 'Traitement du syndrome de la queue de cheval', NULL, 'Traitement et suivi spécialisé.', 'Neurologie', NULL, NULL, 'Traitement queue de cheval', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(963, 'neurologie', 'Traitement du torticolis', NULL, 'Traitement et rééducation du torticolis.', 'Neurologie', NULL, NULL, 'Traitement torticolis', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(964, 'neurologie', 'Rééducation neurologique', NULL, 'Programme de rééducation neurologique fonctionnelle.', 'Neurologie', NULL, NULL, 'Rééducation neurologique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(965, 'neurologie', 'Neuroréhabilitation', NULL, 'Programme complet de neuroréhabilitation.', 'Neurologie', NULL, NULL, 'Neuroréhabilitation', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(966, 'neurologie', 'Réhabilitation neurologique après un AVC', NULL, 'Réadaptation neurologique après AVC.', 'Neurologie', NULL, NULL, 'Réadaptation AVC', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(967, 'neurologie', 'Stimulation cérébrale et neurochirurgie', NULL, 'Approches de stimulation cérébrale selon indication.', 'Neurologie', NULL, NULL, 'Stimulation cérébrale', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09'),
(968, 'neurologie', 'Gestion de la douleur neuropathique', NULL, 'Prise en charge de la douleur d’origine neuropathique.', 'Neurologie', NULL, NULL, 'Douleur neuropathique', NULL, NULL, NULL, NULL, 1, 0, 'fr', NULL, NULL, '2026-01-29 16:59:09', '2026-01-29 16:59:09');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id_note` int(11) NOT NULL,
  `id_request` int(11) NOT NULL,
  `id_commercial` int(11) DEFAULT NULL,
  `contenu` text NOT NULL,
  `type_note` enum('interne','client','medical','logistique') DEFAULT 'interne',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id_patient` int(11) NOT NULL,
  `numero_tel` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `langue` varchar(50) DEFAULT NULL,
  `ip_adresse` varchar(45) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `sexe` enum('M','F','Autre') DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `poids` decimal(5,2) DEFAULT NULL,
  `taille` decimal(5,2) DEFAULT NULL,
  `smoker` tinyint(1) DEFAULT 0,
  `imc` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id_patient`, `numero_tel`, `email`, `nom`, `prenom`, `langue`, `ip_adresse`, `age`, `sexe`, `pays`, `poids`, `taille`, `smoker`, `imc`, `created_at`, `updated_at`) VALUES
(1, '054565656', 'example@gmail.com', 'Grabara', 'luca', 'fr', '41.97.163.76', 31, 'M', 'Algerie', NULL, NULL, 0, NULL, '2025-12-11 10:11:10', '2025-12-23 19:25:47'),
(2, NULL, 'abderrezak.merz@gmail.com', 'Zikou', 'blanco', 'fr', '54.172.56.37', NULL, 'M', 'Brazil', 90.00, 210.00, 0, 123.00, '2025-12-25 09:23:59', '2025-12-30 15:38:37'),
(3, '0445464878', 'mill64@gmail.com', 'Miller', 'Thoma', 'fr', NULL, 24, 'M', 'FR', 90.00, NULL, 0, NULL, '2026-01-04 16:45:56', '2026-01-07 13:46:15'),
(4, '', 'ben@gmail.com', 'sam', 'bem', 'fr', NULL, 38, 'M', '', NULL, NULL, 0, NULL, '2026-01-05 09:59:18', '2026-01-05 10:38:12');

-- --------------------------------------------------------

--
-- Table structure for table `procedure_hospital`
--

CREATE TABLE `procedure_hospital` (
  `id_relation` int(11) NOT NULL,
  `id_procedure` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `prix_base` decimal(12,2) DEFAULT NULL,
  `devise` varchar(10) DEFAULT 'EUR',
  `duree_sejour` varchar(50) DEFAULT NULL,
  `description_specifique` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `procedure_hospital`
--

INSERT INTO `procedure_hospital` (`id_relation`, `id_procedure`, `id_hospital`, `prix_base`, `devise`, `duree_sejour`, `description_specifique`, `is_active`, `created_at`, `updated_at`) VALUES
(7, 4, 1, 500.00, 'EUR', NULL, NULL, 1, '2025-12-29 13:05:50', '2026-01-29 17:35:05'),
(8, 6, 1, 420.00, 'EUR', NULL, NULL, 1, '2025-12-29 13:29:04', '2026-01-29 17:35:12'),
(9, 22, 5, 500.00, 'EUR', NULL, NULL, 1, '2025-12-30 16:42:47', '2026-01-29 17:35:19'),
(10, 22, 3, 500.00, 'EUR', NULL, NULL, 1, '2025-12-30 16:44:03', '2026-01-29 17:35:25'),
(11, 111, 4, 1200.00, 'EUR', NULL, NULL, 1, '2025-12-30 16:44:34', '2026-01-29 17:35:32'),
(12, 45, 2, 1200.00, 'EUR', NULL, NULL, 1, '2025-12-31 14:10:23', '2026-01-29 17:35:38');

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `id_quote` int(11) NOT NULL,
  `id_request` int(11) NOT NULL,
  `id_patient` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `id_coordi` int(11) DEFAULT NULL,
  `id_commercial` int(11) DEFAULT NULL,
  `numero_devis` varchar(50) DEFAULT NULL,
  `plan_traitement` text DEFAULT NULL,
  `services_inclus` text DEFAULT NULL,
  `nbre_nuits_hospital` int(11) DEFAULT 0,
  `nbre_nuits_apres_hospital` int(11) DEFAULT 0,
  `devise` varchar(10) DEFAULT 'EUR',
  `prix_total` decimal(12,2) DEFAULT NULL,
  `id_medecin` int(11) DEFAULT NULL,
  `service_1` varchar(255) DEFAULT NULL,
  `prix_1` decimal(12,2) DEFAULT NULL,
  `inclus_1` tinyint(1) DEFAULT 0,
  `service_2` varchar(255) DEFAULT NULL,
  `prix_2` decimal(12,2) DEFAULT NULL,
  `inclus_2` tinyint(1) DEFAULT 0,
  `service_3` varchar(255) DEFAULT NULL,
  `prix_3` decimal(12,2) DEFAULT NULL,
  `inclus_3` tinyint(1) DEFAULT 0,
  `service_4` varchar(255) DEFAULT NULL,
  `prix_4` decimal(12,2) DEFAULT NULL,
  `inclus_4` tinyint(1) DEFAULT 0,
  `service_5` varchar(255) DEFAULT NULL,
  `prix_5` decimal(12,2) DEFAULT NULL,
  `inclus_5` tinyint(1) DEFAULT 0,
  `service_6` varchar(255) DEFAULT NULL,
  `prix_6` decimal(12,2) DEFAULT NULL,
  `inclus_6` tinyint(1) DEFAULT 0,
  `service_7` varchar(255) DEFAULT NULL,
  `prix_7` decimal(12,2) DEFAULT NULL,
  `inclus_7` tinyint(1) DEFAULT 0,
  `service_8` varchar(255) DEFAULT NULL,
  `prix_8` decimal(12,2) DEFAULT NULL,
  `inclus_8` tinyint(1) DEFAULT 0,
  `remarque` text DEFAULT NULL,
  `status` enum('draft','na','answered','quoted','expired') DEFAULT 'draft',
  `date_validite` date DEFAULT NULL,
  `date_envoi` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `num_quote` varchar(255) NOT NULL,
  `id_case_manager` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`id_quote`, `id_request`, `id_patient`, `id_hospital`, `id_coordi`, `id_commercial`, `numero_devis`, `plan_traitement`, `services_inclus`, `nbre_nuits_hospital`, `nbre_nuits_apres_hospital`, `devise`, `prix_total`, `id_medecin`, `service_1`, `prix_1`, `inclus_1`, `service_2`, `prix_2`, `inclus_2`, `service_3`, `prix_3`, `inclus_3`, `service_4`, `prix_4`, `inclus_4`, `service_5`, `prix_5`, `inclus_5`, `service_6`, `prix_6`, `inclus_6`, `service_7`, `prix_7`, `inclus_7`, `service_8`, `prix_8`, `inclus_8`, `remarque`, `status`, `date_validite`, `date_envoi`, `created_at`, `updated_at`, `num_quote`, `id_case_manager`) VALUES
(1, 8, 3, 2, NULL, 16, 'DEV-2026-000008', 'test', 'Consultation; Test Pré-op; Contrôle médical; 1 nuit(s) d\'hospitalisation; 1 repas par jour', 1, 0, 'EUR', 700.00, 5, 'Transferts Hôtel - Hôpital', NULL, 1, 'Transferts Aéroport - Hôtel', NULL, 1, 'Nuits à l\'hôtel', 500.00, 1, 'Petit-déjeuner', NULL, 1, 'Assistance 7j/7', NULL, 1, 'Durée séjour Turquie', NULL, 1, 'Nuits hôpital nécessaires', NULL, 1, 'Jours après sortie', NULL, 0, 'Commentaire: valable 30 jours\n\nNotes: rien remarque\n\nPourquoi choisir l\'hôpital: `', '', '2026-02-16', NULL, '2026-01-17 11:17:33', '2026-01-17 11:17:33', '', 0),
(3, 9, 4, 2, NULL, 17, 'DEV-2026-000009', 'A faire B ensuite C', 'Consultation; Service d\'interprète en hôpital; Test Pré-op; Anesthésiste et soins; 2 nuit(s) d\'hospitalisation; 2 repas par jour', 2, 1, 'EUR', 400.00, 5, 'Transferts Hôtel - Hôpital', NULL, 0, 'Transferts Aéroport - Hôtel', NULL, 0, 'Nuits à l\'hôtel', 100.00, 1, 'Petit-déjeuner', NULL, 1, 'Assistance 7j/7', NULL, 1, 'Durée séjour Turquie', NULL, 1, 'Nuits hôpital nécessaires', NULL, 1, 'Jours après sortie', NULL, 1, 'Documents nécessaires: passeport\n\nComment prendre RDV: appel tel', '', '2026-02-17', NULL, '2026-01-18 09:53:06', '2026-01-18 09:53:06', '', 0),
(4, 9, 4, 2, NULL, 17, 'Q2026_494', 'descript', 'Consultation', 0, 0, 'EUR', 1600.00, 6, 'Transferts Hôtel - Hôpital', NULL, 0, 'Transferts Aéroport - Hôtel', NULL, 0, 'Nuits à l\'hôtel', NULL, 0, 'Petit-déjeuner', NULL, 0, 'Assistance 7j/7', NULL, 1, 'Durée séjour Turquie', NULL, 0, 'Nuits hôpital nécessaires', NULL, 0, 'Jours après sortie', NULL, 0, NULL, '', '2026-02-19', NULL, '2026-01-20 10:16:27', '2026-01-20 10:16:28', '', 0),
(5, 9, 4, 2, NULL, 17, 'Q-2026-00005VJKX', NULL, 'Consultation; 1 nuit(s) d\'hospitalisation; 1 repas par jour', 1, 1, 'EUR', 3000.00, 5, 'Transferts Hôtel - Hôpital', NULL, 0, 'Transferts Aéroport - Hôtel', NULL, 0, 'Nuits à l\'hôtel', NULL, 0, 'Petit-déjeuner', NULL, 0, 'Assistance 7j/7', NULL, 0, 'Durée séjour Turquie', NULL, 1, 'Nuits hôpital nécessaires', NULL, 1, 'Jours après sortie', NULL, 1, NULL, '', '2026-02-19', NULL, '2026-01-20 10:35:56', '2026-01-20 10:35:56', '', 0),
(6, 9, 4, 2, NULL, 17, 'Q-2026-00006UIFH', NULL, 'Consultation; Test Pré-op', 0, 0, 'EUR', 500.00, 5, 'Transferts Hôtel - Hôpital', NULL, 0, 'Transferts Aéroport - Hôtel', NULL, 0, 'Nuits à l\'hôtel', NULL, 0, 'Petit-déjeuner', NULL, 0, 'Assistance 7j/7', NULL, 1, 'Durée séjour Turquie', NULL, 0, 'Nuits hôpital nécessaires', NULL, 0, 'Jours après sortie', NULL, 0, NULL, 'answered', '2026-02-19', NULL, '2026-01-20 10:40:50', '2026-01-20 14:18:56', 'Q-2026-00006UIFH', 2);

-- --------------------------------------------------------

--
-- Table structure for table `relances`
--

CREATE TABLE `relances` (
  `id_relance` int(11) NOT NULL,
  `id_request` int(11) NOT NULL,
  `id_commercial` int(11) DEFAULT NULL,
  `date_relance` datetime NOT NULL,
  `objet` varchar(255) DEFAULT NULL,
  `type_relance` enum('auto','manual','') DEFAULT '',
  `status` enum('new','done','canceled') DEFAULT 'new',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `relances`
--

INSERT INTO `relances` (`id_relance`, `id_request`, `id_commercial`, `date_relance`, `objet`, `type_relance`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 9, 17, '2026-01-10 00:00:00', 'Attente confirmation', 'manual', 'done', 'test', '2026-01-09 14:54:36', '2026-01-09 14:55:10');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id_request` int(11) NOT NULL,
  `id_patient` int(11) NOT NULL,
  `id_procedure` int(11) DEFAULT NULL,
  `id_commercial` int(11) DEFAULT NULL,
  `id_galerie` int(11) DEFAULT NULL,
  `langue` varchar(50) DEFAULT NULL,
  `message_patient` text DEFAULT NULL,
  `status` enum('New','affected','dispatched','info request','NI','NA','converted','quoted') DEFAULT 'New',
  `text_maladies` text DEFAULT NULL,
  `text_allergies` text DEFAULT NULL,
  `text_chirurgies` text DEFAULT NULL,
  `text_medicaments` text DEFAULT NULL,
  `id_coordi` int(11) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL,
  `utm_source` varchar(100) DEFAULT NULL,
  `utm_medium` varchar(100) DEFAULT NULL,
  `utm_campaign` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id_request`, `id_patient`, `id_procedure`, `id_commercial`, `id_galerie`, `langue`, `message_patient`, `status`, `text_maladies`, `text_allergies`, `text_chirurgies`, `text_medicaments`, `id_coordi`, `source`, `utm_source`, `utm_medium`, `utm_campaign`, `created_at`, `updated_at`, `archived`) VALUES
(1, 1, 2, 17, NULL, 'fr', NULL, 'info request', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 10:11:10', '2026-01-07 11:49:47', 0),
(2, 1, 2, 17, NULL, 'fr', NULL, 'affected', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 10:14:10', '2026-01-07 12:10:15', 0),
(3, 1, 3, 4, NULL, 'eng', NULL, 'affected', 'Diabète', 'Aucune', 'Appendicectomie', 'Paracétamol, cachiattt', NULL, 'Website', NULL, NULL, NULL, '2025-12-11 10:24:42', '2026-01-07 12:10:55', 0),
(4, 1, 2, 4, NULL, 'fr', NULL, 'affected', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 11:24:15', '2026-01-07 12:07:00', 0),
(5, 1, 1, 4, NULL, 'de', NULL, 'converted', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 11:28:11', '2026-01-07 11:50:44', 0),
(6, 1, 3, 4, NULL, NULL, NULL, 'NI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-22 14:54:18', '2026-01-07 14:02:46', 0),
(7, 2, 1, 16, NULL, NULL, NULL, 'dispatched', NULL, NULL, 'test chirg', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-25 09:23:59', '2026-01-05 13:48:23', 0),
(8, 3, 3, 16, NULL, 'fr', NULL, 'dispatched', '', '', '', '', NULL, 'Manual', NULL, NULL, NULL, '2026-01-04 16:45:56', '2026-01-05 11:31:21', 0),
(9, 4, 1, 17, NULL, 'fr', 'test affichage du message patient bla bla bla ', 'quoted', '', '', '', '', NULL, 'Manual', NULL, NULL, NULL, '2026-01-05 09:59:18', '2026-01-18 09:53:06', 0);

-- --------------------------------------------------------

--
-- Table structure for table `request_hospital`
--

CREATE TABLE `request_hospital` (
  `id_relation` int(11) NOT NULL,
  `id_request` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `request_hospital`
--

INSERT INTO `request_hospital` (`id_relation`, `id_request`, `id_hospital`, `is_active`, `created_at`, `updated_at`) VALUES
(23, 7, 5, 0, '2025-12-31 14:05:16', '2026-01-02 15:33:21'),
(24, 7, 4, 0, '2025-12-31 14:05:16', '2026-01-02 15:33:23'),
(25, 9, 2, 1, '2026-01-05 11:25:27', '2026-01-05 11:25:49'),
(26, 8, 1, 1, '2026-01-05 11:31:21', '2026-01-05 11:31:21'),
(27, 9, 3, 1, '2026-01-05 11:52:37', '2026-01-05 11:52:37'),
(28, 7, 3, 1, '2026-01-05 13:48:23', '2026-01-05 13:48:23'),
(29, 6, 1, 1, '2026-01-07 13:53:23', '2026-01-07 13:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_role` int(11) NOT NULL,
  `nom_role` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_role`, `nom_role`, `description`, `permissions`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Administrateur système avec tous les droits', NULL, '2025-12-10 08:30:19', '2025-12-10 08:30:19'),
(2, 'manager', 'Responsable commercial avec accès aux rapports', NULL, '2025-12-10 08:30:19', '2025-12-10 08:30:19'),
(3, 'commercial', 'Agent commercial standard', NULL, '2025-12-10 08:30:19', '2025-12-10 08:30:19'),
(4, 'admin_hospital', 'Admin hospitalier', NULL, '2025-12-10 08:30:19', '2026-01-19 12:14:47'),
(5, 'readonly', 'Accès en lecture seule', NULL, '2025-12-10 08:30:19', '2025-12-10 08:30:19'),
(6, 'coordinator', 'Coordinateur hospitalier', NULL, '2026-01-19 12:12:13', '2026-01-19 12:14:29');

-- --------------------------------------------------------

--
-- Table structure for table `sales_agents`
--

CREATE TABLE `sales_agents` (
  `id_commercial` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `langue` varchar(50) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales_agents`
--

INSERT INTO `sales_agents` (`id_commercial`, `id_user`, `nom`, `prenom`, `photo`, `email`, `telephone`, `langue`, `note`, `is_active`, `created_at`, `updated_at`) VALUES
(4, 1, 'bensalah', 'Samir ', 'agent_695a9f990927f.jpeg', 'test.agent@example.com', '0700000000', 'fr', 'Agent de test', 1, '2025-12-12 09:26:21', '2026-01-04 17:12:57'),
(16, 1, 'hadad', 'noura', NULL, '', NULL, NULL, NULL, 1, '2025-12-22 17:37:18', '2025-12-22 17:37:18'),
(17, NULL, 'andres', 'viro', 'agent_695a9ff0f0bac.webp', 'viro@gmail.com', '05474151612', 'fr', '', 1, '2026-01-04 17:14:24', '2026-01-18 13:50:06'),
(18, NULL, 'agent test', 'sirop', 'agent_6963ab632f5a7.jpeg', 'test@gmail.com', '', 'fr', '', 1, '2026-01-11 13:53:39', '2026-01-11 13:53:39'),
(19, NULL, 'olij', 'kovar', 'agent_697a39ce4f5c0.jpeg', 'olij@gmail.com', '', 'fr', '', 1, '2026-01-28 16:31:10', '2026-01-28 16:31:10');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id_service` int(11) NOT NULL,
  `nom_service` varchar(255) NOT NULL,
  `prix_service` decimal(12,2) DEFAULT NULL,
  `devise` varchar(10) DEFAULT 'EUR',
  `description` text DEFAULT NULL,
  `categorie` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `id_role` int(11) NOT NULL,
  `id_hospital` int(11) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `system` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `id_role`, `id_hospital`, `username`, `email`, `password`, `nom`, `prenom`, `telephone`, `photo`, `is_active`, `last_login`, `created_at`, `updated_at`, `system`) VALUES
(1, 1, NULL, 'samir boss', 'adminB@test.com', '$2y$10$g7ykhDiyp09e/E6CHp8JeuANqWdfDEqzvixaTid0w9Yf6QhjoYTrW', NULL, NULL, NULL, NULL, 1, NULL, '2025-12-10 09:03:35', '2025-12-10 09:03:35', 'B'),
(2, 4, 2, 'wilmer', 'wilmer@gmail.com', '$2y$10$g7ykhDiyp09e/E6CHp8JeuANqWdfDEqzvixaTid0w9Yf6QhjoYTrW', 'wilmer', 'marc', '0021718594546', NULL, 1, NULL, '2025-12-23 08:49:01', '2026-01-18 13:39:08', 'A'),
(3, 6, 2, 'casey', 'casey@hospital2.com', '$2y$10$DjCNSOatob6hrKGUn6f3F.6SCgXOIhqcAyPbmY6DJD4DSnnWlB112', 'casey', 'kayelan', '+33345162518', NULL, 1, NULL, '2026-01-20 14:44:38', '2026-01-20 14:44:38', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `v_quote_summary`
--

CREATE TABLE `v_quote_summary` (
  `id_quote` int(11) DEFAULT NULL,
  `numero_devis` varchar(50) DEFAULT NULL,
  `prix_total` decimal(12,2) DEFAULT NULL,
  `devise` varchar(10) DEFAULT NULL,
  `status` enum('brouillon','envoye','accepte','refuse','expire') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `patient_nom` varchar(100) DEFAULT NULL,
  `patient_prenom` varchar(100) DEFAULT NULL,
  `hospital_nom` varchar(255) DEFAULT NULL,
  `hospital_pays` varchar(100) DEFAULT NULL,
  `nom_medecin` varchar(150) DEFAULT NULL,
  `agent_nom` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `v_request_summary`
--

CREATE TABLE `v_request_summary` (
  `id_request` int(11) DEFAULT NULL,
  `status` enum('New','affected','dispatched','info request','NI','NA','converted') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `patient_nom` varchar(100) DEFAULT NULL,
  `patient_prenom` varchar(100) DEFAULT NULL,
  `patient_email` varchar(255) DEFAULT NULL,
  `patient_pays` varchar(100) DEFAULT NULL,
  `nom_procedure` varchar(255) DEFAULT NULL,
  `procedure_categorie` varchar(100) DEFAULT NULL,
  `agent_nom` varchar(100) DEFAULT NULL,
  `agent_email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `v_upcoming_appointments`
--

CREATE TABLE `v_upcoming_appointments` (
  `id_appointment` int(11) DEFAULT NULL,
  `date_arrivee` date DEFAULT NULL,
  `date_depart` date DEFAULT NULL,
  `status` enum('planifie','confirme','en_cours','termine','annule','no_show') DEFAULT NULL,
  `patient_nom` varchar(100) DEFAULT NULL,
  `patient_prenom` varchar(100) DEFAULT NULL,
  `patient_email` varchar(255) DEFAULT NULL,
  `hospital_nom` varchar(255) DEFAULT NULL,
  `hospital_ville` varchar(100) DEFAULT NULL,
  `prix_total` decimal(12,2) DEFAULT NULL,
  `devise` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id_appointment`),
  ADD KEY `idx_quote` (`id_quote`),
  ADD KEY `idx_request` (`id_request`),
  ADD KEY `idx_patient` (`id_patient`),
  ADD KEY `idx_hospital` (`id_hospital`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_date_arrivee` (`date_arrivee`);

--
-- Indexes for table `case_managers`
--
ALTER TABLE `case_managers`
  ADD PRIMARY KEY (`id_case_manager`),
  ADD KEY `fk_cm_hospital` (`id_hospital`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id_medecin`),
  ADD KEY `idx_hospital` (`id_hospital`),
  ADD KEY `idx_nom` (`nom_medecin`),
  ADD KEY `idx_specialite` (`specialite`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id_template`),
  ADD UNIQUE KEY `unique_slug_langue` (`slug`,`langue`);

--
-- Indexes for table `galerie_patient`
--
ALTER TABLE `galerie_patient`
  ADD PRIMARY KEY (`id_galerie`),
  ADD KEY `idx_request` (`id_request`);

--
-- Indexes for table `historique_email`
--
ALTER TABLE `historique_email`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_request` (`id_request`),
  ADD KEY `idx_patient` (`id_patient`),
  ADD KEY `idx_commercial` (`id_commercial`),
  ADD KEY `idx_date_envoi` (`date_envoi`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id_hospital`),
  ADD KEY `idx_nom` (`nom`),
  ADD KEY `idx_pays` (`pays`),
  ADD KEY `idx_ville` (`ville`);

--
-- Indexes for table `hospital_coordinators`
--
ALTER TABLE `hospital_coordinators`
  ADD PRIMARY KEY (`id_coordi`),
  ADD KEY `idx_hospital` (`id_hospital`),
  ADD KEY `idx_nom` (`nom_coordi`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `hospital_media`
--
ALTER TABLE `hospital_media`
  ADD PRIMARY KEY (`id_media`),
  ADD KEY `idx_hospital` (`id_hospital`),
  ADD KEY `idx_ordre` (`ordre`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id_hotel`),
  ADD KEY `fk_hotel_hospital` (`id_hospital`);

--
-- Indexes for table `medical_procedures`
--
ALTER TABLE `medical_procedures`
  ADD PRIMARY KEY (`id_procedure`),
  ADD UNIQUE KEY `uniq_med_proc` (`category_key`,`nom_procedure`,`language`),
  ADD KEY `idx_nom_procedure` (`nom_procedure`),
  ADD KEY `idx_categorie` (`categorie`),
  ADD KEY `idx_sous_categorie` (`sous_categorie`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id_note`),
  ADD KEY `idx_request` (`id_request`),
  ADD KEY `idx_commercial` (`id_commercial`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id_patient`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_nom` (`nom`,`prenom`),
  ADD KEY `idx_pays` (`pays`),
  ADD KEY `idx_telephone` (`numero_tel`);

--
-- Indexes for table `procedure_hospital`
--
ALTER TABLE `procedure_hospital`
  ADD PRIMARY KEY (`id_relation`),
  ADD UNIQUE KEY `unique_procedure_hospital` (`id_procedure`,`id_hospital`),
  ADD KEY `idx_procedure` (`id_procedure`),
  ADD KEY `idx_hospital` (`id_hospital`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`id_quote`),
  ADD UNIQUE KEY `numero_devis` (`numero_devis`),
  ADD KEY `idx_request` (`id_request`),
  ADD KEY `idx_patient` (`id_patient`),
  ADD KEY `idx_hospital` (`id_hospital`),
  ADD KEY `idx_commercial` (`id_commercial`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_numero_devis` (`numero_devis`),
  ADD KEY `fk_quote_medecin` (`id_medecin`),
  ADD KEY `fk_quote_coordination` (`id_coordi`);

--
-- Indexes for table `relances`
--
ALTER TABLE `relances`
  ADD PRIMARY KEY (`id_relance`),
  ADD KEY `idx_request` (`id_request`),
  ADD KEY `idx_commercial` (`id_commercial`),
  ADD KEY `idx_date_relance` (`date_relance`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id_request`),
  ADD KEY `idx_patient` (`id_patient`),
  ADD KEY `idx_procedure` (`id_procedure`),
  ADD KEY `idx_commercial` (`id_commercial`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `request_hospital`
--
ALTER TABLE `request_hospital`
  ADD PRIMARY KEY (`id_relation`),
  ADD KEY `idx_request` (`id_request`),
  ADD KEY `idx_hospital` (`id_hospital`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_role`),
  ADD UNIQUE KEY `nom_role` (`nom_role`),
  ADD KEY `idx_nom_role` (`nom_role`);

--
-- Indexes for table `sales_agents`
--
ALTER TABLE `sales_agents`
  ADD PRIMARY KEY (`id_commercial`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_nom` (`nom`),
  ADD KEY `idx_user` (`id_user`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id_service`),
  ADD KEY `idx_nom` (`nom_service`),
  ADD KEY `idx_categorie` (`categorie`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_role` (`id_role`),
  ADD KEY `fk_user_hospital` (`id_hospital`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id_appointment` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `case_managers`
--
ALTER TABLE `case_managers`
  MODIFY `id_case_manager` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id_medecin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id_template` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `galerie_patient`
--
ALTER TABLE `galerie_patient`
  MODIFY `id_galerie` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `historique_email`
--
ALTER TABLE `historique_email`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `id_hospital` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `hospital_coordinators`
--
ALTER TABLE `hospital_coordinators`
  MODIFY `id_coordi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hospital_media`
--
ALTER TABLE `hospital_media`
  MODIFY `id_media` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id_hotel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `medical_procedures`
--
ALTER TABLE `medical_procedures`
  MODIFY `id_procedure` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=969;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id_note` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id_patient` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `procedure_hospital`
--
ALTER TABLE `procedure_hospital`
  MODIFY `id_relation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `id_quote` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `relances`
--
ALTER TABLE `relances`
  MODIFY `id_relance` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id_request` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `request_hospital`
--
ALTER TABLE `request_hospital`
  MODIFY `id_relation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sales_agents`
--
ALTER TABLE `sales_agents`
  MODIFY `id_commercial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id_service` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_hospital` FOREIGN KEY (`id_hospital`) REFERENCES `hospitals` (`id_hospital`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
