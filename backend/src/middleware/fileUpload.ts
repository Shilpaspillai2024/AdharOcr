import multer from "multer";
import path from "path";
import fs from 'fs'


const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage=multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
    filename:(req, file, cb)=>{
         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },

});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.'));
  }
};

const upload=multer({
    storage,
    limits:{
        fileSize: 5 * 1024 * 1024
    },
    fileFilter:fileFilter,
});

export default upload;