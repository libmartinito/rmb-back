"use strict";
/**
 * Required External Modules and Types
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = void 0;
const client_1 = require("@prisma/client");
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
// Respond with the full ticket
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
            balance: null
        };
        yield prisma.$disconnect();
        return responseTicket;
    }
});
exports.createTicket = createTicket;
