@echo off 
docker exec -i lovelace_db psql -U lovelace -d lovelace < 001_init.sql
pause