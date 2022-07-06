"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Required External Moduels
 */
const util_1 = __importDefault(require("util"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage }).array("uploads", 10);
const uploadMiddleware = util_1.default.promisify(upload);
exports.default = uploadMiddleware;
