"use strict";
/**
 * Required External Modules
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
exports.updateHardcopy = void 0;
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
/**
 * Definte the service
 */
const prisma = new client_1.PrismaClient();
// Send an email
const sendEmail = (crf) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PW
        }
    });
    const message = {
        body: "This is to let you know that a new ticket with the crf number shown above requires your attention."
    };
    const mailOptions = {
        from: process.env.EMAIL,
        to: "feu.finac@gmail.com",
        subject: `Reimbursement ${crf} Update`,
        html: message.body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
};
const updateHardcopy = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketId = payload.ticketId;
    const hasHardcopy = payload.hasHardcopy;
    const actionBy = payload.actionBy;
    const status = payload.status;
    // Update hasHardcopy
    yield prisma.ticket.update({
        where: {
            id: parseInt(ticketId)
        },
        data: {
            actionBy: actionBy,
            status: status,
            hasHardcopy: hasHardcopy
        }
    });
    const ticket = yield prisma.ticket.findUnique({
        where: {
            id: parseInt(ticketId)
        },
        include: {
            remarks: true,
            reimbursements: true
        }
    });
    if (ticket) {
        sendEmail(ticket.crf);
    }
    prisma.$disconnect();
    return ticket;
});
exports.updateHardcopy = updateHardcopy;
