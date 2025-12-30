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

        if (!isset($data['id_hospital'])) {
            echo json_encode(["error" => "id_hospital is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM hospitals WHERE id_hospital = ?");
        $stmt->execute([$data['id_hospital']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_hospital'])) {
            echo json_encode(["error" => "id_hospital is required"]);
            exit;
        }

        $allowed = ['nom','pays','nom_gerant','reviews','adresse','ville','certifications','note_google','latitude','longitude','description','logo','website','email','telephone','is_active'];

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

        $values[] = $data['id_hospital'];

        $sql = "UPDATE hospitals SET " . implode(', ', $fields) . " WHERE id_hospital = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
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

    echo json_encode([
        "success" => true,
        "type" => "create",
        "id" => $pdo->lastInsertId()
    ]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
