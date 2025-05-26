import express from 'express'
import upload from '../utils/fileUpload'
import { handleOCR } from '../controllers/ocrController'


const router=express.Router();

router.post('/',upload.array('images',2),handleOCR)

export default router;