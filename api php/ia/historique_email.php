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
        $stmt = $pdo->prepare("SELECT * FROM historique_email WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM historique_email ORDER BY id DESC");
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

        if (!isset($data['id'])) {
            echo json_encode(["error" => "id is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM historique_email WHERE id = ?");
        $stmt->execute([$data['id']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id'])) {
            echo json_encode(["error" => "id is required"]);
            exit;
        }

        $allowed = ['id_request','id_patient','id_commercial','titre','text_email','email_destinataire','email_type','status','date_envoi'];

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

        $values[] = $data['id'];

        $sql = "UPDATE historique_email SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO historique_email
        (id_request,id_patient,id_commercial,titre,text_email,email_destinataire,email_type,status,date_envoi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['id_request'] ?? null,
        $data['id_patient'] ?? null,
        $data['id_commercial'] ?? null,
        $data['titre'] ?? null,
        $data['text_email'] ?? null,
        $data['email_destinataire'] ?? null,
        $data['email_type'] ?? null,
        $data['status'] ?? null,
        $data['date_envoi'] ?? null
    ]);

    echo json_encode([
        "success" => true,
        "type" => "create",
        "id" => $pdo->lastInsertId()
    ]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
