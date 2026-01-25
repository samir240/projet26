<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$method = $_SERVER['REQUEST_METHOD'];

/* ======================
   GET
====================== */
if ($method === 'GET') {

    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM hospital_coordinators WHERE id_coordi = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    // Filtrer par id_hospital si fourni
    if (isset($_GET['id_hospital'])) {
        $stmt = $pdo->prepare("SELECT * FROM hospital_coordinators WHERE id_hospital = ? ORDER BY id_coordi DESC");
        $stmt->execute([$_GET['id_hospital']]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM hospital_coordinators ORDER BY id_coordi DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* ======================
   POST (CREATE / UPDATE / DELETE)
====================== */
if ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    /* ---------- DELETE ---------- */
    if (isset($data['action']) && $data['action'] === 'delete') {

        if (!isset($data['id_coordi'])) {
            echo json_encode(["error" => "id_coordi is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM hospital_coordinators WHERE id_coordi = ?");
        $stmt->execute([$data['id_coordi']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_coordi'])) {
            echo json_encode(["error" => "id_coordi is required"]);
            exit;
        }

        $allowed = ['id_hospital','nom_coordi','email','fonction','telephone','langue','is_active'];

        $fields = [];
        $values = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (empty($fields)) {
            echo json_encode(["error" => "No fields to update"]);
            exit;
        }

        $values[] = $data['id_coordi'];

        $sql = "UPDATE hospital_coordinators SET " . implode(', ', $fields) . " WHERE id_coordi = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO hospital_coordinators
        (id_hospital,nom_coordi,email,fonction,telephone,langue,is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['id_hospital'] ?? null,
        $data['nom_coordi'] ?? null,
        $data['email'] ?? null,
        $data['fonction'] ?? null,
        $data['telephone'] ?? null,
        $data['langue'] ?? 'fr',
        $data['is_active'] ?? 1
    ]);

    echo json_encode([
        "success" => true,
        "type" => "create",
        "id" => $pdo->lastInsertId()
    ]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
