<?php
include '../../../private/config.php';

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;
    public function __construct() {
        global $host, $db_name, $username, $password;
        $this->host = $host;
        $this->db_name = $db_name;
        $this->username = $username;
        $this->password = $password;
    }
    public function dbConnection() {
        $this->conn = null;    
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }

    public function sanitize($data) {
        return htmlspecialchars(strip_tags($data));
    }
}
?>
