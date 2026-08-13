const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection ready. Executing commands...');
  
  const cmd = 'cd /var/www/greentech && git fetch origin && git reset --hard origin/main && npm install && pm2 restart greentech';
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '64.118.137.163',
  port: 22,
  username: 'root',
  password: '@Vaishu2'
});
