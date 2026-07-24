<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$database = "gazeta_universitare";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Lidhja me databazën dështoi: " . $conn->connect_error);
}

// Set encoding
$conn->set_charset("utf8mb4");

// Admin credentials
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'admin123');

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>