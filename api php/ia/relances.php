<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$method = $_SERVER['REQUEST_METHOD'];

/* ======================
   GET : Lecture complète
====================== */
if ($method === 'GET') {
    try {
        // Sélection de toutes les colonnes de relances + noms Commercial et Patient
        $sql = "SELECT r.*, 
                sa.nom as commercial_nom, sa.prenom as commercial_prenom,
                p.nom as patient_nom, p.prenom as patient_prenom
                FROM relances r
                LEFT JOIN sales_agents sa ON r.id_commercial = sa.id_commercial
                LEFT JOIN requests req ON r.id_request = req.id_request
                LEFT JOIN patients p ON req.id_patient = p.id_patient
                ORDER BY r.date_relance ASC";

        $stmt = $pdo->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Retourne le tableau (vide ou rempli)
        echo json_encode($results ? $results : []);
        
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

/* ======================
   POST (CREATE / UPDATE / DELETE)
====================== */
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) { echo json_encode(["error" => "Données JSON invalides"]); exit; }

    $action = $data['action'] ?? '';

    /* ---------- CRÉATION ---------- */
    if ($action === 'create') {
        try {
            $sql = "INSERT INTO relances (id_request, id_commercial, date_relance, objet, type_relance, status, notes) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['id_request'] ?? null,
                $data['id_commercial'] ?? null,
                $data['date_relance'] ?? date('Y-m-d H:i:s'),
                $data['objet'] ?? $data['motif'] ?? 'Sans objet',
                $data['type_relance'] ?? 'manual',
                $data['status'] ?? 'new',
                $data['notes'] ?? ''
            ]);
            echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit;
    }

    /* ---------- MISE À JOUR (Statut effectué) ---------- */
    if ($action === 'update') {
        try {
            // Utilise 'effectue' car c'est la valeur prévue dans ton ENUM SQL
            $stmt = $pdo->prepare("UPDATE relances SET status = 'done', updated_at = NOW() WHERE id_relance = ?");
            $stmt->execute([$data['id_relance']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit;
    }

    /* ---------- SUPPRESSION ---------- */
    if ($action === 'delete') {
        try {
            $stmt = $pdo->prepare("DELETE FROM relances WHERE id_relance = ?");
            $stmt->execute([$data['id_relance']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        exit;
    }
}