import express from 'express'
import cors from 'cors'
import ocrRoutes from './routes/ocrRoutes'

const app=express()
app.use(cors())
app.use(express.json())

app.use('/api/ocr',ocrRoutes)


export default app