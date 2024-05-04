//e.g server.js
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import ViteExpress from 'vite-express';

import 'dotenv/config';
import connect from './db/conn.js';

import router from './routes/router.js';

const PORT = process.env.PORT || 5151;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// routes
app.use('/', router);
connect()
  .then(() => {
    console.log('Connected to MongoDB');
    return;
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static('dist'));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
      });
      app.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT} `);
      });
    } else {
      ViteExpress.listen(app, PORT, () =>
        console.log(`Server is listening on PORT ${PORT} `)
      );
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT} `);
});
export default app;
