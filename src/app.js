const express = require('express');
const cors = require('cors');
const wisatakulinerRoutes = require('./routes/routeswisatakuliner');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Mengimpor konfigurasi database
const path = require('path'); 

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', wisatakulinerRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});




const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// const express = require('express');
// const cors = require('cors');
// const wisatakulinerRoutes = require('./routes/routeswisatakuliner');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const db = require('./config/db'); // Menggunakan pool koneksi yang telah diperbarui
// const path = require('path');

// dotenv.config();

// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// app.use('/api', wisatakulinerRoutes);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Middleware penanganan kesalahan
// app.use((err, req, res, next) => {
//   console.error('Exception Tidak Tertangkap:', err);
//   res.status(500).json({ error: 'Kesalahan Internal Server' });
// });

// const PORT = process.env.PORT || 8000;
// const server = app.listen(PORT, () => {
//   console.log(`Server berjalan di port ${PORT}`);
// });

// // Tangani pengecualian yang tidak tertangkap dan matikan server dengan baik
// process.on('uncaughtException', (err) => {
//   console.error('Exception Tidak Tertangkap:', err);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on('SIGTERM', () => {
//   console.log('Sinyal SIGTERM diterima. Menutup server HTTP.');
//   server.close(() => {
//     console.log('Server HTTP telah ditutup.');
//     process.exit(0);
//   });
// });
