const express = require('express');
const cors = require('cors');
const wisatakulinerRoutes = require('./routes/routeswisatakuliner');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Mengimpor konfigurasi database

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


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
