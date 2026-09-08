<?php
// backend/api/index.php
declare(strict_types=1);

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/CategoryController.php';
require_once __DIR__ . '/../controllers/OrderController.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

// Parse path if action is not explicitly provided in query params
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($requestUri, PHP_URL_PATH);

// Normalize path relative to /backend/api
$path = preg_replace('#^.*?/backend/api/?#', '', $path);
$segments = array_values(array_filter(explode('/', trim($path, '/'))));

$resource = $segments[0] ?? $action;
$subResource = $segments[1] ?? ($_GET['id'] ?? ($_GET['slug'] ?? ($_GET['order_number'] ?? null)));

try {
    switch ($resource) {
        case 'categories':
            $controller = new CategoryController();
            if ($subResource) {
                $controller->show($subResource);
            } else {
                $controller->index();
            }
            break;

        case 'products':
        case 'product':
            $controller = new ProductController();
            if ($subResource) {
                $controller->show($subResource);
            } else {
                $controller->index();
            }
            break;

        case 'orders':
        case 'order':
        case 'create_order':
            $controller = new OrderController();
            if ($method === 'POST') {
                $controller->create();
            } elseif ($method === 'GET' && $subResource) {
                $controller->show($subResource);
            } else {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            }
            break;

        case 'health':
        case 'ping':
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'status' => 'OfficeBase API is active', 'time' => date('c')]);
            break;

        default:
            // Default: if empty, show available endpoints
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'name' => 'OfficeBase UAE API',
                'endpoints' => [
                    'GET /categories',
                    'GET /categories/{slug}',
                    'GET /products',
                    'GET /products/{id_or_slug}',
                    'POST /orders',
                    'GET /orders/{order_number}'
                ]
            ]);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
