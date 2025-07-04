import multer from "multer";
import fs from 'fs';
import path from 'path';


const tempDir = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true }); // creates the directory if it doesn't already exist
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,"./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

export const upload = multer({ storage });
