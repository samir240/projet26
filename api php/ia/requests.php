<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "config.php";

$method = $_SERVER['REQUEST_METHOD'];

/* =====================================================
   GET : LISTE ou DÉTAIL (avec jointures)
===================================================== */
if ($method === 'GET') {

    /* ---------- GET BY ID ---------- */
    if (isset($_GET['id'])) {

        $stmt = $pdo->prepare("
            SELECT
                -- REQUEST
                r.*,

                -- PATIENT
                p.id_patient        AS patient_id,
                p.numero_tel        AS patient_tel,
                p.email             AS patient_email,
                p.nom               AS patient_nom,
                p.prenom            AS patient_prenom,
                p.langue            AS patient_langue,
                p.ip_adresse        AS patient_ip,
                p.age               AS patient_age,
                p.sexe              AS patient_sexe,
                p.pays              AS patient_pays,
                p.poids             AS patient_poids,
                p.taille            AS patient_taille,
                p.smoker            AS patient_smoker,
                p.imc               AS patient_imc,
                p.created_at        AS patient_created_at,
                p.updated_at        AS patient_updated_at,

                -- PROCEDURE
                mp.nom_procedure    AS procedure_nom,

                -- COMMERCIAL
                sa.nom              AS commercial_nom,
                sa.prenom           AS commercial_prenom

            FROM requests r
            LEFT JOIN patients p ON r.id_patient = p.id_patient
            LEFT JOIN medical_procedures mp ON r.id_procedure = mp.id_procedure
            LEFT JOIN sales_agents sa ON r.id_commercial = sa.id_commercial

            WHERE r.id_request = ?
        ");

        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    /* ---------- GET ALL ---------- */
    $stmt = $pdo->query("
        SELECT
            r.*,

            p.id_patient        AS patient_id,
            p.numero_tel        AS patient_tel,
            p.email             AS patient_email,
            p.nom               AS patient_nom,
            p.prenom            AS patient_prenom,
            p.langue            AS patient_langue,
            p.age               AS patient_age,
            p.sexe              AS patient_sexe,
            p.pays              AS patient_pays,

            mp.nom_procedure    AS procedure_nom,

            sa.nom              AS commercial_nom,
            sa.prenom           AS commercial_prenom

        FROM requests r
        LEFT JOIN patients p ON r.id_patient = p.id_patient
        LEFT JOIN medical_procedures mp ON r.id_procedure = mp.id_procedure
        LEFT JOIN sales_agents sa ON r.id_commercial = sa.id_commercial

        ORDER BY r.created_at DESC
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* =====================================================
   POST : CREATE / UPDATE / DELETE
===================================================== */
if ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }

    /* ---------- DELETE ---------- */
    if (($data['action'] ?? '') === 'delete') {

        if (!isset($data['id_request'])) {
            echo json_encode(["error" => "id_request required"]);
            exit;
        }

        $pdo->prepare("DELETE FROM requests WHERE id_request = ?")
            ->execute([$data['id_request']]);

        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE REQUEST + PATIENT ---------- */
    if (($data['action'] ?? '') === 'update') {

        if (!isset($data['id_request'], $data['id_patient'])) {
            echo json_encode(["error" => "id_request & id_patient required"]);
            exit;
        }

        try {
            $pdo->beginTransaction();

            /* ===== UPDATE REQUEST ===== */
            $reqFields = [
                'id_procedure','id_commercial','id_galerie','langue','message_patient','status',
                'text_maladies','text_allergies','text_chirurgies','text_medicaments',
                'id_coordi','source','utm_source','utm_medium','utm_campaign'
            ];

            $set = [];
            $vals = [];

            foreach ($reqFields as $f) {
                if (isset($data[$f])) {
                    $set[] = "$f = ?";
                    $vals[] = $data[$f];
                }
            }

            if ($set) {
                $vals[] = $data['id_request'];
                $sql = "UPDATE requests SET ".implode(',', $set)." WHERE id_request = ?";
                $pdo->prepare($sql)->execute($vals);
            }

            /* ===== UPDATE PATIENT ===== */
            if (isset($data['patient'])) {

                $patFields = [
                    'numero_tel','email','nom','prenom','langue','age',
                    'sexe','pays','poids','taille','smoker','imc'
                ];

                $pSet = [];
                $pVals = [];

                foreach ($patFields as $f) {
                    if (isset($data['patient'][$f])) {
                        $pSet[] = "$f = ?";
                        $pVals[] = $data['patient'][$f];
                    }
                }

                if ($pSet) {
                    $pVals[] = $data['id_patient'];
                    $sql = "UPDATE patients SET ".implode(',', $pSet)." WHERE id_patient = ?";
                    $pdo->prepare($sql)->execute($pVals);
                }
            }

            $pdo->commit();

            echo json_encode(["success" => true, "type" => "update_full"]);
            exit;

        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(["error" => $e->getMessage()]);
            exit;
        }
    }

    /* ---------- CREATE REQUEST ---------- */
    $stmt = $pdo->prepare("
        INSERT INTO requests
        (id_patient,id_procedure,id_commercial,id_galerie,langue,message_patient,status,
         text_maladies,text_allergies,text_chirurgies,text_medicaments,id_coordi,
         source,utm_source,utm_medium,utm_campaign)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ");

    $stmt->execute([
        $data['id_patient'] ?? null,
        $data['id_procedure'] ?? null,
        $data['id_commercial'] ?? null,
        $data['id_galerie'] ?? null,
        $data['langue'] ?? 'fr',
        $data['message_patient'] ?? null,
        $data['status'] ?? 'nouveau',
        $data['text_maladies'] ?? null,
        $data['text_allergies'] ?? null,
        $data['text_chirurgies'] ?? null,
        $data['text_medicaments'] ?? null,
        $data['id_coordi'] ?? null,
        $data['source'] ?? null,
        $data['utm_source'] ?? null,
        $data['utm_medium'] ?? null,
        $data['utm_campaign'] ?? null
    ]);

    echo json_encode([
        "success" => true,
        "type" => "create",
        "id_request" => $pdo->lastInsertId()
    ]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
