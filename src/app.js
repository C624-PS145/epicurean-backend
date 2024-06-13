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


// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('/documentation', (req, res) => {
  // Proxy the request to Postman
  request('https://documenter.getpostman.com/view/34962953/2sA3XPEPE8', (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(500).send('Error fetching documentation');
    }
  });
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
