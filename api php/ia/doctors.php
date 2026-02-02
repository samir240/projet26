<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* ======================
    GET
====================== */
if ($method === 'GET') {

    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM doctors WHERE id_medecin = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC) ?: []);
        exit;
    }

    if (isset($_GET['id_hospital'])) {
        $stmt = $pdo->prepare("SELECT * FROM doctors WHERE id_hospital = ? ORDER BY id_medecin DESC");
        $stmt->execute([$_GET['id_hospital']]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    echo json_encode([]);
    exit;
}

/* ======================
    POST
====================== */
if ($method === 'POST') {

    // --- A. GESTION DES FICHIERS (Multipart/Form-Data) ---
    if (isset($_FILES['photo']) || isset($_FILES['cv'])) {
        
        $id_medecin = isset($_POST['id_medecin']) ? intval($_POST['id_medecin']) : null;
        $id_hospital = isset($_POST['id_hospital']) ? intval($_POST['id_hospital']) : null;

        if (!$id_medecin || !$id_hospital) {
            echo json_encode(["error" => "id_medecin et id_hospital sont requis pour l'upload"]);
            exit;
        }

        $uploadDir = "uploads/hospital_" . $id_hospital . "/doctors/";
        if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

        $updates = [];
        $params = [];

        // Upload photo
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $photoExt = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
            $photoName = "doc_" . $id_medecin . "_pic_" . time() . "." . $photoExt;
            $photoTarget = $uploadDir . $photoName;
            if (move_uploaded_file($_FILES['photo']['tmp_name'], $photoTarget)) {
                $updates[] = "photo = ?";
                $params[] = $photoTarget;
            }
        }

        // Upload CV
        if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
            $cvName = "doc_" . $id_medecin . "_cv_" . time() . ".pdf";
            $cvTarget = $uploadDir . $cvName;
            if (move_uploaded_file($_FILES['cv']['tmp_name'], $cvTarget)) {
                $updates[] = "cv = ?";
                $params[] = $cvTarget;
            }
        }

        if (!empty($updates)) {
            $params[] = $id_medecin;
            $stmt = $pdo->prepare("UPDATE doctors SET " . implode(", ", $updates) . " WHERE id_medecin = ?");
            $stmt->execute($params);
            echo json_encode(["success" => true, "type" => "upload_doctor_media"]);
        } else {
            echo json_encode(["error" => "Aucun fichier n'a été traité"]);
        }
        exit;
    }

    // --- B. GESTION JSON ---
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    // ---------- DELETE ----------
    if (isset($data['action']) && $data['action'] === 'delete') {
        if (!isset($data['id_medecin'], $data['id_hospital'])) {
            echo json_encode(["error" => "id_medecin et id_hospital sont requis"]);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM doctors WHERE id_medecin = ? AND id_hospital = ?");
        $stmt->execute([$data['id_medecin'], $data['id_hospital']]);
        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    // ---------- UPDATE ----------
    if (isset($data['action']) && $data['action'] === 'update') {
        if (!isset($data['id_medecin'], $data['id_hospital'])) {
            echo json_encode(["error" => "id_medecin et id_hospital sont requis"]);
            exit;
        }

        // Ajout des nouveaux champs dans la liste autorisée
        $allowed = [
            'nom_medecin', 'specialite', 'qualifications', 'experience_years', 
            'realisations', 'langues', 'description', 'note', 'reviews', 
            'sexe', 'nationalite', 'email', 'telephone', 'is_active'
        ];
        
        $fields = [];
        $values = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (empty($fields)) {
            echo json_encode(["error" => "Aucun champ à modifier"]);
            exit;
        }

        $values[] = $data['id_medecin'];
        $values[] = $data['id_hospital']; 
        
        $stmt = $pdo->prepare("UPDATE doctors SET " . implode(', ', $fields) . " WHERE id_medecin = ? AND id_hospital = ?");
        $stmt->execute($values);
        
        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    // ---------- CREATE ----------
    if (!isset($data['id_hospital'], $data['nom_medecin'])) {
        echo json_encode(["error" => "id_hospital et nom_medecin sont requis"]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO doctors
        (id_hospital, nom_medecin, specialite, qualifications, experience_years, realisations, langues, description, note, reviews, sexe, nationalite, email, telephone, is_active, photo, cv)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['id_hospital'],
        $data['nom_medecin'],
        $data['specialite'] ?? null,
        $data['qualifications'] ?? null,
        $data['experience_years'] ?? 0,
        $data['realisations'] ?? null,
        $data['langues'] ?? null,
        $data['description'] ?? null,
        $data['note'] ?? 0,
        $data['reviews'] ?? 0,
        $data['sexe'] ?? null,
        $data['nationalite'] ?? null,
        $data['email'] ?? null,
        $data['telephone'] ?? null,
        $data['is_active'] ?? 1,
        $data['photo'] ?? null,
        $data['cv'] ?? null
    ]);

    echo json_encode(["success" => true, "type" => "create", "id" => $pdo->lastInsertId()]);
    exit;
}

echo json_encode(["error" => "Méthode non autorisée"]);