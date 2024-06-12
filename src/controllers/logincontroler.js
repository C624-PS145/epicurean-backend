const db = require('../config/db');

const login = (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM adminepicurean WHERE nama = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
};

module.exports = {
    login
};