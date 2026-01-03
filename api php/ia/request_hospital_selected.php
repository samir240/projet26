<?php
header_remove("X-Powered-By");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'config.php'; // $pdo

/* ======================
   GET : hôpitaux désignés par une request
====================== */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (!isset($_GET['id_request'])) {
        http_response_code(400);
        echo json_encode(['error' => 'id_request est requis']);
        exit;
    }

    $id_request = (int) $_GET['id_request'];

    $stmt = $pdo->prepare("
        SELECT 
            h.id_hospital,
            h.nom,
            h.pays,
            h.ville,
            h.adresse,
            h.note_google,
            h.logo,
            h.website,
            h.email,
            h.telephone,
            rh.created_at AS date_designation
        FROM request_hospital rh
        INNER JOIN hospital h 
            ON h.id_hospital = rh.id_hospital
        WHERE rh.id_request = :id_request
          AND rh.is_active = 1
        GROUP BY h.id_hospital
        ORDER BY rh.created_at DESC
    ");

    $stmt->execute(['id_request' => $id_request]);

    echo json_encode([
        'success' => true,
        'count' => $stmt->rowCount(),
        'hospitals' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
    exit;
}

// Méthode non autorisée
http_response_code(405);
echo json_encode(['error' => 'Méthode non supportée']);
exit;
