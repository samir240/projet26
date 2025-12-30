<?php
// ----------- CORS FIX (OBLIGATOIRE pour Next.js / React / Vercel) -----------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// ----------- DATABASE CONFIG -----------
$host = "localhost";
$dbname = "kubi8227_tourismedical";
$user = "kubi8227_client";
$pass = "asU8Cf2B^Gso";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "DB connection failed"]);
    exit();
}

// ----------- GET JSON BODY -----------
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"]) || !isset($data["password"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit();
}

$email = trim($data["email"]);
$password = trim($data["password"]);

// ----------- CHECK USER -----------
$stmt = $conn->prepare("
    SELECT u.id, u.password, u.system, r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = ?
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit();
}

$userData = $result->fetch_assoc();

// ----------- VERIFY PASSWORD -----------
if (password_verify($password, $userData["password"])) {
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $userData["id"],
            "email" => $email,
            "role" => $userData["role"],
            "system" => $userData["system"]
        ]
    ]);
    exit();
} else {
    // Debug : voir ce qui est reçu et le hash en base
    echo json_encode([
        "success" => false,
        "message" => "Invalid password",
        "debug_received_password" => $password,
        "debug_hash_in_database" => $userData["password"],
        "debug_password_verify" => password_verify($password, $userData["password"])
    ]);
    exit();
}
