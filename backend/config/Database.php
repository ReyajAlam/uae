<?php
// backend/config/Database.php

class Database {
    private static ?PDO $instance = null;

    private string $host;
    private string $port;
    private string $db_name;
    private string $username;
    private string $password;

    private function __construct() {
        $this->loadEnv();
        $this->host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? '127.0.0.1');
        $this->port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '3306');
        $this->db_name = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'officebase_db');
        $this->username = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'root');
        $this->password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : ($_ENV['DB_PASS'] ?? '');
    }

    private function loadEnv(): void {
        $envFile = dirname(__DIR__) . '/.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (str_starts_with(trim($line), '#')) continue;
                if (str_contains($line, '=')) {
                    [$key, $val] = explode('=', $line, 2);
                    $key = trim($key);
                    $val = trim($val, " \t\n\r\0\x0B\"'");
                    putenv("{$key}={$val}");
                    $_ENV[$key] = $val;
                }
            }
        }
    }
    private function __clone() {}

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $db = new self();
            self::$instance = $db->connect();
        }
        return self::$instance;
    }

    private function connect(): PDO {
        $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            return new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            // Attempt to create database if it doesn't exist
            if ($e->getCode() == 1049) {
                $rootDsn = "mysql:host={$this->host};port={$this->port};charset=utf8mb4";
                $rootPdo = new PDO($rootDsn, $this->username, $this->password);
                $rootPdo->exec("CREATE DATABASE IF NOT EXISTS `{$this->db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                return new PDO($dsn, $this->username, $this->password, $options);
            }
            throw new Exception("Database connection error: " . $e->getMessage());
        }
    }
}
