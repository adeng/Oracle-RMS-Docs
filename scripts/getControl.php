<?php 
    $app = $_POST["app"];
    $process = $_POST["process"];
    $control = $_POST["controlid"];
    try {
        $conn = new PDO("sqlsrv:server = tcp:oracle-rms.database.windows.net,1433; Database = oracle-rms-docs", "rmsadmin", "CorrectHorse$4257"); 
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $e) {
        print("Error connecting to SQL Server.");
        die(print_r($e));
    }

    $connectionInfo = array("UID" => "rmsadmin@oracle-rms", "pwd" => "CorrectHorse$4257", "Database" => "oracle-rms-docs", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
    $serverName = "tcp:oracle-rms.database.windows.net,1433";
    $conn = sqlsrv_connect($serverName, $connectionInfo);

    // Change this when you can 
    $sql = "SELECT * FROM [reim].[rcm] WHERE Control_ID = '$control'";
    $stmt = sqlsrv_query($conn, $sql);
    if(!$stmt) {
        die(print_r(sqlsrv_errors(), true));
    }

    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC));

    sqlsrv_close($conn);
    echo json_encode($row);
?>