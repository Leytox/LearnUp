const multer = require("multer");
const path = require("path");

function upload(destination) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  return multer({ storage: storage });
}

module.exports = upload;
