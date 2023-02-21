import express from 'express';
import compression from 'compression';
import cors from 'cors';
import index from './routes/index.js';
import busboy from 'connect-busboy';
import bodyParser from "body-parser";

// Server var
const app = express();

// Middleware
app.use(compression());

app.use(busboy());

app.use(bodyParser.json());

app.use(cors());

//Routes
app.use("/", cors(), index);

//Error
// Handle 404
app.use((req, res) => {
  	res.send('{status: "error", code: 404}');
});

// Handle 500
app.use((error, req, res, next) => {
  	res.send('{status: "error", code: 500}');
});

const port = process.env.PORT || 3003;

app.listen(port, function listenHandler () {
  	console.info(`Running on ${port}`);
});