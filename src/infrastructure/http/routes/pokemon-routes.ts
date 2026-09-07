import { Router } from "express";
import { makePokemonController } from "../../../main/factories/make-pokemon-controller";

const router = Router();

const controller = makePokemonController();

router.get('/stats', (req, res) => controller.stats(req, res));
router.get('/', (req, res) => controller.list(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export { router as pokemonRoutes };