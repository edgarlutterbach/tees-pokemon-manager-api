import { Router } from "express";
import { makePokemonController } from "../../../main/factories/make-pokemon-controller";

const router = Router();

const controller = makePokemonController();

router.get('/', (req, res) => controller.list(req, res))
router.get('/:id', (req, res) => controller.getById(req, res))

export { router as pokemonRoutes };