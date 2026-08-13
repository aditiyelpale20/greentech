const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
conn.on('ready', () => {
  console.log('SUCCESS: Connected via SSH Key! Executing reset & restart...');
  
  const cmd = 'cd /var/www/greentech && git fetch origin && git reset --hard origin/main && npm install && pm2 restart greentech';
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Remote execution finished with code: ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error('SSH CONNECTION ERROR:', err.message);
}).connect({
  host: '64.118.137.163',
  port: 22,
  username: 'root',
  privateKey: fs.readFileSync('C:\\Users\\Anuj\\.ssh\\id_ed25519')
});
