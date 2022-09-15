"use strict";
/**
 * Required External Modules and Types
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
exports.createTicket = void 0;
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
/**
 * Define Service
 */
const prisma = new client_1.PrismaClient();
// Create the base ticket
const createBaseTicket = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield prisma.ticket.create({
        data: {
            creator: { connect: { id: payload.creatorId } },
            crf: payload.crf,
            purpose: payload.purpose,
            office: payload.office,
            department: payload.department,
            actionBy: payload.actionBy,
            status: payload.status,
            hasHardcopy: payload.hasHardcopy
        }
    });
    return ticket;
});
// Create the reimbursements
const createReimbs = (payload, ticket) => __awaiter(void 0, void 0, void 0, function* () {
    let reimbursements = [];
    for (let i = 0; i < payload.reimbursements.length; i++) {
        const reimbursement = yield prisma.reimbursement.create({
            data: {
                ticket: { connect: { id: ticket.id } },
                expenseDate: payload.reimbursements[i].expenseDate,
                expenseAmount: payload.reimbursements[i].expenseAmount,
                expenseNature: payload.reimbursements[i].expenseNature,
                orNum: payload.reimbursements[i].orNum,
                approved: payload.reimbursements[i].approved
            }
        });
        reimbursements.push(reimbursement);
    }
    return reimbursements;
});
// Create the image links
const createImages = (payload, ticket) => __awaiter(void 0, void 0, void 0, function* () {
    let images = [];
    for (let i = 0; i < payload.images.length; i++) {
        const image = yield prisma.image.create({
            data: {
                ticket: { connect: { id: ticket.id } },
                link: payload.images[i].link
            }
        });
        images.push(image);
    }
    return images;
});
// Send an email
const sendEmail = (crf, email, actionBy = null, department = null, firstName = null, reimbursements = null) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PW,
        }
    });
    const directorEmail = {
        "Multimedia Arts": "feu.madirector@gmail.com",
        "Computer Science": "feu.csdirector@gmail.com",
        "Information Technology": "feu.itdirector@gmail.com",
        "Computer Engineering": "feu.cpedirector@gmail.com",
        "Mechanical Engineering": "feu.medirector@gmail.com",
        "Civil Engineering": "feu.cedirector@gmail.com",
        "Electronics and Electrical Engineering": "feu.eedirector@gmail.com",
        "Mathematics and Physical Sciences": "feu.mpsdirector@gmail.com",
        "Humanities, Social Sciences, and Communication": "feu.hscdirector@gmail.com"
    };
    let reimbursementString = '';
    reimbursements === null || reimbursements === void 0 ? void 0 : reimbursements.forEach(reimbursement => {
        reimbursementString += reimbursement.expenseNature;
        reimbursementString += ' (To be reviewed)';
        reimbursementString += '<br\/>';
    });
    const message = {
        adminBody: `Good day, ${department} Director<br\/><br\/>This email is to inform you that the ticket with CRF number ${crf} is requiring your immediate action.<br\/><br\/>You can also visit and login on our <a href='http://159.223.45.163'>website</a> for more information.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.</i><br\/><br\/>Thanks,<br\/>RNV e-support`,
        clientBody: `Good day, ${firstName}<br\/><br\/>Thank you for using the Online Reimbursement System. The ${department === null || department === void 0 ? void 0 : department.toLowerCase()} director is now currently working on your ticket with CRF number ${crf}. A list of information about the progress regarding your reimbursement items will be shown below.<br\/><br\/>${reimbursementString}<br\/>You can also visit and login on our <a href='http://159.223.45.163'>website</a> for more information. Thank you for your patience.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.</i><br\/><br\/>Thanks,<br\/>RNV e-support`
    };
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Reimbursement ${crf} Update`,
        html: message.clientBody
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
    if (actionBy === 'director') {
        if (department) {
            mailOptions.to = directorEmail[department];
            mailOptions.html = message.adminBody;
        }
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(info);
            }
        });
    }
};
// Respond with the full ticket and send email update
const createTicket = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield createBaseTicket(payload);
    const reimbursements = yield createReimbs(payload, ticket);
    const images = yield createImages(payload, ticket);
    if (ticket && reimbursements) {
        const responseTicket = {
            id: ticket.id,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            crf: ticket.crf,
            creatorId: ticket.creatorId,
            purpose: ticket.purpose,
            office: ticket.office,
            department: ticket.department,
            actionBy: ticket.actionBy,
            status: ticket.status,
            reimbursements: reimbursements,
            remarks: [],
            images: images,
            balance: null,
            hasHardcopy: ticket.hasHardcopy
        };
        const email = yield prisma.user.findUnique({
            where: {
                id: ticket.creatorId
            },
            select: {
                email: true
            }
        });
        const firstName = yield prisma.user.findUnique({
            where: {
                id: ticket.creatorId
            },
            select: {
                firstName: true
            }
        });
        if (email) {
            sendEmail(ticket.crf, email.email, ticket.actionBy, ticket.department, firstName === null || firstName === void 0 ? void 0 : firstName.firstName, reimbursements);
        }
        yield prisma.$disconnect();
        return responseTicket;
    }
});
exports.createTicket = createTicket;
