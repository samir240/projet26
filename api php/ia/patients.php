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
        $stmt = $pdo->prepare("SELECT * FROM patients WHERE id_patient = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM patients ORDER BY id_patient DESC");
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

        if (!isset($data['id_patient'])) {
            echo json_encode(["error" => "id_patient is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM patients WHERE id_patient = ?");
        $stmt->execute([$data['id_patient']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_patient'])) {
            echo json_encode(["error" => "id_patient is required"]);
            exit;
        }

        $allowed = [
            'numero_tel',
            'email',
            'nom',
            'prenom',
            'langue',
            'ip_adresse',
            'age',
            'sexe',
            'pays',
            'poids',
            'taille',
            'smoker',
            'imc'
        ];

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

        $values[] = $data['id_patient'];

        $sql = "UPDATE patients SET " . implode(', ', $fields) . " WHERE id_patient = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO patients
        (numero_tel, email, nom, prenom, langue, ip_adresse, age, sexe, pays, poids, taille, smoker, imc)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['numero_tel'] ?? null,
        $data['email'] ?? null,
        $data['nom'] ?? null,
        $data['prenom'] ?? null,
        $data['langue'] ?? 'fr',
        $data['ip_adresse'] ?? $_SERVER['REMOTE_ADDR'],
        $data['age'] ?? null,
        $data['sexe'] ?? null,
        $data['pays'] ?? null,
        $data['poids'] ?? null,
        $data['taille'] ?? null,
        $data['smoker'] ?? 0,
        $data['imc'] ?? null
    ]);

    echo json_encode([
        "success" => true,
        "type" => "create",
        "id" => $pdo->lastInsertId()
    ]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
