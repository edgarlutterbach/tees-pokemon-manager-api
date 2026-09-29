import express, { Request, Response, NextFunction } from 'express';
import { pokemonRoutes } from '@infrastructure/http/routes/pokemon-routes';
import { trainerRoutes } from '@infrastructure/http/routes/trainer-routes';
import { swaggerUi, swaggerDocument } from './config/swagger';
import { errorHandler } from '@infrastructure/http/middlewares/error-handler'

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(pokemonRoutes);
app.use(trainerRoutes);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`⚡️ [server]: API rodando em http://localhost:${PORT}`);
  console.log(`📚 [docs]: Documentação em http://localhost:${PORT}/api/docs`);
});
