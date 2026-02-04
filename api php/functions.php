<?php
/**
 * Server Upload Functions
 * Hosted on: pro.medotra.com/app/http/api/functions.php
 * Handles file uploads to pro.medotra.com/uploads/
 */

// Config is included by upload.php before this file
// It provides: $pdo, UPLOADS_BASE_URL

// =========================
// HELPER FUNCTIONS
// =========================

function uploads_base_url(): string {
    // Uses UPLOADS_BASE_URL from config.php (https://pro.medotra.com)
    if (defined('UPLOADS_BASE_URL')) return rtrim(UPLOADS_BASE_URL, '/');
    return 'https://pro.medotra.com';
}

function media_url(?string $relativePath): ?string {
    if (!$relativePath) return null;
    if (preg_match('#^https?://#i', $relativePath)) return $relativePath;
    return uploads_base_url() . '/' . ltrim($relativePath, '/');
}

function ensure_dir(string $dir): void {
    if (!is_dir($dir)) mkdir($dir, 0775, true);
}

function random_filename(string $originalName): string {
    $ext = pathinfo($originalName, PATHINFO_EXTENSION);
    $ext = $ext ? strtolower($ext) : 'bin';
    $rand = bin2hex(random_bytes(9)); // 18 chars
    return $rand . '.' . $ext;
}

/**
 * Folder structure (on pro.medotra.com):
 * uploads/doctors/doctor_1/xxx.png
 * uploads/casemanagers/casemanager_3/xxx.png
 * uploads/patients/patient_5/request_1/xxx.png
 */
function build_media_dir(string $type, int $id, ?int $requestId = null): string {
    $type = strtolower(trim($type));

    switch ($type) {
        case 'doctor_photo':
        case 'doctor_cv':
            return "uploads/doctors/doctor_{$id}";

        case 'casemanager_photo':
            return "uploads/casemanagers/casemanager_{$id}";

        case 'hospital_logo':
            return "uploads/hospitals/hospital_{$id}";

        case 'hotel_photo':
            return "uploads/hotels/hotel_{$id}";

        case 'sales_agent_photo':
            return "uploads/sales_agents/sales_{$id}";

        case 'patient_media':
            if ($requestId) return "uploads/patients/patient_{$id}/request_{$requestId}";
            return "uploads/patients/patient_{$id}";

        case 'hospital_media':
            return "uploads/hospital_media/hospital_{$id}";

        case 'quote_media':
            return "uploads/quote_media/quote_{$id}";

        case 'appointment_media':
            // $requestId here is actually appointement_id passed from the client
            if ($requestId) return "uploads/patients/patient_{$id}/appointement_{$requestId}";
            return "uploads/patients/patient_{$id}";

        default:
            return "uploads/others/{$type}_{$id}";
    }
}

/**
 * MAIN: upload + db update/insert
 *
 * $type accepted:
 * - doctor_photo, doctor_cv
 * - casemanager_photo
 * - hospital_logo
 * - hotel_photo
 * - sales_agent_photo
 * - patient_media
 * - hospital_media
 * - quote_media
 */
