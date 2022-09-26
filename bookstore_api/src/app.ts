// import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { dataSource } from './app-data-source';
import { DevEnv } from './environment/dev.env';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { authRouter } from './routes/auth.route';


const app: Application = express();
const PORT = Number(DevEnv.PORT);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// app.use(helmet);
// app.use(cors);
app.use('/api/v1/auth', authRouter);
app.use(notFoundHandler);


// init databse connection
dataSource.initialize()
    .then(() => console.log('Database connection initialized'))
    .catch((err: Error) => console.log(`Error connecting to database: ${err}`))

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello')
})


app.use(errorHandler);


// start the app
app.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}...`);
})