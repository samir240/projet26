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
        $stmt = $pdo->prepare("SELECT * FROM services WHERE id_service = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM services ORDER BY id_service DESC");
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

        if (!isset($data['id_service'])) {
            echo json_encode(["error" => "id_service is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM services WHERE id_service = ?");
        $stmt->execute([$data['id_service']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_service'])) {
            echo json_encode(["error" => "id_service is required"]);
            exit;
        }

        $fields = [];
        $values = [];

        $allowed = [
            'nom_service',
            'prix_service',
            'devise',
            'description',
            'categorie',
            'is_active'
        ];

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

        $values[] = $data['id_service'];

        $sql = "UPDATE services SET " . implode(', ', $fields) . " WHERE id_service = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO services
        (nom_service, prix_service, devise, description, categorie, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['nom_service'],
        $data['prix_service'],
        $data['devise'] ?? 'EUR',
        $data['description'] ?? null,
        $data['categorie'] ?? null,
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
