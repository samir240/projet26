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
        $stmt = $pdo->prepare("SELECT * FROM procedure_hospital WHERE id_relation = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM procedure_hospital ORDER BY id_relation DESC");
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

        if (!isset($data['id_relation'])) {
            echo json_encode(["error" => "id_relation is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM procedure_hospital WHERE id_relation = ?");
        $stmt->execute([$data['id_relation']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_relation'])) {
            echo json_encode(["error" => "id_relation is required"]);
            exit;
        }

        $allowed = ['id_procedure','id_hospital','prix_base','devise','duree_sejour','description_specifique','is_active'];

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

        $values[] = $data['id_relation'];

        $sql = "UPDATE procedure_hospital SET " . implode(', ', $fields) . " WHERE id_relation = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO procedure_hospital
        (id_procedure,id_hospital,prix_base,devise,duree_sejour,description_specifique,is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['id_procedure'] ?? null,
        $data['id_hospital'] ?? null,
        $data['prix_base'] ?? null,
        $data['devise'] ?? null,
        $data['duree_sejour'] ?? null,
        $data['description_specifique'] ?? null,
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
