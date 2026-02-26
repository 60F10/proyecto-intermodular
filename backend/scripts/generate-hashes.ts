import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const saltRounds = 10;

    const [h1, h2, h3] = await Promise.all([
        bcrypt.hash('SuperAdmin2026!', saltRounds),
        bcrypt.hash('Admin2026!', saltRounds),
        bcrypt.hash('Usuario2026!', saltRounds),
    ]);

    console.log('SUPERADMIN_HASH:', h1);
    console.log('ADMIN_HASH:', h2);
    console.log('USER_HASH:', h3);

    const outputPath = path.join(__dirname, '../../scripts/db/hashes.txt');
    fs.writeFileSync(outputPath, `SUPERADMIN:${h1}\nADMIN:${h2}\nUSER:${h3}\n`, 'utf8');
    console.log(`Hashes written to ${outputPath}`);
}

main().catch(console.error);
