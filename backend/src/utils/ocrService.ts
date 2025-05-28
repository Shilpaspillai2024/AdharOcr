import Tesseract from "tesseract.js";
import sharp from 'sharp'
import fs from'fs/promises'

export interface AadharData{
    aadhaarNumber?:string;
    name?:string;
    YearOfBirth?:string;
    gender?:string;
    address?:string;
    pincode?:string;
    uid?:string;
    message?:string;
}

const preprocessImage = async (imagePath: string): Promise<string> => {
    try {
        const processedPath = imagePath.replace(/\.(jpg|jpeg|png|gif)$/i, '_processed.png')
        await sharp(imagePath)
            .resize(2000, null, { withoutEnlargement: true }) 
            .grayscale()
            .normalize()
            .sharpen()
            .modulate({ brightness: 1.1})
            .linear(1.2, -30)
            .png({ quality: 100 })
            .toFile(processedPath)
        return processedPath
    } catch (error) {
        console.error('Image preprocessing failed', error)
        return imagePath;
    }
};

const extractAadhaarNumber = (text: string) => {
    const matches=text.match(/\d{4}[\s\-]?\d{4}[\s\-]?\d{4}/g);
    if(matches){
        for(const match of matches){
            const cleaned=match.replace(/\D/g,'');
            if(cleaned.length ===12 && /^[2-9]\d{11}$/.test(cleaned)){
                return cleaned
            }
        }
    }
    return undefined;
};

const extractYearOfBirth = (text: string): string | undefined => {
    const patterns = [
        /DOB[:\s]*(\d{2})[\/\-](\d{2})[\/\-](\d{4})/i,
        /D\.O\.B[:\s]*(\d{2})[\/\-](\d{2})[\/\-](\d{4})/i,
        /(\d{2})[\/\-](\d{2})[\/\-](\d{4})/g,
        /\b(19|20)\d{2}\b/g
    ];

    for (const pattern of patterns) {
        const matches = text.match(pattern);
        if (matches) {
            if (pattern.source.includes('DOB')) {
                return matches[3]; 
            } else if (pattern.source.includes('(\d{2})')) {
                return matches[3]; 
            } else {
               
                for (const match of matches) {
                    const year = parseInt(match);
                    if (year >= 1900 && year <= 2010) {
                        return match;
                    }
                }
            }
        }
    }
    return undefined;
};

const extractPincode = (text: string): string | undefined => {
    const lines = text.split('\n');
    
   
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        
        const matches = line.match(/\b\d{6}\b/g);
        if (matches) {
            for (const match of matches) {
              
                const pin = parseInt(match);
                if (pin >= 100000 && pin <= 999999) {
                    return match;
                }
            }
        }
    }
    return undefined;
};

const extractGender = (text: string): string | undefined => {
    
    const patterns = [
        /\b(MALE|FEMALE)\b/i,
        /\b(M|F)ALE\b/i,
        /\bFe?male\b/i,
        /\bFerale\b/i, 
        /\bMale\b/i
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            const gender = match[0].toUpperCase();
            if (gender.includes('F') || gender.includes('FERALE')) return 'FEMALE';
            if (gender.includes('M')) return 'MALE';
        }
    }
    
   
    if (/ERE|erale|emale/i.test(text)) return 'FEMALE';
    
    return undefined;
};



const extractName = (text: string): string | undefined => {
    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && /[A-Za-z]/.test(line));

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/DOB|Date of Birth|Year of Birth|Male|Female/i.test(line)) {
            for (let j = i - 2; j <= i; j++) {
                if (j >= 0 && lines[j]) {
                    const cleaned = lines[j].replace(/[^A-Za-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
                    if (cleaned && /^[A-Z][a-zA-Z\s]{2,40}$/.test(cleaned) &&
                        !/India|Government|Aadhaar/i.test(cleaned)) {
                        return cleaned;
                    }
                }
            }
            break;
        }
    }

    return undefined;
};



