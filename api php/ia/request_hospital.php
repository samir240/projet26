<?php
header_remove("X-Powered-By");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization");

include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Gestion du Preflight CORS
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // --- GET : Récupérer les hôpitaux liés à une requête ---
    if ($method === 'GET') {
        if (!isset($_GET['id_request'])) {
            http_response_code(400);
            echo json_encode(['error' => 'id_request est requis']);
            exit;
        }

        $id_request = intval($_GET['id_request']);
        // Note : Changement de 'hospital' en 'hospitals'
        $stmt = $pdo->prepare("
            SELECT rh.id_relation, rh.id_request, rh.id_hospital, rh.is_active,
                   h.nom AS hospital_nom, h.pays AS hospital_pays, h.ville AS hospital_ville
            FROM request_hospital rh
            JOIN hospitals h ON rh.id_hospital = h.id_hospital
            WHERE rh.id_request = :id_request
        ");
        $stmt->execute(['id_request' => $id_request]);
        echo json_encode($stmt->fetchAll());
        exit;
    }

    // --- POST : Lier un hôpital à une requête ---
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['id_request']) || empty($input['id_hospital'])) {
            http_response_code(400);
            echo json_encode(['error' => 'id_request et id_hospital requis']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO request_hospital (id_request, id_hospital) VALUES (?, ?)");
        $stmt->execute([$input['id_request'], $input['id_hospital']]);

        echo json_encode(['success' => true, 'id_relation' => $pdo->lastInsertId()]);
        exit;
    }

    // --- PUT : Activer/Désactiver ---
    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id_relation'], $input['is_active'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Données incomplètes']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE request_hospital SET is_active = ? WHERE id_relation = ?");
        $stmt->execute([$input['is_active'], $input['id_relation']]);
        echo json_encode(['success' => true]);
        exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}