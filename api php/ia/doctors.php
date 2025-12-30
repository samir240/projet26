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
        $stmt = $pdo->prepare("SELECT * FROM doctors WHERE id_medecin = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM doctors ORDER BY id_medecin DESC");
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

        if (!isset($data['id_medecin'])) {
            echo json_encode(["error" => "id_medecin is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM doctors WHERE id_medecin = ?");
        $stmt->execute([$data['id_medecin']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_medecin'])) {
            echo json_encode(["error" => "id_medecin is required"]);
            exit;
        }

        $fields = [];
        $values = [];

        $allowed = [
            'id_hospital',
            'nom_medecin',
            'photo',
            'cv',
            'specialite',
            'langues',
            'description',
            'note',
            'reviews',
            'sexe',
            'nationalite',
            'email',
            'telephone',
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

        $values[] = $data['id_medecin'];

        $sql = "UPDATE doctors SET " . implode(', ', $fields) . " WHERE id_medecin = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO doctors
        (id_hospital, nom_medecin, photo, cv, specialite, langues, description, note, reviews, sexe, nationalite, email, telephone, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['id_hospital'] ?? null,
        $data['nom_medecin'],
        $data['photo'] ?? null,
        $data['cv'] ?? null,
        $data['specialite'] ?? null,
        $data['langues'] ?? null,
        $data['description'] ?? null,
        $data['note'] ?? null,
        $data['reviews'] ?? null,
        $data['sexe'] ?? null,
        $data['nationalite'] ?? null,
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
