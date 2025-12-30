<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require "config.php";

/* ======================
   GET ALL SALES AGENTS
====================== */

try {

    $stmt = $pdo->query("
        SELECT 
            id_commercial,
            id_user,
            nom,
            prenom,
            photo,
            email,
            telephone,
            langue,
            note,
            is_active,
            created_at,
            updated_at
        FROM sales_agents
        ORDER BY id_commercial DESC
    ");

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
