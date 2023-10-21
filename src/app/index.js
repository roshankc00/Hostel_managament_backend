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
export const app = express();
connnectDatabase()

app.use(mongoSanitize())
app.use(hpp())
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(express.json())


app.use(allRoute)
app.use(ErrorHandlerMiddleware)




app.use(cors());
