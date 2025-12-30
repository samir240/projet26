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
        $stmt = $pdo->prepare("SELECT * FROM appointments WHERE id_appointment = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM appointments ORDER BY id_appointment DESC");
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

        if (!isset($data['id_appointment'])) {
            echo json_encode(["error" => "id_appointment is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM appointments WHERE id_appointment = ?");
        $stmt->execute([$data['id_appointment']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_appointment'])) {
            echo json_encode(["error" => "id_appointment is required"]);
            exit;
        }

        $allowed = ['id_quote','id_request','id_patient','id_hospital','status','date_arrivee','date_depart','passeport_doc','fly_ticket_doc','hotel_reservation','notes'];

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

        $values[] = $data['id_appointment'];

        $sql = "UPDATE appointments SET " . implode(', ', $fields) . " WHERE id_appointment = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO appointments
        (id_quote,id_request,id_patient,id_hospital,status,date_arrivee,date_depart,passeport_doc,fly_ticket_doc,hotel_reservation,notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['id_quote'] ?? null,
        $data['id_request'] ?? null,
        $data['id_patient'] ?? null,
        $data['id_hospital'] ?? null,
        $data['status'] ?? null,
        $data['date_arrivee'] ?? null,
        $data['date_depart'] ?? null,
        $data['passeport_doc'] ?? null,
        $data['fly_ticket_doc'] ?? null,
        $data['hotel_reservation'] ?? null,
        $data['notes'] ?? null
    ]);

    echo json_encode([
        "success" => true,
        "type" => "create",
        "id" => $pdo->lastInsertId()
    ]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
