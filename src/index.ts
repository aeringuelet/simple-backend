import express from 'express';
import 'dotenv/config';
import indexRouter from './routes/index';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(bodyParser.json());

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Simple backend listening on port ${port}`);
});
