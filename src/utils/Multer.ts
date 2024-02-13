import Multer from 'fastify-multer';
import path from 'path';
console.log(path);
// import { fileURLToPath } from 'url';
// import { dirname, join,resolve  } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const parentDir = resolve(__dirname, '..');
// console.log(parentDir ,"Parent Dir");
const fileMaxSize = 150 * 1024 * 1024;

const storage = Multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('storage');
    const ROOT_PATH = __dirname;
    console.log("Root path " + ROOT_PATH);
    console.log("directory name of path ", path.dirname(ROOT_PATH));
    console.log("inside destination folder " + JSON.stringify(file));
    // cb(null, path.dirname(ROOT_PATH))
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    console.log('test in filename');
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  }
});

const upload = Multer({
//   storage: storage,
  limits: { fileSize: fileMaxSize }
});

const filesUpload:any = upload.array('file');

export { filesUpload, Multer };