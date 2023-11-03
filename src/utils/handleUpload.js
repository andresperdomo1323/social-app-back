require('dotenv').config();
const { S3 } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');

const client = new S3({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_PUBLIC_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: client,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      const filename = `file-${Date.now()}.${ext}`;
      cb(null, filename);
    },
  }),
});

module.exports = upload;
