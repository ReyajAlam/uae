<?php
// backend/models/Order.php
require_once __DIR__ . '/../config/Database.php';

class Order {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function create(array $orderData, array $items): array {
        $this->db->beginTransaction();
        try {
            $orderNumber = 'OB-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -5));

            $subtotal = 0.0;
            foreach ($items as $item) {
                $subtotal += ((float)$item['price'] * (int)$item['quantity']);
            }
            $vat = round($subtotal * 0.05, 2); // 5% UAE VAT
            $deliveryFee = 0.0; // Free delivery
            $total = $subtotal + $vat + $deliveryFee;

            $stmt = $this->db->prepare("
                INSERT INTO `orders` (
                    `order_number`, `customer_name`, `customer_email`, `customer_phone`,
                    `address`, `emirate`, `country`, `notes`, `payment_method`,
                    `payment_status`, `transaction_id`, `subtotal`, `vat`, `delivery_fee`, `total`, `status`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $paymentStatus = $orderData['payment_status'] ?? (in_array($orderData['payment_method'], ['card', 'tabby', 'tamara']) ? 'Paid' : 'Pending (COD)');
            $transactionId = $orderData['transaction_id'] ?? ('#FLSAPI' . strtolower(substr(md5((string)uniqid()), 0, 16)));

            $stmt->execute([
                $orderNumber,
                $orderData['customer_name'],
                $orderData['customer_email'],
                $orderData['customer_phone'],
                $orderData['address'],
                $orderData['emirate'],
                $orderData['country'] ?? 'United Arab Emirates',
                $orderData['notes'] ?? '',
                $orderData['payment_method'],
                $paymentStatus,
                $transactionId,
                $subtotal,
                $vat,
                $deliveryFee,
                $total,
                'Processing'
            ]);

            $orderId = (int)$this->db->lastInsertId();

            $itemStmt = $this->db->prepare("
                INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `variant`, `price`, `quantity`, `total`)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");

            foreach ($items as $item) {
                $itemTotal = (float)$item['price'] * (int)$item['quantity'];
                $itemStmt->execute([
                    $orderId,
                    (int)($item['product_id'] ?? $item['id']),
                    $item['name'] ?? $item['product_name'],
                    $item['variant'] ?? '',
                    (float)$item['price'],
                    (int)$item['quantity'],
                    $itemTotal
                ]);
            }

            $this->db->commit();

            return $this->getByOrderNumber($orderNumber);
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function getByOrderNumber(string $orderNumber): ?array {
        $stmt = $this->db->prepare("SELECT * FROM `orders` WHERE `order_number` = ? LIMIT 1");
        $stmt->execute([$orderNumber]);
        $order = $stmt->fetch();

        if (!$order) return null;

        $itemsStmt = $this->db->prepare("SELECT * FROM `order_items` WHERE `order_id` = ?");
        $itemsStmt->execute([$order['id']]);
        $order['items'] = $itemsStmt->fetchAll();

        $order['subtotal'] = (float)$order['subtotal'];
        $order['vat'] = (float)$order['vat'];
        $order['delivery_fee'] = (float)$order['delivery_fee'];
        $order['total'] = (float)$order['total'];

        return $order;
    }
}
