<?php
$Uname = isset($_GET['Uname']) ? $_GET['Uname'] : '';
$pwd = isset($_GET['pwd']) ? $_GET['pwd'] : '';

if (!empty($Uname) && !empty($pwd)) {
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

    // Prepare an SQL statement to check if the user exists
    $stmt = $conn->prepare("SELECT * FROM account WHERE Uname = ? AND pwd = ?");
    $stmt->bind_param("ss", $Uname, $pwd);

    // Execute the query
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if a matching user is found
    if ($result->num_rows > 0) {
        echo "Welcome to our Dashboard";
        header("Location: dashBoard.html");
    } else {
        echo "Invalid username or password";
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
}
?>
