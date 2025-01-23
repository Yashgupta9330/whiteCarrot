"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const prisma_1 = require("./lib/prisma");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://white-carrot-gamma.vercel.app"
    ],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/events", eventRoutes_1.default);
// Start Server
app.listen(PORT, async () => {
    try {
        await prisma_1.prisma.$connect();
        console.log("Connected to PostgreSQL");
        console.log(`Server running on port ${PORT}`);
    }
    catch (error) {
        console.error("Failed to connect to database:", error);
    }
});
