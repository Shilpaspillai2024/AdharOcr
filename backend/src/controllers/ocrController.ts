import { Request, Response } from "express";
import { performOCR } from "../utils/ocrService";
interface MulterFiles {
    frontImage?: Express.Multer.File[];
    backImage?: Express.Multer.File[];
}




export const handleOCR = async (req: Request, res: Response): Promise<void> => {
    let frontImagePath: string | undefined;
    let backImagePath: string | undefined;

    try {
        const files = req.files as MulterFiles;

        if (!files || !files.frontImage) {
            res.status(400).json({
                status: false,
                message: 'Front image is required'
            });
            return;
        }

        frontImagePath = files.frontImage[0].path;
        backImagePath = files.backImage?.[0]?.path;

        console.log('Processing images:', { frontImagePath, backImagePath });
        
        const extractedData = await performOCR(frontImagePath, backImagePath);
        console.log("extractedData",extractedData)

        res.json({
            status: true,
            data: extractedData,
            message: "Parsing Successfully"
        });

    } catch (error) {
        console.error('OCR processing error:', error);
        res.status(500).json({
            status: false,
            data: null,
            message: 'Failed to process Aadhaar card'
        });
    }
};