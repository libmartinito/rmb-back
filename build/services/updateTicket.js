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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicket = void 0;
const client_1 = require("@prisma/client");
/**
 * Definte the service
 */
const prisma = new client_1.PrismaClient();
const updateTicket = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketId = payload.ticketId;
    const actionBy = payload.actionBy;
    const status = payload.status;
    const reimbursements = payload.reimbursements;
    const remarks = payload.remarks;
    const balance = payload.balance;
    // Update base ticket actionby and status
    yield prisma.ticket.update({
        where: {
            id: parseInt(ticketId)
        },
        data: {
            actionBy: actionBy,
            status: status
        }
    });
    // Update changes to reimbursements
    for (let i = 0; i < reimbursements.length; i++) {
        yield prisma.reimbursement.update({
            where: {
                id: reimbursements[i].id
            },
            data: {
                approved: reimbursements[i].approved
            }
        });
    }
    // Create remarks 
    for (let i = 0; i < remarks.length; i++) {
        yield prisma.remark.create({
            data: {
                ticket: { connect: { id: remarks[i].ticketId } },
                type: remarks[i].type,
                role: remarks[i].role,
                content: remarks[i].content
            }
        });
    }
    // Create balance for ticket
    if (balance) {
        yield prisma.balance.create({
            data: {
                ticket: { connect: { id: balance.ticketId } },
                name: balance.name,
                balance: balance.balance,
                amount: balance.amount,
                preparedBy: balance.preparedBy
            }
        });
    }
    const ticket = yield prisma.ticket.findUnique({
        where: {
            id: parseInt(ticketId)
        },
        include: {
            remarks: true,
            reimbursements: true
        }
    });
    prisma.$disconnect();
    return ticket;
});
exports.updateTicket = updateTicket;
