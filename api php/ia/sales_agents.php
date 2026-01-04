<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$method = $_SERVER['REQUEST_METHOD'];

/* ==========================================================================
   CONFIGURATION UPLOAD ET DOSSIER
   ========================================================================== */
$upload_dir = 'photos_agents/';

// Créer le dossier s'il n'existe pas
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

/**
 * Fonction pour traiter l'upload de photo (Base64 vers Fichier)
 */
function handlePhotoUpload($base64String, $uploadDir) {
    // Si la chaîne ne commence pas par le préfixe data:image, ce n'est pas un nouvel upload base64
    if (!preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
        return $base64String; // Retourne la valeur actuelle (ex: nom du fichier existant)
    }

    // Extraire les données
    $data = substr($base64String, strpos($base64String, ',') + 1);
    $type = strtolower($type[1]); // jpg, png, gif, webp

    // Vérification de l'extension
    if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
        return null;
    }

    $data = base64_decode($data);
    if ($data === false) return null;

    // Générer un nom de fichier unique
    $fileName = 'agent_' . uniqid() . '.' . $type;
    $filePath = $uploadDir . $fileName;

    if (file_put_contents($filePath, $data)) {
        return $fileName; // On enregistre seulement le nom du fichier en BDD
    }
    return null;
}

/* ======================
    OPTIONS (Preflight)
====================== */
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* ======================
    GET
====================== */
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM sales_agents WHERE id_commercial = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM sales_agents ORDER BY id_commercial DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* ======================
    POST (CREATE + UPDATE)
====================== */
if ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    /* ---------- UPDATE ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_commercial'])) {
            echo json_encode(["error" => "id_commercial is required"]);
            exit;
        }

        $fields = [];
        $values = [];

        $allowed = ['id_user','nom','prenom','photo','email','telephone','langue','note','is_active'];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $val = $data[$field];

                // TRAITEMENT PHOTO UPDATE
                if ($field === 'photo' && !empty($val)) {
                    $val = handlePhotoUpload($val, $upload_dir);
                }

                $fields[] = "$field = ?";
                $values[] = $val;
            }
        }

        if (empty($fields)) {
            echo json_encode(["error" => "No fields to update"]);
            exit;
        }

        $values[] = $data['id_commercial'];

        $sql = "UPDATE sales_agents SET " . implode(', ', $fields) . " WHERE id_commercial = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    
    // TRAITEMENT PHOTO CREATE
    $photoName = null;
    if (!empty($data['photo'])) {
        $photoName = handlePhotoUpload($data['photo'], $upload_dir);
    }

    $stmt = $pdo->prepare("
        INSERT INTO sales_agents (id_user, nom, prenom, photo, email, telephone, langue, note, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['id_user'] ?? null,
        $data['nom'],
        $data['prenom'] ?? null,
        $photoName, // On stocke le nom du fichier physique
        $data['email'],
        $data['telephone'] ?? null,
        $data['langue'] ?? null,
        $data['note'] ?? null,
        $data['is_active'] ?? 1
    ]);

    echo json_encode(["success" => true, "type" => "create", "id" => $pdo->lastInsertId()]);
    exit;
}

/* ======================
    DELETE
====================== */
if ($method === 'DELETE') {

    if (!isset($_GET['id'])) {
        echo json_encode(["error" => "id is required"]);
        exit;
    }

    // Optionnel : On peut supprimer le fichier physique ici si nécessaire
    $stmt = $pdo->prepare("DELETE FROM sales_agents WHERE id_commercial = ?");
    $stmt->execute([$_GET['id']]);

    echo json_encode(["success" => true]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);