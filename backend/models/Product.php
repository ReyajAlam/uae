<?php
// backend/models/Product.php
require_once __DIR__ . '/../config/Database.php';

class Product {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(?string $category = null, ?string $subcategory = null, ?string $search = null, ?string $sort = null): array {
        $sql = "SELECT * FROM `products` WHERE 1=1";
        $params = [];

        if (!empty($category)) {
            $sql .= " AND (LOWER(`category_name`) = LOWER(?) OR `category_id` IN (SELECT `id` FROM `categories` WHERE LOWER(`slug`) = LOWER(?)))";
            $params[] = $category;
            $params[] = $category;
        }

        if (!empty($subcategory)) {
            $sql .= " AND LOWER(`subcategory`) = LOWER(?)";
            $params[] = $subcategory;
        }

        if (!empty($search)) {
            $sql .= " AND (`name` LIKE ? OR `description` LIKE ? OR `sku` LIKE ?)";
            $searchTerm = "%{$search}%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        switch ($sort) {
            case 'price_asc':
                $sql .= " ORDER BY `price` ASC";
                break;
            case 'price_desc':
                $sql .= " ORDER BY `price` DESC";
                break;
            case 'name_asc':
                $sql .= " ORDER BY `name` ASC";
                break;
            default:
                $sql .= " ORDER BY `id` DESC";
                break;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        foreach ($products as &$p) {
            $p['gallery_images'] = json_decode($p['gallery_images'] ?? '[]', true);
            $p['specifications'] = json_decode($p['specifications'] ?? '{}', true);
            $p['price'] = (float)$p['price'];
            $p['original_price'] = (float)$p['original_price'];
        }

        return $products;
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM `products` WHERE `id` = ? LIMIT 1");
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        if (!$product) return null;

        $product['gallery_images'] = json_decode($product['gallery_images'] ?? '[]', true);
        $product['specifications'] = json_decode($product['specifications'] ?? '{}', true);
        $product['price'] = (float)$product['price'];
        $product['original_price'] = (float)$product['original_price'];

        // Fetch variants
        $vStmt = $this->db->prepare("SELECT * FROM `product_variants` WHERE `product_id` = ? ORDER BY `id` ASC");
        $vStmt->execute([$id]);
        $product['variants'] = $vStmt->fetchAll();
        foreach ($product['variants'] as &$v) {
            $v['price'] = (float)$v['price'];
        }

        return $product;
    }

    public function getBySlug(string $slug): ?array {
        $stmt = $this->db->prepare("SELECT * FROM `products` WHERE `slug` = ? LIMIT 1");
        $stmt->execute([$slug]);
        $product = $stmt->fetch();

        if (!$product) return null;

        return $this->getById((int)$product['id']);
    }

    public function getRelated(int $productId, int $limit = 4): array {
        $stmt = $this->db->prepare("SELECT * FROM `products` WHERE `id` != ? ORDER BY RAND() LIMIT ?");
        $stmt->bindValue(1, $productId, PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll();

        foreach ($items as &$p) {
            $p['gallery_images'] = json_decode($p['gallery_images'] ?? '[]', true);
            $p['specifications'] = json_decode($p['specifications'] ?? '{}', true);
            $p['price'] = (float)$p['price'];
            $p['original_price'] = (float)$p['original_price'];
        }
        return $items;
    }
}
