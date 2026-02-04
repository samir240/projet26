<?php
/**
 * Server Upload Endpoint
 * Hosted on: pro.medotra.com/app/http/api/upload.php
 * 
 * POST Parameters:
 * - type: doctor_photo, doctor_cv, casemanager_photo, hospital_logo, etc.
 * - entity_id: ID of the entity (doctor, casemanager, hospital, etc.)
 * - request_id: (optional) for patient_media
 * - file: the uploaded file
 * 
 * Example URL result: https://pro.medotra.com/uploads/casemanagers/casemanager_3/f328EHR2938N.png
 */

// CORS headers - must be sent FIRST before any output or redirect
$allowedOrigins = ['https://medotra.com', 'https://www.medotra.com', 'http://localhost', 'http://localhost:8080'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: https://medotra.com");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include config first (provides $pdo and UPLOADS_BASE_URL)
require_once __DIR__ . '/config.php';

// Include upload functions
require_once __DIR__ . '/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Use POST']);
    exit;
}

$type      = $_POST['type'] ?? '';
$entityId  = (int)($_POST['entity_id'] ?? 0);
$requestId = isset($_POST['request_id']) && $_POST['request_id'] !== '' ? (int)$_POST['request_id'] : null;

// Check for single file or multiple files
// cURL sends files[0], files[1] as separate keys, need to rebuild array
$hasFile = isset($_FILES['file']);
$hasFiles = isset($_FILES['files']) && is_array($_FILES['files']['tmp_name']);

// Check for cURL-style indexed files (files[0], files[1], etc.)
$curlFiles = [];
foreach ($_FILES as $key => $fileData) {
    if (preg_match('/^files\[(\d+)\]$/', $key, $matches)) {
        $idx = (int)$matches[1];
        $curlFiles[$idx] = $fileData;
    }
}

if (!$type || !$entityId) {
    echo json_encode(['success' => false, 'message' => 'Missing: type, entity_id']);
    exit;
}

if (!$hasFile && !$hasFiles && empty($curlFiles)) {
    echo json_encode(['success' => false, 'message' => 'Missing: file or files']);
    exit;
}

// Determine upload type and process
if (!empty($curlFiles)) {
    // Rebuild files array from cURL-style indexed files
    $files = [
        'name' => [],
        'type' => [],
        'tmp_name' => [],
        'error' => [],
        'size' => [],
    ];
    foreach ($curlFiles as $idx => $f) {
        $files['name'][] = $f['name'];
        $files['type'][] = $f['type'];
        $files['tmp_name'][] = $f['tmp_name'];
        $files['error'][] = $f['error'];
        $files['size'][] = $f['size'];
    }
    $result = api_upload_multiple_media($pdo, $files, $type, $entityId, $requestId);
} elseif ($hasFiles) {
    // Standard multiple files upload
    $result = api_upload_multiple_media($pdo, $_FILES['files'], $type, $entityId, $requestId);
} else {
    // Single file upload
    $result = api_upload_media($pdo, $_FILES['file'], $type, $entityId, $requestId);
}

echo json_encode($result);
