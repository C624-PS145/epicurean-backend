const db = require('../config/db');

exports.createReview = (req, res) => {
    const { nama_pengulas, ulasan, rating } = req.body;
    const wisata_kuliner_id = req.params.id;
    const query = 'INSERT INTO ulasan (wisata_kuliner_id, nama_pengulas, ulasan, rating) VALUES (?, ?, ?, ?)';
    db.query(query, [wisata_kuliner_id, nama_pengulas, ulasan, rating], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Ulasan berhasil ditambahkan!', id: result.insertId });
    });
};
