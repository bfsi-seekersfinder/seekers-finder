import express from "express";
import index from "./routes/index.js";
import admin from './routes/admin.js'
import path from 'path'
import cors from 'cors'
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import mongooseDb from './schema/mongoose.config.js'
import session from 'express-session'
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import checkAndUpdateExpiredUsers from "./controlers/cronCheckExpire.js";
import User from "./schema/user.mongoose.js";
import Candidate from "./schema/userdata.mongoose.js";



const app = express()
dotenv.config()
mongooseDb();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

const corsOptions = {
    origin: ["https://talentx.onrender.com","http://localhost:5173", "https://api.raltgroup.com", "https://www.banksterindia.com/",],
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: "Content-Type,Authorization",
    credentials:true 
  };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser()); 
app.use(session({
  secret: process.env.SECRET_SESSION || "defaultsecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
      secure: false, 
      httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24,
  }
}));

app.use("/uploads", express.static("uploads"));
app.use('/', index);
app.use('/admin', admin)


const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log('system is connected on 4000')
})
