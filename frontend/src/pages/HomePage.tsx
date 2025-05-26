
import OcrUploader from "../components/OcrUploader";

const HomePage=()=>{
    return(
        <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Aadhaar OCR Uploader</h1>
      <OcrUploader />
    </div>
    )
}

export default HomePage