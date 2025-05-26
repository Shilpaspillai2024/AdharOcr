import { Request,Response } from "express";
import { performOCR } from "../services/ocrService";

export const handleOCR=async(req:Request,res:Response)=>{
    try {

        const files=req.files as Express.Multer.File[];
        const results=await performOCR(files)
        res.json({data:results})
        
    } catch (error) {
        res.status(500).json({message:'OCR failed',error})
    }
};

