const db = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');


exports.createWisatakuliner = async (req, res) => {
  try {
    const {
      nama_tempat,
      alamat,
      kabupaten,
      deskripsi,
      jam_operasional,
      link_wa,
      link_maps,
      fasilitas
    } = req.body;
    const files = req.files;

    // Upload gambar-gambar ke Cloudinary jika tersedia
    const uploadPromises = [
      files.gambar_katalog ? cloudinary.uploader.upload(files.gambar_katalog[0].path) : null,
      files.galeri1 ? cloudinary.uploader.upload(files.galeri1[0].path) : null,
      files.galeri2 ? cloudinary.uploader.upload(files.galeri2[0].path) : null,
      files.galeri3 ? cloudinary.uploader.upload(files.galeri3[0].path) : null,
      files.galeri4 ? cloudinary.uploader.upload(files.galeri4[0].path) : null
    ];

    // Menunggu semua proses upload selesai
    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map(result => (result ? result.secure_url : null));

    // Hapus file lokal setelah upload ke Cloudinary
    Object.values(files).forEach(fileGroup => {
      fileGroup.forEach(file => {
        fs.unlinkSync(file.path);
      });
    });

    // Menyusun data untuk di-insert, berikan null jika data tidak tersedia
    const [gambar_katalog, galeri1, galeri2, galeri3, galeri4] = imageUrls;

    const query = `
      INSERT INTO wisata_kuliner(
        gambar_katalog,
        rating_avg,
        nama_tempat,
        alamat,
        kabupaten,
        deskripsi,
        jam_operasional,
        link_wa,
        link_maps,
        fasilitas,
        galeri1,
        galeri2,
        galeri3,
        galeri4
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [gambar_katalog, 0.00, nama_tempat, alamat, kabupaten, deskripsi, jam_operasional, link_wa, link_maps, fasilitas, galeri1, galeri2, galeri3, galeri4], (err, result) => {
      if (err) {
        throw err;
      }
      res.json({ message: 'Wisata kuliner baru berhasil ditambahkan!', id: result.insertId });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllwisatakuliner = (req, res) => {
  const query = 'SELECT * FROM wisata_kuliner';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.deleteWisatakuliner = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM wisata_kuliner WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Wisata kuliner tidak ditemukan' });
    }

    res.json({ message: 'Wisata kuliner berhasil dihapus' });
  });
};

exports.updateWisatakuliner = async (req, res) => {
  try {
      const {
          nama_tempat,
          alamat,
          kabupaten,
          deskripsi,
          jam_operasional,
          link_wa,
          link_maps,
          fasilitas
      } = req.body;
      const files = req.files;

      let imageUrls = {};

      if (files && Object.keys(files).length > 0) {
          const uploadPromises = Object.keys(files).map(async key => {
              const result = await cloudinary.uploader.upload(files[key][0].path);
              fs.unlinkSync(files[key][0].path);  // Delete local file
              return { [key]: result.secure_url };
          });

          const results = await Promise.all(uploadPromises);
          results.forEach(result => {
              Object.assign(imageUrls, result);
          });
      }

      const querySelect = 'SELECT gambar_katalog, galeri1, galeri2, galeri3, galeri4 FROM wisata_kuliner WHERE id = ?';
      db.query(querySelect, [req.params.id], (err, results) => {
          if (err) {
              console.error('Error:', err);
              return res.status(500).json({ message: 'Internal server error' });
          }
          if (results.length === 0) {
              return res.status(404).json({ message: 'Wisata kuliner not found' });
          }
          
          const currentData = results[0];

          const updatedData = {
              gambar_katalog: imageUrls.gambar_katalog || currentData.gambar_katalog,
              galeri1: imageUrls.galeri1 || currentData.galeri1,
              galeri2: imageUrls.galeri2 || currentData.galeri2,
              galeri3: imageUrls.galeri3 || currentData.galeri3,
              galeri4: imageUrls.galeri4 || currentData.galeri4,
              nama_tempat,
              alamat,
              kabupaten,
              deskripsi,
              jam_operasional,
              link_wa,
              link_maps,
              fasilitas,
              rating_avg: 0.00 // Assuming rating_avg is fixed
          };

          const queryUpdate = `
              UPDATE wisata_kuliner
              SET 
                  gambar_katalog = ?, galeri1 = ?, galeri2 = ?, galeri3 = ?, galeri4 = ?,
                  nama_tempat = ?, alamat = ?, kabupaten = ?, deskripsi = ?, 
                  jam_operasional = ?, link_wa = ?, link_maps = ?, fasilitas = ?, 
                  rating_avg = ?
              WHERE id = ?
          `;

          const queryValues = [
              updatedData.gambar_katalog, updatedData.galeri1, updatedData.galeri2, 
              updatedData.galeri3, updatedData.galeri4, updatedData.nama_tempat, 
              updatedData.alamat, updatedData.kabupaten, updatedData.deskripsi, 
              updatedData.jam_operasional, updatedData.link_wa, updatedData.link_maps, 
              updatedData.fasilitas, updatedData.rating_avg, req.params.id
          ];

          db.query(queryUpdate, queryValues, (err, result) => {
              if (err) {
                  console.error('Error:', err);
                  return res.status(500).json({ message: 'Internal server error' });
              }
              res.json({ message: 'Wisata kuliner berhasil diperbarui!', id: req.params.id });
          });
      });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
};


exports.backendgetWisatakulinerById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM wisata_kuliner WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Wisata kuliner not found' });
    }

    res.json(result[0]);
  });
};

















// !!!!!!!!!!!

  

exports.getwisatakulinerById = (req, res) => {

    const { id } = req.params;
    const wisatakulinerQuery = 'SELECT * FROM wisata_kuliner WHERE id = ?';
    const foodQuery = 'SELECT * FROM makanan WHERE wisata_kuliner_id = ?';
    const drinkQuery = 'SELECT * FROM minuman WHERE wisata_kuliner_id  = ?';
    const reviewQuery = 'SELECT nama_pengulas, rating, ulasan, tanggal FROM ulasan WHERE wisata_kuliner_id  = ?';
  
    Promise.all([
      new Promise((resolve, reject) => {
        db.query(wisatakulinerQuery, [id], (err, wisata_kuliner) => {
          if (err) {
            console.error('Error:', err);
            return reject(err);
          }
          resolve(wisata_kuliner[0]);
        });
      }),

      new Promise((resolve, reject) => {
        db.query(foodQuery, [id], (err, foods) => {
          if (err) {
            console.error('Error:', err);
            return reject(err);
          }
          resolve(foods);
        });
      }),

      new Promise((resolve, reject) => {
        db.query(drinkQuery, [id], (err, drinks) => {
          if (err) {
            console.error('Error:', err);
            return reject(err);
          }
          resolve(drinks);
        });
      }),

      new Promise((resolve, reject) => {
        db.query(reviewQuery, [id], (err, reviews) => {
          if (err) {
            console.error('Error:', err);
            return reject(err);
          }
          resolve(reviews);
        });
      })
    ])

    .then(([wisata_kuliner, foods, drinks, reviews]) => {
      wisata_kuliner.foods = foods;
      wisata_kuliner.drinks = drinks;
      wisata_kuliner.reviews = reviews; 
      res.json(wisata_kuliner);
    })

    .catch(err => {
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
  };

  



  

// Mendapatkan 3 restoran terpopuler
exports.getwisatakulinerpopuler = (req, res) => {
    const query = `
      SELECT *
      FROM wisata_kuliner
      ORDER BY rating_avg DESC
      LIMIT 3;
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(results);
    });
  };