function api_upload_media(PDO $pdo, array $file, string $type, int $entityId, ?int $requestId = null): array
{
    if (!isset($file['tmp_name']) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'Upload failed', 'error' => $file['error'] ?? null];
    }

    $type = strtolower(trim($type));

    if ($type === 'patient_media' && !$requestId) {
        return ['success' => false, 'message' => 'request_id is required for patient_media'];
    }

    // Build paths
    $relativeDir = build_media_dir($type, $entityId, $requestId);
    
    // Server root: pro.medotra.com document root
    // Try $_SERVER['DOCUMENT_ROOT'] first, fallback to calculating from __DIR__
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $serverRoot = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
    } else {
        // Fallback: 4 levels up from /app/http/api/
        $serverRoot = realpath(__DIR__ . '/../../../../') ?: dirname(__DIR__, 4);
    }
    
    $absoluteDir = $serverRoot . '/' . $relativeDir;

    // Create directory with full permissions
    if (!is_dir($absoluteDir)) {
        if (!@mkdir($absoluteDir, 0755, true)) {
            return ['success' => false, 'message' => 'Cannot create directory: ' . $absoluteDir];
        }
    }

    $filename     = random_filename($file['name'] ?? 'file.bin');
    $relativePath = rtrim($relativeDir, '/') . '/' . $filename;
    $absolutePath = rtrim($absoluteDir, '/') . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $absolutePath)) {
        return ['success' => false, 'message' => 'Cannot move uploaded file'];
    }

    // DB ops
    $insertedId = null;

    try {
        // Single-column updates
        if ($type === 'doctor_photo') {
            $stmt = $pdo->prepare("UPDATE doctors SET photo=? WHERE id_medecin=?");
            $stmt->execute([$relativePath, $entityId]);

        } elseif ($type === 'doctor_cv') {
            $stmt = $pdo->prepare("UPDATE doctors SET cv=? WHERE id_medecin=?");
            $stmt->execute([$relativePath, $entityId]);

        } elseif ($type === 'casemanager_photo') {
            $stmt = $pdo->prepare("UPDATE case_managers SET profile_photo=? WHERE id_case_manager=?");
            $stmt->execute([$relativePath, $entityId]);

        } elseif ($type === 'hospital_logo') {
            $stmt = $pdo->prepare("UPDATE hospitals SET logo=? WHERE id_hospital=?");
            $stmt->execute([$relativePath, $entityId]);

        } elseif ($type === 'hotel_photo') {
            $stmt = $pdo->prepare("UPDATE hotels SET photo=? WHERE id_hotel=?");
            $stmt->execute([$relativePath, $entityId]);

        } elseif ($type === 'sales_agent_photo') {
            $stmt = $pdo->prepare("UPDATE sales_agents SET photo=? WHERE id_commercial=?");
            $stmt->execute([$relativePath, $entityId]);

        // Media tables inserts (new row)
        } elseif ($type === 'patient_media') {
            // galerie_patient: id_galerie, id_request, nom, path, type_image
            $filename = basename($relativePath);
            $stmt = $pdo->prepare("INSERT INTO galerie_patient (id_request, nom, path, type_image) VALUES (?, ?, ?, 'document')");
            $stmt->execute([$requestId, $filename, $relativePath]);
            $insertedId = (int)$pdo->lastInsertId();

        } elseif ($type === 'hospital_media') {
            // hospital_media: id_media, path
            $stmt = $pdo->prepare("INSERT INTO hospital_media (id_hospital,path) VALUES (?,?)");
            $stmt->execute([$entityId,$relativePath]);
            $insertedId = (int)$pdo->lastInsertId();

        } elseif ($type === 'quote_media') {
            // quote_media: id_qm, id_quote, id_request, nom_image
            $stmt = $pdo->prepare("INSERT INTO quote_media (id_quote, id_request, nom_image) VALUES (?, ?, ?)");
            $stmt->execute([$entityId, $requestId, $relativePath]);
            $insertedId = (int)$pdo->lastInsertId();

        } elseif ($type === 'appointment_media') {
            // No DB insert needed - files are stored and path returned
            // The appointment table columns (passeport_doc, fly_ticket_doc, hotel_reservation) 
            // will be updated separately by the caller
            $insertedId = null;

        } else {
            return ['success' => false, 'message' => 'Unknown type: ' . $type];
        }

    } catch (Exception $e) {
        // optional: delete uploaded file if DB failed
        @unlink($absolutePath);
        return ['success' => false, 'message' => 'DB error', 'detail' => $e->getMessage()];
    }

    return [
        'success' => true,
        'relative_path' => $relativePath,
        'url' => media_url($relativePath),
        'inserted_id' => $insertedId,
    ];
}

