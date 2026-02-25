// Script para generar hashes bcrypt y escribirlos a archivo
const bcrypt = require('C:\\Users\\Raul\\Documents\\Proyecto_Lovelace_Fork_Raul\\proyecto-intermodular\\backend\\node_modules\\bcryptjs');
const fs = require('fs');

console.log('bcryptjs version:', bcrypt.getRounds ? 'ok' : 'loaded');

(async function () {
    try {
        const [h1, h2, h3] = await Promise.all([
            bcrypt.hash('SuperAdmin2026!', 10),
            bcrypt.hash('Admin2026!', 10),
            bcrypt.hash('Usuario2026!', 10),
        ]);

        const content = 'SUPERADMIN:' + h1 + '\nADMIN:' + h2 + '\nUSER:' + h3 + '\n';

        fs.writeFileSync(
            'C:\\Users\\Raul\\Documents\\Proyecto_Lovelace_Fork_Raul\\proyecto-intermodular\\scripts\\db\\hashes.txt',
            content,
            'utf8'
        );

        process.stdout.write('DONE\n');
        process.stdout.write(content);
        process.exit(0);
    } catch (e) {
        fs.writeFileSync(
            'C:\\Users\\Raul\\Documents\\Proyecto_Lovelace_Fork_Raul\\proyecto-intermodular\\scripts\\db\\hashes-error.txt',
            String(e),
            'utf8'
        );
        process.stderr.write('ERROR: ' + String(e) + '\n');
        process.exit(1);
    }
})();
