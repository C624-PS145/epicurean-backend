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
        // Setelah berhasil insert, hitung rating_avg dan update di tabel wisata_kuliner
        updateRatingAverage(wisata_kuliner_id, res);
    });
};

exports.getReviewsByWisataKulinerId = (req, res) => {
    const wisata_kuliner_id = req.params.id;
    const query = 'SELECT * FROM ulasan WHERE wisata_kuliner_id = ?';
    db.query(query, [wisata_kuliner_id], (err, results) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
};

exports.deleteReview = (req, res) => {
    const review_id = req.params.id;
    const queryGetWisataKulinerId = 'SELECT wisata_kuliner_id FROM ulasan WHERE id = ?';
    db.query(queryGetWisataKulinerId, [review_id], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.length === 0) {
            console.error('Error: Review tidak ditemukan');
            return res.status(404).json({ message: 'Review not found' });
        }
        const wisata_kuliner_id = result[0].wisata_kuliner_id;
        
        const deleteQuery = 'DELETE FROM ulasan WHERE id = ?';
        db.query(deleteQuery, [review_id], (err, result) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Review not found' });
            }

            // Setelah berhasil delete, hitung rating_avg dan update di tabel wisata_kuliner
            updateRatingAverage(wisata_kuliner_id, res);
        });
    });
};


exports.deleteAllReviewsByWisataKulinerId = (req, res) => {
    const wisata_kuliner_id = req.params.id;
    const query = 'DELETE FROM ulasan WHERE wisata_kuliner_id = ?';
    db.query(query, [wisata_kuliner_id], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        // Setelah berhasil delete, hitung rating_avg dan update di tabel wisata_kuliner
        updateRatingAverage(wisata_kuliner_id, res);
    });
};

// Fungsi untuk menghitung rating_avg dan update di tabel wisata_kuliner
function updateRatingAverage(wisata_kuliner_id, res) {
    const query = 'SELECT AVG(rating) AS rating_avg FROM ulasan WHERE wisata_kuliner_id = ?';
    db.query(query, [wisata_kuliner_id], (err, result) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        const newRatingAvg = result[0].rating_avg || 0; // Jika tidak ada ulasan, atur rating_avg ke 0
        const updateQuery = 'UPDATE wisata_kuliner SET rating_avg = ? WHERE id = ?';
        db.query(updateQuery, [newRatingAvg, wisata_kuliner_id], (err, result) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json({ message: 'Rating updated successfully' });
        });
    });
}
