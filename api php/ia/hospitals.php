<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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
        $stmt = $pdo->prepare("SELECT * FROM hospitals WHERE id_hospital = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }
    $stmt = $pdo->query("SELECT * FROM hospitals ORDER BY id_hospital DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* ======================
    POST (UPLOAD / DELETE / UPDATE / CREATE)
====================== */
if ($method === 'POST') {

    // --- 1. GESTION DES FICHIERS (Multipart/Form-Data) ---
    if (isset($_FILES['logo']) || isset($_FILES['certifications'])) {
        
        $id_hospital = isset($_POST['id_hospital']) ? intval($_POST['id_hospital']) : null;
        if (!$id_hospital) {
            echo json_encode(["error" => "id_hospital est requis pour l'upload"]);
            exit;
        }

        $baseDir = "uploads/hospital_" . $id_hospital . "/";
        $logoDir = $baseDir . "logos/";
        $certDir = $baseDir . "certifications/";

        if (!file_exists($logoDir)) mkdir($logoDir, 0777, true);
        if (!file_exists($certDir)) mkdir($certDir, 0777, true);

        $updates = [];
        $params = [];

        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            $name = "logo_" . time() . "_" . basename($_FILES['logo']['name']);
            $target = $logoDir . $name;
            if (move_uploaded_file($_FILES['logo']['tmp_name'], $target)) {
                $updates[] = "logo = ?";
                $params[] = $target;
            }
        }

        if (isset($_FILES['certifications']) && $_FILES['certifications']['error'] === UPLOAD_ERR_OK) {
            $name = "cert_" . time() . "_" . basename($_FILES['certifications']['name']);
            $target = $certDir . $name;
            if (move_uploaded_file($_FILES['certifications']['tmp_name'], $target)) {
                $updates[] = "certifications = ?";
                $params[] = $target;
            }
        }

        if (!empty($updates)) {
            $params[] = $id_hospital;
            $stmt = $pdo->prepare("UPDATE hospitals SET " . implode(", ", $updates) . " WHERE id_hospital = ?");
            $stmt->execute($params);
            echo json_encode(["success" => true, "type" => "upload"]);
        } else {
            echo json_encode(["error" => "Erreur lors de l'upload"]);
        }
        exit;
    }

    // --- 2. GESTION JSON ---
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    /* ---------- DELETE ---------- */
    if (isset($data['action']) && $data['action'] === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM hospitals WHERE id_hospital = ?");
        $stmt->execute([$data['id_hospital']]);
        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (Réintégré avec tous tes champs) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {
        $allowed = ['nom','pays','nom_gerant','reviews','adresse','ville','certifications','note_google','latitude','longitude','description','logo','website','email','telephone','is_active'];
        $fields = [];
        $values = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        $values[] = $data['id_hospital'];
        $sql = "UPDATE hospitals SET " . implode(', ', $fields) . " WHERE id_hospital = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE (Réintégré avec tous tes champs) ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO hospitals
        (nom,pays,nom_gerant,reviews,adresse,ville,certifications,note_google,latitude,longitude,description,logo,website,email,telephone,is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['nom'] ?? null,
        $data['pays'] ?? null,
        $data['nom_gerant'] ?? null,
        $data['reviews'] ?? null,
        $data['adresse'] ?? null,
        $data['ville'] ?? null,
        $data['certifications'] ?? null,
        $data['note_google'] ?? null,
        $data['latitude'] ?? null,
        $data['longitude'] ?? null,
        $data['description'] ?? null,
        $data['logo'] ?? null,
        $data['website'] ?? null,
        $data['email'] ?? null,
        $data['telephone'] ?? null,
        $data['is_active'] ?? 1
    ]);

    echo json_encode(["success" => true, "type" => "create", "id" => $pdo->lastInsertId()]);
    exit;
}