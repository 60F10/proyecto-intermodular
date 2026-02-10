@echo off 
docker exec -i lovelace_db psql -U lovelace -d lovelace < 002_seed.sql
pause