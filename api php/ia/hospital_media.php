<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$method = $_SERVER['REQUEST_METHOD'];

/* ======================
   GET - Liste des médias d'un hôpital
====================== */
if ($method === 'GET') {
    if (!isset($_GET['id_hospital'])) {
        echo json_encode(["error" => "id_hospital est requis"]);
        exit;
    }

    $id_hospital = intval($_GET['id_hospital']);

    $stmt = $pdo->prepare("
        SELECT * FROM hospital_media 
        WHERE id_hospital = ? 
        ORDER BY ordre ASC, id_media DESC
    ");
    $stmt->execute([$id_hospital]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* ======================
   POST - Upload / Update / Delete
====================== */
if ($method === 'POST') {
    
    // DELETE
    $input = json_decode(file_get_contents("php://input"), true);
    if ($input && isset($input['action']) && $input['action'] === 'delete') {
        if (!isset($input['id_media'])) {
            echo json_encode(["error" => "id_media est requis"]);
            exit;
        }

        // Supprimer le fichier physique
        $stmt = $pdo->prepare("SELECT path FROM hospital_media WHERE id_media = ?");
        $stmt->execute([$input['id_media']]);
        $media = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($media && $media['path']) {
            $filePath = $_SERVER['DOCUMENT_ROOT'] . '/api/hopital/media/' . basename($media['path']);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM hospital_media WHERE id_media = ?");
        $stmt->execute([$input['id_media']]);
        echo json_encode(["success" => true]);
        exit;
    }

    // UPDATE
    if ($input && isset($input['action']) && $input['action'] === 'update') {
        if (!isset($input['id_media'])) {
            echo json_encode(["error" => "id_media est requis"]);
            exit;
        }

        $allowed = ['ordre', 'langue'];
        $fields = [];
        $values = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $input)) {
                $fields[] = "$field = ?";
                $values[] = $input[$field];
            }
        }

        if (empty($fields)) {
            echo json_encode(["error" => "Aucun champ à mettre à jour"]);
            exit;
        }

        $values[] = $input['id_media'];
        $sql = "UPDATE hospital_media SET " . implode(', ', $fields) . " WHERE id_media = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
        echo json_encode(["success" => true]);
        exit;
    }

    // UPLOAD (FormData)
    if (!isset($_POST['id_hospital'])) {
        echo json_encode(["error" => "id_hospital est requis"]);
        exit;
    }

    $id_hospital = intval($_POST['id_hospital']);
    $langue = $_POST['langue'] ?? 'all';
    
    // Chemin relatif depuis le dossier racine du serveur
    // Le dossier sera créé dans: /api/hopital/media/
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/api/hopital/media/';
    
    // Créer le dossier s'il n'existe pas
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $uploaded = [];
    $errors = [];

    if (isset($_FILES['files'])) {
        $files = $_FILES['files'];
        
        // Gérer plusieurs fichiers
        $fileCount = is_array($files['name']) ? count($files['name']) : 1;
        
        for ($i = 0; $i < $fileCount; $i++) {
            $fileName = is_array($files['name']) ? $files['name'][$i] : $files['name'];
            $fileTmp = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
            $fileError = is_array($files['error']) ? $files['error'][$i] : $files['error'];
            $fileSize = is_array($files['size']) ? $files['size'][$i] : $files['size'];

            if ($fileError === UPLOAD_ERR_OK) {
                // Vérifier le type de fichier
                $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_file($finfo, $fileTmp);
                finfo_close($finfo);

                if (!in_array($mimeType, $allowedTypes)) {
                    $errors[] = "Format non supporté pour $fileName";
                    continue;
                }

                // Générer un nom unique
                $extension = pathinfo($fileName, PATHINFO_EXTENSION);
                $newFileName = 'hospital_' . $id_hospital . '_' . time() . '_' . $i . '.' . $extension;
                $targetPath = $uploadDir . $newFileName;

                if (move_uploaded_file($fileTmp, $targetPath)) {
                    $relativePath = '/api/hopital/media/' . $newFileName;
                    
                    // Insérer en base
                    $stmt = $pdo->prepare("
                        INSERT INTO hospital_media (id_hospital, path, langue, ordre)
                        VALUES (?, ?, ?, (SELECT COALESCE(MAX(ordre), 0) + 1 FROM hospital_media AS hm WHERE hm.id_hospital = ?))
                    ");
                    $stmt->execute([$id_hospital, $relativePath, $langue, $id_hospital]);
                    
                    $uploaded[] = [
                        'id_media' => $pdo->lastInsertId(),
                        'path' => $relativePath,
                        'langue' => $langue
                    ];
                } else {
                    $errors[] = "Erreur lors de l'upload de $fileName";
                }
            } else {
                $errors[] = "Erreur d'upload pour $fileName";
            }
        }
    }

    if (!empty($uploaded)) {
        echo json_encode([
            "success" => true,
            "uploaded" => $uploaded,
            "errors" => $errors
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Aucun fichier uploadé",
            "errors" => $errors
        ]);
    }
    exit;
}

echo json_encode(["error" => "Méthode non autorisée"]);