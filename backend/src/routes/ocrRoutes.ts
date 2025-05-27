import express from 'express'
import upload from '../middleware/fileUpload'
import { handleOCR } from '../controllers/ocrController'


const router=express.Router();



router.post('/process',
    upload.fields([
        {name:'frontImage',maxCount:1},
        {name:'backImage',maxCount:1}
    ]),handleOCR);
export default router;