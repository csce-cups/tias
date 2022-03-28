param (
    [String] $pguser,
    [String] $pghost,
    [String] $pgpassword,
    [String] $pgdatabase,
    [System.Int16] $pgport,
    [String] $prog
)

$env:PGUSER = $pguser
$env:PGHOST = $pghost
$env:PGPASSWORD = $pgpassword
$env:PGDATABASE = $pgdatabase
$env:PGPORT = $pgport

node $prog

Remove-Item Env:\PGUSER
Remove-Item Env:\PGHOST
Remove-Item Env:\PGPASSWORD
Remove-Item Env:\PGDATABASE
Remove-Item Env:\PGPORT
