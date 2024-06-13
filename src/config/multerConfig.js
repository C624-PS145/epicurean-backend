// config/multerConfig.js
const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = '/tmp/uploads';
    mkdirp.sync(uploadPath);  // Ensure the directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

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
    cb('Error: Images Only!');
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // Limit file size to 5MB (adjust as needed)
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

module.exports = upload;
