const express = require('express');
const cors = require('cors');
const wisatakulinerRoutes = require('./routes/routeswisatakuliner');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('./config/db'); 
const path = require('path'); 

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', wisatakulinerRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
