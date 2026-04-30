<?php
// Обработчик формы заявки KSV — отправка в Telegram через Bot API.
// Endpoint: POST /submit.php
//
// Конфиг через переменные окружения (настраиваются в панели хостинга
// или через .htaccess SetEnv) ИЛИ через прямую правку этого файла:
//   BOT_TOKEN          — токен от @BotFather
//   TELEGRAM_CHAT_ID   — id чата владельца (личка или группа)
//   ALLOWED_ORIGINS    — список доменов через запятую (по умолчанию ksv-service.pro + www)
//
// Для безопасности рекомендуется хранить токен в .env, но если хостинг не
// поддерживает env vars — впишите значения ниже:

$BOT_TOKEN        = getenv('BOT_TOKEN')         ?: '';      // <-- ВПИСАТЬ ТОКЕН ОТ @BotFather
$TELEGRAM_CHAT_ID = getenv('TELEGRAM_CHAT_ID')  ?: '';      // <-- ВПИСАТЬ ID чата

$DEFAULT_ALLOWED_ORIGINS = [
    'https://ksv-service.pro',
    'https://www.ksv-service.pro',
];

$ALLOWED_DEVICES = ['Телефон', 'Планшет', 'Ноутбук', 'Принтер или МФУ', 'Другое', ''];

// ===== Утилиты =====

function escape_html($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sanitize_text($s) {
    // Удаляем управляющие, zero-width и RTL-override символы
    $s = preg_replace('/[\x00-\x1F\x7F\x{200B}-\x{200F}\x{202A}-\x{202E}\x{FEFF}]/u', '', (string)$s);
    return trim($s);
}

function normalize_phone($s) {
    return preg_replace('/[^\d+]/', '', (string)$s);
}

function json_response($status, $data) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function check_origin($allowed) {
    $origin = '';
    if (isset($_SERVER['HTTP_ORIGIN']))   $origin = $_SERVER['HTTP_ORIGIN'];
    elseif (isset($_SERVER['HTTP_REFERER'])) $origin = $_SERVER['HTTP_REFERER'];
    $origin = strtolower($origin);
    if (!$origin) return false;
    foreach ($allowed as $a) {
        if (strpos($origin, strtolower($a)) === 0) return true;
    }
    return false;
}

// Простой rate-limit на файловой системе: 3 заявки с одного IP за 60 секунд
function take_bucket($ip, $window_sec = 60, $max_hits = 3) {
    $dir = sys_get_temp_dir() . '/ksv_ratelimit';
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    $file = $dir . '/' . md5($ip);
    $now  = time();
    $bucket = [];
    if (file_exists($file)) {
        $raw = @file_get_contents($file);
        $bucket = $raw ? json_decode($raw, true) : [];
        if (!is_array($bucket)) $bucket = [];
    }
    $bucket = array_filter($bucket, function($t) use ($now, $window_sec) {
        return ($now - $t) < $window_sec;
    });
    if (count($bucket) >= $max_hits) {
        @file_put_contents($file, json_encode(array_values($bucket)));
        return false;
    }
    $bucket[] = $now;
    @file_put_contents($file, json_encode(array_values($bucket)));
    return true;
}

// ===== Обработка запроса =====

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Origin allowlist
$allowed_raw = getenv('ALLOWED_ORIGINS');
$allowed = $allowed_raw
    ? array_filter(array_map('trim', explode(',', $allowed_raw)))
    : $DEFAULT_ALLOWED_ORIGINS;
if (!check_origin($allowed)) {
    json_response(403, ['ok' => false, 'error' => 'forbidden_origin']);
}

// Парсинг JSON
$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);
if (!is_array($payload)) {
    json_response(400, ['ok' => false, 'error' => 'bad_json']);
}

// Honeypot
if (!empty($payload['website'])) {
    json_response(200, ['ok' => true]);
}

