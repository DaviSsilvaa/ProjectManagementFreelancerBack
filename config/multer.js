const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
  const uploadPath = path.resolve(__dirname, '..', 'uploads', 'projects');
  
  console.log("===> NOVO CAMINHO (DENTRO DA API):", uploadPath);
  cb(null, uploadPath);
},
    filename: (req, file, cb) => {
      crypto.randomBytes(10, (err, hash) => {
        if (err) cb(err);
        const fileName = `${hash.toString('hex')}-${file.originalname}`;
        cb(null, fileName);
      });
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'application/pdf',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Apenas PDF e Imagens são aceitos.'));
    }
  },
};