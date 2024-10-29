<?php
$Fname = $_POST['Fname'];
$Lname = $_POST['Lname'];
$Uname = $_POST['Uname'];
$pwd = $_POST['pwd'];

if (!empty($Uname) && !empty($pwd) && !empty($Fname) && !empty($Lname)) {
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

    // Prepare an SQL statement to insert data
    $stmt = $conn->prepare("INSERT INTO account (Fname,Lname,Uname,pwd) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $Fname, $Lname, $Uname, $pwd);

    // Execute the query
    if ($stmt->execute()) {
        echo "New record created successfully";
        header("Location: index.html");
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
}
