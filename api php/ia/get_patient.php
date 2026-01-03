
<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require "config.php";


$id = intval($_GET['id']);

$sql = "
SELECT r.*, p.*
FROM requests r
JOIN patients p ON p.id_patient = r.id_patient
WHERE p.id_patient = ?
ORDER BY r.created_at DESC
LIMIT 1
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);

echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
