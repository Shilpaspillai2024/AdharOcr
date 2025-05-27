import express from 'express'
import cors from 'cors'
import path from 'path'

import ocrRoutes from './routes/ocrRoutes'



const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/uploads',express.static(path.join(__dirname,'../uploads')))

app.use('/api/ocr',ocrRoutes)


export default app