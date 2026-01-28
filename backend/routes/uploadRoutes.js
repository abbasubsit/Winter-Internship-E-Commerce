import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// 1. Storage Configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// 2. File Filter (Only Images)
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});

// 3. Upload Route
router.post('/', upload.single('image'), (req, res) => {
    res.json({
        message: 'Image Uploaded',
        image: `/${req.file.path.replace(/\\/g, '/')}`,
    });
});

export default router;