const extractAddress = (text: string): string => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const addressLines: string[] = [];
    
    let foundAddressStart = false;
    
    for (const line of lines) {
        const trimmed = line.trim();
        
       
        if (trimmed.toLowerCase().includes('address:') || trimmed.includes('D/O') || trimmed.includes('S/O') || trimmed.includes('W/O')) {
            foundAddressStart = true;
        }
        
       
        if (foundAddressStart) {
           
            if (
                trimmed.length > 5 &&
                !trimmed.match(/^\d{4}\s?\d{4}\s?\d{4}$/) && 
                !trimmed.match(/^(help@|www\.|Na C|1947)/) && 
                !trimmed.match(/^[*\s\-£©>]+$/) && 
                !trimmed.match(/^[A-Z\s]{1,5}$/) && 
                !/^(BREEN|ARIE|Sen OF UES|BAA ed|Ed Br|ERD SE|Ean ae)$/i.test(trimmed) 
            ) {
               
                let cleanLine = trimmed
                    .replace(/Address[:\s]*/i, '') 
                    .replace(/[£©>]+/g, '') 
                    .replace(/\s+/g, ' ') 
                    .trim();
                
                if (cleanLine.length > 3) {
                    addressLines.push(cleanLine);
                }
            }
        }
    }
    
   
    let address = addressLines.join(', ')
        .replace(/,\s*,+/g, ',') 
        .replace(/^,\s*/, '') 
        .replace(/\s*,$/, '') 
        .replace(/\s+/g, ' ') 
        .trim();
    
   
    const pincodeMatch = address.match(/\b(\d{6})\b/g);
    if (pincodeMatch && pincodeMatch.length > 1) {
        const pincode = pincodeMatch[0];
        address = address.replace(new RegExp(`\\b${pincode}\\b.*?\\b${pincode}\\b`, 'g'), pincode);
    }
    
    return address;
};

export const performOCR = async (frontImagePath: string, backImagePath?: string): Promise<AadharData> => {
     let processedFrontPath=''
     let processedBackPath=''
    
    
    try {
         processedFrontPath = await preprocessImage(frontImagePath);
        
        // Create worker for better control
        const worker = await Tesseract.createWorker('eng');
        
        // Set parameters for better OCR
        await worker.setParameters({
            tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY,
            tessedit_pageseg_mode: Tesseract.PSM.AUTO, 
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/.,: -'
        });
        
        const frontResult = await worker.recognize(processedFrontPath);
        const frontText = frontResult.data.text;
        console.log("Front text:   ", frontText);

        let backText = '';
        if (backImagePath) {
            processedBackPath = await preprocessImage(backImagePath);
            const backResult = await worker.recognize(processedBackPath);
            backText = backResult.data.text;
        }

        await worker.terminate();

        const combinedText = frontText + ' ' + backText;
        console.log("Combined text:  ", combinedText);

       
        const name = extractName(frontText);
        const aadhaarNumber = extractAadhaarNumber(combinedText);
        const YearOfBirth = extractYearOfBirth(combinedText);
        const gender = extractGender(combinedText);
        const pincode = extractPincode(combinedText);
        const address = extractAddress(combinedText);

        console.log("Extracted data:", {
            name,
            aadhaarNumber,
            YearOfBirth,
            gender,
            pincode,
            address
        });

        return {
            aadhaarNumber,
            name,
            YearOfBirth,
            gender,
            pincode,
            uid: aadhaarNumber,
            message: 'Parsing Successfully',
            address
        };
        
    } catch (error) {
        console.error('Error processing Aadhaar:', error);
        throw new Error('Failed to process Aadhaar card');
    }finally{
      try {
            if (processedFrontPath) await fs.unlink(processedFrontPath);
            if (processedBackPath) await fs.unlink(processedBackPath);
        } catch (cleanupError) {
            console.warn('Failed to delete processed images:', cleanupError);
        }
    }
};