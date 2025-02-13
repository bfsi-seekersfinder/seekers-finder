import express from "express";
import index from "./routes/index.js";
import path from 'path'
import cors from 'cors'
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import mongooseDb from './schema/mongoose.config.js'
// import bfsiMongoose from './schema/bfsi.mongoose.js'

const app = express()
dotenv.config()
mongooseDb();
// bfsiMongoose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

const corsOptions = {
    origin: ["http://localhost:5173", "https://api.raltgroup.com", "https://www.banksterindia.com/", "https://9670-183-83-53-6.ngrok-free.app/"],
    methods: "GET,POST,PUT,DELETE", 
    allowedHeaders: "Content-Type,Authorization" 
  };
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });


app.use(cors());
app.use(cors(corsOptions));

app.use('/', index);


const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log('system is connected on 4000')
})