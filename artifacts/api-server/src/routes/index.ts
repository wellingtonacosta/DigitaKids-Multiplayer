import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import licoesRouter from "./licoes";
import rankingRouter from "./ranking";
import perfilRouter from "./perfil";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(licoesRouter);
router.use(rankingRouter);
router.use(perfilRouter);

export default router;
