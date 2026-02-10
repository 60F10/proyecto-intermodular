@echo off
echo Reiniciando la base de datos...
docker compose -f ../../docker-compose.yml down -v
docker compose -f ../../docker-compose.yml up -d
echo Esperando estabilidad..
timeout /t 5
call apply-schema.bat
call apply-seed.bat
pause