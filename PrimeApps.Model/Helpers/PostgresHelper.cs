using System;using System.Diagnostics;using System.IO;using System.Runtime.InteropServices;using Microsoft.AspNetCore.Hosting;using Microsoft.Extensions.Configuration;using Newtonsoft.Json.Linq;using Npgsql;namespace PrimeApps.Model.Helpers{    public static class PostgresHelper    {        public static void Create(string connectionString, string databaseName, string postgresPath, string logDirectory = "", string locale = "")        {            var npgsqlConnection = new NpgsqlConnectionStringBuilder(connectionString);            Environment.SetEnvironmentVariable("PGPASSWORD", npgsqlConnection.Password);            if (string.IsNullOrEmpty(databaseName))                databaseName = npgsqlConnection.Database;            npgsqlConnection.KeepAlive = 1;                        var fileName = !string.IsNullOrEmpty(postgresPath) ? Path.Combine(postgresPath, "createdb") : "createdb";            var localeStr = !string.IsNullOrEmpty(locale) ? $"--lc-ctype={locale} --lc-collate={locale}" : "";            var arguments = $"-h {npgsqlConnection.Host} -U {npgsqlConnection.Username} -p {npgsqlConnection.Port} --template=template0 --encoding=UTF8 {localeStr} {databaseName}";            var psi = new ProcessStartInfo();            psi.FileName = fileName;            psi.Arguments = arguments;            psi.UseShellExecute = false;            psi.CreateNoWindow = true;            psi.RedirectStandardOutput = true;            psi.RedirectStandardError = true;            using (var process = Process.Start(psi))            {                using (var reader = process.StandardError)                {                    if (!string.IsNullOrEmpty(logDirectory))                    {                        var path = Path.Combine(logDirectory, $"{databaseName}_create.log");                        var sw = new StreamWriter(path);                        sw.WriteLine(reader.ReadToEnd());                        sw.Close();                    }                }                process.WaitForExit();                process.Close();            }        }        public static void Drop(string connectionString, string databaseName, string postgresPath, string logDirectory = "", bool ifExist = true)        {            var npgsqlConnection = new NpgsqlConnectionStringBuilder(connectionString);            Environment.SetEnvironmentVariable("PGPASSWORD", npgsqlConnection.Password);            if (string.IsNullOrEmpty(databaseName))                databaseName = npgsqlConnection.Database;            npgsqlConnection.KeepAlive = 1;                        var fileName = !string.IsNullOrEmpty(postgresPath) ? Path.Combine(postgresPath, "dropdb") : "dropdb";            var exists = !ifExist ? "--if-exists" : "";            var arguments = $"-h {npgsqlConnection.Host} -U {npgsqlConnection.Username} -p {npgsqlConnection.Port} {exists} {databaseName}";            var psi = new ProcessStartInfo();            psi.FileName = fileName;            psi.Arguments = arguments;            psi.UseShellExecute = false;            psi.CreateNoWindow = true;            psi.RedirectStandardOutput = true;            psi.RedirectStandardError = true;            using (var process = Process.Start(psi))            {                using (var reader = process.StandardError)                {                    if (!string.IsNullOrEmpty(logDirectory))                    {                        var path = Path.Combine(logDirectory, $"{databaseName}_drop.log");                        var sw = new StreamWriter(path);                        sw.WriteLine(reader.ReadToEnd());                        sw.Close();                    }                }                process.WaitForExit();                process.Close();            }        }        public static bool Dump(string connectionString, string databaseName, string postgresPath, string dumpDirectory, string logDirectory = "")        {            var npgsqlConnection = new NpgsqlConnectionStringBuilder(connectionString);            Environment.SetEnvironmentVariable("PGPASSWORD", npgsqlConnection.Password);            if (string.IsNullOrEmpty(databaseName))                databaseName = npgsqlConnection.Database;            npgsqlConnection.KeepAlive = 1;                        var dumpFile = Path.Combine(dumpDirectory, $"{databaseName}.bak");            if (File.Exists(dumpFile))                File.Delete(dumpFile);            var fileName = !string.IsNullOrEmpty(postgresPath) ? Path.Combine(postgresPath, "pg_dump") : "pg_dump";            string arguments;            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))                arguments = $" -h {npgsqlConnection.Host} -p {npgsqlConnection.Port} -U {npgsqlConnection.Username} -Fc -d {databaseName} -f  \"{dumpFile}\" -n public --encoding=utf-8 --if-exists --clean --no-acl --no-owner";            else                arguments = $"-h {npgsqlConnection.Host} -U {npgsqlConnection.Username} -p {npgsqlConnection.Port} -Fc {databaseName} -f {dumpFile} --if-exists --clean --no-acl --no-owner";            var psi = new ProcessStartInfo();            psi.FileName = fileName;            psi.Arguments = arguments;            psi.UseShellExecute = false;            psi.CreateNoWindow = true;            psi.RedirectStandardInput = true;            psi.RedirectStandardOutput = true;            psi.RedirectStandardError = true;            try            {                using (var process = Process.Start(psi))                {                    using (var reader = process.StandardError)                    {                        if (!string.IsNullOrEmpty(logDirectory))                        {                            var path = Path.Combine(logDirectory, $"{databaseName}_dump.log");                            var sw = new StreamWriter(path);                            sw.WriteLine(reader.ReadToEnd());                            sw.Close();                        }                    }                    process.WaitForExit();                    process.Close();                }                return true;            }            catch (Exception ex)            {                ErrorHandler.LogError(ex, "PostgresHelper dump method eror.");                return false;            }        }        public static bool Restore(string connectionString, string databaseName, string postgresPath, string dumpDirectory, string targetDatabaseName = "", string logDirectory = "")        {            var npgsqlConnection = new NpgsqlConnectionStringBuilder(connectionString);            Environment.SetEnvironmentVariable("PGPASSWORD", npgsqlConnection.Password);            if (string.IsNullOrEmpty(databaseName))                databaseName = npgsqlConnection.Database;                        npgsqlConnection.KeepAlive = 1;            var dumpFile = Path.Combine(dumpDirectory, $"{databaseName}.bak");            var fileName = !string.IsNullOrEmpty(postgresPath) ? Path.Combine(postgresPath, "pg_restore") : "pg_restore";            if (string.IsNullOrEmpty(targetDatabaseName))                targetDatabaseName = databaseName;            string arguments;            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))                arguments = $" -h {npgsqlConnection.Host} -U {npgsqlConnection.Username} -p {npgsqlConnection.Port} --no-owner --role=postgres -d {targetDatabaseName} \"{dumpFile}\"";            else                arguments = $"-h {npgsqlConnection.Host} -U {npgsqlConnection.Username} -p {npgsqlConnection.Port} --no-owner --role=postgres -Fc -d {targetDatabaseName} {dumpFile}";            /*using (var conn = new NpgsqlConnection(npgsqlConnection.ToString()))            {                var file = new FileInfo(dumpFile);                var script = file.OpenText().ReadToEnd();                var m_createdb_cmd = new NpgsqlCommand(script, conn);                conn.Open();                m_createdb_cmd.ExecuteNonQuery();                conn.Close();            }*/            var psi = new ProcessStartInfo();            psi.FileName = fileName;            psi.Arguments = arguments;            psi.UseShellExecute = false;            psi.CreateNoWindow = true;            psi.RedirectStandardOutput = true;            psi.RedirectStandardError = true;            try            {                using (var process = Process.Start(psi))                {                    using (var reader = process.StandardError)                    {                        if (!string.IsNullOrEmpty(logDirectory))                        {                            var path = Path.Combine(logDirectory, $"{databaseName}_restore.log");                            var sw = new StreamWriter(path);                            sw.WriteLine(reader.ReadToEnd());                            sw.Close();                        }                    }                    process.WaitForExit();                    process.Close();                    return true;                }            }            catch (Exception ex)            {                ErrorHandler.LogError(ex, "PostgresHelper restore method eror.");                return false;            }        }        public static bool Run(string connectionString, string databaseName, string script, bool lastTry = false)        {            var npgsqlConnection = new NpgsqlConnectionStringBuilder(connectionString);            if (!string.IsNullOrEmpty(databaseName))                npgsqlConnection.Database = databaseName;            npgsqlConnection.KeepAlive = 1;            using (var conn = new NpgsqlConnection(npgsqlConnection.ToString()))            {                conn.Open();                using (var cmd = new NpgsqlCommand())                {                    cmd.Connection = conn;                    cmd.CommandText = script;                    try                    {                        cmd.ExecuteNonQuery();                        conn.Close();                        return true;                    }                    catch (PostgresException e)                    {                        if (lastTry)                        {                            ErrorHandler.LogError(e, $"PostgresHelper run method eror. Database : {databaseName}, Script: {script}, ConnectionString: {connectionString}");                            return false;                        }                                                var sql = script;                        if (e.SqlState == "55006")                        {                            Run(connectionString, databaseName, $"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '{databaseName}' AND pid <> pg_backend_pid();");                            return Run(connectionString, databaseName, sql, true);                        }                        else if (e.SqlState == "23503" || e.SqlState == "23505")                        {                            var tableName = PackageHelper.GetTableName(script);                            Run(connectionString, databaseName, $"SELECT SETVAL('{e.TableName}_id_seq', (SELECT MAX(id) + 1 FROM {e.TableName}));");                            return Run(connectionString, databaseName, sql, true);                        }                                                ErrorHandler.LogError(e, $"PostgresHelper run method eror. Database : {databaseName}, Script: {script}, ConnectionString: {connectionString}");                        return false;                    }                }            }        }        public static bool RunAll(string connectionString, string databaseName, string[] sqls)        {            var npgsqlConnection = new NpgsqlConnectionStringBuilder(connectionString);            if (!string.IsNullOrEmpty(databaseName))                npgsqlConnection.Database = databaseName;            npgsqlConnection.KeepAlive = 1;                        using (var conn = new NpgsqlConnection(npgsqlConnection.ToString()))            {                conn.Open();                NpgsqlTransaction transaction = conn.BeginTransaction();                using (var cmd = new NpgsqlCommand())                {                    cmd.Connection = conn;                    cmd.Transaction = transaction;                    try                    {                        foreach (var sql in sqls)                        {                            cmd.CommandText = sql;                            cmd.ExecuteNonQuery();                        }                        transaction.Commit();                        return true;                    }                    catch (PostgresException ex)                    {                        transaction.Rollback();                        ErrorHandler.LogError(ex, "PostgresHelper runAll method eror. Database name : " + databaseName);                        return false;                    }                    finally                    {                        conn.Close();                    }                }            }        }        public static dynamic Read(string connectionString, string databaseName, string script, string type)        {            var npgsqlConnection = new NpgsqlConnectionStringBuilder(connectionString);            if (!string.IsNullOrEmpty(databaseName))                npgsqlConnection.Database = databaseName;                        npgsqlConnection.KeepAlive = 1;            using (var conn = new NpgsqlConnection(npgsqlConnection.ToString()))            {                conn.Open();                using (var cmd = new NpgsqlCommand(script, conn))                {                    try                    {                        var result = cmd.ExecuteReader();                        switch (type)                        {                            case "array":                                return result.ResultToJArray();                            case "hasRows":                                return result.HasRows;                        }                        return result;                    }                    catch (Exception ex)                    {                        ErrorHandler.LogError(ex, "PostgresHelper read method eror.");                        return null;                    }                }            }        }        public static void Template(string connectionString, string databaseName)        {            var npgsqlConnectionString = new NpgsqlConnectionStringBuilder(connectionString);            npgsqlConnectionString.Database = "postgres";            npgsqlConnectionString.KeepAlive = 1;                        using (var connection = new NpgsqlConnection(npgsqlConnectionString.ToString()))            {                connection.Open();                using (var command = connection.CreateCommand())                {                    // Check database is exists                    command.CommandText = $"SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '{databaseName}');";                    var isExists = (bool)command.ExecuteScalar();                    // Terminate connections on new database                    command.CommandText = $"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname = '{databaseName}_new' and pid <> pg_backend_pid();";                    var result = command.ExecuteNonQuery();                    if (result > -1)                        throw new Exception($"Template database connections cannot be terminated. Database name: {databaseName}");                    // Set new database as template                    command.CommandText = $"UPDATE pg_database SET datistemplate=true, datallowconn=false WHERE datname='{databaseName}_new';";                    result = command.ExecuteNonQuery();                    if (result < 1)                        throw new Exception($"Template database cannot be set as a template database. Database name: {databaseName}");                    if (isExists)                    {                        // Rename existing database as old                        command.CommandText = $"ALTER DATABASE \"{databaseName}\" RENAME TO \"{databaseName}_old\";";                        result = command.ExecuteNonQuery();                        if (result > -1)                            throw new Exception($"Template database cannot be renamed as old. Database name: {databaseName}");                    }                    // Remove _new suffix from new database                    command.CommandText = $"ALTER DATABASE \"{databaseName}_new\" RENAME TO \"{databaseName}\";";                    result = command.ExecuteNonQuery();                    if (result > -1)                        throw new Exception($"New template database cannot be renamed as {databaseName}");                    if (isExists)                    {                        // Unset old database as template                        command.CommandText = $"UPDATE pg_database SET datistemplate=false WHERE datname='{databaseName}_old';";                        result = command.ExecuteNonQuery();                        /*if (result < 1)                            ErrorHandler.LogError(new Exception($"Template database (old) cannot be unset as template. Database name:{databaseName}"));                        */                        // Drop old database                        command.CommandText = $"DROP DATABASE \"{databaseName}_old\";";                        result = command.ExecuteNonQuery();                        /*if (result > -1)                            ErrorHandler.LogError(new Exception($"Template database (old) cannot be droped. Database name: {databaseName}"));                        */                    }                }                connection.Close();            }        }        public static bool CreateDatabaseIfNotExists(string connectionString, string dbName)        {            try            {                PostgresHelper.Run(connectionString, "postgres", $"DROP DATABASE IF EXISTS {dbName};");                PostgresHelper.Run(connectionString, "postgres", $"CREATE DATABASE {dbName};");                return true;            }            catch (Exception ex)            {                ErrorHandler.LogError(ex, "PostgresHelper CreateDatabaseIfNotExists method eror.");                return false;            }        }        public static bool CopyDatabase(string connectionString, string dbName, string scriptPath = null)        {            try            {                var sql = $"CREATE DATABASE {dbName}_copy WITH TEMPLATE {dbName};";                if (!string.IsNullOrEmpty(scriptPath))                    File.AppendAllText(scriptPath, sql + Environment.NewLine);                return PostgresHelper.Run(connectionString, "postgres", sql);            }            catch (Exception ex)            {                ErrorHandler.LogError(ex, "PostgresHelper CopyDatabase method eror.");                return false;            }        }        public static bool ChangeTemplateDatabaseStatus(string connectionString, string dbName, bool open = false)        {            try            {                JArray sqls;                if (!open)                {                    sqls = new JArray()                    {                        $"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '{dbName}' AND pid <> pg_backend_pid();",                        $"UPDATE pg_database SET datistemplate = TRUE WHERE datname = '{dbName}';",                        $"UPDATE pg_database SET datallowconn = FALSE WHERE datname = '{dbName}';"                    };                }                else                {                    sqls = new JArray()                    {                        $"UPDATE pg_database SET datistemplate = FALSE WHERE datname = '{dbName}';",                        $"UPDATE pg_database SET datallowconn = TRUE WHERE datname = '{dbName}';"                    };                }                foreach (var sql in sqls)                {                    PostgresHelper.Run(connectionString, "postgres", sql.ToString());                }                return true;            }            catch (Exception ex)            {                ErrorHandler.LogError(ex, "PostgresHelper ChangeTemplateDatabaseStatus method eror.");                return false;            }        }        public static bool SwapDatabase(string connectionString, string sourceDbName, string destinationDbName)        {            try            {                var result = RemoveTemplateDatabase(connectionString, destinationDbName);                if (result)                {                    try                    {                        PostgresHelper.Run(connectionString, "postgres", $"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '{sourceDbName}' AND pid <> pg_backend_pid();");                        PostgresHelper.Run(connectionString, "postgres", $"ALTER DATABASE {sourceDbName} RENAME TO {destinationDbName};");                        PostgresHelper.Run(connectionString, "postgres", $"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '{destinationDbName}' AND pid <> pg_backend_pid();");                        //ChangeTemplateDatabaseStatus(connectionString, destinationDbName, true);                    }                    catch (Exception)                    {                        return false;                    }                    return true;                }                return false;            }            catch (Exception ex)            {                ErrorHandler.LogError(ex, "PostgresHelper SwapDatabase method eror.");                return false;            }        }        public static bool RemoveTemplateDatabase(string connectionString, string dbName)        {            try            {                var result = PostgresHelper.Read(connectionString, "postgres", $"SELECT datname FROM pg_catalog.pg_database where datname='{dbName}'", "hasRows");                if (!result)                    return true;                                ChangeTemplateDatabaseStatus(connectionString, dbName, true);                PostgresHelper.Run(connectionString, "postgres", $"DROP DATABASE {dbName};");                return true;            }            catch (Exception ex)            {                ErrorHandler.LogError(ex, "PostgresHelper RemoveTemplateDatabase method eror.");                return false;            }        }        public static string GetPostgresBinaryPath(IConfiguration configuration, IHostingEnvironment hostingEnvironment)        {            var postgresPath = configuration.GetValue("AppSettings:PostgresPath", string.Empty);            if (string.IsNullOrWhiteSpace(postgresPath))            {                var root = Directory.GetParent(hostingEnvironment.ContentRootPath);                postgresPath = Path.Combine(root.FullName, "programs", "pgsql", "bin");            }            return postgresPath;        }    }}