// Валидация
$name    = mb_substr(sanitize_text($payload['name']    ?? ''), 0, 120);
$phone   = mb_substr(normalize_phone($payload['phone'] ?? ''), 0, 20);
$device  = mb_substr(sanitize_text($payload['device']  ?? ''), 0, 60);
$problem = mb_substr(sanitize_text($payload['problem'] ?? ''), 0, 2000);
$source  = mb_substr(sanitize_text($payload['source']  ?? 'unknown'), 0, 30);
$consent = ($payload['consent'] === true)
        || ($payload['consent'] === 'on')
        || ($payload['consent'] === '1');
$utm = (isset($payload['utm']) && is_array($payload['utm'])) ? $payload['utm'] : [];

if (!$consent) {
    json_response(400, ['ok' => false, 'error' => 'consent_required']);
}
if (!preg_match('/^[A-Za-zА-ЯЁа-яё\s\-\'.]{2,60}$/u', $name)) {
    json_response(400, ['ok' => false, 'error' => 'invalid_name']);
}
if (!preg_match('/^\+?7\d{10}$/', $phone)) {
    json_response(400, ['ok' => false, 'error' => 'invalid_phone']);
}
if (!in_array($device, $ALLOWED_DEVICES, true)) {
    json_response(400, ['ok' => false, 'error' => 'invalid_device']);
}

// Rate-limit
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (strpos($ip, ',') !== false) $ip = trim(explode(',', $ip)[0]);
if (!take_bucket($ip)) {
    json_response(429, ['ok' => false, 'error' => 'rate_limited']);
}

// Проверка конфигурации
if (!$BOT_TOKEN || !$TELEGRAM_CHAT_ID) {
    error_log('submit.php: BOT_TOKEN or TELEGRAM_CHAT_ID missing');
    json_response(500, ['ok' => false, 'error' => 'not_configured']);
}

// Формирование сообщения
$utm_lines = [];
foreach ($utm as $k => $v) {
    if (strpos($k, 'utm_') === 0 && $v) {
        $utm_lines[] = '<code>' . escape_html($k) . '</code>: ' . escape_html((string)$v);
    }
}

$lines = [
    '🔔 <b>Новая заявка · KSV</b>',
    '',
    '👤 Имя: <b>' . escape_html($name) . '</b>',
    '📞 Телефон: <a href="tel:' . escape_html($phone) . '">' . escape_html($phone) . '</a>',
];
if ($device)  $lines[] = '📱 Устройство: ' . escape_html($device);
if ($problem) { $lines[] = ''; $lines[] = '📝 Проблема:'; $lines[] = escape_html($problem); }
if ($utm_lines) { $lines[] = ''; $lines[] = '📊 UTM:'; $lines = array_merge($lines, $utm_lines); }
$lines[] = '';
$lines[] = '🕒 ' . date('c');

$text = implode("\n", $lines);

// Отправка в Telegram
$tg_url = "https://api.telegram.org/bot{$BOT_TOKEN}/sendMessage";
$tg_payload = json_encode([
    'chat_id'                => $TELEGRAM_CHAT_ID,
    'text'                   => $text,
    'parse_mode'             => 'HTML',
    'disable_web_page_preview' => true,
]);

$ch = curl_init($tg_url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $tg_payload,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 10,
]);
$tg_resp = curl_exec($ch);
$tg_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_err = curl_error($ch);
curl_close($ch);

if ($curl_err) {
    error_log('submit.php curl error: ' . $curl_err);
    json_response(502, ['ok' => false, 'error' => 'telegram_unreachable']);
}

$tg_data = json_decode($tg_resp, true);
if ($tg_code < 200 || $tg_code >= 300 || empty($tg_data['ok'])) {
    error_log('submit.php telegram error: HTTP ' . $tg_code);
    json_response(502, ['ok' => false, 'error' => 'telegram_failed']);
}

json_response(200, ['ok' => true]);
