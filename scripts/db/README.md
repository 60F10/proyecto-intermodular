# Database Scripts

## Seed Data

El archivo `002_seed.sql` contiene datos iniciales para desarrollo y testing.

### Usuarios de Desarrollo

Todos los usuarios tienen la misma contraseña para facilitar el desarrollo:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `jefe@lovelace.local` | `lovelace` | SUPERADMIN |
| `profe@lovelace.local` | `lovelace` | ADMIN |
| `alumno@lovelace.local` | `lovelace` | USER |

### Generar Nuevos Hashes de Contraseña

Si necesitas crear nuevos usuarios o cambiar contraseñas en el seed:

1. Ejecuta el script de generación de hashes:
   ```bash
   cd backend
   npx ts-node scripts/generate-hashes.ts
   ```

2. O genera un hash manualmente en Node.js:
   ```javascript
   const bcrypt = require('bcrypt');
   const hash = await bcrypt.hash('tu_contraseña', 10);
   console.log(hash);
   ```

3. Copia el hash generado al archivo `002_seed.sql`

### Aplicar el Seed

Desde la raíz del proyecto:

```bash
docker exec -i lovelace_db psql -U lovelace -d lovelace < scripts/db/002_seed.sql
```

## Notas de Seguridad

⚠️ **IMPORTANTE**: Las contraseñas en este seed son solo para desarrollo local. 
**NUNCA** uses estas credenciales en producción.
