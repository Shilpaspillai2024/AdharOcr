import express from 'express'
import upload from '../utils/fileUpload'
import { handleOCR } from '../controllers/ocrController'


const router=express.Router();



router.post('/',
    upload.fields([
        {name:'front',maxCount:1},
        {name:'back',maxCount:1}
    ]),
    handleOCR
)
export default router;