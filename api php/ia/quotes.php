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
        $stmt = $pdo->prepare("SELECT * FROM quotes WHERE id_quote = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM quotes ORDER BY id_quote DESC");
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

        if (!isset($data['id_quote'])) {
            echo json_encode(["error" => "id_quote is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM quotes WHERE id_quote = ?");
        $stmt->execute([$data['id_quote']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE (partiel) ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {

        if (!isset($data['id_quote'])) {
            echo json_encode(["error" => "id_quote is required"]);
            exit;
        }

        $allowed = [
            'id_request','id_patient','id_hospital','id_coordination','id_commercial','numero_devis',
            'plan_traitement','services_inclus','nbre_nuits_hospital','nbre_nuits_apres_hospital',
            'devise','prix_total','id_medecin',
            'service_1','prix_1','inclus_1','service_2','prix_2','inclus_2','service_3','prix_3','inclus_3',
            'service_4','prix_4','inclus_4','service_5','prix_5','inclus_5','service_6','prix_6','inclus_6',
            'service_7','prix_7','inclus_7','service_8','prix_8','inclus_8',
            'remarque','status','date_validite','date_envoi'
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

        $values[] = $data['id_quote'];

        $sql = "UPDATE quotes SET " . implode(', ', $fields) . " WHERE id_quote = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO quotes
        (id_request,id_patient,id_hospital,id_coordination,id_commercial,numero_devis,plan_traitement,services_inclus,
        nbre_nuits_hospital,nbre_nuits_apres_hospital,devise,prix_total,id_medecin,
        service_1,prix_1,inclus_1,service_2,prix_2,inclus_2,service_3,prix_3,inclus_3,
        service_4,prix_4,inclus_4,service_5,prix_5,inclus_5,service_6,prix_6,inclus_6,
        service_7,prix_7,inclus_7,service_8,prix_8,inclus_8,
        remarque,status,date_validite,date_envoi)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['id_request'] ?? null,
        $data['id_patient'] ?? null,
        $data['id_hospital'] ?? null,
        $data['id_coordination'] ?? null,
        $data['id_commercial'] ?? null,
        $data['numero_devis'] ?? null,
        $data['plan_traitement'] ?? null,
        $data['services_inclus'] ?? null,
        $data['nbre_nuits_hospital'] ?? null,
        $data['nbre_nuits_apres_hospital'] ?? null,
        $data['devise'] ?? null,
        $data['prix_total'] ?? null,
        $data['id_medecin'] ?? null,
        $data['service_1'] ?? null, $data['prix_1'] ?? null, $data['inclus_1'] ?? null,
        $data['service_2'] ?? null, $data['prix_2'] ?? null, $data['inclus_2'] ?? null,
        $data['service_3'] ?? null, $data['prix_3'] ?? null, $data['inclus_3'] ?? null,
        $data['service_4'] ?? null, $data['prix_4'] ?? null, $data['inclus_4'] ?? null,
        $data['service_5'] ?? null, $data['prix_5'] ?? null, $data['inclus_5'] ?? null,
        $data['service_6'] ?? null, $data['prix_6'] ?? null, $data['inclus_6'] ?? null,
        $data['service_7'] ?? null, $data['prix_7'] ?? null, $data['inclus_7'] ?? null,
        $data['service_8'] ?? null, $data['prix_8'] ?? null, $data['inclus_8'] ?? null,
        $data['remarque'] ?? null,
        $data['status'] ?? null,
        $data['date_validite'] ?? null,
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
