<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

$delay = rand(1, 5);
sleep($delay);

echo json_encode([
    'delay' => $delay,
    'timestamp' => time(),
    'status' => 'success'
]);
exit;
?>