// mendapatkan review terbaru dengan rating 5
  exports.getreviewsterbaik = (req, res) => {
    const query = `
      SELECT u.*, r.nama_tempat, r.gambar_katalog
      FROM ulasan u
      JOIN wisata_kuliner r ON u.wisata_kuliner_id = r.id
      WHERE u.rating = 5
      ORDER BY u.tanggal DESC
      LIMIT 3;
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(results);
    });
  };



  exports.searchWisataKuliner = (req, res) => {
    const { nama_tempat, kabupaten } = req.query;
    
    // Buat query pencarian
    let searchQuery = `
      SELECT *
      FROM wisata_kuliner
      WHERE 1=1
    `;
  
    const queryParams = [];
  
    // Tambahkan kondisi untuk pencarian berdasarkan nama_tempat jika ada
    if (nama_tempat) {
      searchQuery += ' AND nama_tempat LIKE ?';
      queryParams.push(`%${nama_tempat}%`);
    }
  
    // Tambahkan kondisi untuk filter berdasarkan kabupaten jika ada
    if (kabupaten) {
      searchQuery += ' AND kabupaten = ?';
      queryParams.push(kabupaten);
    }
  
    // Lakukan pencarian di database
    db.query(searchQuery, queryParams, (err, results) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(results);
    });
  };



