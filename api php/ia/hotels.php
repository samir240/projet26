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
    // Par hôpital
    if (isset($_GET['id_hospital'])) {
        $stmt = $pdo->prepare("SELECT * FROM hotels WHERE id_hospital = ? ORDER BY stars DESC");
        $stmt->execute([$_GET['id_hospital']]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }
    // Par ID unique
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM hotels WHERE id_hotel = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM hotels ORDER BY id_hotel DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* ======================
    POST
====================== */
if ($method === 'POST') {

    // --- A. UPLOAD PHOTO (FormData) ---
    if (isset($_FILES['photo'])) {
        $id_hotel = $_POST['id_hotel'] ?? null;
        $id_hosp = $_POST['id_hospital'] ?? null;

        if (!$id_hotel || !$id_hosp) {
            echo json_encode(["error" => "id_hotel et id_hospital requis"]);
            exit;
        }

        $dir = "uploads/hospital_" . $id_hosp . "/hotels/";
        if (!file_exists($dir)) mkdir($dir, 0777, true);

        $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $fileName = "hotel_" . $id_hotel . "_" . time() . "." . $ext;
        $target = $dir . $fileName;

        if (move_uploaded_file($_FILES['photo']['tmp_name'], $target)) {
            $stmt = $pdo->prepare("UPDATE hotels SET photo = ? WHERE id_hotel = ?");
            $stmt->execute([$target, $id_hotel]);
            echo json_encode(["success" => true, "path" => $target]);
        }
        exit;
    }

    // --- B. ACTIONS JSON ---
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) exit;

    // DELETE
    if (isset($data['action']) && $data['action'] === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM hotels WHERE id_hotel = ?");
        $stmt->execute([$data['id_hotel']]);
        echo json_encode(["success" => true]);
        exit;
    }

    // UPDATE
    if (isset($data['action']) && $data['action'] === 'update') {
        $allowed = ['hotel_name', 'stars', 'adresse', 'hotel_website', 'single_room_price', 'double_room_price', 'is_active'];
        $fields = []; $values = [];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $values[] = $data[$f];
            }
        }
        $values[] = $data['id_hotel'];
        $stmt = $pdo->prepare("UPDATE hotels SET " . implode(', ', $fields) . " WHERE id_hotel = ?");
        $stmt->execute($values);
        echo json_encode(["success" => true]);
        exit;
    }

    // CREATE
    $stmt = $pdo->prepare("INSERT INTO hotels (id_hospital, hotel_name, stars, adresse, hotel_website, single_room_price, double_room_price) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['id_hospital'],
        $data['hotel_name'],
        $data['stars'] ?? 3,
        $data['adresse'] ?? null,
        $data['hotel_website'] ?? null,
        $data['single_room_price'] ?? 0,
        $data['double_room_price'] ?? 0
    ]);
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    exit;
}