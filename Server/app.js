import express from "express";
import index from "./routes/index.js";
import path from 'path'
import cors from 'cors'
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import mongoose from './schema/mongoose.config.js'
import bfsiMongoose from './schema/bfsi.mongoose.js'

const app = express()
dotenv.config()
// mongoose();
bfsiMongoose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

const corsOptions = {
    origin: "http://localhost:5173", // Allow only your frontend
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization" // Allowed headers
  };


app.use(cors());
app.use(cors(corsOptions));

app.use('/', index);


const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log('system is connected on 4000')
})