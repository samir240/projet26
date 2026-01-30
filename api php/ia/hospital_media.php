<?php
/**
 * Fichier : api/ia/hospital_media.php
 * Arborescence : 
 * - api/ia/hospital_media.php
 * - api/ia/uploads/hospital_{id}/media/
 */

// 1. Sécurité et Headers
error_reporting(0);
ini_set('display_errors', 0);
if (ob_get_level()) ob_clean(); // Nettoie toute sortie parasite pour garantir un JSON pur

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. Connexion BDD
include "config.php";

$method = $_SERVER['REQUEST_METHOD'];

/*
|--------------------------------------------------------------------------
| GET — Récupérer les médias
|--------------------------------------------------------------------------
*/
if ($method === 'GET') {
    $id_hospital = intval($_GET['id_hospital'] ?? 0);

    if ($id_hospital <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "ID hospital requis"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM hospital_media WHERE id_hospital = ? ORDER BY ordre ASC, id_media DESC");
    $stmt->execute([$id_hospital]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/*
|--------------------------------------------------------------------------
| POST — Upload / Update / Delete
|--------------------------------------------------------------------------
*/
if ($method === 'POST') {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    $isMultipart = strpos($contentType, 'multipart/form-data') !== false;
    $input = !$isMultipart ? json_decode(file_get_contents("php://input"), true) : null;

    // --- LOGIQUE DELETE ---
    if ($input && ($input['action'] ?? '') === 'delete') {
        $id_media = intval($input['id_media'] ?? 0);
        
        $stmt = $pdo->prepare("SELECT path FROM hospital_media WHERE id_media = ?");
        $stmt->execute([$id_media]);
        $media = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($media) {
            // On transforme le chemin relatif BDD en chemin serveur réel pour unlink
            $filePath = $_SERVER['DOCUMENT_ROOT'] . $media['path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            $pdo->prepare("DELETE FROM hospital_media WHERE id_media = ?")->execute([$id_media]);
        }
        echo json_encode(["success" => true]);
        exit;
    }

    // --- LOGIQUE UPDATE (Ordre/Langue) ---
    if ($input && ($input['action'] ?? '') === 'update') {
        $id_media = intval($input['id_media'] ?? 0);
        $ordre = intval($input['ordre'] ?? 0);
        $langue = $input['langue'] ?? 'all';

        $pdo->prepare("UPDATE hospital_media SET ordre = ?, langue = ? WHERE id_media = ?")
            ->execute([$ordre, $langue, $id_media]);

        echo json_encode(["success" => true]);
        exit;
    }

    // --- LOGIQUE UPLOAD (Multipart) ---
    // Vérifier d'abord les fichiers comme dans doctors.php
    if (isset($_FILES['files'])) {
        $id_hospital = isset($_POST['id_hospital']) ? intval($_POST['id_hospital']) : 0;
        $langue = isset($_POST['langue']) ? $_POST['langue'] : 'all';

        if ($id_hospital <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "id_hospital est requis pour l'upload"]);
            exit;
        }

        // Définition de l'arborescence dynamique
        $subFolder = 'uploads/hospital_' . $id_hospital . '/media/';
        $uploadDir = __DIR__ . '/' . $subFolder;

        // Création du dossier si inexistant
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $uploaded = [];
        $f = $_FILES['files'];
        // Gestion du format multiple (tableau) ou simple
        $count = is_array($f['name']) ? count($f['name']) : 1;

        for ($i = 0; $i < $count; $i++) {
            $name = is_array($f['name']) ? $f['name'][$i] : $f['name'];
            $tmp  = is_array($f['tmp_name']) ? $f['tmp_name'][$i] : $f['tmp_name'];
            $err  = is_array($f['error']) ? $f['error'][$i] : $f['error'];

            if ($err !== UPLOAD_ERR_OK) continue;

            $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) continue;

            // Génération d'un nom unique pour éviter les doublons
            $newName = 'img_' . time() . '_' . uniqid() . '.' . $ext;
            $dest = $uploadDir . $newName;

            if (move_uploaded_file($tmp, $dest)) {
                // Chemin d'accès public pour la base de données
                $dbPath = '/api/ia/' . $subFolder . $newName;

                $sql = "INSERT INTO hospital_media (id_hospital, path, langue, ordre) 
                        VALUES (?, ?, ?, (SELECT COALESCE(MAX(h_temp.ordre), 0) + 1 
                                        FROM hospital_media as h_temp 
                                        WHERE h_temp.id_hospital = ?))";

                $stmtInsert = $pdo->prepare($sql);
                $stmtInsert->execute([$id_hospital, $dbPath, $langue, $id_hospital]);

                $uploaded[] = [
                    "id_media" => $pdo->lastInsertId(),
                    "path" => $dbPath,
                    "langue" => $langue
                ];
            }
        }

        echo json_encode([
            "success" => count($uploaded) > 0,
            "uploaded" => $uploaded
        ]);
        exit;
    }
}

// Si aucune condition n'est remplie
http_response_code(400);
echo json_encode(["error" => "Requête invalide ou ID manquant"]);
exit;