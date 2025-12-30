<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Réponse pour préflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
/*
|--------------------------------------------------------------------------
| CONNEXION BASE DE DONNÉES
|--------------------------------------------------------------------------
*/
$host = "localhost";
$dbname = "kubi8227_medical_tourism";
$username = "kubi8227_client";
$password = "asU8Cf2B^Gso";



try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection error: " . $e->getMessage()]);
    exit();
}


$response = [
    "success" => false,
    "message" => "",
];


try {
    // Récupération des données envoyées en JSON
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        throw new Exception("Invalid JSON data received.");
    }

    // Champs patient
    $email = $input["email"] ?? null;
    $numero_tel = $input["numero_tel"] ?? null;
    $nom = $input["nom"] ?? null;
    $prenom = $input["prenom"] ?? null;
    $langue = $input["langue"] ?? "fr";
    $ip = $_SERVER["REMOTE_ADDR"];

    // Champs request
    $id_procedure = $input["id_procedure"] ?? null;
    $message_patient = $input["message_patient"] ?? null;
    $source = $input["source"] ?? null;

    if (!$email || !$id_procedure) {
        throw new Exception("email and id_procedure are required.");
    }


    /*
    |--------------------------------------------------------------------------
    | ÉTAPE 1 — Vérifier si le patient existe déjà
    |--------------------------------------------------------------------------
    */
    $sql = "SELECT id_patient FROM patients WHERE email = ? OR numero_tel = ? LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email, $numero_tel]);

    $patient = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($patient) {
        // Patient déjà existant
        $id_patient = $patient["id_patient"];
    } else {
        /*
        |--------------------------------------------------------------------------
        | ÉTAPE 2 — Créer le patient car il n'existe pas
        |--------------------------------------------------------------------------
        */
        $sql = "INSERT INTO patients (numero_tel, email, nom, prenom, langue, ip_adresse, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $numero_tel,
            $email,
            $nom,
            $prenom,
            $langue,
            $ip
        ]);

        $id_patient = $pdo->lastInsertId();
    }


    /*
    |--------------------------------------------------------------------------
    | ÉTAPE 3 — Créer la request
    |--------------------------------------------------------------------------
    */

    $sql = "INSERT INTO requests 
            (id_patient, id_procedure, message_patient, source, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'pending', NOW(), NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id_patient,
        $id_procedure,
        $message_patient,
        $source
    ]);

    $id_request = $pdo->lastInsertId();


    /*
    |--------------------------------------------------------------------------
    | SUCCESS RESPONSE
    |--------------------------------------------------------------------------
    */
    $response["success"] = true;
    $response["message"] = "Request created successfully";
    $response["id_patient"] = $id_patient;
    $response["id_request"] = $id_request;

    echo json_encode($response);

} catch (Exception $e) {

    http_response_code(400);
    $response["message"] = $e->getMessage();
    echo json_encode($response);
}
