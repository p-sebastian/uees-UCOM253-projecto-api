const sql = require('mysql2/promise');
const Client = require('ssh2').Client;
const ssh = new Client();
const {
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_PORT_TO_OPEN,
  DB_USER,
  SSH_HOST,
  SSH_PASSWORD,
  SSH_USERNAME
} = require('./config');

module.exports = new Promise((resolve, reject) => {
  ssh.on('ready', () => {
    ssh.forwardOut(
      // from local
      '127.0.0.1',
      DB_PORT_TO_OPEN,
      // to ext local
      '127.0.0.1',
      DB_PORT,
      (err, stream) => {
        if (err) {
          return reject(err);
        }
        sql.createConnection({
          host: '127.0.0.1',
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME,
          stream
        })
        .then(resolve)
        .catch(reject);
      }
    );
  }).connect({
    host: SSH_HOST,
    port: 22,
    username: SSH_USERNAME,
    password: SSH_PASSWORD
  });
});