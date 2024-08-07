<?php
include '../../../private/config.php';
echo $host.' '.$db_name.' '.$username.' '.$password;
// class Database {
//     private $host = $host;
//     private $db_name = $db_name;
//     private $username = $username;
//     private $password = $password;
//     public $conn;

//     public function dbConnection() {
//         $this->conn = null;    
//         try {
//             $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
//             $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);   
//         } catch(PDOException $exception) {
//             echo "Connection error: " . $exception->getMessage();
//         }
//         return $this->conn;
//     }

//     public function sanitize($data) {
//         return htmlspecialchars(strip_tags($data));
//     }
// }
?>
