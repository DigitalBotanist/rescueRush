import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure 'uploads/' directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Storage engine using _id as filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Temporary filename, will be renamed after getting _id
        cb(null, `temp_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

export default upload;
