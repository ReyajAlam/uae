<?php
// backend/database/seed.php
require_once __DIR__ . '/../config/Database.php';

try {
    echo "Connecting to database...\n";
    $pdo = Database::getInstance();

    // 1. Run Schema
    echo "Applying schema...\n";
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    // Split schema statements
    $statements = array_filter(array_map('trim', explode(';', $schema)));
    foreach ($statements as $stmt) {
        if (!empty($stmt)) {
            $pdo->exec($stmt);
        }
    }
    echo "Schema applied successfully.\n";

    // 2. Clear old test data
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE `categories`;");
    $pdo->exec("TRUNCATE TABLE `products`;");
    $pdo->exec("TRUNCATE TABLE `product_variants`;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    // 3. Seed Categories
    echo "Seeding categories...\n";
    $categories = [
        ['id' => 1, 'name' => 'Chairs', 'slug' => 'chairs', 'icon_url' => 'https://www.officebase.ae/assets/images/image-data/6374782371.webp'],
        ['id' => 2, 'name' => 'Desks', 'slug' => 'desks', 'icon_url' => 'https://www.officebase.ae/assets/images/image-data/5070366126.webp'],
        ['id' => 3, 'name' => 'Storage', 'slug' => 'storage', 'icon_url' => 'https://www.officebase.ae/assets/images/image-data/4328270562.webp'],
        ['id' => 4, 'name' => 'Meeting and Shared Spaces', 'slug' => 'meeting-and-shared-spaces', 'icon_url' => 'https://www.officebase.ae/assets/images/image-data/7936905474.webp'],
        ['id' => 5, 'name' => 'Lounge and Reception Areas', 'slug' => 'lounge-and-reception-areas', 'icon_url' => 'https://www.officebase.ae/assets/images/image-data/8831986750.webp'],
        ['id' => 6, 'name' => 'Pantries', 'slug' => 'pantries', 'icon_url' => 'https://www.officebase.ae/assets/images/image-data/683519101.webp'],
        ['id' => 7, 'name' => 'Office Accessories', 'slug' => 'office-accessories', 'icon_url' => 'https://www.officebase.ae/assets/images/image-data/7245863393.webp'],
        ['id' => 8, 'name' => 'Acoustic Solutions', 'slug' => 'acoustic-solutions', 'icon_url' => 'https://www.officebase.ae/assets/images/image-data/7331674415.webp'],
        ['id' => 9, 'name' => 'Decor', 'slug' => 'decor', 'icon_url' => 'https://www.officebase.ae/assets/images/image-data/3237230023.webp'],
    ];

    $catStmt = $pdo->prepare("INSERT INTO `categories` (`id`, `name`, `slug`, `icon_url`, `description`) VALUES (?, ?, ?, ?, ?)");
    foreach ($categories as $cat) {
        $catStmt->execute([$cat['id'], $cat['name'], $cat['slug'], $cat['icon_url'], "Browse high quality {$cat['name']} for modern UAE offices."]);
    }
    echo "Seeded " . count($categories) . " categories.\n";

    // 4. Seed Products
    echo "Seeding products...\n";
    $jsonPath = __DIR__ . '/../../desk_products.json';
    $rawProducts = file_exists($jsonPath) ? json_decode(file_get_contents($jsonPath), true) : [];

    // Specific flagship product 63824 requested by user:
    $flagship = [
        'id' => 63824,
        'name' => 'IVORY L Shape Desk (White Frame)',
        'slug' => 'ivory-l-shape-desk-white-frame',
        'sku' => 'OB-IVORY-63824',
        'price' => 3739.00,
        'original_price' => 4150.00,
        'image_url' => 'https://officebaseuae.b-cdn.net/assets/images/image-data/7937308194.png',
        'gallery_images' => json_encode([
            'https://officebaseuae.b-cdn.net/assets/images/image-data/7937308194.png',
            'https://www.officebase.ae/assets/images/image-data/6374782371.webp',
            'https://www.officebase.ae/assets/images/image-data/5070366126.webp',
            'https://www.officebase.ae/assets/images/image-data/4328270562.webp'
        ]),
        'category_id' => 2,
        'category_name' => 'Desks',
        'subcategory' => 'Executive Desks',
        'description' => "Elevate your executive suite with the IVORY L Shape Desk (White Frame). Featuring a pristine DB01 White desktop paired with DB03 Ash Gray accents and sturdy steel framing. Designed with an integrated side credenza, password-lockable security drawers, and intelligent cable routing grommets. Built to eco-friendly E1 commercial standards.",
        'specifications' => json_encode([
            'Color' => 'DB01 White + DB03 Ash Gray Table-top',
            'Material' => 'E1 Grade Eco-Friendly Melamine & Powder-coated Steel',
            'Storage' => 'Integrated Credenza with 3 Lockable Drawers & Digital Password Lock',
            'Cable Management' => 'Integrated flip-top brush cable grommets',
            'Orientation' => 'Reversible (Left or Right configuration)',
            'Load Capacity' => '150 KG evenly distributed'
        ]),
        'warranty' => 'Limited Lifetime Warranty. 1-year warranty on hardware furniture.',
        'delivery_time' => '7 - 8 Working Days from order confirmation.',
        'country_of_origin' => 'Made in China',
        'in_stock' => 1
    ];

    $prodStmt = $pdo->prepare("
        INSERT INTO `products` (
            `id`, `name`, `slug`, `sku`, `price`, `original_price`, `image_url`, `gallery_images`,
            `category_id`, `category_name`, `subcategory`, `description`, `specifications`,
            `warranty`, `delivery_time`, `country_of_origin`, `in_stock`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $varStmt = $pdo->prepare("
        INSERT INTO `product_variants` (`product_id`, `variant_type`, `variant_value`, `price`, `sku`)
        VALUES (?, ?, ?, ?, ?)
    ");

    // Insert flagship product first
    $prodStmt->execute([
        $flagship['id'],
        $flagship['name'],
        $flagship['slug'],
        $flagship['sku'],
        $flagship['price'],
        $flagship['original_price'],
        $flagship['image_url'],
        $flagship['gallery_images'],
        $flagship['category_id'],
        $flagship['category_name'],
        $flagship['subcategory'],
        $flagship['description'],
        $flagship['specifications'],
        $flagship['warranty'],
        $flagship['delivery_time'],
        $flagship['country_of_origin'],
        $flagship['in_stock']
    ]);

    // Flagship variants
    $flagshipVariants = [
        ['val' => 'W1600 X D1450 X H750 MM', 'price' => 3739.00, 'sku' => 'OB-IVORY-63824-1600'],
        ['val' => 'W1800 X D1550 X H750 MM', 'price' => 3949.00, 'sku' => 'OB-IVORY-63824-1800'],
        ['val' => 'W2000 X D1550 X H750 MM', 'price' => 4159.00, 'sku' => 'OB-IVORY-63824-2000'],
        ['val' => 'W2200 X D1550 X H750 MM', 'price' => 4369.00, 'sku' => 'OB-IVORY-63824-2200']
    ];
    foreach ($flagshipVariants as $v) {
        $varStmt->execute([$flagship['id'], 'Dimensions', $v['val'], $v['price'], $v['sku']]);
    }

    // Insert all parsed desk products
    $count = 1;
    foreach ($rawProducts as $p) {
        if ($p['id'] == 63824) continue; // Already inserted

        $sku = 'OB-' . strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $p['name']), 0, 8)) . '-' . $p['id'];
        $gallery = json_encode([
            $p['image'],
            'https://officebaseuae.b-cdn.net/assets/images/image-data/7937308194.png',
            'https://www.officebase.ae/assets/images/image-data/5070366126.webp'
        ]);

        $subcat = 'Executive Desks';
        if (stripos($p['name'], 'Workstation') !== false) {
            $subcat = 'Workstation Desks';
        } elseif (stripos($p['name'], 'Height Adjustable') !== false) {
            $subcat = 'Height Adjustable Desks';
        } elseif (stripos($p['name'], 'CEO') !== false) {
            $subcat = 'CEO Desks';
        }

        $specs = json_encode([
            'Material' => 'E1 Grade Engineered Wood with melamine finish',
            'Frame' => 'Heavy-duty steel with anti-scratch powder coat',
            'Cable Management' => 'Integrated grommets',
            'Warranty' => 'Limited Lifetime Warranty',
            'Origin' => 'Imported'
        ]);

        $prodStmt->execute([
            $p['id'],
            $p['name'],
            $p['slug'],
            $sku,
            $p['price'],
            $p['price'] * 1.15,
            $p['image'],
            $gallery,
            2,
            'Desks',
            $subcat,
            "Premium ergonomic {$p['name']} crafted for corporate and home offices across UAE.",
            $specs,
            'Limited Lifetime Warranty. 1-year warranty on hardware furniture.',
            '7 - 8 Working Days from order confirmation.',
            'Made in China',
            1
        ]);

        // Default variants
        $vList = [
            ['val' => 'W1600 X D1400 X H750 MM', 'price' => (float)$p['price']],
            ['val' => 'W1800 X D1500 X H750 MM', 'price' => (float)$p['price'] + 250.00],
            ['val' => 'W2000 X D1600 X H750 MM', 'price' => (float)$p['price'] + 500.00]
        ];
        foreach ($vList as $v) {
            $varStmt->execute([$p['id'], 'Dimensions', $v['val'], $v['price'], "{$sku}-DIM"]);
        }
        $count++;
    }

    echo "Seeded total {$count} products with variants successfully.\n";

} catch (Exception $e) {
    echo "SEED ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
