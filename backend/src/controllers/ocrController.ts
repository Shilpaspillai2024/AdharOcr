import { Request,Response } from "express";
import { performOCR } from "../services/ocrService";

export const handleOCR=async(req:Request,res:Response)=>{
    try {

        const fileObj=req.files as { [fieldname:string]:Express.Multer.File[]};
       
        const files:Express.Multer.File[]=[]

        if(fileObj.front) files.push(fileObj.front[0])
        if(fileObj.back) files.push(fileObj.back[0])
        
        const results=await performOCR(files)
        res.json({data:results})
        
    } catch (error) {
        res.status(500).json({message:'OCR failed',error})
    }
};

