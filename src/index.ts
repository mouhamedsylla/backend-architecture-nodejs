import { config } from "./config/env";
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send("Hello World")
})

app
    .listen(config.port, () => {
        console.log(`🚀 Server is running at http://localhost:${config.port}`);
    })
    .on('error', (e) => {
        console.log(`❌ Error running server : ${e}`)
    })