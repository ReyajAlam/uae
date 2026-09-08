-- backend/database/schema.sql

CREATE DATABASE IF NOT EXISTS `officebase_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `officebase_db`;

CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `icon_url` TEXT NULL,
    `image_url` TEXT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
    `id` INT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `sku` VARCHAR(100) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `original_price` DECIMAL(10, 2) NULL,
    `image_url` TEXT NOT NULL,
    `gallery_images` LONGTEXT NULL,
    `category_id` INT DEFAULT 2,
    `category_name` VARCHAR(100) DEFAULT 'Desks',
    `subcategory` VARCHAR(100) NULL,
    `description` LONGTEXT NULL,
    `specifications` LONGTEXT NULL,
    `warranty` VARCHAR(255) DEFAULT 'Limited Lifetime Warranty. 1-year warranty on hardware furniture.',
    `delivery_time` VARCHAR(255) DEFAULT '7 - 8 Working Days from order confirmation.',
    `country_of_origin` VARCHAR(100) DEFAULT 'Made in China',
    `in_stock` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_variants` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `variant_type` VARCHAR(100) NOT NULL DEFAULT 'Dimensions',
    `variant_value` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `sku` VARCHAR(100) NULL,
    INDEX `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(64) UNIQUE NOT NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `customer_phone` VARCHAR(50) NOT NULL,
    `address` TEXT NOT NULL,
    `emirate` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) DEFAULT 'United Arab Emirates',
    `notes` TEXT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` VARCHAR(50) DEFAULT 'Paid',
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `vat` DECIMAL(10, 2) NOT NULL,
    `delivery_fee` DECIMAL(10, 2) DEFAULT 0.00,
    `total` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'Processing',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `variant` VARCHAR(255) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `quantity` INT NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    INDEX `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
