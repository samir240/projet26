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
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id_user = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM users ORDER BY id_user DESC");
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

        $allowed = [
            'id_role',
            'username',
            'email',
            'password',
            'nom',
            'prenom',
            'telephone',
            'photo',
            'is_active',
            'last_login',
            'system'
        ];

        $fields = [];
        $values = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                if ($field === 'password') {
                    $fields[] = "$field = ?";
                    $values[] = password_hash($data[$field], PASSWORD_BCRYPT);
                } else {
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
        (id_role, username, email, password, nom, prenom, telephone, photo, is_active, last_login, system)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        $data['last_login'] ?? null,
        $data['system'] ?? null
    ]);

    echo json_encode([
        "success" => true,
        "type" => "create",
        "id" => $pdo->lastInsertId()
    ]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
