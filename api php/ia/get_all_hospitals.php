<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        "error" => "Method not allowed"
    ]);
    exit;
}

try {
    $stmt = $pdo->query("
        SELECT 
            id_hospital,
            nom,
            ville,
            pays,
            is_active
        FROM hospitals
        ORDER BY nom ASC
    ");

    $hospitals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "count" => count($hospitals),
        "data" => $hospitals
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
