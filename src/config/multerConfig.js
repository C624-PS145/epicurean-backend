const multer = require('multer');
const path = require('path');

// Destination directory
const uploadDir = path.join(__dirname, '../uploads/');

// Set storage engine
const storage = multer.diskStorage({
  destination: uploadDir, // Menentukan direktori langsung
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file 5MB (sesuaikan sesuai kebutuhan)
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).fields([
  { name: 'gambar_katalog', maxCount: 1 },
  { name: 'galeri1', maxCount: 1 },
  { name: 'galeri2', maxCount: 1 },
  { name: 'galeri3', maxCount: 1 },
  { name: 'galeri4', maxCount: 1 },
  { name: 'gambar_artikel', maxCount: 1 },
]);

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

module.exports = upload;