/**
 * Upload multiple files for media types (hospital_media, quote_media, patient_media)
 *
 * @param PDO $pdo Database connection
 * @param array $files $_FILES['files'] array (multiple files)
 * @param string $type Upload type (patient_media, hospital_media, quote_media)
 * @param int $entityId Entity ID (patient_id, hospital_id, quote_id)
 * @param int|null $requestId Request ID (required for patient_media, quote_media)
 * @return array Result with uploaded files info
 */
function api_upload_multiple_media(PDO $pdo, array $files, string $type, int $entityId, ?int $requestId = null): array
{
    $type = strtolower(trim($type));
    
    // Only allow multi-upload for media types
    $allowedTypes = ['patient_media', 'hospital_media', 'quote_media'];
    if (!in_array($type, $allowedTypes)) {
        return ['success' => false, 'message' => 'Multiple upload only allowed for: ' . implode(', ', $allowedTypes)];
    }
    
    // Validate request_id for types that need it
    if (in_array($type, ['patient_media', 'quote_media']) && !$requestId) {
        return ['success' => false, 'message' => 'request_id is required for ' . $type];
    }
    
    // Check if files array is properly formatted for multiple uploads
    if (!isset($files['tmp_name']) || !is_array($files['tmp_name'])) {
        // Single file passed, convert to array format
        $files = [
            'name' => [$files['name'] ?? ''],
            'type' => [$files['type'] ?? ''],
            'tmp_name' => [$files['tmp_name'] ?? ''],
            'error' => [$files['error'] ?? UPLOAD_ERR_NO_FILE],
            'size' => [$files['size'] ?? 0],
        ];
    }
    
    $uploaded = [];
    $errors = [];
    $totalFiles = count($files['tmp_name']);
    
    for ($i = 0; $i < $totalFiles; $i++) {
        // Skip empty slots
        if (empty($files['tmp_name'][$i]) || $files['error'][$i] === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        
        // Build single file array
        $singleFile = [
            'name' => $files['name'][$i],
            'type' => $files['type'][$i],
            'tmp_name' => $files['tmp_name'][$i],
            'error' => $files['error'][$i],
            'size' => $files['size'][$i],
        ];
        
        // Use existing single upload function
        $result = api_upload_media($pdo, $singleFile, $type, $entityId, $requestId);
        
        if ($result['success']) {
            $uploaded[] = [
                'filename' => $files['name'][$i],
                'path' => $result['relative_path'],
                'url' => $result['url'],
                'inserted_id' => $result['inserted_id'],
            ];
        } else {
            $errors[] = [
                'filename' => $files['name'][$i],
                'error' => $result['message'] ?? 'Upload failed',
            ];
        }
    }
    
    return [
        'success' => count($uploaded) > 0,
        'type' => $type,
        'entity_id' => $entityId,
        'request_id' => $requestId,
        'uploaded_count' => count($uploaded),
        'error_count' => count($errors),
        'uploaded' => $uploaded,
        'errors' => $errors,
    ];
}

/**
 * Get media/images for an entity
 *
 * @param PDO $pdo Database connection
 * @param string $type Entity type (doctor_photo, casemanager_photo, hospital_logo, etc.)
 * @param int $entityId Entity ID
 * @param int|null $requestId Request ID (for patient_media, quote_media)
 * @return array Result with images
 */
function api_get_media(PDO $pdo, string $type, int $entityId, ?int $requestId = null): array
{
    $type = strtolower(trim($type));
    $images = [];

    try {
        // Single image from entity table
        if ($type === 'doctor_photo') {
            $stmt = $pdo->prepare("SELECT photo FROM doctors WHERE id_medecin = ?");
            $stmt->execute([$entityId]);
            $row = $stmt->fetch();
            if ($row && $row['photo']) {
                $images[] = ['path' => $row['photo'], 'url' => media_url($row['photo'])];
            }

        } elseif ($type === 'doctor_cv') {
            $stmt = $pdo->prepare("SELECT cv FROM doctors WHERE id_medecin = ?");
            $stmt->execute([$entityId]);
            $row = $stmt->fetch();
            if ($row && $row['cv']) {
                $images[] = ['path' => $row['cv'], 'url' => media_url($row['cv'])];
            }

        } elseif ($type === 'casemanager_photo') {
            $stmt = $pdo->prepare("SELECT profile_photo FROM case_managers WHERE id_case_manager = ?");
            $stmt->execute([$entityId]);
            $row = $stmt->fetch();
            if ($row && $row['profile_photo']) {
                $images[] = ['path' => $row['profile_photo'], 'url' => media_url($row['profile_photo'])];
            }

        } elseif ($type === 'hospital_logo') {
            $stmt = $pdo->prepare("SELECT logo FROM hospitals WHERE id_hospital = ?");
            $stmt->execute([$entityId]);
            $row = $stmt->fetch();
            if ($row && $row['logo']) {
                $images[] = ['path' => $row['logo'], 'url' => media_url($row['logo'])];
            }

        } elseif ($type === 'hotel_photo') {
            $stmt = $pdo->prepare("SELECT photo FROM hotels WHERE id_hotel = ?");
            $stmt->execute([$entityId]);
            $row = $stmt->fetch();
            if ($row && $row['photo']) {
                $images[] = ['path' => $row['photo'], 'url' => media_url($row['photo'])];
            }

        } elseif ($type === 'sales_agent_photo') {
            $stmt = $pdo->prepare("SELECT photo FROM sales_agents WHERE id_commercial = ?");
            $stmt->execute([$entityId]);
            $row = $stmt->fetch();
            if ($row && $row['photo']) {
                $images[] = ['path' => $row['photo'], 'url' => media_url($row['photo'])];
            }

        // Multiple images from media tables
        } elseif ($type === 'patient_media') {
            $stmt = $pdo->prepare("SELECT id_galerie, path FROM galerie_patient WHERE id_request = ?");
            $stmt->execute([$requestId ?: $entityId]);
            while ($row = $stmt->fetch()) {
                $images[] = [
                    'id' => $row['id_galerie'],
                    'path' => $row['path'],
                    'url' => media_url($row['path'])
                ];
            }

        } elseif ($type === 'hospital_media') {
            $stmt = $pdo->prepare("SELECT id_media, path FROM hospital_media WHERE id_hospital = ?");
            $stmt->execute([$entityId]);
            while ($row = $stmt->fetch()) {
                $images[] = [
                    'id' => $row['id_media'],
                    'path' => $row['path'],
                    'url' => media_url($row['path'])
                ];
            }

        } elseif ($type === 'quote_media') {
            if ($requestId) {
                $stmt = $pdo->prepare("SELECT id_qm, id_quote, id_request, nom_image FROM quote_media WHERE id_quote = ? AND id_request = ?");
                $stmt->execute([$entityId, $requestId]);
            } else {
                $stmt = $pdo->prepare("SELECT id_qm, id_quote, id_request, nom_image FROM quote_media WHERE id_quote = ?");
                $stmt->execute([$entityId]);
            }
            while ($row = $stmt->fetch()) {
                $images[] = [
                    'id' => $row['id_qm'],
                    'id_quote' => $row['id_quote'],
                    'id_request' => $row['id_request'],
                    'path' => $row['nom_image'],
                    'url' => media_url($row['nom_image'])
                ];
            }

        } else {
            return ['success' => false, 'message' => 'Unknown type: ' . $type];
        }

    } catch (Exception $e) {
        return ['success' => false, 'message' => 'DB error', 'detail' => $e->getMessage()];
    }

    return [
        'success' => true,
        'type' => $type,
        'entity_id' => $entityId,
        'count' => count($images),
        'images' => $images,
    ];
}
