<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$method = $_SERVER['REQUEST_METHOD'];

/* --------------------------
   LISTE DES TABLES & CHAMPS
-------------------------- */
$tables = [
    "sales_agents" => ['id_commercial','id_user','nom','prenom','photo','email','telephone','langue','note','is_active'],
    "services" => ['id_service','nom_service','prix_service','devise','description','categorie','is_active'],
    "doctors" => ['id_medecin','id_hospital','nom_medecin','photo','cv','specialite','langues','description','note','reviews','sexe','nationalite','email','telephone','is_active'],
    "patients" => ['id_patient','numero_tel','email','nom','prenom','langue','ip_adresse','age','sexe','pays','poids','taille','smoker','imc'],
    "users" => ['id_user','id_role','username','email','password','nom','prenom','telephone','photo','is_active','last_login','system'],
    "roles" => ['id_role','nom_role','description','permissions'],
    "requests" => ['id_request','id_patient','id_procedure','id_commercial','id_galerie','langue','message_patient','status','text_maladies','text_allergies','text_chirurgies','text_medicaments','id_coordination','source','utm_source','utm_medium','utm_campaign'],
    "relances" => ['id_relance','id_request','id_commercial','date_relance','objet','type_relance','status','notes'],
    "quotes" => ['id_quote','id_request','id_patient','id_hospital','id_coordination','id_commercial','numero_devis','plan_traitement','services_inclus','nbre_nuits_hospital','nbre_nuits_apres_hospital','devise','prix_total','id_medecin',
                 'service_1','prix_1','inclus_1','service_2','prix_2','inclus_2','service_3','prix_3','inclus_3','service_4','prix_4','inclus_4','service_5','prix_5','inclus_5','service_6','prix_6','inclus_6','service_7','prix_7','inclus_7','service_8','prix_8','inclus_8','remarque','status','date_validite','date_envoi'],
    "procedure_hospital" => ['id_relation','id_procedure','id_hospital','prix_base','devise','duree_sejour','description_specifique','is_active'],
    "notes" => ['id_note','id_request','id_commercial','contenu','type_note'],
    "medical_procedures" => ['id_procedure','nom_procedure','categorie','sous_categorie','description','img_procedure','duree_moyenne','is_active'],
    "hospital_coordinators" => ['id_coordi','id_hospital','nom_coordi','email','fonction','telephone','langue','is_active'],
    "hospitals" => ['id_hospital','nom','pays','nom_gerant','reviews','adresse','ville','certifications','note_google','latitude','longitude','description','logo','website','email','telephone','is_active'],
    "historique_email" => ['id','id_request','id_patient','id_commercial','titre','text_email','email_destinataire','email_type','status','date_envoi'],
    "galerie_patient" => ['id_galerie','id_image','id_request','nom','path','type_image','description'],
    "appointments" => ['id_appointment','id_quote','id_request','id_patient','id_hospital','status','date_arrivee','date_depart','passeport_doc','fly_ticket_doc','hotel_reservation','notes']
];

/* --------------------------
   Vérification table
-------------------------- */
$table = $_GET['table'] ?? null;
if (!$table || !isset($tables[$table])) {
    echo json_encode(["error" => "Table non valide"]);
    exit;
}

$primaryKey = $tables[$table][0]; // la première colonne est l'ID

/* ======================
   GET
====================== */
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM $table WHERE $primaryKey = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    $stmt = $pdo->query("SELECT * FROM $table ORDER BY $primaryKey DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/* ======================
   POST
====================== */
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) $data = $_POST;

    $action = $data['action'] ?? 'create';

    /* ---------- DELETE ---------- */
    if ($action === 'delete') {
        if (!isset($data[$primaryKey])) {
            echo json_encode(["error" => "$primaryKey est requis"]);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM $table WHERE $primaryKey = ?");
        $stmt->execute([$data[$primaryKey]]);
        echo json_encode(["success" => true, "type" => "delete"]);
        exit;
    }

    /* ---------- UPDATE ---------- */
    if ($action === 'update') {
        if (!isset($data[$primaryKey])) {
            echo json_encode(["error" => "$primaryKey est requis"]);
            exit;
        }

        $fields = [];
        $values = [];
        foreach ($tables[$table] as $field) {
            if ($field !== $primaryKey && array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (empty($fields)) {
            echo json_encode(["error" => "Aucun champ à mettre à jour"]);
            exit;
        }

        $values[] = $data[$primaryKey];
        $sql = "UPDATE $table SET " . implode(', ', $fields) . " WHERE $primaryKey = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        echo json_encode(["success" => true, "type" => "update"]);
        exit;
    }

    /* ---------- CREATE ---------- */
    $fields = [];
    $placeholders = [];
    $values = [];

    foreach ($tables[$table] as $field) {
        if ($field !== $primaryKey) {
            $fields[] = $field;
            $placeholders[] = "?";
            $values[] = $data[$field] ?? null;
        }
    }

    $sql = "INSERT INTO $table (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);

    echo json_encode(["success" => true, "type" => "create", "id" => $pdo->lastInsertId()]);
    exit;
}

echo json_encode(["error" => "Méthode non autorisée"]);
