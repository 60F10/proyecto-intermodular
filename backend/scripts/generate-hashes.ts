import * as bcrypt from 'bcrypt';

async function generateHashes() {
    const passwords = {
        superadmin: 'lovelace',
        admin: 'lovelace',
        user: 'lovelace'
    };

    console.log('Generating bcrypt hashes for seed data...\n');

    for (const [role, password] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`${role}:`);
        console.log(`  Password: ${password}`);
        console.log(`  Hash: ${hash}\n`);
    }
}

generateHashes();
