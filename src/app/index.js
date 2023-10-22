import cors from "cors";
import express from "express";
import "dotenv/config";
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import hpp from "hpp";
import compression from "compression";
import morgan from 'morgan'
import { ErrorHandlerMiddleware } from "../middlewares/errorhandler.middleware.js";
import { connnectDatabase } from "../config/db.config.js";
import allRoute from '../routes/index.js'
import expressSession from "express-session";
import { passportInitialize } from "../middlewares/passport.middleware.js";
import passport from "passport";
export const app = express();
connnectDatabase()

app.use(express.json())
app.use(cors());
app.use(mongoSanitize())
app.use(hpp())
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
// creating the session 
app.use(expressSession({ 
    secret: "test123#",
    resave: true,
    saveUninitialized: true,
    cookie:{secure:true}

  })
);
passportInitialize()
app.use(passport.initialize());
app.use(passport.session());


app.use(allRoute)
app.use(ErrorHandlerMiddleware)




