import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { 
    healthcheck
 } from "../controllers/healthcheck.controller.js";

const router = Router();

router.use(verifyJwt);

router.route("/").get(healthcheck);


export default router;