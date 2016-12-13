<?php 
    $risk_no = $_POST["risk_no"];
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
    $sql = "SELECT * FROM [reim].[riskmatrix] AS rm WHERE rm.Risk_No = '$risk_no'";
    $stmt = sqlsrv_query($conn, $sql);
    if(!$stmt) {
        die(print_r(sqlsrv_errors(), true));
    }

    $result = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    $csid = $result['Control_Solution_ID'];
    
    $sql = "SELECT cs.Control_ID, rcm.Control_Description FROM [reim].controlsolutions AS cs INNER JOIN [reim].rcm AS rcm ON cs.Control_ID = rcm.Control_ID WHERE cs.Control_Solution_ID = '$csid'";
    $stmt2 = sqlsrv_query($conn, $sql);
    if(!$stmt2) {
        die(print_r(sqlsrv_errors(), true));
    }

    $controls = array();

    while($row = sqlsrv_fetch_array($stmt2, SQLSRV_FETCH_ASSOC)) {
        $result = array($row['Control_ID'], $row['Control_Description']);
        array_push($controls, $result);
    }

    $result['Control_ID'] = $controls;

    sqlsrv_close($conn);
    echo json_encode($result);
?>