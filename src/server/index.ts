import express from 'express';
import { config } from "../env";
import usersRouter from '../routes/users'
import { setupSwagger } from '../swagger';


const app = express();

app.use(express.json());
app.use('/api', usersRouter);

export const startServer = () => {
    const port = config.port;
    app.listen(port, () => {
        console.log(`🚀 Server is running at http://localhost:${port}`);
    })
}

setupSwagger(app);