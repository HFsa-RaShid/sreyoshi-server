import express, { Application, Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app: Application = express();


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middlewares
app.use(cors());

// Application Routes
app.use('/api/v1', router);

// Testing route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Sreyoshi Backend API!',
  });
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
});

export default app;