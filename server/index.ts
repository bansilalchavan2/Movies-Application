
import express, { Express } from 'express';
import { PORT } from './envs';
import {routes} from './routes';
import bodyParser from 'body-parser';

const app: Express = express();
const port = PORT;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({}));
let cors = require('cors')
const corsOptions ={
  origin:'http://localhost:8081', 
  credentials:true,            
  optionSuccessStatus:200
}
app.use(cors());

app.use(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
  return;
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});