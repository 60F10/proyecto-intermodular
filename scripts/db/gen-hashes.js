const bcrypt = require('bcryptjs');
const fs = require('fs');

const passwords = [
    { label: 'SUPERADMIN', password: 'SuperAdmin2026!' },
    { label: 'ADMIN', password: 'Admin2026!' },
    { label: 'USER', password: 'Usuario2026!' },
];

const saltRounds = 10;

Promise.all(
    passwords.map(({ label, password }) =>
        bcrypt.hash(password, saltRounds).then((hash) => `${label}: ${hash}`)
    )
)
    .then((results) => {
        const output = results.join('\n');
        fs.writeFileSync('hashes-output.txt', output, 'utf8');
        console.log('Hashes written to hashes-output.txt');
        console.log(output);
    })
    .catch((err) => {
        fs.writeFileSync('hashes-error.txt', String(err), 'utf8');
        console.error(err);
    });
