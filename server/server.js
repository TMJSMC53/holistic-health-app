//e.g server.js
import express from 'express';
import cors from 'cors';

import ViteExpress from 'vite-express';

import 'dotenv/config';
import './db/conn.js';

import router from './routes/router.js';

const PORT = process.env.PORT || 5050;

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/', router);

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on PORT ${PORT} `)
);
