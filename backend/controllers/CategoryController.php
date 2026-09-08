<?php
// backend/controllers/CategoryController.php
require_once __DIR__ . '/../models/Category.php';

class CategoryController {
    private Category $categoryModel;

    public function __construct() {
        $this->categoryModel = new Category();
    }

    public function index(): void {
        $categories = $this->categoryModel->getAll();
        $this->jsonResponse(['success' => true, 'count' => count($categories), 'data' => $categories]);
    }

    public function show(string $slug): void {
        $category = $this->categoryModel->getBySlug($slug);
        if (!$category) {
            $this->jsonResponse(['success' => false, 'message' => 'Category not found'], 404);
            return;
        }
        $this->jsonResponse(['success' => true, 'data' => $category]);
    }

    private function jsonResponse(array $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}
