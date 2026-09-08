<?php
// backend/controllers/ProductController.php
require_once __DIR__ . '/../models/Product.php';

class ProductController {
    private Product $productModel;

    public function __construct() {
        $this->productModel = new Product();
    }

    public function index(): void {
        $category = $_GET['category'] ?? null;
        $subcategory = $_GET['subcategory'] ?? null;
        $search = $_GET['search'] ?? null;
        $sort = $_GET['sort'] ?? null;

        $products = $this->productModel->getAll($category, $subcategory, $search, $sort);
        $this->jsonResponse(['success' => true, 'count' => count($products), 'data' => $products]);
    }

    public function show(string $idOrSlug): void {
        if (is_numeric($idOrSlug)) {
            $product = $this->productModel->getById((int)$idOrSlug);
        } else {
            $product = $this->productModel->getBySlug($idOrSlug);
        }

        if (!$product) {
            $this->jsonResponse(['success' => false, 'message' => 'Product not found'], 404);
            return;
        }

        $related = $this->productModel->getRelated((int)$product['id'], 4);
        $this->jsonResponse(['success' => true, 'data' => $product, 'related' => $related]);
    }

    private function jsonResponse(array $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}
