<?php
$host = "localhost";
$dbname = "kubi8227_medical_tourism";
$username = "kubi8227_client";
$password = "asU8Cf2B^Gso";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Database connection failed"]));
}
?>
