"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
/**
 * Required External Modules
 */
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv.config();
const prisma = new client_1.PrismaClient();
/**
 * Controllers for Authentication
 */
// A controller that registers a new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const secret = process.env.JWT_SECRET;
    // Check if user already exists
    const oldUser = yield prisma.user.findUnique({
        where: {
            email: payload.email,
        }
    });
    if (oldUser) {
        res.status(400).send({
            message: "User already exists. Please login."
        });
    }
    // Hash password
    payload.password = yield bcrypt.hash(payload.password, 8);
    // Try creating user and providing an authentication token 
    try {
        // Create user
        const user = yield prisma.user.create({ data: payload });
        // Provide token
        const token = jwt.sign({ id: user.id }, secret);
        // Save token
        yield prisma.token.create({
            data: {
                userId: user.id,
                token: token,
            }
        });
        // If ok, send created user and token
        res.status(200).send({
            user: {
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                department: user.department
            },
            token: token,
        });
    }
    catch (e) {
        // If error is thrown, send error message
        res.status(500).send({
            message: e.message
        });
    }
    finally {
        // Close database connection
        prisma.$disconnect();
    }
});
exports.register = register;
// A controller that logins an existing user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const secret = process.env.JWT_SECRET;
    // Try logging in and providing an authentication token
    try {
        // Check if email exists in database
        const user = yield prisma.user.findUnique({
            where: {
                email: payload.email,
            }
        });
        if (!user) {
            // Return an error message if no email found
            res.status(400).send({
                message: "User does not exist. Please register."
            });
        }
        // Check if password matches email
        let isMatch = false;
        if (user) {
            const password = payload.password;
            const userPassword = user.password;
            isMatch = yield bcrypt.compare(password, userPassword);
        }
        if (isMatch) {
            if (user) {
                // Provide a token if password matches
                const token = jwt.sign({ id: user.id }, secret);
                // Save token
                yield prisma.token.create({
                    data: {
                        userId: user.id,
                        token: token
                    }
                });
                // Respond with user and token 
                res.status(200).send({
                    user: {
                        id: user.id,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        department: user.department
                    },
                    token: token,
                });
            }
        }
        else {
            // Send an error message if no password found
            res.status(400).send({
                message: "Password does not match email."
            });
        }
    }
    catch (e) {
        // If error is thrown, send error message
        res.status(500).send({
            message: e.message
        });
    }
    finally {
        // Close database connection
        prisma.$disconnect();
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bearerToken = req.header("Authorization");
        if (bearerToken) {
            const token = bearerToken.replace("Bearer ", "");
            yield prisma.token.deleteMany({
                where: {
                    token: token,
                }
            });
        }
    }
    catch (e) {
        res.status(500).send(e.message);
    }
    finally {
        prisma.$disconnect();
    }
});
exports.logout = logout;
