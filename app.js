import express from 'express'
import { config } from 'dotenv' // this package is for connecting the config folder with our app js 
import course from './routes/courseRoutes.js';
import user from './routes/userRoutes.js';
import ErrorMiddleware from './middlewares/Error.js';
import cookieParser from 'cookie-parser';
import paymentRoutes from './routes/paymentRoutes.js'
import otherRoutes from './routes/otherRoutes.js'
import cors from 'cors'
config({
    path: "./config/config.env"
})
const app = express();

//Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
// Importing & using ROutes

app.use('/api/v1', course)
app.use('/api/v1', user)
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', otherRoutes)
app.get('/', (req, res) => res.send(`<h1>Site is Working... Click <a href = ${process.env.FRONTEND_URL}>Here</a> to Visit The FrontEnd</h1>`))
export default app;

app.use(ErrorMiddleware);