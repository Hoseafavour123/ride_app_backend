"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const authenticate_1 = require("./middleware/authenticate");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const session_route_1 = __importDefault(require("./routes/session.route"));
const swagger_route_1 = __importDefault(require("./routes/swagger.route"));
const ride_route_1 = __importDefault(require("./routes/ride.route"));
const driver_route_1 = __importDefault(require("./routes/driver.route"));
const matching_route_1 = __importDefault(require("./routes/matching.route"));
const deliveries_route_1 = __importDefault(require("./routes/deliveries.route"));
const fare_route_1 = __importDefault(require("./routes/fare.route"));
const dashcam_route_1 = __importDefault(require("./routes/dashcam.route"));
const sos_route_1 = __importDefault(require("./routes/sos.route"));
const audience_1 = __importDefault(require("./constants/audience"));
const internal_alert_1 = __importDefault(require("./routes/internal_alert"));
const review_route_1 = __importDefault(require("./routes/review.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    //origin: process.env.APP_ORIGIN as string,
    origin: "*",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.get("/", (_, res) => {
    return res.status(200).json({
        status: "healthy",
    });
});
// swagger docs
app.use('/docs', swagger_route_1.default);
// auth routes
app.use("/api/v1/auth", auth_route_1.default);
// user and session routes
app.use("/api/v1/user", authenticate_1.authenticate, user_route_1.default);
app.use("/api/v1/sessions", authenticate_1.authenticate, session_route_1.default);
// passenger routes
app.use("/api/v1/ride", (0, authenticate_1.authenticate)(audience_1.default.User), ride_route_1.default);
app.use("/api/v1/matching", (0, authenticate_1.authenticate)(audience_1.default.User), matching_route_1.default);
// driver routes
app.use("/api/v1/driver", (0, authenticate_1.authenticate)(audience_1.default.User), driver_route_1.default);
// delivery routes
app.use("/api/v1/delivery", (0, authenticate_1.authenticate)(audience_1.default.User), deliveries_route_1.default);
// fare routes
app.use("/api/v1/fare", fare_route_1.default);
// dashcam routes
app.use("/api/v1/dashcam", (0, authenticate_1.authenticate)(audience_1.default.User), dashcam_route_1.default);
// sos routes
app.use("/api/v1/sos", (0, authenticate_1.authenticate)(audience_1.default.User), sos_route_1.default);
app.use("/api/v1/internal-alert", internal_alert_1.default);
// review routes
app.use("/api/v1/review", (0, authenticate_1.authenticate)(audience_1.default.User), review_route_1.default);
app.use(errorHandler_1.default);
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
    await (0, db_1.default)();
});
