<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include config file
require_once 'config.php';

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'get_all_news':
        getAllNews();
        break;
    
    case 'get_news_by_id':
        getNewsById();
        break;

    case 'get_latest_news':
        getLatestNews();
        break;
    
    case 'get_carousel_news':
        getCarouselNews();
        break;
    
    case 'get_news_by_category':
        getNewsByCategory();
        break;
    
    case 'add_news':
        addNews();
        break;
    
    case 'delete_news':
        deleteNews();
        break;
    
    case 'login':
        login();
        break;
    
    case 'check_session':
        checkSession();
        break;
    
    case 'get_admin_users':
        getAdminUsers();
        break;
    
    default:
        echo json_encode(['success' => false, 'message' => 'Aksion i pavlefshëm']);
        break;
}

function getAllNews() {
    global $conn;
    
    $sql = "SELECT * FROM lajme ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $news = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $news[] = [
                'id' => (int)$row['id'],
                'title' => $row['title'],
                'content' => $row['content'],
                'image' => $row['image'],
                'category' => $row['category'],
                'date' => $row['created_at']
            ];
        }
    }
    
    echo json_encode(['success' => true, 'data' => $news]);
}

function getNewsById() {
    global $conn;
    $id = (int)($_GET['id'] ?? 0);
    
    $sql = "SELECT * FROM lajme WHERE id = $id";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'content' => $row['content'],
            'image' => $row['image'],
            'category' => $row['category'],
            'date' => $row['created_at']
        ]]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Artikulli nuk u gjet']);
    }
}

function getLatestNews() {
    global $conn;
    
    $sql = "SELECT * FROM lajme ORDER BY created_at DESC LIMIT 1";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $news = [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'content' => $row['content'],
            'image' => $row['image'],
            'category' => $row['category'],
            'date' => $row['created_at']
        ];
        echo json_encode(['success' => true, 'data' => $news]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Nuk ka lajme']);
    }
}

function getCarouselNews() {
    global $conn;
    
    // Marrim 12 lajme për të pasur 2 faqe me nga 6 artikuj (3 majtas, 3 djathtas)
    $sql = "SELECT * FROM lajme ORDER BY created_at DESC LIMIT 1, 12";
    $result = $conn->query($sql);
    
    $news = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $news[] = [
                'id' => (int)$row['id'],
                'title' => $row['title'],
                'content' => $row['content'],
                'image' => $row['image'],
                'category' => $row['category'],
                'date' => $row['created_at']
            ];
        }
    }
    
    echo json_encode(['success' => true, 'data' => $news]);
}

function getNewsByCategory() {
    global $conn;
    
    $category = $_GET['category'] ?? 'lajm';
    $category = $conn->real_escape_string($category);
    
    $sql = "SELECT * FROM lajme WHERE category = '$category' ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $news = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $news[] = [
                'id' => (int)$row['id'],
                'title' => $row['title'],
                'content' => $row['content'],
                'image' => $row['image'],
                'category' => $row['category'],
                'date' => $row['created_at']
            ];
        }
    }
    
    echo json_encode(['success' => true, 'data' => $news]);
}

function addNews() {
    global $conn;
    
    $title = $conn->real_escape_string($_POST['title'] ?? '');
    $content = $conn->real_escape_string($_POST['content'] ?? '');
    $category = $conn->real_escape_string($_POST['category'] ?? 'lajm');
    $image = $_POST['image'] ?? '';
    
    if (empty($title) || empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Titulli dhe përmbajtja janë të detyrueshme']);
        return;
    }
    
    // Generate default image if none provided
    if (empty($image)) {
        $colors = [
            ['%230d47a1', '%231565c0'],
            ['%23006064', '%2300838f'],
            ['%231a237e', '%23283593'],
            ['%23e65100', '%23f57c00'],
            ['%23004d40', '%2300695c']
        ];
        $randomColor = $colors[array_rand($colors)];
        $shortTitle = substr($title, 0, 15);
        $image = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:{$randomColor[0]};stop-opacity:1'/><stop offset='100%' style='stop-color:{$randomColor[1]};stop-opacity:1'/></linearGradient></defs><rect fill='url(%23grad)' width='600' height='400'/><text x='300' y='200' text-anchor='middle' fill='white' font-size='32' font-weight='bold'>$shortTitle</text></svg>";
    }
    
    // Sigurohemi që imazhi i gjeneruar (me thonjëza) të mos thyejë SQL-në
    $image = $conn->real_escape_string($image);
    
    $sql = "INSERT INTO lajme (title, content, image, category) VALUES ('$title', '$content', '$image', '$category')";
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => true, 'message' => 'Lajmi u shtua me sukses']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gabim në shtimin e lajmit: ' . $conn->error]);
    }
}

function deleteNews() {
    global $conn;
    
    $id = (int)($_POST['id'] ?? 0);
    
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'ID e pavlefshme']);
        return;
    }
    
    $sql = "DELETE FROM lajme WHERE id = $id";
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => true, 'message' => 'Lajmi u fshi me sukses']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gabim në fshirjen e lajmit: ' . $conn->error]);
    }
}

function login() {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Check credentials
    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        
        echo json_encode([
            'success' => true, 
            'message' => 'Hyrja u krye me sukses',
            'username' => $username
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'Përdoruesi ose fjalëkalimi është gabim'
        ]);
    }
}

function checkSession() {
    if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
        echo json_encode([
            'logged_in' => true,
            'username' => $_SESSION['admin_username'] ?? 'admin'
        ]);
    } else {
        echo json_encode(['logged_in' => false]);
    }
}

function getAdminUsers() {
    global $conn;
    $sql = "SELECT * FROM `admin_users`;";
    $result = $conn->query($sql);

    $users = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $users]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Nuk u gjetën përdorues']);
    }
}
?>