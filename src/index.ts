import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import errorHandler from "./middleware/errorHandler";
import {authenticate} from "./middleware/authenticate";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";
import swaggerRouter from './routes/swagger.route';
import rideRoutes from './routes/ride.route'
import driverRoutes from './routes/driver.route'
import matchingRoutes from './routes/matching.route'
import deliveryRoutes from './routes/deliveries.route'
import fareRoutes from "./routes/fare.route";
import dashcamRoutes from './routes/dashcam.route'
import sosRoutes from "./routes/sos.route";
import Audience from "./constants/audience";
import internalAlertRoutes from "./routes/internal_alert";
import reviewRoutes from "./routes/review.route";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    //origin: process.env.APP_ORIGIN as string,
    origin:"*",
    credentials: true,
  })
);
app.use(cookieParser());


app.get("/", (_, res) => {
  return res.status(200).json({
    status: "healthy",
  });
});


// swagger docs
app.use('/docs', swaggerRouter)

// auth routes
app.use("/api/v1/auth", authRoutes);

// user and session routes
app.use("/api/v1/user", authenticate, userRoutes);
app.use("/api/v1/sessions", authenticate, sessionRoutes);

// passenger routes
app.use("/api/v1/ride", authenticate(Audience.User), rideRoutes)
app.use("/api/v1/matching", authenticate(Audience.User), matchingRoutes)

// driver routes
app.use("/api/v1/driver", authenticate(Audience.User), driverRoutes)

// delivery routes
app.use("/api/v1/delivery", authenticate(Audience.User), deliveryRoutes)

// fare routes
app.use("/api/v1/fare", fareRoutes)

// dashcam routes
app.use("/api/v1/dashcam", authenticate(Audience.User), dashcamRoutes)


// sos routes
app.use("/api/v1/sos", authenticate(Audience.User), sosRoutes)


app.use("/api/v1/internal-alert", internalAlertRoutes)

// review routes
app.use("/api/v1/reviews", authenticate(Audience.User), reviewRoutes)

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";


app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
  await connectToDatabase();
});