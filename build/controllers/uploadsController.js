"use strict";
/**
 * Required External Modules
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleUpload = void 0;
const upload_1 = __importDefault(require("../middleware/upload"));
const multipleUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, upload_1.default)(req, res);
        if (req.files) {
            if (req.files.length <= 0) {
                res.status(400).send({
                    message: "You should have at least 1 file."
                });
            }
            res.status(200).send({
                message: "Files have been uploaded."
            });
        }
    }
    catch (e) {
        if (e.code === "LIMIT_UNEXPECTED_FILE") {
            res.status(400).send({
                message: "Too many files to upload."
            });
        }
    }
});
exports.multipleUpload = multipleUpload;
