<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// ----------- DATABASE CONFIG -----------
$host = "localhost";
$dbname = "kubi8227_medical_tourism";
$user = "kubi8227_client";
$pass = "asU8Cf2B^Gso";

// Force UTF-8 (IMPORTANT)
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conn = new mysqli($host, $user, $pass, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "DB connection failed"
    ]);
    exit();
}

try {

    $sql = "SELECT 
                id_procedure,
                nom_procedure,
                categorie,
                sous_categorie,
                description,
                img_procedure,
                duree_moyenne,
                is_active,
                created_at,
                updated_at
            FROM medical_procedures
            ORDER BY id_procedure DESC";

    $result = $conn->query($sql);

    $procedures = [];
    while ($row = $result->fetch_assoc()) {
        $procedures[] = $row;
    }

    echo json_encode([
        "success" => true,
        "count" => count($procedures),
        "data" => $procedures
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

$conn->close();
