const db = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');


exports.createArticle = async (req, res) => {
    try {
      const {
        judul,
        deskripsi,
        isi,
        penulis
        
      } = req.body;
      const files = req.files;
      const uploadPromises = [
        files.gambar_artikel ? cloudinary.uploader.upload(files.gambar_artikel[0].path) : null,
      ];
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(result => (result ? result.secure_url : null));

      Object.values(files).forEach(fileGroup => {
        fileGroup.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
      const [gambar_artikel] = imageUrls;
  
      const query = `
                 INSERT INTO artikel (judul, deskripsi, gambar_artikel, isi, penulis) VALUES (?, ?, ?, ?, ?)
      `;
  
      db.query(query, [judul,deskripsi,gambar_artikel,isi,penulis], (err, result) => {
        if (err) {
          throw err;
        }
        res.json({ message: 'artikel baru berhasil ditambahkan!', id: result.insertId });
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// READ
exports.getAllArticles = (req, res) => {
  const query = 'SELECT * FROM artikel';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.getArticleById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM artikel WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ message: 'Artikel not found' });
    }
    res.json(results[0]);
  });
};

// UPDATE
exports.updateArticle = (req, res) => {
  const { id } = req.params;
  const { judul } = req.body;
  const query = 'UPDATE artikel SET judul = ? WHERE id = ?';
  db.query(query, [judul, id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artikel not found' });
    }
    res.json({ message: 'Artikel updated!' });
  });
};

// DELETE
exports.deleteArticle = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM artikel WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artikel not found' });
    }
    res.json({ message: 'Artikel deleted!' });
  });
};