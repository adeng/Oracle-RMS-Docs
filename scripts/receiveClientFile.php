<?php
    // This handles file upload
    $upload_dir = '../uploads';

    // Cleanup old working files
    foreach(glob("$upload_dir/working/*") as $oldfname) {
        unlink("$upload_dir/working/" . basename($oldfname));
    }

    foreach(glob("$upload_dir/format/*") as $oldfmtname) {
        unlink("$upload_dir/working/" . basename($oldfmtname));
    }
    
    $file_name = basename($_FILES['file']['name']);
    $file_tmp_name = $_FILES['file']['tmp_name'];
    
    if(!move_uploaded_file($file_tmp_name, "$upload_dir/$file_name")) {
        echo "Failed to move zip file\n";
        return;
    }
    
    // This is for unzipping the uploaded file
    $zip = new ZipArchive();
    $res = $zip->open("$upload_dir/$file_name");
    if($res === TRUE) {
        $zip->extractTo("$upload_dir/working");
        $zip->close();
    } else {
        die("Failed to unzip file\n");
    }
    unlink("$upload_dir/$file_name");
    
    // Establish database connection
    // Yes, PW is hardcoded - someone should really fix this at some point :) 
    try {
        $conn = new PDO("sqlsrv:server = tcp:oracle-rms.database.windows.net,1433; Database = oracle-rms-docs", "rmsadmin", "CorrectHorse$4257");
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $e) {
        print("Error connecting to SQL Server.");
        die(print_r($e));
    }
    
    // SQL Server Extension Sample Code:
    $connectionInfo = array("UID" => "rmsadmin@oracle-rms", "pwd" => "CorrectHorse$4257", "Database" => "oracle-rms-docs", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
    $serverName = "tcp:oracle-rms.database.windows.net,1433";
    $conn = sqlsrv_connect($serverName, $connectionInfo);
    
    $schema_name = $_POST["schema"];
    $schema_sql = "IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = '$schema_name') BEGIN EXEC('CREATE SCHEMA [$schema_name] AUTHORIZATION [dbo];') END";
    $schema_query = sqlsrv_query($conn, $schema_sql);
    if(!$schema_sql) {
        die("\Failed to create schema $schema_name");
    }

    // This is for handling unzipped files
    foreach(glob("$upload_dir/working/*") as $fname) {
        // For each non-directory item (basically files)
        if(!is_dir($fname)) {
            $file = fopen("$fname", "r");
            $headers = fgetcsv($file);
            $table_name = substr(basename($fname), 0, strlen(basename($fname)) - 4);
            
            // Create FMT file for BCP
            if(file_exists("$upload_dir/format/$table_name.fmt"))
                unlink("$upload_dir/format/$table_name.fmt");
            
            $fmt_file = fopen("$upload_dir/format/$table_name.fmt", "w") or die ("Unable to create FMT file");
            fwrite($fmt_file, "9.0\n");
            fwrite($fmt_file, (count($headers) + 1) . "\n");
            fwrite($fmt_file, '1        SQLCHAR       0       1      "\""                 0     Quote1                         SQL_Latin1_General_CP1_CI_AS' . "\n");
            
            // Create SQL command for creating table
            $header_sql = "CREATE TABLE [$schema_name].[$table_name] (";
            
            // All varchar because I am lazy
            $i = 0;
            $a = 2;
            $b = 1;
            foreach($headers as $header) {
                $delim = ($i == count($headers) - 1 ? '"\"\\r\\n"' : '"\",\""'); 
                $row = $a . '        SQLCHAR       0       255    ' . $delim . '              ' . $b . '     ' . $header . '                           SQL_Latin1_General_CP1_CI_AS' . "\n";
                fwrite($fmt_file, $row);
                
                $header_sql .= "$header VARCHAR(MAX) NULL";
                $header_sql .= ($i == count($headers) - 1 ? "" : ", ");

                $i++;
                $a++;
                $b++;
            }
            fclose($fmt_file);
            
            $header_sql .= ");"; 
            
            // Milestone update: I spent the past 15 minutes trying to figure out why my 
            // code didn't work: I had a $ in front of my sqlsrv_query :| 
            $table_query = sqlsrv_query($conn, $header_sql);
            if(!$table_query) {
                die("\nFailed to create table $table_name");
            }

            // Skip LoginHistory
            // if($table_name != "LoginHistory") {
            //     $bcp = shell_exec("bcp [oracle-rms-docs].[$schema_name].[$table_name] IN $upload_dir/working/$table_name.csv -S pwc-ssa-1.database.windows.net -U ssadmin@pwc-ssa-1 -P Password2 -f $upload_dir/format/$table_name.fmt -F2");
            //     if(!$bcp) {
            //         die("\nFailed on batch upload");
            //     }                
            // }
            // echo "\nSuccessfully uploaded data into table $table_name";
            
            // Clean up
            fclose($file);
        }
    }
    
    sqlsrv_close($conn);

    echo "Tables updated. Tables created under schema '$schema_name'"
?>
