<?php
class Crud {
    private $conn;

    public function __construct($db){
        $this->conn = $db;
    }

    public function create($table, $data){
        $fields = implode(", ", array_keys($data));
        $values = ":" . implode(", :", array_keys($data));
        $stmt = $this->conn->prepare("INSERT INTO $table ($fields) VALUES ($values)");
        return $stmt->execute($data);
    }

    public function read($table, $conditions = []){
        $sql = "SELECT * FROM $table";
        if (!empty($conditions)) {
            $sql .= " WHERE " . key($conditions) . " = :" . key($conditions);
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
}
?>
