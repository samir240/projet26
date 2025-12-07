/* test samir 13 nov2025 */
/* --------------------------------------------------------
   Christmas Report — Filtre date + type pickup/delivery
   et tableau des produits (avec variations)
--------------------------------------------------------- */

add_action('admin_menu', function () {
    add_menu_page(
        'Christmas Report',
        'Christmas Report',
        'manage_woocommerce',
        'christmas-report',
        'christmas_report_page',
        'dashicons-clipboard',
        56
    );
});

function christmas_report_page() {

    echo '<div class="wrap"><h1>Christmas Report</h1>';

    /* ------------------------
       FILTRES
    ------------------------- */
    $selected_type = $_GET['type'] ?? '';
    $selected_date = $_GET['date'] ?? '';

    echo '<form method="GET" style="margin-bottom:20px; display:flex; gap:20px;">';
    echo '<input type="hidden" name="page" value="christmas-report">';

    // FILTRE TYPE
    echo '<select name="type">
            <option value="">Type (tous)</option>
            <option value="pickup" ' . selected($selected_type, "pickup", false) . '>Pickup</option>
            <option value="delivery" ' . selected($selected_type, "delivery", false) . '>Delivery</option>
          </select>';

    // FILTRE DATE
    echo '<input type="date" name="date" value="' . esc_attr($selected_date) . '">';

    echo '<button class="button button-primary">Filtrer</button>';
    echo '</form>';

    /* ------------------------
       REQUÊTE COMMANDES
    ------------------------- */

    $args = [
        'limit' => -1,
        'status' => ['processing', 'completed'],
    ];

    $orders = wc_get_orders($args);

    $products_summary = [];

    foreach ($orders as $order) {

        $order_id = $order->get_id();

        $delivery_type = $order->get_meta('delivery_type');
        $delivery_date = $order->get_meta('delivery_date');
        $pickup_date   = $order->get_meta('pickup_date');

        // 🔹 Filtre Type
        if ($selected_type && $selected_type !== $delivery_type) {
            continue;
        }

        // 🔹 Filtre Date selon type
        if ($selected_type === 'pickup' && $selected_date && $pickup_date !== $selected_date) {
            continue;
        }
        if ($selected_type === 'delivery' && $selected_date && $delivery_date !== $selected_date) {
            continue;
        }

        foreach ($order->get_items() as $item) {

            $product_id   = $item->get_product_id();
            $variation_id = $item->get_variation_id();
            $name         = $item->get_name();
            $qty          = $item->get_quantity();

            /* -------------------------
               Variation label
            ---------------------------- */
            $variation_label = "";

            if ($variation_id) {
                $variation_product = wc_get_product($variation_id);
                if ($variation_product) {
                    $variation_attributes = $variation_product->get_attributes();

                    foreach ($variation_attributes as $attr_name => $attr_value) {
                        $variation_label .= " (" . wc_attribute_label($attr_name) . ": " . $attr_value . ")";
                    }
                }
            }

            // Clé unique variation
            $key = $product_id . '-' . $variation_id;

            // Nom final affiché
            $full_name = $name . $variation_label;

            if (!isset($products_summary[$key])) {
                $products_summary[$key] = [
                    'name' => $full_name,
                    'qty'  => 0
                ];
            }

            $products_summary[$key]['qty'] += $qty;
        }
    }

    /* ------------------------
       TABLEAU RÉSULTAT
    ------------------------- */

    echo '<h2>Résultats</h2>';

    if (empty($products_summary)) {
        echo "<p>Aucun résultat pour ces filtres.</p></div>";
        return;
    }

    echo '<table class="wp-list-table widefat fixed striped">';
    echo '<thead><tr><th>Produit</th><th>Quantité totale</th></tr></thead><tbody>';

    foreach ($products_summary as $row) {
        echo "<tr><td>{$row['name']}</td><td><strong>{$row['qty']}</strong></td></tr>";
    }

    echo '</tbody></table>';

    echo '</div>';
}

/* fin test samir */
