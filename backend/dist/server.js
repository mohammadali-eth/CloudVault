"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const common_1 = require("@nestjs/common");
const express_1 = __importDefault(require("express"));
const platform_express_1 = require("@nestjs/platform-express");
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
async function createServer() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.use((0, cors_1.default)({
        origin: [
            "https://cloudy-vault.vercel.app",
            "http://localhost:3000"
        ],
        credentials: true
    }));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.init();
}
createServer()
    .then(() => console.log('Nest Readiness Complete'))
    .catch((err) => console.error('Nest Readiness Error', err));
exports.default = server;
//# sourceMappingURL=server.js.map