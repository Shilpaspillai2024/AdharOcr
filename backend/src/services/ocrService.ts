import Tesseract from "tesseract.js";

export const performOCR=async(files:Express.Multer.File[])=>{
    const results=[]

    for(const file of files){
        const { data: {text} }=await Tesseract.recognize(file.path,'eng');
        results.push(text);
    }

    return results
}