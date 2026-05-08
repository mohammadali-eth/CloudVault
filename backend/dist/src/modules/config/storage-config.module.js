"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageConfigModule = void 0;
const common_1 = require("@nestjs/common");
const storage_config_service_1 = require("./storage-config.service");
const storage_config_controller_1 = require("./storage-config.controller");
const database_module_1 = require("../../database/database.module");
let StorageConfigModule = class StorageConfigModule {
};
exports.StorageConfigModule = StorageConfigModule;
exports.StorageConfigModule = StorageConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [storage_config_service_1.StorageConfigService],
        controllers: [storage_config_controller_1.StorageConfigController],
        exports: [storage_config_service_1.StorageConfigService],
    })
], StorageConfigModule);
//# sourceMappingURL=storage-config.module.js.map