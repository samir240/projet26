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
        $stmt = $pdo->prepare("SELECT * FROM medical_procedures WHERE id_procedure = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM medical_procedures ORDER BY id_procedure DESC");
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

        if (!isset($data['id_procedure'])) {
            echo json_encode(["error" => "id_procedure is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM medical_procedures WHERE id_procedure = ?");
        $stmt->execute([$data['id_procedure']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_procedure'])) {
            echo json_encode(["error" => "id_procedure is required"]);
            exit;
        }

        $allowed = ['nom_procedure','categorie','sous_categorie','description','img_procedure','duree_moyenne','is_active'];

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

        $values[] = $data['id_procedure'];

        $sql = "UPDATE medical_procedures SET " . implode(', ', $fields) . " WHERE id_procedure = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO medical_procedures
        (nom_procedure,categorie,sous_categorie,description,img_procedure,duree_moyenne,is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['nom_procedure'] ?? null,
        $data['categorie'] ?? null,
        $data['sous_categorie'] ?? null,
        $data['description'] ?? null,
        $data['img_procedure'] ?? null,
        $data['duree_moyenne'] ?? null,
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
