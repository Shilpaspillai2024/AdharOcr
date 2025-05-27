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
            .grayscale()
            .resize(2000, null, { withoutEnlargement: true }) 
            .normalize()
            .sharpen({ sigma: 1, m1: 0.5, m2: 2, x1: 2, y2: 10, y3: 20 })
            .linear(1.2, -(128 * 1.2) + 128)
            .png({ quality: 100 })
            .toFile(processedPath)
        return processedPath
    } catch (error) {
        console.error('Image preprocessing failed', error)
        return imagePath;
    }
};

const extractAadhaarNumber = (text: string) => {
    
    const patterns = [
        /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
        /\b\d{12}\b/g
    ];
    
    for (const pattern of patterns) {
        const matches = text.match(pattern);
        if (matches) {
           
            for (const match of matches) {
                const cleaned = match.replace(/\s/g, '');
                if (cleaned.length === 12 && !cleaned.startsWith('0')) {
                    return cleaned;
                }
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
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
   
    for (const line of lines) {
        const cleanLine = line.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
        
       
        const namePattern = /\b([A-Z][a-z]{2,}\s+(?:[A-Z]\.?\s+)?[A-Z][a-z]{2,})\b/;
        const match = cleanLine.match(namePattern);
        
        if (match) {
            const potentialName = match[1];
           
            if (!potentialName.match(/\b(GOVERNMENT|INDIA|AADHAAR|UNIQUE|IDENTIFICATION|AUTHORITY|ADDRESS|MALE|FEMALE)\b/i)) {
                return potentialName;
            }
        }
    }
    
  
    for (const line of lines) {
       
        const cleaned = line
            .replace(/^[^A-Za-z]*/, '') 
            .replace(/[^A-Za-z\s]*$/, '') 
            .replace(/\s+/g, ' ')
            .trim();
        
       
        const words = cleaned.split(' ').filter(word => 
            /^[A-Z][a-z]{1,15}$/.test(word) && 
            word.length > 1 &&
            !/(GOVERNMENT|INDIA|AADHAAR|UNIQUE|MALE|FEMALE|ADDRESS|DOB)/i.test(word)
        );
        
      
        if (words.length >= 2 && words.length <= 4) {
            const possibleName = words.join(' ');
            
            if (possibleName.length >= 5 && possibleName.length <= 50) {
                return possibleName;
            }
        }
    }
    
   
    const textLines = text.split('\n');
    for (let i = 0; i < textLines.length; i++) {
        const line = textLines[i];
        
      
        if (/DOB|MALE|FEMALE|Ferale/i.test(line) || 
            (i < textLines.length - 1 && /DOB|MALE|FEMALE|Ferale/i.test(textLines[i + 1]))) {
            
           
            const linesToCheck = [textLines[i - 1], textLines[i]].filter(Boolean);
            
            for (const checkLine of linesToCheck) {
                const cleanLine = checkLine.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
                const words = cleanLine.split(' ').filter(word => 
                    /^[A-Z][a-z]+$/.test(word) && 
                    word.length > 2 &&
                    !/(DOB|MALE|FEMALE|GOVERNMENT|INDIA|AADHAAR)/i.test(word)
                );
                
                if (words.length >= 2 && words.length <= 3) {
                    return words.join(' ');
                }
            }
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
            tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/.,: -'
        });
        
        const frontResult = await worker.recognize(processedFrontPath);
        const frontText = frontResult.data.text;
        console.log("Front text:", frontText);

        let backText = '';
        if (backImagePath) {
            processedBackPath = await preprocessImage(backImagePath);
            const backResult = await worker.recognize(processedBackPath);
            backText = backResult.data.text;
        }

        await worker.terminate();

        const combinedText = frontText + ' ' + backText;
        console.log("Combined text:", combinedText);

       
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