import express, { Application, NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { dataSource } from './app-data-source';

const app: Application = express();

app.use(express.json());


// init databse connection
dataSource.initialize()
    .then(() => console.log('Database connection initialized'))
    .catch((err: Error) => console.log(`Error connecting to database: ${err}`))

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello');
})

app.listen(3000, ()=> {
    console.log('Server is listening on port 3000...');
})