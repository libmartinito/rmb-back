"use strict";
/**
 * Required External Modules and Interfaces
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const authController = __importStar(require("./controllers/authController"));
const ticketsController = __importStar(require("./controllers/ticketsController"));
const uploadsController = __importStar(require("./controllers/uploadsController"));
const auth_1 = require("./middleware/auth");
/**
 * Router Definition
 */
exports.router = express_1.default.Router();
// Route for registering a user
exports.router.post("/api/register", authController.register);
// Route for logging in a user
exports.router.post("/api/login", authController.login);
// Route for logging out a user
exports.router.post("/api/logout", authController.logout);
// Route for creating a ticket
exports.router.post("/api/tickets", auth_1.auth, ticketsController.create);
// Route for getting tickets for a given client and status
exports.router.get("/api/tickets/:role/:id/:status", auth_1.auth, ticketsController.getClient);
// Route for getting all tickets
exports.router.get("/api/tickets", auth_1.auth, ticketsController.getAll);
// Route for getting a ticket
exports.router.get("/api/tickets/:ticketcrf", auth_1.auth, ticketsController.getOne);
// Route for updating a ticket
exports.router.patch("/api/tickets/:ticketcrf", auth_1.auth, ticketsController.updateOne);
// Route for uploading images
exports.router.post("/api/upload", auth_1.auth, uploadsController.multipleUpload);
