import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";
import Audience from "../constants/audience";

const authRoutes = Router();

// prefix: /api/v1/auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);

authRoutes.get('/logout', authenticate(Audience.User), logoutHandler)
export default authRoutes;
