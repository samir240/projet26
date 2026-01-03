-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 03, 2026 at 10:27 AM
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
-- Database: `kubi8227_medical_tourism`
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
  `nom_coordi` varchar(150) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fonction` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `langue` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `medical_procedures`
--

CREATE TABLE `medical_procedures` (
  `id_procedure` int(11) NOT NULL,
  `nom_procedure` varchar(255) NOT NULL,
  `categorie` varchar(100) DEFAULT NULL,
  `sous_categorie` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `img_procedure` varchar(500) DEFAULT NULL,
  `duree_moyenne` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medical_procedures`
--

INSERT INTO `medical_procedures` (`id_procedure`, `nom_procedure`, `categorie`, `sous_categorie`, `description`, `img_procedure`, `duree_moyenne`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Liposuccion Abdominale', 'Chirurgie Esthétique', 'Corps', 'Procédure visant à retirer l’excès de graisse au niveau du ventre tout en remodelant la silhouette.', 'liposuccion_abdomen.jpg', '2h', 1, '2025-12-10 09:58:28', '2025-12-10 09:58:28'),
(2, 'Implants Dentaires', 'Dentisterie', 'Implants', 'Pose d’un implant dentaire en titane pour remplacer une dent manquante avec une solution durable.', 'implant_dentaire.jpg', '1h30', 1, '2025-12-10 09:58:28', '2025-12-10 09:58:28'),
(3, 'Rhinoplastie', 'Chirurgie Esthétique', 'Visage', 'Intervention chirurgicale permettant de corriger la forme du nez pour un résultat harmonieux.', 'rhinoplastie.jpg', '3h', 1, '2025-12-10 09:58:28', '2025-12-10 09:58:28');

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
(2, NULL, 'abderrezak.merz@gmail.com', 'Zikou', 'blanco', 'fr', '54.172.56.37', NULL, 'M', 'Brazil', 90.00, 210.00, 0, 123.00, '2025-12-25 09:23:59', '2025-12-30 15:38:37');

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
(7, 2, 1, 500.00, 'EUR', NULL, NULL, 1, '2025-12-29 13:05:50', '2025-12-29 13:05:50'),
(8, 3, 1, 420.00, 'EUR', NULL, NULL, 1, '2025-12-29 13:29:04', '2025-12-29 13:29:04'),
(9, 1, 5, 500.00, 'EUR', NULL, NULL, 1, '2025-12-30 16:42:47', '2025-12-30 16:42:47'),
(10, 1, 3, 500.00, 'EUR', NULL, NULL, 1, '2025-12-30 16:44:03', '2025-12-30 16:44:03'),
(11, 1, 4, 1200.00, 'EUR', NULL, NULL, 1, '2025-12-30 16:44:34', '2025-12-30 16:44:34'),
(12, 1, 2, 1200.00, 'EUR', NULL, NULL, 1, '2025-12-31 14:10:23', '2025-12-31 14:10:23');

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `id_quote` int(11) NOT NULL,
  `id_request` int(11) NOT NULL,
  `id_patient` int(11) NOT NULL,
  `id_hospital` int(11) NOT NULL,
  `id_coordination` int(11) DEFAULT NULL,
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
  `status` enum('brouillon','envoye','accepte','refuse','expire') DEFAULT 'brouillon',
  `date_validite` date DEFAULT NULL,
  `date_envoi` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `type_relance` enum('email','telephone','whatsapp','sms','autre') DEFAULT 'email',
  `status` enum('planifie','effectue','annule') DEFAULT 'planifie',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `status` enum('nouveau','en_cours','converti','perdu','annule','Qualified') DEFAULT 'nouveau',
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id_request`, `id_patient`, `id_procedure`, `id_commercial`, `id_galerie`, `langue`, `message_patient`, `status`, `text_maladies`, `text_allergies`, `text_chirurgies`, `text_medicaments`, `id_coordi`, `source`, `utm_source`, `utm_medium`, `utm_campaign`, `created_at`, `updated_at`) VALUES
(1, 1, 2, NULL, NULL, 'fr', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 10:11:10', '2025-12-16 15:28:38'),
(2, 1, 2, NULL, NULL, 'fr', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 10:14:10', '2025-12-16 15:28:44'),
(3, 1, 3, 4, NULL, 'eng', NULL, 'Qualified', 'Diabète', 'Aucune', 'Appendicectomie', 'Paracétamol, cachiattt', NULL, 'Website', NULL, NULL, NULL, '2025-12-11 10:24:42', '2025-12-23 10:54:11'),
(4, 1, 2, 16, NULL, 'fr', NULL, 'Qualified', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 11:24:15', '2025-12-23 10:58:08'),
(5, 1, 1, 16, NULL, 'de', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-11 11:28:11', '2025-12-22 17:37:37'),
(6, 1, 3, 4, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-22 14:54:18', '2025-12-22 17:24:34'),
(7, 2, 1, 16, NULL, NULL, NULL, 'Qualified', NULL, NULL, 'test chirg', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-25 09:23:59', '2025-12-31 14:37:28');

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
(24, 7, 4, 0, '2025-12-31 14:05:16', '2026-01-02 15:33:23');

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
(4, 'coordinator', 'Coordinateur hospitalier', NULL, '2025-12-10 08:30:19', '2025-12-10 08:30:19'),
(5, 'readonly', 'Accès en lecture seule', NULL, '2025-12-10 08:30:19', '2025-12-10 08:30:19');

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
(4, 1, 'Test', 'Samir Modifié2', 'https://example.com/photo.jpg', 'test.agent@example.com', '0700000000', 'fr', 'Agent de test', 1, '2025-12-12 09:26:21', '2025-12-14 09:03:06'),
(16, 1, 'hadad', 'noura', NULL, '', NULL, NULL, NULL, 1, '2025-12-22 17:37:18', '2025-12-22 17:37:18');

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

INSERT INTO `users` (`id_user`, `id_role`, `username`, `email`, `password`, `nom`, `prenom`, `telephone`, `photo`, `is_active`, `last_login`, `created_at`, `updated_at`, `system`) VALUES
(1, 1, 'samir boss', 'adminB@test.com', '$2y$10$g7ykhDiyp09e/E6CHp8JeuANqWdfDEqzvixaTid0w9Yf6QhjoYTrW', NULL, NULL, NULL, NULL, 1, NULL, '2025-12-10 09:03:35', '2025-12-10 09:03:35', 'B'),
(2, 4, 'wilmer', 'wilmer@gmail.com', '$2y$10$g7ykhDiyp09e/E6CHp8JeuANqWdfDEqzvixaTid0w9Yf6QhjoYTrW', 'wilmer', 'marc', '0021718594546', NULL, 1, NULL, '2025-12-23 08:49:01', '2025-12-23 08:50:28', 'A');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_pending_relances`
-- (See below for the actual view)
--
CREATE TABLE `v_pending_relances` (
`id_relance` int(11)
,`date_relance` datetime
,`objet` varchar(255)
,`type_relance` enum('email','telephone','whatsapp','sms','autre')
,`id_request` int(11)
,`patient_nom` varchar(100)
,`patient_prenom` varchar(100)
,`patient_email` varchar(255)
,`agent_nom` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_quote_summary`
-- (See below for the actual view)
--
CREATE TABLE `v_quote_summary` (
`id_quote` int(11)
,`numero_devis` varchar(50)
,`prix_total` decimal(12,2)
,`devise` varchar(10)
,`status` enum('brouillon','envoye','accepte','refuse','expire')
,`created_at` timestamp
,`patient_nom` varchar(100)
,`patient_prenom` varchar(100)
,`hospital_nom` varchar(255)
,`hospital_pays` varchar(100)
,`nom_medecin` varchar(150)
,`agent_nom` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_request_summary`
-- (See below for the actual view)
--
CREATE TABLE `v_request_summary` (
`id_request` int(11)
,`status` enum('nouveau','en_cours','converti','perdu','annule','Qualified')
,`created_at` timestamp
,`patient_nom` varchar(100)
,`patient_prenom` varchar(100)
,`patient_email` varchar(255)
,`patient_pays` varchar(100)
,`nom_procedure` varchar(255)
,`procedure_categorie` varchar(100)
,`agent_nom` varchar(100)
,`agent_email` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_upcoming_appointments`
-- (See below for the actual view)
--
CREATE TABLE `v_upcoming_appointments` (
`id_appointment` int(11)
,`date_arrivee` date
,`date_depart` date
,`status` enum('planifie','confirme','en_cours','termine','annule','no_show')
,`patient_nom` varchar(100)
,`patient_prenom` varchar(100)
,`patient_email` varchar(255)
,`hospital_nom` varchar(255)
,`hospital_ville` varchar(100)
,`prix_total` decimal(12,2)
,`devise` varchar(10)
);

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
  ADD KEY `idx_nom` (`nom_coordi`);

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
  ADD KEY `fk_quote_coordination` (`id_coordination`);

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
  ADD KEY `idx_role` (`id_role`);

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
  MODIFY `id_case_manager` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id_medecin` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_coordi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hospital_media`
--
ALTER TABLE `hospital_media`
  MODIFY `id_media` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id_hotel` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medical_procedures`
--
ALTER TABLE `medical_procedures`
  MODIFY `id_procedure` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id_note` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id_patient` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `procedure_hospital`
--
ALTER TABLE `procedure_hospital`
  MODIFY `id_relation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `id_quote` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `relances`
--
ALTER TABLE `relances`
  MODIFY `id_relance` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id_request` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `request_hospital`
--
ALTER TABLE `request_hospital`
  MODIFY `id_relation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sales_agents`
--
ALTER TABLE `sales_agents`
  MODIFY `id_commercial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id_service` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

-- --------------------------------------------------------

--
-- Structure for view `v_pending_relances`
--
DROP TABLE IF EXISTS `v_pending_relances`;

CREATE ALGORITHM=UNDEFINED DEFINER=`kubi8227`@`localhost` SQL SECURITY DEFINER VIEW `v_pending_relances`  AS SELECT `rel`.`id_relance` AS `id_relance`, `rel`.`date_relance` AS `date_relance`, `rel`.`objet` AS `objet`, `rel`.`type_relance` AS `type_relance`, `r`.`id_request` AS `id_request`, `p`.`nom` AS `patient_nom`, `p`.`prenom` AS `patient_prenom`, `p`.`email` AS `patient_email`, `sa`.`nom` AS `agent_nom` FROM (((`relances` `rel` left join `requests` `r` on(`rel`.`id_request` = `r`.`id_request`)) left join `patients` `p` on(`r`.`id_patient` = `p`.`id_patient`)) left join `sales_agents` `sa` on(`rel`.`id_commercial` = `sa`.`id_commercial`)) WHERE `rel`.`status` = 'planifie' AND `rel`.`date_relance` >= current_timestamp() ORDER BY `rel`.`date_relance` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_quote_summary`
--
DROP TABLE IF EXISTS `v_quote_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`kubi8227`@`localhost` SQL SECURITY DEFINER VIEW `v_quote_summary`  AS SELECT `q`.`id_quote` AS `id_quote`, `q`.`numero_devis` AS `numero_devis`, `q`.`prix_total` AS `prix_total`, `q`.`devise` AS `devise`, `q`.`status` AS `status`, `q`.`created_at` AS `created_at`, `p`.`nom` AS `patient_nom`, `p`.`prenom` AS `patient_prenom`, `h`.`nom` AS `hospital_nom`, `h`.`pays` AS `hospital_pays`, `d`.`nom_medecin` AS `nom_medecin`, `sa`.`nom` AS `agent_nom` FROM ((((`quotes` `q` left join `patients` `p` on(`q`.`id_patient` = `p`.`id_patient`)) left join `hospitals` `h` on(`q`.`id_hospital` = `h`.`id_hospital`)) left join `doctors` `d` on(`q`.`id_medecin` = `d`.`id_medecin`)) left join `sales_agents` `sa` on(`q`.`id_commercial` = `sa`.`id_commercial`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_request_summary`
--
DROP TABLE IF EXISTS `v_request_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`kubi8227`@`localhost` SQL SECURITY DEFINER VIEW `v_request_summary`  AS SELECT `r`.`id_request` AS `id_request`, `r`.`status` AS `status`, `r`.`created_at` AS `created_at`, `p`.`nom` AS `patient_nom`, `p`.`prenom` AS `patient_prenom`, `p`.`email` AS `patient_email`, `p`.`pays` AS `patient_pays`, `mp`.`nom_procedure` AS `nom_procedure`, `mp`.`categorie` AS `procedure_categorie`, `sa`.`nom` AS `agent_nom`, `sa`.`email` AS `agent_email` FROM (((`requests` `r` left join `patients` `p` on(`r`.`id_patient` = `p`.`id_patient`)) left join `medical_procedures` `mp` on(`r`.`id_procedure` = `mp`.`id_procedure`)) left join `sales_agents` `sa` on(`r`.`id_commercial` = `sa`.`id_commercial`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_upcoming_appointments`
--
DROP TABLE IF EXISTS `v_upcoming_appointments`;

CREATE ALGORITHM=UNDEFINED DEFINER=`kubi8227`@`localhost` SQL SECURITY DEFINER VIEW `v_upcoming_appointments`  AS SELECT `a`.`id_appointment` AS `id_appointment`, `a`.`date_arrivee` AS `date_arrivee`, `a`.`date_depart` AS `date_depart`, `a`.`status` AS `status`, `p`.`nom` AS `patient_nom`, `p`.`prenom` AS `patient_prenom`, `p`.`email` AS `patient_email`, `h`.`nom` AS `hospital_nom`, `h`.`ville` AS `hospital_ville`, `q`.`prix_total` AS `prix_total`, `q`.`devise` AS `devise` FROM (((`appointments` `a` left join `patients` `p` on(`a`.`id_patient` = `p`.`id_patient`)) left join `hospitals` `h` on(`a`.`id_hospital` = `h`.`id_hospital`)) left join `quotes` `q` on(`a`.`id_quote` = `q`.`id_quote`)) WHERE `a`.`date_arrivee` >= curdate() ORDER BY `a`.`date_arrivee` ASC ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `fk_appointment_hospital` FOREIGN KEY (`id_hospital`) REFERENCES `hospitals` (`id_hospital`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appointment_patient` FOREIGN KEY (`id_patient`) REFERENCES `patients` (`id_patient`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appointment_quote` FOREIGN KEY (`id_quote`) REFERENCES `quotes` (`id_quote`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appointment_request` FOREIGN KEY (`id_request`) REFERENCES `requests` (`id_request`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `case_managers`
--
ALTER TABLE `case_managers`
  ADD CONSTRAINT `fk_cm_hospital` FOREIGN KEY (`id_hospital`) REFERENCES `hospitals` (`id_hospital`) ON DELETE CASCADE;

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `fk_doctor_hospital` FOREIGN KEY (`id_hospital`) REFERENCES `hospitals` (`id_hospital`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `galerie_patient`
--
ALTER TABLE `galerie_patient`
  ADD CONSTRAINT `fk_galerie_request` FOREIGN KEY (`id_request`) REFERENCES `requests` (`id_request`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `historique_email`
--
ALTER TABLE `historique_email`
  ADD CONSTRAINT `fk_email_commercial` FOREIGN KEY (`id_commercial`) REFERENCES `sales_agents` (`id_commercial`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_email_patient` FOREIGN KEY (`id_patient`) REFERENCES `patients` (`id_patient`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_email_request` FOREIGN KEY (`id_request`) REFERENCES `requests` (`id_request`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hospital_coordinators`
--
ALTER TABLE `hospital_coordinators`
  ADD CONSTRAINT `fk_coordinator_hospital` FOREIGN KEY (`id_hospital`) REFERENCES `hospitals` (`id_hospital`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hotels`
--
ALTER TABLE `hotels`
  ADD CONSTRAINT `fk_hotel_hospital` FOREIGN KEY (`id_hospital`) REFERENCES `hospitals` (`id_hospital`) ON DELETE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `fk_note_commercial` FOREIGN KEY (`id_commercial`) REFERENCES `sales_agents` (`id_commercial`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_note_request` FOREIGN KEY (`id_request`) REFERENCES `requests` (`id_request`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `procedure_hospital`
--
ALTER TABLE `procedure_hospital`
  ADD CONSTRAINT `fk_ph_hospital` FOREIGN KEY (`id_hospital`) REFERENCES `hospitals` (`id_hospital`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ph_procedure` FOREIGN KEY (`id_procedure`) REFERENCES `medical_procedures` (`id_procedure`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quotes`
--
ALTER TABLE `quotes`
  ADD CONSTRAINT `fk_quote_commercial` FOREIGN KEY (`id_commercial`) REFERENCES `sales_agents` (`id_commercial`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_quote_coordination` FOREIGN KEY (`id_coordination`) REFERENCES `hospital_coordinators` (`id_coordi`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_quote_hospital` FOREIGN KEY (`id_hospital`) REFERENCES `hospitals` (`id_hospital`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_quote_medecin` FOREIGN KEY (`id_medecin`) REFERENCES `doctors` (`id_medecin`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_quote_patient` FOREIGN KEY (`id_patient`) REFERENCES `patients` (`id_patient`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_quote_request` FOREIGN KEY (`id_request`) REFERENCES `requests` (`id_request`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `relances`
--
ALTER TABLE `relances`
  ADD CONSTRAINT `fk_relance_commercial` FOREIGN KEY (`id_commercial`) REFERENCES `sales_agents` (`id_commercial`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_relance_request` FOREIGN KEY (`id_request`) REFERENCES `requests` (`id_request`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `fk_request_commercial` FOREIGN KEY (`id_commercial`) REFERENCES `sales_agents` (`id_commercial`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_request_patient` FOREIGN KEY (`id_patient`) REFERENCES `patients` (`id_patient`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_request_procedure` FOREIGN KEY (`id_procedure`) REFERENCES `medical_procedures` (`id_procedure`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sales_agents`
--
ALTER TABLE `sales_agents`
  ADD CONSTRAINT `fk_sales_agent_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
