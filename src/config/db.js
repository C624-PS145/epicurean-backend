// const mysql = require('mysql2');
// require('dotenv').config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT
// });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to the database!');
// });

// module.exports = connection;


const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('connection', (connection) => {
  console.log('Terhubung ke database!');
  connection.on('error', (err) => {
    console.error('Kesalahan koneksi MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ETIMEDOUT') {
      // Tangani rekoneksi
      handleDisconnect();
    } else {
      throw err;
    }
  });
});

function handleDisconnect() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Kesalahan saat mencoba menghubungkan kembali ke database:', err);
      setTimeout(handleDisconnect, 2000); // Coba lagi setelah 2 detik
    } else if (connection) {
      console.log('Berhasil menghubungkan kembali ke database!');
      connection.release();
    }
  });
}

module.exports = pool;
