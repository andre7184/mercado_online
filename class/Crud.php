<?php
require_once 'Database.php';

class Crud {
    private $conn;
    private $db;

    public function __construct(){
        $this->db = new Database();
        $this->conn = $this->db->dbConnection();
    }

    public function create($table, $data){
        $fields = implode(", ", array_keys($data));
        $values = ":" . implode(", :", array_keys($data));
        $stmt = $this->conn->prepare("INSERT INTO $table ($fields) VALUES ($values)");
        $success = $stmt->execute($data);
        if ($success) {
            return $this->conn->lastInsertId();
        } else {
            return false;
        }
    }

    public function read($table, $conditions = []){
        $sql = "SELECT * FROM $table";
        if (!empty($conditions)) {
            $sql .= " WHERE ";
            $first = true;
            foreach ($conditions as $key => $value) {
                if (!$first) {
                    $sql .= " AND ";
                } else {
                    $first = false;
                }
                $sql .= "$key = :$key";
            }
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($conditions);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function update($table, $data, $conditions){
        $fields = "";
        foreach ($data as $key => $value) {
            $fields .= "$key = :$key, ";
        }
        $fields = rtrim($fields, ", ");
        $sql = "UPDATE $table SET $fields WHERE " . key($conditions) . " = :" . key($conditions);
        $stmt = $this->conn->prepare($sql);
        print_r($conditions);
        return $stmt->execute(array_merge($data, $conditions));
    }

    public function delete($table, $conditions){
        $sql = "DELETE FROM $table WHERE " . key($conditions) . " = :" . key($conditions);
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($conditions);
    }

    public function count($table, $conditions = []){
        $sql = "SELECT COUNT(*) FROM $table";
        if (!empty($conditions)) {
            $sql .= " WHERE " . key($conditions) . " = :" . key($conditions);
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($conditions);
        return $stmt->fetchColumn();
    }

    public function sanitize($data) {
        return $this->db->sanitize($data);
    }
}
?>
