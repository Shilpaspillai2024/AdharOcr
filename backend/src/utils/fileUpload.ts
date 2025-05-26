import multer from "multer";
import path from "path";

const storage=multer.diskStorage({
    destination:'uploads/',
    filename:(_, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    },

});

const upload=multer({
    storage,
    fileFilter:(_, file, cb)=>{
        const fileTypes=/jpeg|jpg|png/;
        const ext=path.extname(file.originalname).toLocaleLowerCase();
        cb(null, fileTypes.test(ext))
    },
});

export default upload;