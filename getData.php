<?php
header('Content-Type: application/json');

// Database credentials
$host = "sql12.freesqldatabase.com";
$dbUsername = "sql12741552";
$dbPassword = "zLjFxXwNW8";
$dbname = "sql12741552";

// Create connection
$conn = new mysqli($host, $dbUsername, $dbPassword, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


// Fetch Year and P data ordered by Year
$sql = "SELECT Year, P, R, PE, RLONG, CPI FROM Investment ORDER BY Year ASC";
$result = $conn->query($sql);

$data = ['years' => [], 'p_values' => [], 'pe_values' => [], 'r_values' => [],'rLong_values' => [], 'cpi_values' => []];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data['years'][] = $row['Year']; // Assuming there's a 'year' column
        $data['p_values'][] = $row['P'];
        $data['pe_values'][] = $row['PE'];
        $data['r_values'][] = $row['R'];
        $data['rLong_values'][] = $row['RLONG'];
        $data['cpi_values'][] = $row['CPI'];
    }
} else {
    $data['error'] = 'No data found';
}

// Close the connection
$conn->close();
header('Content-Type: application/json');
// Return data as JSON
echo json_encode($data);
?>