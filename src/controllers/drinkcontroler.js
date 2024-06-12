const db = require('../config/db');

exports.createDrink = (req, res) => {
    const { wisata_kuliner_id, nama_minuman, harga } = req.body;
    const query = 'INSERT INTO minuman (wisata_kuliner_id, nama_minuman, harga) VALUES (?, ?, ?)';
    db.query(query, [wisata_kuliner_id, nama_minuman, harga], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Drink created!', id: result.insertId });
    });
};

exports.getDrinksBywisatakulinerId = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM minuman WHERE wisata_kuliner_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
};

exports.updateDrink = (req, res) => {
    const { id } = req.params;
    const { nama_minuman, harga } = req.body;
    const query = 'UPDATE minuman SET nama_minuman = ?, harga = ? WHERE id = ?';
    db.query(query, [nama_minuman, harga, id], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Drink not found' });
        }
        res.json({ message: 'Drink updated!' });
    });
};
exports.deleteDrink = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM minuman WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Drink not found' });
        }
        res.json({ message: 'Drink deleted!' });
    });
};
