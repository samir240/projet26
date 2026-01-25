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

    // Si on demande un utilisateur spécifique (pour le Login ou Profil)
    if (isset($_GET['id'])) {
        // Cette requête récupère l'utilisateur, le rôle ET le nom de l'hôpital s'il est coordinateur
        $sql = "SELECT u.*, r.nom_role, h.nom as hospital_nom, hc.id_hospital
                FROM users u
                LEFT JOIN roles r ON u.id_role = r.id_role
                LEFT JOIN hospital_coordinators hc ON u.email = hc.email
                LEFT JOIN hospitals h ON hc.id_hospital = h.id_hospital
                WHERE u.id_user = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_GET['id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            unset($user['password']); // Sécurité : ne pas renvoyer le hash
            echo json_encode($user);
        } else {
            echo json_encode(["error" => "User not found"]);
        }
        exit;
    }

    // Liste globale avec nom d'hôpital
    $sql = "SELECT u.id_user, u.username, u.email, u.id_role, u.is_active, h.nom as hospital_nom 
            FROM users u
            LEFT JOIN hospital_coordinators hc ON u.email = hc.email
            LEFT JOIN hospitals h ON hc.id_hospital = h.id_hospital
            ORDER BY u.id_user DESC";
            
    $stmt = $pdo->query($sql);
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
        if (!isset($data['id_user'])) {
            echo json_encode(["error" => "id_user is required"]);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM users WHERE id_user = ?");
        $stmt->execute([$data['id_user']]);
        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE ---------- */
    if (isset($data['action']) && $data['action'] === 'update') {
        if (!isset($data['id_user'])) {
            echo json_encode(["error" => "id_user is required"]);
            exit;
        }

        $allowed = ['id_role', 'username', 'email', 'password', 'nom', 'prenom', 'telephone', 'photo', 'is_active', 'last_login', 'system'];
        $fields = [];
        $values = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                if ($field === 'password' && !empty($data[$field])) {
                    $fields[] = "$field = ?";
                    $values[] = password_hash($data[$field], PASSWORD_BCRYPT);
                } else if ($field !== 'password') {
                    $fields[] = "$field = ?";
                    $values[] = $data[$field];
                }
            }
        }

        if (empty($fields)) {
            echo json_encode(["error" => "No fields to update"]);
            exit;
        }

        $values[] = $data['id_user'];
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id_user = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO users 
        (id_role, username, email, password, nom, prenom, telephone, photo, is_active, system) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['id_role'] ?? 2,
        $data['username'],
        $data['email'],
        isset($data['password']) ? password_hash($data['password'], PASSWORD_BCRYPT) : null,
        $data['nom'] ?? null,
        $data['prenom'] ?? null,
        $data['telephone'] ?? null,
        $data['photo'] ?? null,
        $data['is_active'] ?? 1,
        $data['system'] ?? 'B'
    ]);

    echo json_encode([
        "success" => true, 
        "type" => "create", 
        "id" => $pdo->lastInsertId()
    ]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);