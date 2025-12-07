$order = wc_get_order(125);

if (!$order) {
    return;
}

$data = $order->get_data();

// 🔹 INFO CLIENT
$billing = $data['billing'];
$shipping = $data['shipping'];

// 🔹 MÉTAS
$delivery_type = $order->get_meta('delivery_type');
$pickup_date   = $order->get_meta('pickup_date');
$pickup_time   = $order->get_meta('pickup_time');

// 🔹 INFORMATIONS COMMANDES
$order_id       = $data['id'];
$order_status   = $data['status'];
$total          = $data['total'];
$currency       = $data['currency'];
$date_created   = $data['date_created']->date('Y-m-d H:i:s');

// 🔹 AFFICHAGE
echo "<h2>Commande #{$order_id}</h2>";
echo "<p>Status : {$order_status}</p>";
echo "<p>Total : {$total} {$currency}</p>";
echo "<p>Date : {$date_created}</p>";

echo "<h3>Informations Client</h3>";
echo "<p>Nom : {$billing['first_name']} {$billing['last_name']}</p>";
echo "<p>Email : {$billing['email']}</p>";
echo "<p>Adresse : {$billing['address_1']}, {$billing['city']}</p>";

echo "<h3>Livraison / Pickup</h3>";
echo "<p>Type : {$delivery_type}</p>";

if ($delivery_type === 'pickup') {
    echo "<p>Date de retrait : {$pickup_date}</p>";
    echo "<p>Heure de retrait : {$pickup_time}</p>";
}

// 🔹 PRODUITS DE LA COMMANDE
echo "<h3>Produits</h3>";

foreach ($order->get_items() as $item) {
    $product_name = $item->get_name();
    $quantity     = $item->get_quantity();
    $subtotal     = $item->get_total();

    echo "<p>- {$product_name} × {$quantity} → {$subtotal} {$currency}</p>";
}
