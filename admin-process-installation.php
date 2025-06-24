<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
$UPLOADS_DIR = 'images/installations/';
$INSTALLATIONS_JSON = 'installations.json';
$INSTALLATIONS_DIR = 'installations/';
$TEMPLATE_FILE = 'installation-template.html';

// Ensure directories exist
if (!is_dir($UPLOADS_DIR)) {
    mkdir($UPLOADS_DIR, 0755, true);
}
if (!is_dir($INSTALLATIONS_DIR)) {
    mkdir($INSTALLATIONS_DIR, 0755, true);
}

function generateSlug($title) {
    $slug = strtolower($title);
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    $slug = trim($slug, '-');
    return $slug;
}

function sanitizeFilename($filename) {
    $info = pathinfo($filename);
    $name = preg_replace('/[^a-zA-Z0-9_-]/', '', $info['filename']);
    $extension = strtolower($info['extension']);
    return $name . '.' . $extension;
}

function uploadImages($files) {
    global $UPLOADS_DIR;
    $uploadedFiles = [];
    
    foreach ($files as $file) {
        if ($file['error'] === UPLOAD_ERR_OK) {
            $originalName = sanitizeFilename($file['name']);
            $timestamp = time();
            $filename = $timestamp . '_' . $originalName;
            $destination = $UPLOADS_DIR . $filename;
            
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                $uploadedFiles[] = $filename;
            }
        }
    }
    
    return $uploadedFiles;
}

function loadInstallationsJson() {
    global $INSTALLATIONS_JSON;
    
    if (!file_exists($INSTALLATIONS_JSON)) {
        return ['installations' => []];
    }
    
    $content = file_get_contents($INSTALLATIONS_JSON);
    return json_decode($content, true) ?: ['installations' => []];
}

function saveInstallationsJson($data) {
    global $INSTALLATIONS_JSON;
    
    // Create backup
    if (file_exists($INSTALLATIONS_JSON)) {
        copy($INSTALLATIONS_JSON, $INSTALLATIONS_JSON . '.backup.' . time());
    }
    
    $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    return file_put_contents($INSTALLATIONS_JSON, $jsonContent) !== false;
}

function generateInstallationPage($installation) {
    global $INSTALLATIONS_DIR, $TEMPLATE_FILE;
    
    // Load template
    if (!file_exists($TEMPLATE_FILE)) {
        throw new Exception('Template file not found');
    }
    
    $template = file_get_contents($TEMPLATE_FILE);
    
    // Generate slug for filename
    $slug = generateSlug($installation['title']);
    $filename = $slug . '.html';
    
    // Replace template placeholders
    $html = str_replace('{{TITLE}}', htmlspecialchars($installation['title']), $template);
    $html = str_replace('{{LOCATION}}', htmlspecialchars($installation['location']), $html);
    $html = str_replace('{{DATE}}', date('F j, Y', strtotime($installation['date'])), $html);
    
    // Generate description HTML
    $descriptionHtml = '';
    foreach ($installation['description'] as $paragraph) {
        $descriptionHtml .= '<p>' . htmlspecialchars($paragraph) . '</p>' . "\n                ";
    }
    $html = str_replace('{{DESCRIPTION}}', trim($descriptionHtml), $html);
    
    // Generate images HTML
    $imagesHtml = '';
    foreach ($installation['images'] as $index => $image) {
        $imagesHtml .= '<div class="installation-image">' . "\n";
        $imagesHtml .= '    <img src="../images/installations/' . htmlspecialchars($image) . '" alt="' . htmlspecialchars($installation['title']) . ' - Image ' . ($index + 1) . '">' . "\n";
        $imagesHtml .= '</div>' . "\n";
    }
    $html = str_replace('{{IMAGES}}', trim($imagesHtml), $html);
    
    // Add meta description
    $metaDescription = substr(strip_tags($installation['description'][0]), 0, 155) . '...';
    $html = str_replace('{{META_DESCRIPTION}}', htmlspecialchars($metaDescription), $html);
    
    // Save the file
    $filepath = $INSTALLATIONS_DIR . $filename;
    if (file_put_contents($filepath, $html) === false) {
        throw new Exception('Failed to create installation page');
    }
    
    return $filename;
}

function updateSitemap($newSlug) {
    $sitemapFile = 'installation-sitemap.txt';
    $newUrl = 'installations/' . $newSlug . '.html';
    
    if (file_exists($sitemapFile)) {
        $sitemap = file_get_contents($sitemapFile);
        if (strpos($sitemap, $newUrl) === false) {
            file_put_contents($sitemapFile, $sitemap . "\n" . $newUrl);
        }
    } else {
        file_put_contents($sitemapFile, $newUrl);
    }
}

// Main processing
try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST requests allowed');
    }
    
    // Validate required fields
    $required = ['title', 'location', 'date', 'application', 'descriptions'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    // Process uploaded images
    $imageFiles = [];
    foreach ($_FILES as $key => $file) {
        if (strpos($key, 'image_') === 0) {
            $imageFiles[] = $file;
        }
    }
    
    if (empty($imageFiles)) {
        throw new Exception('At least one image is required');
    }
    
    // Upload images
    $uploadedImages = uploadImages($imageFiles);
    if (empty($uploadedImages)) {
        throw new Exception('Failed to upload images');
    }
    
    // Parse descriptions
    $descriptions = json_decode($_POST['descriptions'], true);
    if (!$descriptions || !is_array($descriptions)) {
        throw new Exception('Invalid descriptions format');
    }
    
    // Create installation object
    $installation = [
        'title' => trim($_POST['title']),
        'location' => trim($_POST['location']),
        'date' => $_POST['date'],
        'application' => $_POST['application'],
        'description' => $descriptions,
        'images' => $uploadedImages
    ];
    
    // Load existing installations
    $data = loadInstallationsJson();
    
    // Add new installation to the beginning of the array (newest first)
    array_unshift($data['installations'], $installation);
    
    // Save updated JSON
    if (!saveInstallationsJson($data)) {
        throw new Exception('Failed to update installations database');
    }
    
    // Generate installation page
    $pageFilename = generateInstallationPage($installation);
    
    // Update sitemap
    $slug = generateSlug($installation['title']);
    updateSitemap($slug);
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Installation created successfully',
        'data' => [
            'filename' => $pageFilename,
            'slug' => $slug,
            'images_uploaded' => count($uploadedImages)
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>