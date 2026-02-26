$scriptContent = @'
const bcrypt = require('bcryptjs');
const fs = require('fs');

Promise.all([
  bcrypt.hash('SuperAdmin2026!', 10),
  bcrypt.hash('Admin2026!', 10),
  bcrypt.hash('Usuario2026!', 10)
]).then(([h1, h2, h3]) => {
  const out = `SUPERADMIN:${h1}\nADMIN:${h2}\nUSER:${h3}\n`;
  fs.writeFileSync('C:\\\\Users\\\\Raul\\\\Documents\\\\Proyecto_Lovelace_Fork_Raul\\\\proyecto-intermodular\\\\scripts\\\\db\\\\hashes.txt', out);
});
'@

$scriptContent | Out-File -FilePath "C:\Users\Raul\Documents\Proyecto_Lovelace_Fork_Raul\proyecto-intermodular\scripts\db\gen.js" -Encoding UTF8

Set-Location "C:\Users\Raul\Documents\Proyecto_Lovelace_Fork_Raul\proyecto-intermodular\backend"
$result = Start-Process -FilePath "node" -ArgumentList "..\scripts\db\gen.js" -Wait -NoNewWindow -PassThru
Write-Host "Exit code: $($result.ExitCode)"
