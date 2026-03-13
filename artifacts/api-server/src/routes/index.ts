import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import aiRouter from "./ai";
import historyRouter from "./history";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/ai", aiRouter);
router.use("/history", historyRouter);
router.use("/admin", adminRouter);

export default router;
