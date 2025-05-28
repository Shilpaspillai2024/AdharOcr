# Aadhaar OCR System

A MERN (MongoDB, Express.js, React.js, Node.js) stack web application that allows users to upload images of the **front and back of an Aadhaar card**, performs OCR (Optical Character Recognition) on them, and displays the extracted information in a structured format.

## project Description

This application simplifies the process of extracting Aadhaar details from images using OCR technology. Users can upload both sides of their Aadhaar card, and the system processes these images to extract key information such as the Aadhaar number, name, date of birth, gender, and address.

##  Features

- Upload front and back images of Aadhaar cards.
- Preview uploaded images before processing.
- Trigger OCR process with a single click.
- Display extracted data in a clean and organized UI.
- Error handling for invalid images and API issues.
- Frontend built with **React with Type script**.
- Backend API built with **Node + Express with Typescript**.
- Image preprocessing with **Sharp** and OCR using **Tesseract.js**.

---

## Sample Workflow

1. Upload Aadhaar front and back images.
2. Click "Parse Data".
3. See details like:
   - Aadhaar Number
   - Name
   - Date of Birth
   - Gender
   - Address

