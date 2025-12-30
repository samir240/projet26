<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$method = $_SERVER['REQUEST_METHOD'];

/* ======================
   GET
====================== */
if ($method === 'GET') {

    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM sales_agents WHERE id_commercial = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM sales_agents ORDER BY id_commercial DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* ======================
   POST (CREATE + UPDATE)
====================== */
if ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    /* ---------- UPDATE ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_commercial'])) {
            echo json_encode(["error" => "id_commercial is required"]);
            exit;
        }

        $fields = [];
        $values = [];

        $allowed = ['id_user','nom','prenom','photo','email','telephone','langue','note','is_active'];

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

        $values[] = $data['id_commercial'];

        $sql = "UPDATE sales_agents SET " . implode(', ', $fields) . " WHERE id_commercial = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO sales_agents (id_user, nom, prenom, photo, email, telephone, langue, note, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['id_user'] ?? null,
        $data['nom'],
        $data['prenom'] ?? null,
        $data['photo'] ?? null,
        $data['email'],
        $data['telephone'] ?? null,
        $data['langue'] ?? null,
        $data['note'] ?? null,
        $data['is_active'] ?? 1
    ]);

    echo json_encode(["success" => true, "type" => "create", "id" => $pdo->lastInsertId()]);
    exit;
}

/* ======================
   DELETE
====================== */
if ($method === 'DELETE') {

    if (!isset($_GET['id'])) {
        echo json_encode(["error" => "id is required"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM sales_agents WHERE id_commercial = ?");
    $stmt->execute([$_GET['id']]);

    echo json_encode(["success" => true]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
