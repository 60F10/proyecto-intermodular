@echo off
pushd %~dp0
docker exec -i lovelace_db psql -U lovelace -d lovelace < 003_suppliers.sql
popd
pause