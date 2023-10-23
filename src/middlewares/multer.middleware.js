import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `src/public/uploads`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" 
  ) {
    cb(null, true);
  } else {
    cb(new Error("invalid file type only images are allowed"));
  }
};
const upload = multer({
  storage: storage,
  limits: {
    // 30 mb max size 
    fieldSize: 30 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;
