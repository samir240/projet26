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
        $stmt = $pdo->prepare("SELECT * FROM case_managers WHERE id_case_manager = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }
    
    // Lister par hôpital
    if (isset($_GET['id_hospital'])) {
        $stmt = $pdo->prepare("SELECT * FROM case_managers WHERE id_hospital = ?");
        $stmt->execute([$_GET['id_hospital']]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM case_managers ORDER BY id_case_manager DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* ======================
    POST
====================== */
if ($method === 'POST') {

    // --- A. UPLOAD PHOTO ---
    if (isset($_FILES['profile_photo'])) {
        $id_cm = $_POST['id_case_manager'] ?? null;
        $id_hosp = $_POST['id_hospital'] ?? null;

        if (!$id_cm || !$id_hosp) {
            echo json_encode(["error" => "id_case_manager et id_hospital manquants"]);
            exit;
        }

        $dir = "uploads/hospital_" . $id_hosp . "/case_managers/";
        if (!file_exists($dir)) mkdir($dir, 0777, true);

        $ext = pathinfo($_FILES['profile_photo']['name'], PATHINFO_EXTENSION);
        $fileName = "cm_" . $id_cm . "_" . time() . "." . $ext;
        $target = $dir . $fileName;

        if (move_uploaded_file($_FILES['profile_photo']['tmp_name'], $target)) {
            $stmt = $pdo->prepare("UPDATE case_managers SET profile_photo = ? WHERE id_case_manager = ?");
            $stmt->execute([$target, $id_cm]);
            echo json_encode(["success" => true, "path" => $target]);
        }
        exit;
    }

    // --- B. JSON (Create / Update / Delete) ---
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) exit;

    // DELETE
    if (isset($data['action']) && $data['action'] === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM case_managers WHERE id_case_manager = ?");
        $stmt->execute([$data['id_case_manager']]);
        echo json_encode(["success" => true]);
        exit;
    }

    // UPDATE
    if (isset($data['action']) && $data['action'] === 'update') {
        $allowed = ['fullname', 'email', 'phone', 'countries_concerned', 'id_coordinator', 'is_active'];
        $fields = []; $values = [];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $values[] = $data[$f];
            }
        }
        $values[] = $data['id_case_manager'];
        $stmt = $pdo->prepare("UPDATE case_managers SET " . implode(', ', $fields) . " WHERE id_case_manager = ?");
        $stmt->execute($values);
        echo json_encode(["success" => true]);
        exit;
    }

    // CREATE
    $stmt = $pdo->prepare("INSERT INTO case_managers (id_hospital, fullname, email, phone, countries_concerned, id_coordinator) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['id_hospital'],
        $data['fullname'],
        $data['email'] ?? null,
        $data['phone'] ?? null,
        $data['countries_concerned'] ?? null,
        $data['id_coordinator'] ?? null // Utilisation de l'ID ici
    ]);
    
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    exit;
}