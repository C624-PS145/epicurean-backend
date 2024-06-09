const db = require('../config/db');

exports.createFood = (req, res) => {
    const { wisata_kuliner_id, nama_makanan, harga } = req.body;
    const query = 'INSERT INTO makanan (wisata_kuliner_id, nama_makanan, harga) VALUES (?, ?, ?)';
    db.query(query, [wisata_kuliner_id, nama_makanan, harga], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Makanan berhasil ditambahkan!', id: result.insertId });
    });
};

// READ Foods by wisatakuliner ID
exports.getFoodsBywisatakulinerId = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM makanan WHERE wisata_kuliner_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
};

// UPDATE Food
exports.updateFood = (req, res) => {
    const { id } = req.params;
    const { nama_makanan, harga } = req.body;
    const query = 'UPDATE makanan SET nama_makanan = ?, harga = ? WHERE id = ?';
    db.query(query, [nama_makanan, harga, id], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.json({ message: 'Food updated!' });
    });
};

// DELETE Food
exports.deleteFood = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM makanan WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.json({ message: 'Food deleted!' });
    });
};



