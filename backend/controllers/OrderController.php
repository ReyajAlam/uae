<?php
// backend/controllers/OrderController.php
require_once __DIR__ . '/../models/Order.php';

class OrderController {
    private Order $orderModel;

    public function __construct() {
        $this->orderModel = new Order();
    }

    public function create(): void {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            $this->jsonResponse(['success' => false, 'message' => 'Invalid JSON input'], 400);
            return;
        }

        $customer = $input['customer'] ?? [];
        $items = $input['items'] ?? [];

        if (empty($customer['name']) || empty($customer['email']) || empty($customer['phone']) || empty($customer['address']) || empty($customer['emirate'])) {
            $this->jsonResponse(['success' => false, 'message' => 'Missing required customer delivery information'], 422);
            return;
        }

        if (empty($items)) {
            $this->jsonResponse(['success' => false, 'message' => 'Order must have at least one item'], 422);
            return;
        }

        $orderData = [
            'customer_name' => trim($customer['name']),
            'customer_email' => trim($customer['email']),
            'customer_phone' => trim($customer['phone']),
            'address' => trim($customer['address']),
            'emirate' => trim($customer['emirate']),
            'country' => $customer['country'] ?? 'United Arab Emirates',
            'notes' => $customer['notes'] ?? '',
            'payment_method' => $input['payment_method'] ?? 'card',
            'transaction_id' => $input['transaction_id'] ?? null,
            'payment_status' => $input['payment_status'] ?? null
        ];

        try {
            $order = $this->orderModel->create($orderData, $items);
            $this->jsonResponse(['success' => true, 'message' => 'Order placed successfully', 'order' => $order], 201);
        } catch (Exception $e) {
            $this->jsonResponse(['success' => false, 'message' => 'Failed to create order: ' . $e->getMessage()], 500);
        }
    }

    public function show(string $orderNumber): void {
        $order = $this->orderModel->getByOrderNumber($orderNumber);
        if (!$order) {
            $this->jsonResponse(['success' => false, 'message' => 'Order not found'], 404);
            return;
        }
        $this->jsonResponse(['success' => true, 'order' => $order]);
    }

    private function jsonResponse(array $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}
