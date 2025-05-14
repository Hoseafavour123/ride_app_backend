import { Router } from "express";
import { getUserHandler } from "../controllers/user.controller";

const userRoutes = Router();

// prefix: /api/v1/user
userRoutes.get("/", getUserHandler);

export default userRoutes;
