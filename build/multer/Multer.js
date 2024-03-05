import Multer from 'fastify-multer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const parentDir = resolve(__dirname, '..');
const fileMaxSize = 150 * 1024 * 1024;
console.log(parentDir, "Parent Dir");
const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('storage');
        const ROOT_PATH = __dirname;
        console.log("Root path " + ROOT_PATH);
        console.log("directory name of path ", parentDir);
        console.log("inside destination folder " + JSON.stringify(file));
        // cb(null, path.dirname(ROOT_PATH))
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log('test in filename');
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
const upload = Multer({
    storage: storage,
    limits: { fileSize: fileMaxSize }
});
const filesUpload = upload.array('file');
export { filesUpload, Multer };
//# sourceMappingURL=Multer.js.map